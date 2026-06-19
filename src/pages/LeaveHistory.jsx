import { useEffect, useState } from "react";
import { getLeavesByUser } from "../services/leaveService";
import { getStatusColor, formatDate } from "../utils/helpers";
import Navbar from "../components/Navbar";

//Leave history page showing all page

const LeaveHistory = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected"];

    useEffect(() => {

        // Fetch all leaves for the user
        const fetchLeaves = async () => {
            try {
                const data = await getLeavesByUser(user.id);
                setLeaves(data.reverse());
            } catch (err) {
                console.error("Failed to fetch leave history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaves();
    }, []);


    const filteredLeaves =
        filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Leave History</h2>
                <p className="text-gray-500 text-sm mb-6">
                    All your leave applications are listed below.
                </p>


                <div className="flex gap-2 mb-6">
                    {STATUS_FILTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === s
                                ? "bg-blue-700 text-white"
                                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}
                                            >
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

export default LeaveHistory;