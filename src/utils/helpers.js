/**
 * Formats a date string to DD/MM/YYYY
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN");
};

/**
 * Calculates number of days between two dates
 * @param {string} startDate
 * @param {string} endDate
 * @returns {number}
 */
export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 0;
};

/**
 * Returns Tailwind CSS color class based on leave status
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
