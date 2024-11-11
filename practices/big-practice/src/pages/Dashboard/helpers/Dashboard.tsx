// Returns the current date and time as a formatted string in the format "Nov 10, 2024 20:54:10".
const getRegisteredDate = () => `${new Date().toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})} ${new Date().toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})}`;

export {
  getRegisteredDate
};
