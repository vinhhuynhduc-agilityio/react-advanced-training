const formatDropdownOptions = <T extends { id: string }>(
  data: T[],
  valueKey: keyof T
) =>
  data.map((item) => ({
    id: item.id,
    value: item[valueKey],
  }));

export {
  formatDropdownOptions
};
