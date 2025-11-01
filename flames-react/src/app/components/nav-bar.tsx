import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-2">
      <div className="container flex flex-row items-start mx-auto space-x-10">
        <div className="text-white text-xl font-bold">
          <img
            className="h-10 w-auto"
            src="/flames.png"
            alt="Flames Animation App"
          />
        </div>
        <div className="hidden md:flex space-x-10 h-10">
          <Link to="/" className="text-white">
            Home
          </Link>
          <Link to="/animations" className="text-white">
            Animations
          </Link>
          <Link to="/about" className="text-white">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
