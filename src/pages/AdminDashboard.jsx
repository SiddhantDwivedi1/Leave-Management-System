import { useEffect, useState } from "react";
import {
    getAllLeaves,
    updateLeaveStatus,
    getUserById,
    updateLeaveBalance,
} from "../services/leaveService";
import { getStatusColor, formatDate } from "../utils/helpers";
import Navbar from "../components/Navbar";

/**
 * Admin dashboard to view and manage all leave requests
 */
const AdminDashboard = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [actionLoading, setActionLoading] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    /**
     * Fetches all leave applications from the server
     */
    const fetchAllLeaves = async () => {
        try {
            console.info("[ADMIN] Fetching all leaves");
            const data = await getAllLeaves();
            setLeaves(data.reverse());
        } catch (err) {
            console.error("[ADMIN] Failed to fetch leaves:", err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles approve or reject action on a leave
     * Deducts balance on approval
     * @param {Object} leave - The leave object
     * @param {string} newStatus - "Approved" or "Rejected"
     */
    const handleAction = async (leave, newStatus) => {
        setActionLoading(leave.id);
        try {
            await updateLeaveStatus(leave.id, newStatus);
            console.info("[ADMIN] Leave", leave.id, "->", newStatus);

            if (newStatus === "Approved") {
                const employee = await getUserById(leave.userId);
                const updatedBalance = { ...employee.leaveBalance };
                updatedBalance[leave.leaveType] = Math.max(
                    0,
                    updatedBalance[leave.leaveType] - leave.days
                );
                await updateLeaveBalance(leave.userId, updatedBalance);
                console.info("[ADMIN] Leave balance updated for userId:", leave.userId);
            }

            await fetchAllLeaves();
        } catch (err) {
            console.error("[ADMIN] Action failed:", err.message);
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Toggles expanded row for mobile dropdown
     * @param {string} id - Leave ID
     */
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const filteredLeaves =
        filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Manage all employee leave requests.
                </p>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {["All", "Pending", "Approved", "Rejected"].map((s) => (
                        <div key={s} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                            <p className="text-3xl font-bold text-blue-700">
                                {s === "All" ? leaves.length : leaves.filter((l) => l.status === s).length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{s}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {STATUS_FILTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${filter === s
                                ? "bg-blue-700 text-white"
                                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    {loading ? (
                        <p className="text-sm text-gray-400 p-6">Loading...</p>
                    ) : filteredLeaves.length === 0 ? (
                        <p className="text-sm text-gray-400 p-6">No records found.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-left">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Leave Type</th>
                                    <th className="px-4 py-3">From</th>
                                    <th className="px-4 py-3">To</th>
                                    <th className="px-4 py-3">Days</th>
                                    <th className="px-4 py-3">Reason</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave, index) => (
                                    <tr key={leave.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium">{leave.userName}</td>
                                        <td className="px-4 py-3">{leave.leaveType}</td>
                                        <td className="px-4 py-3">{formatDate(leave.startDate)}</td>
                                        <td className="px-4 py-3">{formatDate(leave.endDate)}</td>
                                        <td className="px-4 py-3">{leave.days}</td>
                                        <td className="px-4 py-3 max-w-xs truncate">{leave.reason}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {leave.status === "Pending" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAction(leave, "Approved")}
                                                        disabled={actionLoading === leave.id}
                                                        className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs hover:bg-green-200 transition disabled:opacity-50 cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(leave, "Rejected")}
                                                        disabled={actionLoading === leave.id}
                                                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 transition disabled:opacity-50 cursor-pointer"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Mobile Dropdown Cards */}
                <div className="md:hidden flex flex-col gap-3">
                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : filteredLeaves.length === 0 ? (
                        <p className="text-sm text-gray-400">No records found.</p>
                    ) : (
                        filteredLeaves.map((leave) => (
                            <div
                                key={leave.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* Card Header */}
                                <div
                                    className="flex justify-between items-center px-4 py-3 cursor-pointer"
                                    onClick={() => toggleExpand(leave.id)}
                                >
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">
                                            {leave.userName}
                                        </p>
                                        <p className="text-xs text-gray-500">{leave.leaveType}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                            {expandedId === leave.id ? "▲" : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === leave.id && (
                                    <div className="px-4 pb-4 border-t border-gray-100 flex flex-col gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">From</span>
                                            <span className="font-medium">{formatDate(leave.startDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">To</span>
                                            <span className="font-medium">{formatDate(leave.endDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Days</span>
                                            <span className="font-medium">{leave.days}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Reason</span>
                                            <p className="text-gray-800 mt-1">{leave.reason}</p>
                                        </div>
                                        {leave.status === "Pending" && (
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleAction(leave, "Approved")}
                                                    disabled={actionLoading === leave.id}
                                                    className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-xs hover:bg-green-200 transition disabled:opacity-50 cursor-pointer"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(leave, "Rejected")}
                                                    disabled={actionLoading === leave.id}
                                                    className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-xs hover:bg-red-200 transition disabled:opacity-50 cursor-pointer"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;