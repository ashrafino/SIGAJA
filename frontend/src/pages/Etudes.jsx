import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, FileText, Upload, X, Paperclip, Eye, RefreshCw } from 'lucide-react';
import './Module.css';

const Etudes = () => {
    const [etudes, setEtudes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEtude, setSelectedEtude] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        titre: '',
        type: 'Note de synthèse',
        reference: '',
        demandeur: '',
        date: '',
        statut: 'En cours',
        juristeEnCharge: '',
        commentaires: '',
        piecesJointes: []
    });

    useEffect(() => {
        fetchEtudes();
    }, []);

    const fetchEtudes = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}api/etudes`);
            setEtudes(data);
        } catch (error) {
            console.error('Error fetching etudes', error);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadData = new FormData();
        files.forEach(file => uploadData.append('documents', file));

        setUploading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}api/upload`, uploadData);
            setFormData({ ...formData, piecesJointes: [...formData.piecesJointes, ...data] });
        } catch (error) {
            console.error('Upload error', error);
            alert('Erreur lors du téléchargement des pièces jointes');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedEtude && selectedEtude._id) {
                await axios.put(`${import.meta.env.VITE_API_URL}api/etudes/${selectedEtude._id}`, formData);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}api/etudes`, formData);
            }
            setShowModal(false);
            setFormData({
                titre: '', type: 'Note de synthèse', reference: '', demandeur: '',
                date: '', statut: 'En cours', juristeEnCharge: '',
                commentaires: '', piecesJointes: []
            });
            setSelectedEtude(null);
            fetchEtudes();
        } catch (error) {
            console.error('Submit error', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const deleteEtude = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette étude ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}api/etudes/${id}`);
                fetchEtudes();
            } catch (error) {
                console.error('Delete error', error);
            }
        }
    };

    const openDetail = (etude) => {
        setSelectedEtude(etude);
        setShowDetailModal(true);
    };

    const openEdit = (etude) => {
        setFormData({
            titre: etude.titre,
            type: etude.type,
            reference: etude.reference || '',
            demandeur: etude.demandeur,
            date: etude.date ? etude.date.split('T')[0] : '',
            statut: etude.statut,
            juristeEnCharge: etude.juristeEnCharge || '',
            commentaires: etude.commentaires || '',
            piecesJointes: etude.piecesJointes || []
        });
        setSelectedEtude(etude);
        setShowModal(true);
    };

    const filteredEtudes = etudes.filter(e => 
        e.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.demandeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusClass = (statut) => {
        if (statut === 'En cours') return 'status-warning';
        if (statut === 'Clôturé') return 'status-success';
        if (statut === 'Annulé') return 'status-danger';
        return 'status-info';
    };

    return (
        <div className="module-container">
            <div className="module-header">
                <h1>Études Juridiques</h1>
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => {
                        setSelectedEtude(null);
                        setFormData({
                            titre: '', type: 'Note de synthèse', reference: '', demandeur: '',
                            date: '', statut: 'En cours', juristeEnCharge: '',
                            commentaires: '', piecesJointes: []
                        });
                        setShowModal(true);
                    }}>
                        <Plus size={18} /> Nouvelle Étude
                    </button>
                    <button className="btn btn-secondary" onClick={fetchEtudes}>
                        <RefreshCw size={18} /> Actualiser
                    </button>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card blue">
                    <div>
                        <h3>Total Études</h3>
                        <div className="value">{etudes.length}</div>
                    </div>
                    <FileText />
                </div>
                <div className="kpi-card orange">
                    <div>
                        <h3>En Cours</h3>
                        <div className="value">{etudes.filter(e => e.statut === 'En cours').length}</div>
                    </div>
                    <RefreshCw />
                </div>
                <div className="kpi-card green">
                    <div>
                        <h3>Clôturées</h3>
                        <div className="value">{etudes.filter(e => e.statut === 'Clôturé').length}</div>
                    </div>
                    <Eye />
                </div>
            </div>

            <div className="card">
                <div className="search-bar" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Search size={20} color="#6b7280" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par titre, type ou demandeur..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', borderBottom: '1px solid #e5e7eb', borderRadius: 0, padding: '0.5rem 0', boxShadow: 'none' }}
                    />
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Titre / Objet</th>
                                <th>Type</th>
                                <th>Demandeur</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEtudes.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Aucune étude trouvée.</td></tr>
                            ) : (
                                filteredEtudes.map((etude) => (
                                    <tr key={etude._id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{etude.titre}</div>
                                            {etude.reference && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Réf: {etude.reference}</div>}
                                        </td>
                                        <td>{etude.type}</td>
                                        <td>{etude.demandeur}</td>
                                        <td>{etude.date ? new Date(etude.date).toLocaleDateString('fr-FR') : 'N/A'}</td>
                                        <td>
                                            <span className={`status ${getStatusClass(etude.statut)}`}>
                                                {etude.statut}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon" onClick={() => openDetail(etude)} title="Voir détails"><Eye size={16} /></button>
                                                <button className="btn-icon" onClick={() => openEdit(etude)} title="Modifier"><FileText size={16} /></button>
                                                <button className="btn-icon" onClick={() => deleteEtude(etude._id)} style={{ color: '#dc2626' }} title="Supprimer"><X size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Ajout/Modification */}
            {showModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: '#fff', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{selectedEtude ? 'Modifier l\'Étude' : 'Nouvelle Étude Juridique'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Titre / Objet *</label>
                                    <input type="text" value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Type d'Étude *</label>
                                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
                                        <option value="Note de synthèse">Note de synthèse</option>
                                        <option value="Note de présentation">Note de présentation</option>
                                        <option value="Consultation">Consultation</option>
                                        <option value="Service / Assistance">Service / Assistance</option>
                                        <option value="Rapport">Rapport</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Référence</label>
                                    <input type="text" value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} placeholder="Optionnel" />
                                </div>
                                <div className="form-group">
                                    <label>Service Demandeur *</label>
                                    <input type="text" value={formData.demandeur} onChange={(e) => setFormData({...formData, demandeur: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Juriste en charge</label>
                                    <input type="text" value={formData.juristeEnCharge} onChange={(e) => setFormData({...formData, juristeEnCharge: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Statut *</label>
                                    <select value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})} required>
                                        <option value="En cours">En cours</option>
                                        <option value="En attente">En attente</option>
                                        <option value="Clôturé">Clôturé</option>
                                        <option value="Annulé">Annulé</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Commentaires / Synthèse</label>
                                    <textarea value={formData.commentaires} onChange={(e) => setFormData({...formData, commentaires: e.target.value})} rows={3} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Pièces Jointes</label>
                                    <input type="file" multiple onChange={handleFileUpload} />
                                    {uploading && <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#025690' }}>Téléchargement en cours...</div>}
                                    {formData.piecesJointes.length > 0 && (
                                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {formData.piecesJointes.map((pj, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', background: '#f3f4f6', padding: '0.5rem', borderRadius: '0.25rem' }}>
                                                    <Paperclip size={14} />
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>{pj.split('/').pop()}</span>
                                                    <button type="button" onClick={() => setFormData({...formData, piecesJointes: formData.piecesJointes.filter((_, idx) => idx !== i)})} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}><X size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails */}
            {showDetailModal && selectedEtude && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: '#fff', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '700px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Détails de l'Étude</h2>
                            <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        
                        <div className="detail-grid">
                            <div className="detail-section" style={{ gridColumn: '1 / -1' }}>
                                <h4>Informations Générales</h4>
                                <p><strong>Titre :</strong> {selectedEtude.titre}</p>
                                <p><strong>Type :</strong> {selectedEtude.type}</p>
                                <p><strong>Référence :</strong> {selectedEtude.reference || 'N/A'}</p>
                                <p><strong>Service Demandeur :</strong> {selectedEtude.demandeur}</p>
                                <p><strong>Juriste en charge :</strong> {selectedEtude.juristeEnCharge || 'Non assigné'}</p>
                            </div>

                            <div className="detail-section">
                                <h4>Suivi</h4>
                                <p><strong>Date :</strong> {selectedEtude.date ? new Date(selectedEtude.date).toLocaleDateString('fr-FR') : 'N/A'}</p>
                                <p>
                                    <strong>Statut : </strong>
                                    <span className={`status ${getStatusClass(selectedEtude.statut)}`}>{selectedEtude.statut}</span>
                                </p>
                            </div>

                            <div className="detail-section" style={{ gridColumn: '1 / -1' }}>
                                <h4>Commentaires & Synthèse</h4>
                                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', minHeight: '60px', whiteSpace: 'pre-wrap' }}>
                                    {selectedEtude.commentaires || 'Aucun commentaire.'}
                                </div>
                            </div>

                            <div className="detail-section" style={{ gridColumn: '1 / -1' }}>
                                <h4>Pièces Jointes</h4>
                                {selectedEtude.piecesJointes && selectedEtude.piecesJointes.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {selectedEtude.piecesJointes.map((pj, i) => (
                                            <a key={i} href={pj.startsWith('http') ? pj : `${import.meta.env.VITE_API_URL}${pj.replace(/^\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', textDecoration: 'none', color: '#025690' }}>
                                                <Paperclip size={16} />
                                                Document {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Aucune pièce jointe.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Etudes;
