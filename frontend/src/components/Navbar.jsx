import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Loader, Search, Settings, LogOut, ChevronDown } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (link) => {
    setShowDropdown(false);
    if (link) navigate(link);
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('recouvrement')) return 'Contentieux & Recouvrement';
    if (path.includes('contrats')) return 'Gestion des Contrats';
    if (path.includes('assurances')) return 'Dossiers Assurances';
    if (path.includes('alertes')) return 'Alertes & Échéances';
    if (path.includes('statistiques')) return 'Statistiques Globales';
    if (path.includes('admin')) return 'Administration';
    return 'Tableau de Bord';
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Rechercher un dossier, contrat..." className="search-input" />
        </div>
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
                  title="Rafraîchir"
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
                  <p className="no-notif">Aucune notification pour le moment.</p>
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
          ref={profileRef}
        >
          <div className="avatar">
            {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="user-info-nav">
            <span className="user-name">{userInfo.name || "Admin"}</span>
            <span className="user-role">{userInfo.role || "Administrator"}</span>
          </div>
          <ChevronDown size={16} className="chevron-icon" />
          
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-user-header">
                <p className="greeting">Bonjour,</p>
                <p className="greeting-name">{userInfo.name || "Admin"}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-menu-item" onClick={() => navigate('/app/admin')}>
                <Settings size={16} />
                <span>Paramètres</span>
              </button>
              <button onClick={handleLogout} className="dropdown-menu-item logout-btn">
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
