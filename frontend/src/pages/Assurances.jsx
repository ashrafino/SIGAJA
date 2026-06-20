import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash, Clock, Paperclip } from 'lucide-react';
import './Module.css';

const Assurances = () => {
    const [assurances, setAssurances] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        typeAssurance: 'Accident', date: '', lieu: '', service: 'Eau',
        description: '', statut: 'Déclaré', numeroPolice: '',
        compagnieAssurance: '', dateDeclaration: '', montantDemande: '', montantAccorde: '', piecesJointes: []
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo && userInfo.role === 'Admin';
    const canViewAll = userInfo && (userInfo.role === 'Admin' || userInfo.role === 'Directeur Général');

    useEffect(() => { fetchAssurances(); }, []);

    const fetchAssurances = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}api/assurances`);
            setAssurances(data);
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Êtes-vous sûr de vouloir supprimer cette assurance ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}api/assurances/${id}`);
                fetchAssurances();
            } catch (error) { console.error(error); alert('Erreur lors de la suppression'); }
        }
    };

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const uploadData = new FormData();
        Array.from(files).forEach(file => {
            uploadData.append('documents', file);
        });
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}api/upload`, uploadData);
            setFormData(prev => ({ ...prev, piecesJointes: [...(prev.piecesJointes || []), ...data] }));
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'upload des fichiers");
        }
    };

    const handleNewClick = () => {
        setFormData({
            typeAssurance: 'Accident', date: '', lieu: '', service: 'Eau',
            description: '', statut: 'Déclaré', numeroPolice: '',
            compagnieAssurance: '', dateDeclaration: '', montantDemande: '', montantAccorde: '', piecesJointes: []
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditClick = (a) => {
        setFormData({
            typeAssurance: a.typeAssurance,
            date: a.date?.split('T')[0] || '',
            lieu: a.lieu,
            service: a.service,
            description: a.description || '',
            statut: a.statut,
            numeroPolice: a.numeroPolice || '',
            compagnieAssurance: a.compagnieAssurance || '',
            dateDeclaration: a.dateDeclaration?.split('T')[0] || '',
            montantDemande: a.montantDemande || '',
            montantAccorde: a.montantAccorde || '',
            piecesJointes: a.piecesJointes || []
        });
        setCurrentId(a._id);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_API_URL}api/assurances/${currentId}`, formData);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}api/assurances`, formData);
            }
            setShowModal(false);
            fetchAssurances();
        } catch (error) { console.error(error); }
    };

    const getDelaiIndicator = (a) => {
        if (!a.dateDeclaration) return null;
        const now = a.dateIndemnisation ? new Date(a.dateIndemnisation) : new Date();
        const decl = new Date(a.dateDeclaration);
        const days = Math.ceil((now - decl) / (1000 * 60 * 60 * 24));
        if (a.statut === 'Indemnisé' || a.statut === 'Clôturé') {
            return <span className="delai-badge green"><Clock size={12} /> {days}j</span>;
        }
        if (days > 60) return <span className="delai-badge red"><Clock size={12} /> {days}j</span>;
        if (days > 30) return <span className="delai-badge yellow"><Clock size={12} /> {days}j</span>;
        return <span className="delai-badge green"><Clock size={12} /> {days}j</span>;
    };

    return (
        <div className="module-container">
            <div className="module-header">
                <h1>Gestion des Assurances</h1>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={handleNewClick}>
                        <Plus size={18} /> Déclarer Assurance
                    </button>
                )}
            </div>

            {isAdmin && showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxWidth: '650px'}}>
                        <h2>{isEditMode ? 'Modifier Assurance' : 'Déclaration d\'Assurance'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type d'Assurance</label>
                                    <select className="form-control" value={['Accident', 'Dégât Réseau', 'Dommage Tiers'].includes(formData.typeAssurance) ? formData.typeAssurance : 'Autre'}
                                        onChange={(e) => {
                                            if (e.target.value === 'Autre') setFormData({...formData, typeAssurance: ''});
                                            else setFormData({...formData, typeAssurance: e.target.value});
                                        }}>
                                        <option value="Accident">Accident</option>
                                        <option value="Dégât Réseau">Dégât Réseau</option>
                                        <option value="Dommage Tiers">Dommage Tiers</option>
                                        <option value="Autre">Autre...</option>
                                    </select>
                                    {!['Accident', 'Dégât Réseau', 'Dommage Tiers'].includes(formData.typeAssurance) && (
                                        <input type="text" className="form-control" placeholder="Précisez le type d'assurance" style={{marginTop: '8px'}}
                                            value={formData.typeAssurance}
                                            onChange={(e) => setFormData({...formData, typeAssurance: e.target.value})}
                                        />
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Service Impacté</label>
                                    <select className="form-control" value={['Eau', 'Électricité', 'Assainissement'].includes(formData.service) ? formData.service : 'Autre'}
                                        onChange={(e) => {
                                            if (e.target.value === 'Autre') setFormData({...formData, service: ''});
                                            else setFormData({...formData, service: e.target.value});
                                        }}>
                                        <option value="Eau">Eau</option>
                                        <option value="Électricité">Électricité</option>
                                        <option value="Assainissement">Assainissement</option>
                                        <option value="Autre">Autre...</option>
                                    </select>
                                    {!['Eau', 'Électricité', 'Assainissement'].includes(formData.service) && (
                                        <input type="text" className="form-control" placeholder="Précisez le service" style={{marginTop: '8px'}}
                                            value={formData.service}
                                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>N° Police</label>
                                    <input type="text" className="form-control"
                                        value={formData.numeroPolice}
                                        onChange={(e) => setFormData({...formData, numeroPolice: e.target.value})}
                                        placeholder="Numéro de police d'assurance"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Compagnie d'Assurance</label>
                                    <input type="text" className="form-control"
                                        value={formData.compagnieAssurance}
                                        onChange={(e) => setFormData({...formData, compagnieAssurance: e.target.value})}
                                        placeholder="Nom de la compagnie"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date de l'Incident</label>
                                    <input type="date" className="form-control" required
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date de Déclaration</label>
                                    <input type="date" className="form-control"
                                        value={formData.dateDeclaration}
                                        onChange={(e) => setFormData({...formData, dateDeclaration: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Lieu</label>
                                <input type="text" className="form-control" required
                                    value={formData.lieu}
                                    onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Montant Demandé (MAD)</label>
                                    <input type="number" className="form-control"
                                        value={formData.montantDemande}
                                        onChange={(e) => setFormData({...formData, montantDemande: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Montant Accordé (MAD)</label>
                                    <input type="number" className="form-control"
                                        value={formData.montantAccorde}
                                        onChange={(e) => setFormData({...formData, montantAccorde: e.target.value})}
                                    />
                                </div>
                            </div>
                            {isEditMode && (
                                <div className="form-group">
                                    <label>Statut</label>
                                    <select className="form-control" value={formData.statut}
                                        onChange={(e) => setFormData({...formData, statut: e.target.value})}>
                                        <option>Déclaré</option>
                                        <option>En expertise</option>
                                        <option>Indemnisé</option>
                                        <option>Clôturé</option>
                                    </select>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Pièces Jointes</label>
                                <input type="file" multiple className="form-control" onChange={handleFileUpload} />
                                {formData.piecesJointes && formData.piecesJointes.length > 0 && (
                                    <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                                        {formData.piecesJointes.length} fichier(s) attaché(s)
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">{isEditMode ? 'Mettre à jour' : 'Enregistrer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-container card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Service</th>
                            <th>Lieu</th>
                            <th>Compagnie</th>
                            <th>Demandé</th>
                            <th>Accordé</th>
                            <th>Délai</th>
                            <th>Pièces</th>
                            <th>Statut</th>
                            {isAdmin && <th style={{textAlign: 'right'}}>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {assurances.map((a) => (
                            <tr key={a._id}>
                                <td>{new Date(a.date).toLocaleDateString()}</td>
                                <td>{a.typeAssurance}</td>
                                <td>{a.service}</td>
                                <td>{a.lieu}</td>
                                <td>{a.compagnieAssurance || '—'}</td>
                                <td>{a.montantDemande ? `${a.montantDemande.toLocaleString()} MAD` : '—'}</td>
                                <td>{a.montantAccorde ? `${a.montantAccorde.toLocaleString()} MAD` : '—'}</td>
                                <td>{getDelaiIndicator(a)}</td>
                                <td>
                                    {a.piecesJointes && a.piecesJointes.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {a.piecesJointes.map((pj, i) => (
                                                <a key={i} href={pj.startsWith('http') ? pj : `${import.meta.env.VITE_API_URL}${pj.replace(/^\\//, '')}`} target="_blank" rel="noopener noreferrer" 
                                                   title={`Voir document ${i+1}`} 
                                                   style={{ color: '#023047', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', textDecoration: 'none' }}>
                                                    <Paperclip size={14} /> Doc {i+1}
                                                </a>
                                            ))}
                                        </div>
                                    ) : '—'}
                                </td>
                                <td><span className={`status status-${a.statut === 'Déclaré' ? 'warning' : a.statut === 'En expertise' ? 'info' : 'success'}`}>{a.statut}</span></td>
                                {isAdmin && (
                                    <td style={{textAlign: 'right'}}>
                                        <div className="action-buttons" style={{justifyContent: 'flex-end'}}>
                                            <button className="btn-icon" onClick={() => handleEditClick(a)} title="Modifier">
                                                <Edit size={18} />
                                            </button>
                                            <button className="btn-icon delete" onClick={() => handleDelete(a._id)} title="Supprimer">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Assurances;
