const BASE_URL = "http://localhost:5000";

/**
 * Authenticates user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>}
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/users`);
  const users = await response.json();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  return user;
};
