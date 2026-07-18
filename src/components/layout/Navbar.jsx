import { NavLink, useLocation } from "react-router-dom";
import { FaSteam } from "react-icons/fa";
import { useState, useEffect } from "react";
import { APP_NAME, NAVIGATION } from "../../utils/constants";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (openMenu) setOpenMenu(null);
  }, [location.pathname, openMenu]);

  const isParentActive = (children) => children?.some((child) => location.pathname === child.path);

  return (
    <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50 px-4 md:px-8">
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown lg:hidden">
          <label className="btn btn-ghost" tabIndex={0}>
            <span className="text-xl">☰</span>
          </label>
          <ul className="menu menu-sm dropdown-content mt-3 w-64 rounded-box bg-base-100 shadow-xl z-50">
            {NAVIGATION.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      className={`w-full text-left ${openMenu === item.label ? "active" : ""}`}
                      onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    >
                      {item.label}
                    </button>
                    {openMenu === item.label && (
                      <ul className="pl-4">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) => (isActive ? "active" : "")}
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        <NavLink to="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-90 transition-opacity">
          <img
            src="src/assets/images/tug.png"
            alt="TUG Insurgency banner"
            className="w-8 h-8 object-contain"
          />
          {APP_NAME}
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {NAVIGATION.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div className="dropdown dropdown-hover">
                  <label
                    tabIndex={0}
                    className={`px-3 py-2 rounded-lg cursor-pointer ${
                      isParentActive(item.children) ? "active" : ""
                    }`}
                  >
                    {item.label}
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-56 z-50 mt-2">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <NavLink
                          to={child.path}
                          className={({ isActive }) => (isActive ? "active" : "")}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        <a
          href="https://store.steampowered.com/app/222880/Insurgency/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm md:btn-md font-bold"
        >
          <FaSteam className="w-4 h-4 md:w-5 md:h-5" />
          Play Now
        </a>
      </div>
    </div>
  );
}