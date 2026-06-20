import { Link } from "react-router-dom";
import { APP_NAME, NAVIGATION } from "../../utils/constants";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="navbar-start">

        {/* Mobile */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            ☰
          </label>

          <ul className="menu menu-sm dropdown-content mt-3 z-1 w-64 rounded-box bg-base-100 shadow">
            {NAVIGATION.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <span>{item.label}</span>

                    <ul>
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link to={child.path}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
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

        <Link
          to="/"
          className="text-xl font-bold"
        >
          {APP_NAME}
        </Link>
      </div>

      {/* Desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {NAVIGATION.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <details>
                  <summary>{item.label}</summary>

                  <ul className="bg-base-100 rounded-box w-56">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <Link to={child.path}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
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