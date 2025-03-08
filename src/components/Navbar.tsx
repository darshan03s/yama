import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
    name: string;
    to: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ name, to, isActive }) => {
    return (
        <Link to={to} className="flex items-center">
            <span
                className={`sm:inline font-medium hover:text-black/80 transition-colors duration-100 
                ${isActive ? "underline decoration-amber-800 decoration-2 underline-offset-4" : ""}`}
                aria-current={isActive ? "page" : undefined}
            >
                {name}
            </span>
        </Link>
    );
};

const Navbar: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");

    return (
        <nav className="bg-amber-300 p-2 flex items-center justify-center">
            <div className="nav-items flex items-center gap-4">
                <NavItem name="Movies" to="/" isActive={location.pathname === "/" && !category} />
                <NavItem name="TV Shows" to="/?category=tv" isActive={category === "tv"} />
                <NavItem name="Trending" to="/?category=trending" isActive={category === "trending"} />
            </div>
        </nav>
    );
};

export default Navbar;
