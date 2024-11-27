import React from "react";
import PropTypes from "prop-types";

const NavBar = ({ username, handleLogout, role }) => {
    // Determine the label for the logout button based on role and username
    const logoutLabel = role === "admin" 
        ? `Logout (${username || "Admin"})` 
        : `Logout (${username || "child"})`;

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light fixed-top"
            style={{
                backgroundColor: 'rgba(173, 216, 230, 0.7)', // Pale white with 70% opacity
                boxShadow: 'none',
            }}
        >
            <div className="container-fluid">
                {/* Brand */}
                <a className="navbar-brand" href="/">
                    <img
                        src="favicon.ico"
                        alt="Favicon"
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    <b>EXPRESSION TRACKER</b>
                </a>

                {/* Toggle Button for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            {/* Additional links can go here if needed */}
                        </li>
                    </ul>

                    {/* Logout Button */}
                    <button
                        className="btn logout-btn"
                        onClick={handleLogout}
                        style={{
                            marginLeft: 'auto',
                            backgroundColor: '#2ea8b1',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '5px',
                        }}
                    >
                        {logoutLabel}
                    </button>
                </div>
            </div>
        </nav>
    );
};

// Define PropTypes for validation
NavBar.propTypes = {
    username: PropTypes.string,
    handleLogout: PropTypes.func.isRequired,
    role: PropTypes.oneOf(["admin", "child"]).isRequired, // Role should be either "admin" or "child"
};

export default NavBar;
