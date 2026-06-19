const BASE_URL = "http://localhost:5000";

/**
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getLeavesByUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/leaves`);
  const leaves = await response.json();
  return leaves.filter((l) => String(l.userId) === String(userId));
};

/**
 * Fetches all leave requests (admin only)
 * @returns {Promise<Array>}
 */
export const getAllLeaves = async () => {
  const response = await fetch(`${BASE_URL}/leaves`);
  return response.json();
};

/**
 * Submits a new leave application
 * @param {Object} leaveData
 * @returns {Promise<Object>}
 */
export const applyLeave = async (leaveData) => {
  const response = await fetch(`${BASE_URL}/leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leaveData),
  });
  return response.json();
};

/**
 * Updates the status of a leave request (admin only)
 * @param {number} leaveId
 * @param {string} status
 * @returns {Promise<Object>}
 */
export const updateLeaveStatus = async (leaveId, status) => {
  const response = await fetch(`${BASE_URL}/leaves/${leaveId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

/**
 * Fetches user data by ID
 * @param {number} userId
 * @returns {Promise<Object>}
 */
export const getUserById = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`);
  return response.json();
};

/**
 * Updates leave balance after approval
 * @param {number} userId
 * @param {Object} leaveBalance
 * @returns {Promise<Object>}
 */
export const updateLeaveBalance = async (userId, leaveBalance) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaveBalance }),
  });
  return response.json();
};
