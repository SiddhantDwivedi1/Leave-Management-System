import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clipboard, Menu, X } from "lucide-react";

// Navbar component
const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Redirect to login
    const handleLogout = () => {
        sessionStorage.removeItem("user");
        navigate("/");
    };

    // Toggle hamburger menu
    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
            <div className="flex justify-between items-center">

                {/* Logo links to dashboard */}
                <Link
                    to={user?.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2"
                >
                    <Clipboard className="h-7 w-7 text-white" />
                    <h1 className="text-xl font-bold tracking-wide">LMS</h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {user?.role === "admin" ? (
                        <Link to="/admin" className="hover:underline text-sm">
                            Admin Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/dashboard" className="hover:underline text-sm">
                                Dashboard
                            </Link>
                            <Link to="/apply" className="hover:underline text-sm">
                                Apply Leave
                            </Link>
                            <Link to="/history" className="hover:underline text-sm">
                                Leave History
                            </Link>
                        </>
                    )}
                    <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                        {user?.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-gray-100 transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

                {/* Hamburger Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden focus:outline-none cursor-pointer"
                >
                    {menuOpen ? (
                        <X className="text-white h-6 w-6" />
                    ) : (
                        <Menu className="text-white h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-3 border-t border-blue-600 pt-4">
                    {user?.role === "admin" ? (
                        <Link
                            to="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="hover:underline text-sm"
                        >
                            Admin Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/dashboard"
                                onClick={() => setMenuOpen(false)}
                                className="hover:underline text-sm"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/apply"
                                onClick={() => setMenuOpen(false)}
                                className="hover:underline text-sm"
                            >
                                Apply Leave
                            </Link>
                            <Link
                                to="/history"
                                onClick={() => setMenuOpen(false)}
                                className="hover:underline text-sm"
                            >
                                Leave History
                            </Link>
                        </>
                    )}
                    <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full w-fit">
                        {user?.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-gray-100 transition w-fit cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
