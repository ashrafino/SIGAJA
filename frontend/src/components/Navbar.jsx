import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell, User, Loader } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/notifications`,
      );
      setNotifications(data);
    } catch (error) {
      console.error("Erreur notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optionnel: rafraîchir toutes les 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleNotificationClick = (link) => {
    setShowDropdown(false);
    if (link) navigate(link);
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = (e) => {
    e.stopPropagation(); // Empêche le menu de se refermer/rouvrir bizarrement
    localStorage.removeItem("userInfo");
    navigate("/login"); // Force la redirection vers la page de connexion
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h3>Espace de Gestion</h3>
      </div>
      <div className="navbar-right">
        <div
          className="notification-icon"
          onClick={() => setShowDropdown(!showDropdown)}
          ref={dropdownRef}
        >
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="badge">{notifications.length}</span>
          )}

          {showDropdown && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button
                  className="refresh-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchNotifications();
                  }}
                >
                  ↻
                </button>
              </div>
              <div className="dropdown-body">
                {loading && (
                  <div className="loading">
                    <Loader size={16} className="spin" />
                  </div>
                )}
                {!loading && notifications.length === 0 && (
                  <p className="no-notif">Aucune notification</p>
                )}
                {!loading &&
                  notifications.map((notif, index) => (
                    <div
                      key={index}
                      className={`notif-item ${notif.type}`}
                      onClick={() => handleNotificationClick(notif.link)}
                    >
                      <p>{notif.message}</p>
                      <span className="notif-date">
                        {new Date(notif.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="user-profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className="avatar">
            <User size={20} />
          </div>
          <span>{userInfo.name || "Admin"}</span>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
