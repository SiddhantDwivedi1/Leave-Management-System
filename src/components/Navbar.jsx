import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";


const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        navigate("/");
    };


    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-wide">LMS</h1>

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
                        className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
                    >
                        Logout
                    </button>
                </div>

                <button onClick={toggleMenu} className="md:hidden focus:outline-none">
                    {menuOpen ? (
                        <HiX className="text-white text-2xl" />
                    ) : (
                        <HiMenu className="text-white text-2xl" />
                    )}
                </button>
            </div>


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
                        className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-gray-100 transition w-fit"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;