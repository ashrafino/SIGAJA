import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Trash, Plus, Shield } from 'lucide-react';
import './Module.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Juriste'
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo && userInfo.role === 'Admin';
    const canViewAll = userInfo && (userInfo.role === 'Admin' || userInfo.role === 'Directeur Général');

    useEffect(() => {
        if (canViewAll) {
            fetchUsers();
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}api/users`, config);
            setUsers(data);
        } catch (error) {
            console.error(error);
            alert('Erreur lors du chargement des utilisateurs.');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Voulez-vous supprimer cet utilisateur ?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`${import.meta.env.VITE_API_URL}api/users/${id}`, config);
                fetchUsers();
            } catch (error) {
                console.error(error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post(`${import.meta.env.VITE_API_URL}api/users`, formData, config);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'Juriste' });
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert(`Erreur: ${error.response?.data?.message || 'Impossible de créer l\'utilisateur'}`);
        }
    };

    if (!canViewAll) {
        return (
            <div className="module-container">
                <div className="alert alert-danger" style={{
                    padding: '20px', background: '#FEE2E2', color: '#B91C1C',
                    borderRadius: '8px', textAlign: 'center', fontWeight: 500
                }}>
                    Accès Refusé. Vous devez être Administrateur ou Directeur Général pour voir cette page.
                </div>
            </div>
        );
    }

    return (
        <div className="module-container">
            <div className="module-header">
                <h1>Administration Système</h1>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <User size={18} /> Nouvel Utilisateur
                    </button>
                )}
            </div>

            {/* DG info banner */}
            {!isAdmin && canViewAll && (
                <div style={{
                    padding: '12px 16px', background: '#DBEAFE', color: '#1E40AF',
                    borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem'
                }}>
                    🔍 Mode Consultation — Directeur Général (lecture seule)
                </div>
            )}

            {isAdmin && showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Nouvel Utilisateur</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nom Complet</label>
                                <input type="text" className="form-control" required 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" required 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input type="password" className="form-control" required 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Rôle</label>
                                <select className="form-control"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="Directeur Général">Directeur Général</option>
                                    <option value="Admin">Administrateur (Contrôle Total)</option>
                                    <option value="Juriste">Juriste</option>
                                    <option value="Responsable Juridique et Assurance">Responsable Juridique et Assurance</option>
                                    <option value="Agent Recouvrement">Agent Recouvrement</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Créer Utilisateur</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-container card">
                <h3>Utilisateurs du Système</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            {isAdmin && <th style={{textAlign: 'right'}}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`status ${
                                        user.role === 'Admin' ? 'status-danger' : 
                                        user.role === 'Directeur Général' ? 'status-dg' :
                                        'status-info'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                {isAdmin && (
                                    <td style={{textAlign: 'right'}}>
                                        {user.role !== 'Admin' && (
                                            <button className="btn-icon delete" onClick={() => handleDelete(user._id)} title="Supprimer">
                                                <Trash size={18} />
                                            </button>
                                        )}
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

export default Admin;
