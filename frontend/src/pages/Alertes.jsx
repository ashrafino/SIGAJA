import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Clock, RefreshCw, XCircle, FileText } from 'lucide-react';
import './Module.css';

const Alertes = () => {
    const [contrats, setContrats] = useState([]);
    const [dossiers, setDossiers] = useState([]);
    const [assurances, setAssurances] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resContrats, resDossiers, resAssurances] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}api/contrats`),
                axios.get(`${import.meta.env.VITE_API_URL}api/recouvrement`),
                axios.get(`${import.meta.env.VITE_API_URL}api/assurances`)
            ]);
            setContrats(resContrats.data);
            setDossiers(resDossiers.data);
            setAssurances(resAssurances.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getDaysUntilExpiry = (dateFin) => {
        if (!dateFin) return null;
        const now = new Date();
        const end = new Date(dateFin);
        return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    };

    const aRenouveler = contrats.filter(c => c.statut === 'Actif' && getDaysUntilExpiry(c.dateFin) <= (c.alerteRenouvellement || 30) && getDaysUntilExpiry(c.dateFin) >= 0);
    const expires = contrats.filter(c => c.statut === 'Actif' && getDaysUntilExpiry(c.dateFin) < 0);
    const resilies = contrats.filter(c => c.statut === 'Résilié');

    const dossiersCritiques = dossiers.filter(d => d.risqueFinancier === 'Critique' && d.statut !== 'Clôturé');
    const assurancesEnExpertise = assurances.filter(a => a.statut === 'En expertise');

    return (
        <div className="module-container">
            <div className="module-header">
                <h1>Centre des Alertes</h1>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card orange">
                    <RefreshCw size={32} />
                    <div>
                        <span className="kpi-value">{aRenouveler.length}</span>
                        <span className="kpi-label">À renouveler (Dans les {aRenouveler[0]?.alerteRenouvellement || 30} j)</span>
                    </div>
                </div>
                <div className="kpi-card red">
                    <AlertTriangle size={32} />
                    <div>
                        <span className="kpi-value">{expires.length}</span>
                        <span className="kpi-label">Contrats expirés</span>
                    </div>
                </div>
                <div className="kpi-card purple">
                    <XCircle size={32} />
                    <div>
                        <span className="kpi-value">{resilies.length}</span>
                        <span className="kpi-label">Contrats résiliés</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>⚠️ Action requise : À renouveler</h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>N° Contrat</th>
                                <th>Type</th>
                                <th>Fin du contrat</th>
                                <th>Jours restants</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aRenouveler.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">Aucun contrat à renouveler</td></tr>
                            ) : aRenouveler.map(c => (
                                <tr key={c._id}>
                                    <td style={{fontWeight: 600}}>{c.numeroContrat}</td>
                                    <td>{c.type}</td>
                                    <td>{new Date(c.dateFin).toLocaleDateString()}</td>
                                    <td><span className="expiry-badge warning"><Clock size={12} /> {getDaysUntilExpiry(c.dateFin)}j</span></td>
                                    <td>
                                        <button className="btn btn-primary" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => navigate('/contrats')}>Consulter</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card" style={{borderLeft: '4px solid #EF4444'}}>
                <h3 style={{color: '#B91C1C'}}>🚨 Critique : Dépassés / Expirés</h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>N° Contrat</th>
                                <th>Type</th>
                                <th>Expiré depuis</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expires.length === 0 ? (
                                <tr><td colSpan="4" className="text-center">Aucun contrat expiré</td></tr>
                            ) : expires.map(c => (
                                <tr key={c._id}>
                                    <td style={{fontWeight: 600}}>{c.numeroContrat}</td>
                                    <td>{c.type}</td>
                                    <td><span className="expiry-badge expired"><AlertTriangle size={12} /> {Math.abs(getDaysUntilExpiry(c.dateFin))}j de retard</span></td>
                                    <td>
                                        <button className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => navigate('/contrats')}>Résilier / Renouveler</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card" style={{borderLeft: '4px solid #F59E0B', marginTop: '20px'}}>
                <h3 style={{color: '#D97706'}}>⚖️ Contentieux Critiques</h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>N° Dossier</th>
                                <th>Nature du Litige</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dossiersCritiques.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">Aucun dossier critique en cours</td></tr>
                            ) : dossiersCritiques.map(d => (
                                <tr key={d._id}>
                                    <td style={{fontWeight: 600}}>{d.numeroDossier}</td>
                                    <td>{d.natureLitige || d.activite}</td>
                                    <td>{d.montant?.toLocaleString()} MAD</td>
                                    <td><span className="status status-warning">{d.statut}</span></td>
                                    <td>
                                        <button className="btn btn-primary" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => navigate('/recouvrement')}>Consulter</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card" style={{borderLeft: '4px solid #3B82F6', marginTop: '20px'}}>
                <h3 style={{color: '#2563EB'}}>🛡️ Assurances en Expertise</h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type Assurance</th>
                                <th>Service</th>
                                <th>Demandé</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assurancesEnExpertise.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">Aucune assurance en expertise</td></tr>
                            ) : assurancesEnExpertise.map(a => (
                                <tr key={a._id}>
                                    <td style={{fontWeight: 600}}>{new Date(a.date).toLocaleDateString()}</td>
                                    <td>{a.typeAssurance}</td>
                                    <td>{a.service}</td>
                                    <td>{a.montantDemande ? `${a.montantDemande.toLocaleString()} MAD` : '—'}</td>
                                    <td>
                                        <button className="btn btn-primary" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => navigate('/assurances')}>Consulter</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Alertes;
