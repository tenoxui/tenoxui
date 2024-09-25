import React, { useState, useRef, useEffect } from "react";
import { styler } from "@styler";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  styler();

  const linkStyle =
    "h-35px center j-c-[flex-start] g-6px td-none fw-500 c-slate-800 bg-none hover:c-slate-700 px-1rem py-6px ls--0.030em lh-1.4";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="flex space a-i-center px-1rem py-8px relative shadow-lg">
      <Link to="/" className="fs-1rem fw-500 ls--0.025em c-slate-900 td-none">
        TenoxUI
      </Link>
      <button ref={buttonRef} className="all-unset box-20px center p-8px br-4pxl c-slate-900" onClick={toggleMenu}>
        <span className={`ri fs-1.25rem ${isMenuOpen ? "ri-close-line" : "ri-menu-line"}`}></span>
      </button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute r-1rem t-[calc(100%\_+\_1rem)] bg-slate-100 br-6px flex fx-d-column g-8px py-6px shadow-lg z-9999"
        >
          <NavLink to="/example/styles" className={({ isActive }) => `${linkStyle} ${isActive ? "bg-slate-200" : ""}`}>
            <span className="ri ri-pantone-fill"></span> Styles
          </NavLink>
          <NavLink
            to="/example/components"
            className={({ isActive }) => `${linkStyle} ${isActive ? "bg-slate-200" : ""}`}
          >
            <span className="ri ri-puzzle-2-fill"></span> Components
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
