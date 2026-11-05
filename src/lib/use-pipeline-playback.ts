import { useEffect, useEffectEvent, useLayoutEffect, useReducer } from "react";
import type { RunFrame } from "./pipeline-run";

/** How long each frame of a simulated run stays on screen. */
export const TICK_MS = 800;

export type PlaybackStatus = "idle" | "running" | "paused" | "done";
export type PlaybackState = { status: PlaybackStatus; frame: number };
export type PlaybackAction =
  | { type: "run" }
  | { type: "tick"; last: number }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "finish"; last: number }
  | { type: "reset" };

/** Not playing: the final outcome is shown. */
export const IDLE: PlaybackState = { status: "idle", frame: 0 };

/** Walks the frame index of a simulated run. `last` is the index of the final frame. */
export function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction,
): PlaybackState {
  switch (action.type) {
    case "run":
      return { status: "running", frame: 0 };
    case "tick": {
      if (state.status !== "running") return state;
      const frame = state.frame + 1;
      return { status: frame >= action.last ? "done" : "running", frame };
    }
    case "pause":
      return state.status === "running"
        ? { ...state, status: "paused" }
        : state;
    case "resume":
      return state.status === "paused"
        ? { ...state, status: "running" }
        : state;
    case "finish":
      return { status: "done", frame: action.last };
    case "reset":
      return IDLE;
  }
}

/**
 * Plays `frames` one tick at a time. While idle it shows the final frame. With `reducedMotion`,
 * Run jumps straight to the end. `onFrame` receives each frame index the timer reaches.
 * Hiding the route (`<Activity mode="hidden">`) pauses the run instead of letting it resume unseen.
 */
export function usePipelinePlayback(
  frames: readonly RunFrame[],
  {
    reducedMotion,
    onFrame,
  }: { reducedMotion: boolean; onFrame?: (frame: number) => void },
) {
  const [state, dispatch] = useReducer(playbackReducer, IDLE);
  const last = frames.length - 1;
  const reportFrame = useEffectEvent((frame: number) => onFrame?.(frame));

  useEffect(() => {
    if (state.status !== "running") return;
    const timer = setTimeout(() => {
      dispatch({ type: "tick", last });
      reportFrame(state.frame + 1);
    }, TICK_MS);
    return () => clearTimeout(timer);
  }, [state.status, state.frame, last]);

  useLayoutEffect(() => () => dispatch({ type: "pause" }), []);

  return {
    status: state.status,
    frame: state.frame,
    states: frames[state.status === "idle" ? last : state.frame],
    run: () =>
      dispatch(reducedMotion ? { type: "finish", last } : { type: "run" }),
    pause: () => dispatch({ type: "pause" }),
    resume: () => dispatch({ type: "resume" }),
    reset: () => dispatch({ type: "reset" }),
  };
}
