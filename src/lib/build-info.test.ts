import { describe, expect, it } from "vitest";
import { getBuildInfo } from "./build-info";

const repo = "https://github.com/someone/portfolio";

describe("getBuildInfo", () => {
  it("returns null when no commit SHA was provided", () => {
    expect(getBuildInfo(undefined, repo)).toBeNull();
    expect(getBuildInfo("", repo)).toBeNull();
  });

  it("rejects values that aren't a 7–40 character hex SHA", () => {
    expect(getBuildInfo("abc12", repo)).toBeNull();
    expect(getBuildInfo("not-a-commit-sha", repo)).toBeNull();
    expect(getBuildInfo("a".repeat(41), repo)).toBeNull();
  });

  it("shortens the SHA and links it to the commit on the source repository", () => {
    const sha = "4552b64f0e2c9d1a7b3e8f6c5d4a3b2c1d0e9f8a";
    expect(getBuildInfo(sha, repo)).toEqual({
      short: "4552b64",
      url: `${repo}/commit/${sha}`,
    });
  });

  it("keeps the version but drops the link when the repository URL isn't publishable", () => {
    expect(getBuildInfo("4552b64", "")).toEqual({ short: "4552b64" });
  });
});
