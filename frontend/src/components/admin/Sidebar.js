import React from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

const Sidebar = () => {

  const user = useSelector((state) => state.auth.user); // Get user role from Redux store

  return (
    <div className="sidebar-wrapper">
      <nav id="sidebar">
        <ul className="list-unstyled components">
          <li>
            <Link to="/dashboard">
              <i className="fa fa-tachometer"></i> Dashboard
            </Link>
          </li>

          <li>
            <a
              href="#productSubmenu"
              data-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <i className="fa fa-product-hunt"></i> Food Items
            </a>
            <ul className="collapse list-unstyled" id="productSubmenu">
              <li>
                <Link to="/admin/products">
                  <i className="fa fa-clipboard"></i> All
                </Link>
              </li>

              <li>
                <Link to="/admin/product">
                  <i className="fa fa-plus"></i> Create
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/admin/orders">
              <i className="fa fa-shopping-basket"></i> Orders
            </Link>
          </li>

          {user.role === "admin" && (
            <>
              <li>
                <Link to="/admin/users">
                  <i className="fa fa-users"></i> Users
                </Link>
              </li>
              <li>
                <Link to="/admin/reviews">
                  <i className="fa fa-users"></i> Reviews
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
