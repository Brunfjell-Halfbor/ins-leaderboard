import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { APP_NAME, NAVIGATION } from "../../utils/constants";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  return (
    <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="navbar-start">

        {/* Mobile */}
        <div className="dropdown lg:hidden">
          <label className="btn btn-ghost" tabIndex={0}>
            ☰
          </label>

          <ul className="menu menu-sm dropdown-content mt-3 w-64 rounded-box bg-base-100 shadow z-50">
            {NAVIGATION.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      className="w-full text-left"
                      onClick={() =>
                        setOpenMenu(openMenu === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                    </button>

                    {openMenu === item.label && (
                      <ul className="pl-4">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link to={child.path}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link to={item.path}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <img
            src="src/assets/images/tug.png"
            alt="TUG Insurgency banner"
            className="w-8 h-8 object-contain"
          />
          {APP_NAME}
        </Link>
      </div>

      {/* Desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {NAVIGATION.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div className="dropdown dropdown-hover">
                  <label tabIndex={0} className="px-2">
                    {item.label}
                  </label>

                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56 z-50 left-1/2 -translate-x-1/2 mt-2">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <Link to={child.path}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link to={item.path}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end" />
    </div>
  );
}