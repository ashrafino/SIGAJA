import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash,
  AlertTriangle,
  Clock,
  Paperclip,
} from "lucide-react";
import "./Module.css";

const Contrats = () => {
  const [contrats, setContrats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    numeroContrat: "",
    type: "Fournisseur",
    montant: "",
    duree: "",
    service: "",
    dateDebut: "",
    dateFin: "",
    renouvellementAuto: false,
    statut: "Actif",
    piecesJointes: [],
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo && userInfo.role === "Admin";
  const canViewAll =
    userInfo &&
    (userInfo.role === "Admin" || userInfo.role === "Directeur Général");

  useEffect(() => {
    fetchContrats();
  }, []);

  const fetchContrats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/contrats`,
      );
      setContrats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}api/contrats/${id}`);
        fetchContrats();
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadData = new FormData();
    Array.from(files).forEach((file) => {
      uploadData.append("documents", file);
    });
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}api/upload`,
        uploadData,
      );
      setFormData((prev) => ({
        ...prev,
        piecesJointes: [...(prev.piecesJointes || []), ...data],
      }));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'upload des fichiers");
    }
  };

  const handleNewClick = () => {
    setFormData({
      numeroContrat: "",
      type: "Fournisseur",
      montant: "",
      duree: "",
      service: "",
      dateDebut: "",
      dateFin: "",
      renouvellementAuto: false,
      statut: "Actif",
      piecesJointes: [],
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEditClick = (contrat) => {
    setFormData({
      numeroContrat: contrat.numeroContrat,
      type: contrat.type,
      montant: contrat.montant || "",
      duree: contrat.duree || "",
      service: contrat.service || "",
      dateDebut: contrat.dateDebut?.split("T")[0] || "",
      dateFin: contrat.dateFin?.split("T")[0] || "",
      renouvellementAuto: contrat.renouvellementAuto,
      statut: contrat.statut,
      piecesJointes: contrat.piecesJointes || [],
    });
    setCurrentId(contrat._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}api/contrats/${currentId}`,
          formData,
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}api/contrats`,
          formData,
        );
      }
      setShowModal(false);
      fetchContrats();
    } catch (error) {
      console.error(error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  const getDaysUntilExpiry = (dateFin) => {
    if (!dateFin) return null;
    const now = new Date();
    const end = new Date(dateFin);
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadge = (contrat) => {
    if (contrat.statut !== "Actif") return null;
    const days = getDaysUntilExpiry(contrat.dateFin);
    if (days === null) return null;
    if (days < 0)
      return (
        <span className="expiry-badge expired">
          <AlertTriangle size={12} /> Expiré
        </span>
      );
    if (days <= 7)
      return (
        <span className="expiry-badge critical">
          <AlertTriangle size={12} /> {days}j
        </span>
      );
    if (days <= 30)
      return (
        <span className="expiry-badge warning">
          <Clock size={12} /> {days}j
        </span>
      );
    return null;
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1>Gestion Contractuelle</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleNewClick}>
            <Plus size={18} /> Nouveau Contrat
          </button>
        )}
      </div>

      {isAdmin && showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <h2>{isEditMode ? "Modifier Contrat" : "Nouveau Contrat"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Numéro Contrat</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.numeroContrat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numeroContrat: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Type de Contrat</label>
                  <select
                    className="form-control"
                    value={
                      ["Marché Public", "Fournisseur", "Partenariat"].includes(
                        formData.type,
                      )
                        ? formData.type
                        : "Autre"
                    }
                    onChange={(e) => {
                      if (e.target.value === "Autre")
                        setFormData({ ...formData, type: "" });
                      else setFormData({ ...formData, type: e.target.value });
                    }}
                  >
                    <option value="Marché Public">Marché Public</option>
                    <option value="Fournisseur">Fournisseur</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Autre...</option>
                  </select>
                  {!["Marché Public", "Fournisseur", "Partenariat"].includes(
                    formData.type,
                  ) && (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Précisez le type de contrat"
                      style={{ marginTop: "8px" }}
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Montant (MAD)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.montant}
                    onChange={(e) =>
                      setFormData({ ...formData, montant: e.target.value })
                    }
                    placeholder="Montant du contrat"
                  />
                </div>
                <div className="form-group">
                  <label>Durée</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.duree}
                    onChange={(e) =>
                      setFormData({ ...formData, duree: e.target.value })
                    }
                    placeholder="Ex: 12 mois"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Service</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  placeholder="Service concerné"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date Début</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.dateDebut}
                    onChange={(e) =>
                      setFormData({ ...formData, dateDebut: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Date Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.dateFin}
                    onChange={(e) =>
                      setFormData({ ...formData, dateFin: e.target.value })
                    }
                  />
                </div>
              </div>
              {isEditMode && (
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    className="form-control"
                    value={formData.statut}
                    onChange={(e) =>
                      setFormData({ ...formData, statut: e.target.value })
                    }
                  >
                    <option>Actif</option>
                    <option>Expiré</option>
                    <option>Résilié</option>
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.renouvellementAuto}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        renouvellementAuto: e.target.checked,
                      })
                    }
                  />{" "}
                  Renouvellement Automatique
                </label>
              </div>
              <div className="form-group">
                <label>Pièces Jointes</label>
                <input
                  type="file"
                  multiple
                  className="form-control"
                  onChange={handleFileUpload}
                />
                {formData.piecesJointes &&
                  formData.piecesJointes.length > 0 && (
                    <div style={{ marginTop: "8px", fontSize: "0.85rem" }}>
                      {formData.piecesJointes.length} fichier(s) attaché(s)
                    </div>
                  )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? "Mettre à jour" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {contrats.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3>Aucun contrat enregistré</h3>
          <p>Ajoutez les contrats de vos fournisseurs ou prestataires pour suivre leurs échéances et renouvellements.</p>
          {isAdmin && (
            <button className="btn btn-primary" onClick={handleNewClick}>
              <Plus size={18} /> Créer un contrat
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>N° Contrat</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Service</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Renouv.</th>
                <th>Pièces</th>
                <th>Statut</th>
                {isAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {contrats.map((contrat) => (
                <tr key={contrat._id}>
                  <td style={{ fontWeight: 600 }}>{contrat.numeroContrat}</td>
                  <td>{contrat.type}</td>
                  <td style={{ fontWeight: 500 }}>
                    {contrat.montant
                      ? `${contrat.montant.toLocaleString()} MAD`
                      : "—"}
                  </td>
                  <td>{contrat.service || "—"}</td>
                  <td>{new Date(contrat.dateDebut).toLocaleDateString()}</td>
                  <td>
                    {new Date(contrat.dateFin).toLocaleDateString()}
                    <div style={{ marginTop: '4px' }}>
                      {getExpiryBadge(contrat)}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: contrat.renouvellementAuto ? 'var(--success-color)' : 'var(--text-secondary)', fontWeight: 500 }}>
                      {contrat.renouvellementAuto ? "Automatique" : "Non"}
                    </span>
                  </td>
                  <td>
                    {contrat.piecesJointes && contrat.piecesJointes.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        {contrat.piecesJointes.map((pj, i) => (
                          <a
                            key={i}
                            href={pj.startsWith('http') ? pj : `${import.meta.env.VITE_API_URL}${pj.startsWith('/') ? pj.slice(1) : pj}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Voir document ${i + 1}`}
                            style={{
                              color: "var(--secondary-color)",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              textDecoration: "none",
                              background: "#eff6ff",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              width: "fit-content"
                            }}
                          >
                            <Paperclip size={14} /> Doc {i + 1}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-secondary)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status status-${contrat.statut === "Actif" ? "success" : "danger"}`}
                    >
                      {contrat.statut}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: "right" }}>
                      <div
                        className="action-buttons"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <button
                          className="btn-icon"
                          onClick={() => handleEditClick(contrat)}
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDelete(contrat._id)}
                          title="Supprimer"
                        >
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
      )}
    </div>
  );
};

export default Contrats;
