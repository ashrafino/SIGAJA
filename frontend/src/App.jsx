import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Recouvrement from './pages/Recouvrement';
import Contrats from './pages/Contrats';
import Assurances from './pages/Assurances';
import Statistiques from './pages/Statistiques';
import Admin from './pages/Admin';
import Archivage from './pages/Archivage';
import Alertes from './pages/Alertes';
import Landing from './pages/Landing';
import Etudes from './pages/Etudes';
import ProtectedRoute from './components/ProtectedRoute'; // Importation du ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Ces routes sont protégées : si pas connecté -> redirection Login */}
        <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="recouvrement" element={<Recouvrement />} />
                <Route path="contrats" element={<Contrats />} />
                <Route path="alertes" element={<Alertes />} />
                <Route path="assurances" element={<Assurances />} />
                <Route path="etudes" element={<Etudes />} />
                <Route path="statistiques" element={<Statistiques />} />
                <Route path="archivage" element={<Archivage />} />
                <Route path="admin" element={<Admin />} />
            </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
