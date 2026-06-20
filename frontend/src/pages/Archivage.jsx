import { useState, useEffect } from 'react';
import axios from 'axios';
import { File, Download, Trash, Upload, Search, Filter } from 'lucide-react';
import './Module.css';

const Archivage = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Tous');
    
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('General');

    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    const isAdmin = userInfo.role === 'Admin';

    const token = userInfo.token;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}api/documents`, config);
            setDocuments(data);
            setFilteredDocuments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        let docs = documents;
        
        if (searchTerm) {
            docs = docs.filter(doc => 
                doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== 'Tous') {
            docs = docs.filter(doc => doc.category === filterCategory);
        }

        setFilteredDocuments(docs);
    }, [searchTerm, filterCategory, documents]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Veuillez sélectionner un fichier');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        setUploading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}api/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setFile(null);
            document.getElementById('fileInput').value = ''; 
            fetchDocuments();
        } catch (error) {
            console.error(error);
            alert('Erreur lors du téléchargement');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (id, filename) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/documents/${id}/download`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert('Erreur lors du téléchargement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce document ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}api/documents/${id}`, config);
                fetchDocuments();
            } catch (error) {
                console.error(error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="module-container">
            <div className="module-header">
                <h1>Médiathèque & Archivage</h1>
            </div>

            {/* Zone de téléchargement */}
            {isAdmin && (
                <div className="card">
                    <h3><Upload size={20} style={{marginRight: '10px', verticalAlign: 'middle'}}/> Ajouter un nouveau document</h3>
                    <form onSubmit={handleUpload} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginTop: '15px' }}>
                        <div className="form-group" style={{flex: 1}}>
                            <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)'}}>Fichier</label>
                            <input 
                                type="file" 
                                id="fileInput"
                                onChange={handleFileChange} 
                                className="form-control" 
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div className="form-group" style={{width: '250px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)'}}>Catégorie</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                className="form-control"
                            >
                                <option value="General">Général</option>
                                <option value="Recouvrement">Recouvrement</option>
                                <option value="Contrat">Contrat</option>
                                <option value="Assurance">Assurance</option>
                                <option value="Facture">Facture</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                            {uploading ? 'Envoi...' : 'Archiver le document'}
                        </button>
                    </form>
                </div>
            )}

            {/* Filtres */}
            <div className="card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                     <div style={{position: 'relative', flex: 1}}>
                        <Search size={18} style={{position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
                        <input 
                            type="text" 
                            className="form-control"
                            placeholder="Rechercher un document par nom ou catégorie..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '40px', margin: 0 }}
                        />
                     </div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '10px', width: '250px'}}>
                        <Filter size={18} color="var(--text-secondary)" />
                        <select 
                            className="form-control"
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            style={{ margin: 0 }}
                        >
                            <option value="Tous">Toutes les catégories</option>
                            <option value="General">Général</option>
                            <option value="Recouvrement">Recouvrement</option>
                            <option value="Contrat">Contrat</option>
                            <option value="Assurance">Assurance</option>
                            <option value="Facture">Facture</option>
                            <option value="Autre">Autre</option>
                        </select>
                     </div>
                </div>
            </div>

            {/* Liste des documents */}
            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Chargement des documents...</div>
            ) : filteredDocuments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <File size={32} />
                    </div>
                    <h3>Aucun document trouvé</h3>
                    <p>La médiathèque est vide ou aucun document ne correspond à vos critères de recherche.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nom du fichier</th>
                                <th>Catégorie</th>
                                <th>Taille</th>
                                <th>Ajouté par</th>
                                <th>Date</th>
                                <th style={{textAlign: 'right'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.map(doc => (
                                <tr key={doc._id}>
                                    <td style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <File size={18} color="var(--secondary-color)" />
                                        {doc.originalName}
                                    </td>
                                    <td>
                                        <span className="status status-info">
                                            {doc.category}
                                        </span>
                                    </td>
                                    <td>{formatBytes(doc.size)}</td>
                                    <td>{doc.uploadedBy?.name || 'Inconnu'}</td>
                                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                    <td style={{textAlign: 'right'}}>
                                        <div className="action-buttons" style={{justifyContent: 'flex-end'}}>
                                            <button 
                                                onClick={() => handleDownload(doc._id, doc.originalName)}
                                                className="btn-icon"
                                                style={{color: 'var(--success-color)'}}
                                                title="Télécharger"
                                            >
                                                <Download size={18} />
                                            </button>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="btn-icon delete"
                                                    title="Supprimer"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Archivage;
