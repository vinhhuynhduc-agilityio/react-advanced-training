import { isProjectDuplicate } from "@/helpers";
import { mockProject } from "@/mocks";

describe("isProjectDuplicate", () => {
  it("should return true if the project name already exists (case insensitive)", () => {
    const result = isProjectDuplicate(mockProject, "support");
    expect(result).toBe(true);
  });

  it("should return false if the project name does not exist", () => {
    const result = isProjectDuplicate(mockProject, "Non-Existing Project");
    expect(result).toBe(false);
  });

  it("should return true if the project name matches exactly", () => {
    const result = isProjectDuplicate(mockProject, "Support");
    expect(result).toBe(true);
  });

  it("should handle empty input project name and return false", () => {
    const result = isProjectDuplicate(mockProject, "");
    expect(result).toBe(false);
  });

  it("should handle empty project list and return false", () => {
    const result = isProjectDuplicate([], "Support");
    expect(result).toBe(false);
  });
});
