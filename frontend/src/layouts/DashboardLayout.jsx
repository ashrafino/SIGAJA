import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/ChatWidget';
import './DashboardLayout.css';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-area">
                    <Outlet />
                </div>
                {/* <ChatWidget /> */}
            </div>
        </div>
    );
};

export default DashboardLayout;
