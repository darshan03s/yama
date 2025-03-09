import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Category } from "../types";

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
            >
                {name}
            </span>
        </Link>
    );
};

const Navbar: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = (searchParams.get("category") as Category) || "movie";
    return (
        <nav className="bg-amber-300 p-2 flex items-center justify-center">
            <div className="nav-items flex items-center gap-4 text-sm sm:text-base">
                <NavItem name="Movies" to="/" isActive={location.pathname === "/" && category === "movie"} />
                <NavItem name="TV Shows" to="/?category=tv" isActive={category === "tv"} />
                <NavItem name="Now playing" to="/?category=now_playing" isActive={category === "now_playing"} />
                <NavItem name="Top rated" to="/?category=top_rated" isActive={category === "top_rated"} />
                <NavItem name="Upcoming" to="/?category=upcoming" isActive={category === "upcoming"} />
            </div>
        </nav>
    );
};

export default Navbar;
