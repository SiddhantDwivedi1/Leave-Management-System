import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyLeave } from "../services/leaveService";
import { calculateDays } from "../utils/helpers";
import Navbar from "../components/Navbar";


const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Earned Leave", "Leave Without Pay", "Other"];

// Leave application form page

const LeaveForm = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Updates form state on input change
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError("");
        const { leaveType, startDate, endDate, reason } = formData;


        if (!leaveType || !startDate || !endDate || !reason) {
            setError("All fields are required.");
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            setError("End date cannot be before start date.");
            return;
        }

        const days = calculateDays(startDate, endDate);
        const availableBalance = user.leaveBalance[leaveType];

        if (days > availableBalance) {
            setError(`Insufficient balance. You have ${availableBalance} ${leaveType} days left.`);
            return;
        }

        setLoading(true);
        try {
            await applyLeave({
                userId: user.id,
                userName: user.name,
                leaveType,
                startDate,
                endDate,
                days,
                reason,
                status: "Pending",
                appliedOn: new Date().toISOString().split("T")[0],
            });
            navigate("/history");
        } catch (err) {
            setError("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const days = formData.startDate && formData.endDate
        ? calculateDays(formData.startDate, formData.endDate)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Apply for Leave</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Fill in the details below to submit your leave request.
                </p>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Leave Type
                        </label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select leave type</option>
                            {LEAVE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type} ({user?.leaveBalance[type]} days left)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Days calculated */}

                    {days > 0 && (
                        <p className="text-sm text-blue-600 font-medium">
                            Total Days: {days}
                        </p>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Reason
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Briefly describe the reason for your leave..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition font-medium disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveForm;