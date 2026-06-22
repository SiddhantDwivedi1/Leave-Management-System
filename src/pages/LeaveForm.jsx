import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applyLeave, getLeavesByUser, getUserById } from "../services/leaveService";
import { calculateDays } from "../utils/helpers";
import Navbar from "../components/Navbar";

// Available leave types
const LEAVE_TYPES = [
    "Sick Leave",
    "Casual Leave",
    "Earned Leave",
    "Other",
];

// Reason min and max length
const REASON_MIN = 5;
const REASON_MAX = 50;

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
    const [leaveBalance, setLeaveBalance] = useState({});
    const [existingLeaves, setExistingLeaves] = useState([]);

    // Min date = today, Max date = 1 year from today
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    useEffect(() => {
        // Always fetch fresh leaveBalance
        const fetchData = async () => {
            try {
                console.info("[FORM] Fetching fresh user data and leaves");
                const freshUser = await getUserById(user.id);
                setLeaveBalance(freshUser.leaveBalance);
                const leaves = await getLeavesByUser(user.id);
                setExistingLeaves(leaves);
            } catch (err) {
                console.error("[FORM] Failed to fetch data:", err.message);
            }
        };
        fetchData();
    }, []);

    /**
     * Updates form state on input change
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Checks if new leave dates overlap with existing pending/approved leaves
     * @param {string} startDate - New leave start date
     * @param {string} endDate - New leave end date
     * @param {string} leaveType - New leave type
     * @returns {boolean} - True if overlap found
     */
    const hasOverlap = (startDate, endDate, leaveType) => {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        return existingLeaves.some((leave) => {
            if (
                leave.leaveType !== leaveType ||
                leave.status === "Rejected"
            )
                return false;

            const existStart = new Date(leave.startDate);
            const existEnd = new Date(leave.endDate);

            // Check overlap
            return newStart <= existEnd && newEnd >= existStart;
        });
    };

    /**
     * Checks if pending leaves of same type would exceed balance
     * @param {string} leaveType - Leave type
     * @param {number} requestedDays - Days being requested
     * @returns {number} - Days already used in pending leaves
     */
    const getPendingDays = (leaveType) => {
        return existingLeaves
            .filter(
                (l) => l.leaveType === leaveType && l.status === "Pending"
            )
            .reduce((total, l) => total + l.days, 0);
    };

    // Submits the leave application
    const handleSubmit = async () => {
        setError("");
        const { leaveType, startDate, endDate, reason } = formData;

        // Basic validation
        if (!leaveType || !startDate || !endDate || !reason) {
            setError("All fields are required.");
            return;
        }

        // Reason length validation
        if (reason.trim().length < REASON_MIN) {
            setError(`Reason must be at least ${REASON_MIN} characters.`);
            return;
        }
        if (reason.trim().length > REASON_MAX) {
            setError(`Reason must not exceed ${REASON_MAX} characters.`);
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError("End date cannot be before start date.");
            return;
        }

        const days = calculateDays(startDate, endDate);
        const availableBalance = leaveBalance[leaveType] || 0;

        // Check pending days of same type
        const pendingDays = getPendingDays(leaveType);
        const effectiveBalance = availableBalance - pendingDays;

        // Block if pending leaves already exceed balance
        if (pendingDays >= availableBalance) {
            setError(
                `You already have ${pendingDays} pending day(s) of ${leaveType} which equals or exceeds your balance of ${availableBalance} days. Wait for approval before applying again.`
            );
            return;
        }

        // Check if requested days exceed effective balance
        if (days > effectiveBalance) {
            setError(
                `Insufficient balance. You have ${availableBalance} ${leaveType} days, but ${pendingDays} are already pending. Only ${effectiveBalance} days available.`
            );
            return;
        }

        if (hasOverlap(startDate, endDate, leaveType)) {
            setError(
                "You already have a pending or approved leave for the same leave type on overlapping dates."
            );
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
                reason: reason.trim(),
                status: "Pending",
                appliedOn: new Date().toISOString().split("T")[0],
            });
            console.info("[FORM] Leave applied successfully");
            navigate("/history");
        } catch (err) {
            setError("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const days =
        formData.startDate && formData.endDate
            ? calculateDays(formData.startDate, formData.endDate)
            : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Apply for Leave
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Fill in the details below to submit your leave request.
                </p>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Leave Type */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Leave Type
                        </label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        >
                            <option value="">Select leave type</option>
                            {LEAVE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type} ({leaveBalance[type] ?? "..."} days left)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
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
                                min={today}
                                max={maxDateStr}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
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
                                min={formData.startDate || today}
                                max={maxDateStr}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
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
                            <span className="text-gray-400 font-normal ml-1">
                                ({REASON_MIN}–{REASON_MAX} characters)
                            </span>
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows={4}
                            maxLength={REASON_MAX}
                            placeholder="Briefly describe the reason for your leave..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">
                            {formData.reason.length}/{REASON_MAX}
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition font-medium disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveForm;