const BASE_URL = "https://leave-management-system-wm59.onrender.com";

/**
 * Authenticates user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User object if found
 */
export const loginUser = async (email, password) => {
  // Frontend validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  console.info("[AUTH] Attempting login for:", email);

  try {
    const response = await fetch(
      `${BASE_URL}/users?email=${email}&password=${password}`
    );

    if (!response.ok) {
      console.error("[AUTH] Server error during login");
      throw new Error("Server error. Please try again.");
    }

    const users = await response.json();

    if (!users || users.length === 0 || !users[0]) {
      console.warn("[AUTH] Invalid credentials for:", email);
      throw new Error("Invalid credentials");
    }

    console.info("[AUTH] Login successful for:", email);
    return users[0];
  } catch (err) {
    console.error("[AUTH] Login failed:", err.message);
    throw err;
  }
};
