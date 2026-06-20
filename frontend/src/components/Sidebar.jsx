import { useNavigate } from 'react-router-dom';
import { Home, FileText, Database, ShieldAlert, PieChart, Lock, LogOut, Archive } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Tableau de Bord', icon: <Home size={20} />, path: '/app' },
        { name: 'Contentieux', icon: <FileText size={20} />, path: '/app/recouvrement' },
        { name: 'Contrats', icon: <Database size={20} />, path: '/app/contrats' },
        { name: 'Alertes', icon: <ShieldAlert size={20} color="#EF4444" />, path: '/app/alertes' },
        { name: 'Assurances', icon: <ShieldAlert size={20} />, path: '/app/assurances' },
        { name: 'Statistiques', icon: <PieChart size={20} />, path: '/app/statistiques' },
        { name: 'Archivage', icon: <Archive size={20} />, path: '/app/archivage' },
        { name: 'Administration', icon: <Lock size={20} />, path: '/app/admin' },
    ];

    const handleLogout = () => {
        // Logique de déconnexion ici
        localStorage.removeItem('userInfo');
        console.log('Déconnexion');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>SIGAJA (SRM-LS)</h2>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <li key={index} onClick={() => navigate(item.path)}>
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
