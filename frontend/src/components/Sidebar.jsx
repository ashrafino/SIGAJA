import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Database, ShieldAlert, PieChart, Lock, LogOut, Archive } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Tableau de Bord', icon: <Home size={20} />, path: '/app' },
        { name: 'Contentieux', icon: <FileText size={20} />, path: '/app/recouvrement' },
        { name: 'Contrats', icon: <Database size={20} />, path: '/app/contrats' },
        { name: 'Alertes', icon: <ShieldAlert size={20} />, path: '/app/alertes' },
        { name: 'Assurances', icon: <ShieldAlert size={20} />, path: '/app/assurances' },
        { name: 'Statistiques', icon: <PieChart size={20} />, path: '/app/statistiques' },
        { name: 'Archivage', icon: <Archive size={20} />, path: '/app/archivage' },
        { name: 'Administration', icon: <Lock size={20} />, path: '/app/admin' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src="/srm_logo.png" alt="SRM" className="sidebar-logo" />
                <div>
                    <h2>SIGAJA</h2>
                    <span className="sidebar-subtitle">SRM Laâyoune</span>
                </div>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <li 
                        key={index} 
                        onClick={() => navigate(item.path)}
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        <div className="menu-item">
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
