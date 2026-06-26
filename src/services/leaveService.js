const BASE_URL = "https://leave-management-system-wm59.onrender.com";
/**
 * Fetches all leave requests
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of leave objects
 */
export const getLeavesByUser = async (userId) => {
  console.info("[LEAVE] Fetching leaves for userId:", userId);
  try {
    const response = await fetch(`${BASE_URL}/leaves`);
    if (!response.ok) throw new Error("Failed to fetch leaves");
    const leaves = await response.json();
    return leaves.filter((l) => String(l.userId) === String(userId));
  } catch (err) {
    console.error("[LEAVE] Error fetching user leaves:", err.message);
    throw err;
  }
};

/**
 * Fetches all leave requests (admin only)
 * @returns {Promise<Array>} - Array of all leave objects
 */
export const getAllLeaves = async () => {
  console.info("[LEAVE] Fetching all leaves (admin)");
  try {
    const response = await fetch(`${BASE_URL}/leaves`);
    if (!response.ok) throw new Error("Failed to fetch all leaves");
    return response.json();
  } catch (err) {
    console.error("[LEAVE] Error fetching all leaves:", err.message);
    throw err;
  }
};

/**
 * Submits a new leave application
 * @param {Object} leaveData - The leave form data
 * @returns {Promise<Object>} - The created leave object
 */
export const applyLeave = async (leaveData) => {
  console.info("[LEAVE] Applying leave:", leaveData);
  try {
    const response = await fetch(`${BASE_URL}/leaves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leaveData),
    });
    if (!response.ok) throw new Error("Failed to apply leave");
    return response.json();
  } catch (err) {
    console.error("[LEAVE] Error applying leave:", err.message);
    throw err;
  }
};

/**
 * Updates the status of a leave request (admin only)
 * @param {number} leaveId - The ID of the leave
 * @param {string} status - New status: "Approved" or "Rejected"
 * @returns {Promise<Object>} - Updated leave object
 */
export const updateLeaveStatus = async (leaveId, status) => {
  console.info("[LEAVE] Updating leave status:", leaveId, "->", status);
  try {
    const response = await fetch(`${BASE_URL}/leaves/${leaveId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update leave status");
    return response.json();
  } catch (err) {
    console.error("[LEAVE] Error updating leave status:", err.message);
    throw err;
  }
};

/**
 * Fetches user data by ID
 * @param {number} userId - ID of the user
 * @returns {Promise<Object>} - User object
 */
export const getUserById = async (userId) => {
  console.info("[USER] Fetching user by ID:", userId);
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  } catch (err) {
    console.error("[USER] Error fetching user:", err.message);
    throw err;
  }
};

/**
 * Updates leave balance after approval
 * @param {number} userId - The ID of the user
 * @param {Object} leaveBalance - Updated leave balance object
 * @returns {Promise<Object>} - Updated user object
 */
export const updateLeaveBalance = async (userId, leaveBalance) => {
  console.info("[USER] Updating leave balance for userId:", userId);
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaveBalance }),
    });
    if (!response.ok) throw new Error("Failed to update leave balance");
    return response.json();
  } catch (err) {
    console.error("[USER] Error updating leave balance:", err.message);
    throw err;
  }
};
