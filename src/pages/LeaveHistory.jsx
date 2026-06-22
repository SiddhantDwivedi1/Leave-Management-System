import { useEffect, useState } from "react";
import { getLeavesByUser } from "../services/leaveService";
import { getStatusColor, formatDate } from "../utils/helpers";
import Navbar from "../components/Navbar";

/**
 * Leave history page showing all leave applications
 */
const LeaveHistory = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [expandedId, setExpandedId] = useState(null);

    const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                console.info("[HISTORY] Fetching leave history for userId:", user.id);
                const data = await getLeavesByUser(user.id);
                setLeaves(data.reverse());
            } catch (err) {
                console.error("[HISTORY] Failed to fetch leave history:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaves();
    }, []);

    // Filter leaves
    const filteredLeaves =
        filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

    /**
     * Toggles expanded row for mobile dropdown
     * @param {string} id - Leave ID
     */
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Leave History</h2>
                <p className="text-gray-500 text-sm mb-6">
                    All your leave applications are listed below.
                </p>

                {/* Filter Tabs */}
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
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <p className="text-sm text-gray-400 p-6">Loading...</p>
                    ) : filteredLeaves.length === 0 ? (
                        <p className="text-sm text-gray-400 p-6">No records found.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-left">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Leave Type</th>
                                    <th className="px-4 py-3">From</th>
                                    <th className="px-4 py-3">To</th>
                                    <th className="px-4 py-3">Days</th>
                                    <th className="px-4 py-3">Reason</th>
                                    <th className="px-4 py-3">Applied On</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave, index) => (
                                    <tr key={leave.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3">{leave.leaveType}</td>
                                        <td className="px-4 py-3">{formatDate(leave.startDate)}</td>
                                        <td className="px-4 py-3">{formatDate(leave.endDate)}</td>
                                        <td className="px-4 py-3">{leave.days}</td>
                                        <td className="px-4 py-3 max-w-xs truncate">{leave.reason}</td>
                                        <td className="px-4 py-3">{formatDate(leave.appliedOn)}</td>
                                        <td className="px-4 py-3">
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

                {/* Mobile Dropdown Cards */}
                <div className="md:hidden flex flex-col gap-3">
                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : filteredLeaves.length === 0 ? (
                        <p className="text-sm text-gray-400">No records found.</p>
                    ) : (
                        filteredLeaves.map((leave, index) => (
                            <div
                                key={leave.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div
                                    className="flex justify-between items-center px-4 py-3 cursor-pointer"
                                    onClick={() => toggleExpand(leave.id)}
                                >
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">
                                            {leave.leaveType}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                                        </p>
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

                                {expandedId === leave.id && (
                                    <div className="px-4 pb-4 border-t border-gray-100 flex flex-col gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Days</span>
                                            <span className="font-medium">{leave.days}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Applied On</span>
                                            <span className="font-medium">{formatDate(leave.appliedOn)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Reason</span>
                                            <p className="text-gray-800 mt-1">{leave.reason}</p>
                                        </div>
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

export default LeaveHistory;