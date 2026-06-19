import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * @param {Event} e - Form submit event
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = await loginUser(email, password);

            sessionStorage.setItem("user", JSON.stringify(user));
            user.role === "admin" ? navigate("/admin") : navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center">LMS</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Leave Management System</p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded mb-4 border border-red-200">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition font-medium disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;