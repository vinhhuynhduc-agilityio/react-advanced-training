import { formatDropdownOptions } from "../helpers";

describe("formatDropdownOptions", () => {
  it("should format data into dropdown options with the specified valueKey", () => {
    const mockData = [
      { id: "1", name: "Option 1", description: "This is option 1" },
      { id: "2", name: "Option 2", description: "This is option 2" },
      { id: "3", name: "Option 3", description: "This is option 3" },
    ];

    const expectedResult = [
      { id: "1", value: "Option 1" },
      { id: "2", value: "Option 2" },
      { id: "3", value: "Option 3" },
    ];

    const result = formatDropdownOptions(mockData, "name");

    expect(result).toEqual(expectedResult);
  });

  it("should return an empty array if the input data is empty", () => {
    const mockData: { id: string; name: string }[] = [];
    const expectedResult: { id: string; value: string }[] = [];

    const result = formatDropdownOptions(mockData, "name");

    expect(result).toEqual(expectedResult);
  });
});
