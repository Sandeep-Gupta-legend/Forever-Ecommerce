import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef();
  const {setShowSearch,getCartItemCount}= useContext(ShopContext);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Shared NavLink style
  const navItem = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium tracking-wide transition-all duration-300
     ${isActive ? "text-black border-b-2 border-black" : "text-gray-700 border-b-2 border-transparent"}
     hover:border-gray-400`;

  return (
    <nav className="w-full shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">

        {/* LOGO */}
        <Link to="/">
          <img src={assets.logo} className="w-32 sm:w-40" alt="logo" />
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={navItem}>
            Home
          </NavLink>

          <NavLink to="/collection" className={navItem}>
            Collection
          </NavLink>

          <NavLink to="/about" className={navItem}>
            About
          </NavLink>

          <NavLink to="/contact" className={navItem}>
            Contact
          </NavLink>
        </ul>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-6">

          {/* Search Icon */}
          <img
            src={assets.search_icon}
            className="w-7 cursor-pointer hover:scale-110 transition"
            alt="search"
            onClick={()=>setShowSearch(true)}
          />

          {/* Profile */}
          <div className="relative" ref={profileRef}>
           <Link to='/login'><img
              src={assets.profile_icon}
              className="w-6 cursor-pointer hover:scale-110 transition"
              onClick={() => setProfileOpen(!profileOpen)}
              alt="profile"
            /></Link> 

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-36 bg-white rounded shadow-md p-3 flex flex-col gap-2 text-sm text-gray-700">
                <p className="hover:text-black cursor-pointer">My Profile</p>
                <p className="hover:text-black cursor-pointer">Orders</p>
                <p className="hover:text-black cursor-pointer">Logout</p>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              className="w-6 cursor-pointer hover:scale-110 transition"
              alt="cart"
            />
            <span className="absolute right-[-6px] top-[-6px] bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {getCartItemCount()}
            </span>
          </Link>

          {/* Mobile Menu Icon */}
          <img
            src={assets.menu_icon}
            className="w-7 md:hidden cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            alt="menu"
          />
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-white shadow-md transition-all duration-300 overflow-hidden 
        ${mobileOpen ? "max-h-60 py-3" : "max-h-0 py-0"}`}
      >
        <ul className="flex flex-col gap-3 px-6 text-gray-700">

          <NavLink to="/" className={navItem} onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/collection" className={navItem} onClick={() => setMobileOpen(false)}>
            Collection
          </NavLink>

          <NavLink to="/about" className={navItem} onClick={() => setMobileOpen(false)}>
            About
          </NavLink>

          <NavLink to="/contact" className={navItem} onClick={() => setMobileOpen(false)}>
            Contact
          </NavLink>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
