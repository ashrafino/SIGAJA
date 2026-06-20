import { useState, useEffect } from 'react';
import axios from 'axios';
import { File, Download, Trash, Upload, Search, Filter } from 'lucide-react';
import './Dashboard.css'; // Réutiliser les styles existants

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
            alert('Erreur lors du chargement des documents');
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
            alert('Document téléchargé avec succès');
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
        <div className="dashboard-container">
            <h1 className="page-title">Médiathèque & Archivage</h1>

            {/* Zone de téléchargement */}
            <div className="card-upload" style={{
                background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
                <h3><Upload size={20} style={{marginRight: '10px'}}/> Ajouter un nouveau document</h3>
                <form onSubmit={handleUpload} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginTop: '15px' }}>
                    <div className="form-group" style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Fichier</label>
                        <input 
                            type="file" 
                            id="fileInput"
                            onChange={handleFileChange} 
                            className="form-control" 
                            accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                    </div>
                    <div className="form-group" style={{width: '200px'}}>
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Catégorie</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            className="form-control"
                            style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
                        >
                            <option value="General">Général</option>
                            <option value="Recouvrement">Recouvrement</option>
                            <option value="Contrat">Contrat</option>
                            <option value="Assurance">Assurance</option>
                            <option value="Facture">Facture</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" disabled={uploading}>
                        {uploading ? 'Envoi...' : 'Archiver'}
                    </button>
                </form>
            </div>

            {/* Filtres */}
            <div className="filters-bar" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                 <div className="search-box" style={{position: 'relative', flex: 1}}>
                    <Search size={18} style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888'}} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un document..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{width: '100%', padding: '10px 10px 10px 35px', borderRadius: '4px', border: '1px solid #ddd'}}
                    />
                 </div>
                 <div className="filter-box" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Filter size={18} color="#888" />
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}}
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

            {/* Liste des documents */}
            <div className="documents-list" style={{background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
                <table className="table" style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead style={{background: '#f8f9fa', borderBottom: '2px solid #eee'}}>
                        <tr>
                            <th style={{padding: '15px', textAlign: 'left'}}>Nom du fichier</th>
                            <th style={{padding: '15px', textAlign: 'left'}}>Catégorie</th>
                            <th style={{padding: '15px', textAlign: 'left'}}>Taille</th>
                            <th style={{padding: '15px', textAlign: 'left'}}>Ajouté par</th>
                            <th style={{padding: '15px', textAlign: 'left'}}>Date</th>
                            <th style={{padding: '15px', textAlign: 'center'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{padding: '20px', textAlign: 'center'}}>Chargement...</td></tr>
                        ) : filteredDocuments.length === 0 ? (
                            <tr><td colSpan="6" style={{padding: '20px', textAlign: 'center'}}>Aucun document trouvé.</td></tr>
                        ) : (
                            filteredDocuments.map(doc => (
                                <tr key={doc._id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <File size={20} color="#003366" />
                                        {doc.originalName}
                                    </td>
                                    <td style={{padding: '15px'}}>
                                        <span className="badge" style={{
                                            background: '#e3f2fd', color: '#0d47a1', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem'
                                        }}>
                                            {doc.category}
                                        </span>
                                    </td>
                                    <td style={{padding: '15px'}}>{formatBytes(doc.size)}</td>
                                    <td style={{padding: '15px'}}>{doc.uploadedBy?.name || 'Inconnu'}</td>
                                    <td style={{padding: '15px'}}>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                    <td style={{padding: '15px', textAlign: 'center'}}>
                                        <button 
                                            onClick={() => handleDownload(doc._id, doc.originalName)}
                                            style={{background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px', color: '#28a745'}}
                                            title="Télécharger"
                                        >
                                            <Download size={18} />
                                        </button>
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(doc._id)}
                                                style={{background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545'}}
                                                title="Supprimer"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Archivage;
