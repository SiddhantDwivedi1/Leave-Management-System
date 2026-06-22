import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeavesByUser, getUserById } from "../services/leaveService";
import { getStatusColor } from "../utils/helpers";
import Navbar from "../components/Navbar";

/**
 * Employee dashboard showing leave balance
 */
const Dashboard = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.info("[DASHBOARD] Fetching fresh data for userId:", user.id);
                // Fetch fresh leaveBalance
                const freshUser = await getUserById(user.id);
                setLeaveBalance(freshUser.leaveBalance);
                // Fetch last 3 leave applications
                const data = await getLeavesByUser(user.id);
                setRecentLeaves(data.slice(-3).reverse());
            } catch (err) {
                console.error("[DASHBOARD] Failed to fetch data:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Welcome */}
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Welcome back, {user?.name}
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                    Here's your leave summary for this year.
                </p>

                {/* Leave Balance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {Object.entries(leaveBalance).map(([type, count]) => (
                        <div
                            key={type}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                        >
                            <p className="text-sm text-gray-500 mb-1">{type}</p>
                            <p className="text-4xl font-bold text-blue-700">{count}</p>
                            <p className="text-xs text-gray-400 mt-1">days remaining</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 mb-8">
                    <Link
                        to="/apply"
                        className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 transition cursor-pointer"
                    >
                        + Apply for Leave
                    </Link>
                    <Link
                        to="/history"
                        className="border border-blue-700 text-blue-700 px-5 py-2 rounded-lg text-sm hover:bg-blue-50 transition cursor-pointer"
                    >
                        View Full History
                    </Link>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Recent Applications
                    </h3>
                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : recentLeaves.length === 0 ? (
                        <p className="text-sm text-gray-400">No leave applications yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-2">Type</th>
                                    <th className="pb-2">From</th>
                                    <th className="pb-2">To</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeaves.map((leave) => (
                                    <tr key={leave.id} className="border-b last:border-0">
                                        <td className="py-2">{leave.leaveType}</td>
                                        <td className="py-2">{leave.startDate}</td>
                                        <td className="py-2">{leave.endDate}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;