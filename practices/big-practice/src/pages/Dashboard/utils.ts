export const handleRowSelection = (
  userId: string | null,
  sourceComponent: string,
  handleRowSelected: (userId: string | null, sourceComponent: string) => void
) => {
  handleRowSelected(userId, sourceComponent);
};
