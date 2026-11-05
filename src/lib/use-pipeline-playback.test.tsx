import { act, render, renderHook, screen } from "@testing-library/react";
import { Activity } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ciJobs, pipelineScenarios } from "@/content/lab-pipeline";
import { resolveRun, runFrames } from "./pipeline-run";
import {
  IDLE,
  playbackReducer,
  TICK_MS,
  usePipelinePlayback,
  type PlaybackState,
} from "./use-pipeline-playback";

const frames = runFrames(ciJobs, resolveRun(ciJobs, pipelineScenarios[0]));
const last = frames.length - 1;

describe("usePipelinePlayback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the final outcome until a run starts", () => {
    const { result } = renderHook(() =>
      usePipelinePlayback(frames, { reducedMotion: false }),
    );

    expect(result.current.status).toBe("idle");
    expect(result.current.states).toEqual(frames[last]);
  });

  it("plays one frame per tick, reports each frame, and finishes", () => {
    const onFrame = vi.fn();
    const { result } = renderHook(() =>
      usePipelinePlayback(frames, { reducedMotion: false, onFrame }),
    );

    act(() => result.current.run());
    expect(result.current.states).toEqual(frames[0]);

    act(() => vi.advanceTimersByTime(TICK_MS));
    expect(result.current.states).toEqual(frames[1]);
    expect(onFrame).toHaveBeenLastCalledWith(1);

    for (let frame = 2; frame <= last; frame++) {
      act(() => vi.advanceTimersByTime(TICK_MS));
    }
    expect(result.current.status).toBe("done");
    expect(result.current.states).toEqual(frames[last]);
    expect(onFrame).toHaveBeenCalledTimes(last);
  });

  it("stops advancing while paused", () => {
    const { result } = renderHook(() =>
      usePipelinePlayback(frames, { reducedMotion: false }),
    );
    act(() => result.current.run());
    act(() => vi.advanceTimersByTime(TICK_MS));

    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(TICK_MS * 3));
    expect(result.current.states).toEqual(frames[1]);

    act(() => result.current.resume());
    act(() => vi.advanceTimersByTime(TICK_MS));
    expect(result.current.states).toEqual(frames[2]);
  });

  it("jumps to the final outcome when reduced motion is requested", () => {
    const onFrame = vi.fn();
    const { result } = renderHook(() =>
      usePipelinePlayback(frames, { reducedMotion: true, onFrame }),
    );

    act(() => result.current.run());

    expect(result.current.status).toBe("done");
    expect(result.current.states).toEqual(frames[last]);
    expect(onFrame).not.toHaveBeenCalled();
  });

  it("pauses when its route is hidden, and stays paused when shown again", () => {
    function Probe() {
      const playback = usePipelinePlayback(frames, { reducedMotion: false });
      return (
        <button type="button" onClick={playback.run}>
          {playback.status}
        </button>
      );
    }
    const ui = (mode: "visible" | "hidden") => (
      <Activity mode={mode}>
        <Probe />
      </Activity>
    );
    const { rerender } = render(ui("visible"));
    act(() => screen.getByRole("button", { hidden: true }).click());

    rerender(ui("hidden"));
    rerender(ui("visible"));
    act(() => vi.advanceTimersByTime(TICK_MS * 3));

    expect(screen.getByRole("button")).toHaveTextContent("paused");
  });
});

const at = (status: PlaybackState["status"], frame: number) => ({
  status,
  frame,
});

describe("playbackReducer", () => {
  it("starts a run from the first frame", () => {
    expect(playbackReducer(IDLE, { type: "run" })).toEqual(at("running", 0));
    expect(playbackReducer(at("done", 6), { type: "run" })).toEqual(
      at("running", 0),
    );
  });

  it("advances one frame per tick and finishes on the last one", () => {
    expect(
      playbackReducer(at("running", 0), { type: "tick", last: 2 }),
    ).toEqual(at("running", 1));
    expect(
      playbackReducer(at("running", 1), { type: "tick", last: 2 }),
    ).toEqual(at("done", 2));
  });

  it("ignores ticks unless running", () => {
    expect(playbackReducer(at("paused", 1), { type: "tick", last: 2 })).toEqual(
      at("paused", 1),
    );
  });

  it("pauses and resumes a running run only", () => {
    expect(playbackReducer(at("running", 1), { type: "pause" })).toEqual(
      at("paused", 1),
    );
    expect(playbackReducer(at("paused", 1), { type: "resume" })).toEqual(
      at("running", 1),
    );
    expect(playbackReducer(IDLE, { type: "pause" })).toBe(IDLE);
    expect(playbackReducer(IDLE, { type: "resume" })).toBe(IDLE);
  });

  it("jumps straight to the end when finishing (reduced motion)", () => {
    expect(playbackReducer(IDLE, { type: "finish", last: 4 })).toEqual(
      at("done", 4),
    );
  });

  it("resets to the final outcome view", () => {
    expect(playbackReducer(at("paused", 3), { type: "reset" })).toBe(IDLE);
  });
});
