import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash, Eye, AlertTriangle, Paperclip } from "lucide-react";
import "./Module.css";

const Recouvrement = () => {
  const [dossiers, setDossiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    numeroDossier: "",
    typeCreance: "Client",
    montant: "",
    natureLitige: "Eau",
    dateOuverture: "",
    statut: "En cours",
    classification: "Civil",
    tribunal: "",
    avocat: "",
    partieAdverse: "",
    risqueFinancier: "Moyen",
    directionConcernee: "",
    avancementPourcentage: 0,
    prochaineAudience: "",
    piecesJointes: [],
    typeProcedure: "Recours Juridictionnel",
    propositionsAmiable: "",
    dateCloture: "",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo && userInfo.role === "Admin";
  const canViewAll =
    userInfo &&
    (userInfo.role === "Admin" || userInfo.role === "Directeur Général");

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/recouvrement`,
      );
      setDossiers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}api/recouvrement/${id}`,
        );
        fetchDossiers();
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

  const handleEditClick = (dossier) => {
    setFormData({
      numeroDossier: dossier.numeroDossier,
      typeCreance: dossier.typeCreance,
      montant: dossier.montant,
      natureLitige: dossier.natureLitige || dossier.activite, // Support legacy
      dateOuverture: dossier.dateOuverture?.split("T")[0] || "",
      statut: dossier.statut,
      classification: dossier.classification || "Civil",
      tribunal: dossier.tribunal || "",
      avocat: dossier.avocat || "",
      partieAdverse: dossier.partieAdverse || "",
      risqueFinancier: dossier.risqueFinancier || "Moyen",
      directionConcernee: dossier.directionConcernee || "",
      avancementPourcentage: dossier.avancementPourcentage || 0,
      prochaineAudience: dossier.prochaineAudience?.split("T")[0] || "",
      piecesJointes: dossier.piecesJointes || [],
      typeProcedure: dossier.typeProcedure || "Recours Juridictionnel",
      propositionsAmiable: dossier.propositionsAmiable || "",
      dateCloture: dossier.dateCloture?.split("T")[0] || "",
    });
    setCurrentId(dossier._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleNewClick = () => {
    setFormData({
      numeroDossier: "",
      typeCreance: "Client",
      montant: "",
      natureLitige: "Eau",
      dateOuverture: "",
      statut: "En cours",
      classification: "Civil",
      tribunal: "",
      avocat: "",
      partieAdverse: "",
      risqueFinancier: "Moyen",
      directionConcernee: "",
      avancementPourcentage: 0,
      prochaineAudience: "",
      piecesJointes: [],
      typeProcedure: "Recours Juridictionnel",
      propositionsAmiable: "",
      dateCloture: "",
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}api/recouvrement/${currentId}`,
          formData,
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}api/recouvrement`,
          formData,
        );
      }
      setShowModal(false);
      fetchDossiers();
    } catch (error) {
      console.error(error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  const riskColor = (risk) => {
    const colors = {
      Faible: "#10B981",
      Moyen: "#F59E0B",
      Élevé: "#EF4444",
      Critique: "#7C2D12",
    };
    return colors[risk] || "#888";
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1>Gestion du Contentieux</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleNewClick}>
            <Plus size={18} /> Nouveau Dossier
          </button>
        )}
      </div>

      {/* Detail View */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div
            className="modal-content detail-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px" }}
          >
            <h2>Dossier {showDetail.numeroDossier}</h2>
            <div className="detail-grid">
              <div className="detail-section">
                <h4>Informations Générales</h4>
                <p>
                  <strong>Procédure :</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        showDetail.typeProcedure === "Règlement Amiable"
                          ? "#166534"
                          : "#1e40af",
                    }}
                  >
                    {showDetail.typeProcedure || "Recours Juridictionnel"}
                  </span>
                </p>
                <p>
                  <strong>Type :</strong> {showDetail.typeCreance}
                </p>
                <p>
                  <strong>Nature du litige :</strong>{" "}
                  {showDetail.natureLitige || showDetail.activite}
                </p>
                {(!showDetail.typeProcedure ||
                  showDetail.typeProcedure === "Recours Juridictionnel") && (
                  <p>
                    <strong>Classification :</strong>{" "}
                    {showDetail.classification || "—"}
                  </p>
                )}
                <p>
                  <strong>Montant :</strong>{" "}
                  {showDetail.montant?.toLocaleString()} MAD
                </p>
                <p>
                  <strong>
                    {showDetail.typeProcedure === "Règlement Amiable"
                      ? "Date d'ouverture :"
                      : "Date d'ouverture :"}
                  </strong>{" "}
                  {new Date(showDetail.dateOuverture).toLocaleDateString()}
                </p>
                <p>
                  <strong>Partie Adverse :</strong>{" "}
                  {showDetail.partieAdverse || "—"}
                </p>
                <p>
                  <strong>Statut :</strong>{" "}
                  <span
                    className={`status status-${showDetail.statut === "En cours" ? "info" : "success"}`}
                  >
                    {showDetail.statut}
                  </span>
                </p>
                {showDetail.typeProcedure === "Règlement Amiable" &&
                  showDetail.dateCloture && (
                    <p>
                      <strong>Date de clôture :</strong>{" "}
                      {new Date(showDetail.dateCloture).toLocaleDateString()}
                    </p>
                  )}
                {showDetail.typeProcedure === "Règlement Amiable" && (
                  <p>
                    <strong>Propositions :</strong>{" "}
                    {showDetail.propositionsAmiable || "—"}
                  </p>
                )}
              </div>
              {(!showDetail.typeProcedure ||
                showDetail.typeProcedure === "Recours Juridictionnel") && (
                <div className="detail-section">
                  <h4>Suivi Juridique</h4>
                  <p>
                    <strong>Tribunal :</strong> {showDetail.tribunal || "—"}
                  </p>
                  <p>
                    <strong>Avocat :</strong> {showDetail.avocat || "—"}
                  </p>
                  <p>
                    <strong>Prochaine Audience :</strong>{" "}
                    {showDetail.prochaineAudience
                      ? new Date(
                          showDetail.prochaineAudience,
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              )}
            </div>
            {(!showDetail.typeProcedure ||
              showDetail.typeProcedure === "Recours Juridictionnel") && (
              <>
                <div className="detail-section" style={{ marginTop: "16px" }}>
                  <h4>Évaluation du Risque</h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: riskColor(showDetail.risqueFinancier),
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      ● {showDetail.risqueFinancier || "Non évalué"}
                    </span>
                    <span style={{ color: "#64748b" }}>
                      — Direction concernée :{" "}
                      {showDetail.directionConcernee || "—"}
                    </span>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>
                      Avancement : {showDetail.avancementPourcentage || 0}%
                    </strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${showDetail.avancementPourcentage || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                {showDetail.audiences && showDetail.audiences.length > 0 && (
                  <div className="detail-section" style={{ marginTop: "16px" }}>
                    <h4>Historique des Audiences</h4>
                    <table className="table" style={{ fontSize: "0.85rem" }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Lieu</th>
                          <th>Objet</th>
                          <th>Résultat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showDetail.audiences.map((a, i) => (
                          <tr key={i}>
                            <td>{new Date(a.date).toLocaleDateString()}</td>
                            <td>{a.lieu}</td>
                            <td>{a.objet}</td>
                            <td>{a.resultat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            {showDetail.piecesJointes &&
              showDetail.piecesJointes.length > 0 && (
                <div className="detail-section" style={{ marginTop: "16px" }}>
                  <h4>Pièces Jointes</h4>
                  <ul>
                    {showDetail.piecesJointes.map((pj, i) => (
                      <li key={i}>
                        <a
                          href={pj.startsWith('http') ? pj : `${import.meta.env.VITE_API_URL}${pj.replace(/^\\//, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Voir Document {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDetail(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isAdmin && showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "650px" }}>
            <h2>
              {isEditMode ? "Modifier Dossier" : "Nouveau Dossier Contentieux"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div
                className="form-group"
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#f8fafc",
                  padding: "15px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #3b82f6",
                }}
              >
                <label style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
                  Type de Procédure
                </label>
                <div
                  style={{ display: "flex", gap: "30px", marginTop: "10px" }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      name="typeProcedure"
                      value="Recours Juridictionnel"
                      checked={
                        formData.typeProcedure === "Recours Juridictionnel"
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          typeProcedure: e.target.value,
                          statut: "En cours",
                        })
                      }
                      style={{ transform: "scale(1.2)" }}
                    />
                    ⚖️ Recours Juridictionnel
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "#166534",
                    }}
                  >
                    <input
                      type="radio"
                      name="typeProcedure"
                      value="Règlement Amiable"
                      checked={formData.typeProcedure === "Règlement Amiable"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          typeProcedure: e.target.value,
                          statut: "En cours",
                        })
                      }
                      style={{ transform: "scale(1.2)" }}
                    />
                    🤝 Règlement Amiable
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Numéro Dossier</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.numeroDossier}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numeroDossier: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Date Ouverture</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.dateOuverture}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOuverture: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Partie Adverse</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.partieAdverse}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partieAdverse: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Montant (MAD)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={formData.montant}
                    onChange={(e) =>
                      setFormData({ ...formData, montant: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nature du litige</label>
                  <select
                    className="form-control"
                    value={
                      ["Eau", "Électricité", "Assainissement"].includes(
                        formData.natureLitige,
                      )
                        ? formData.natureLitige
                        : "Autre"
                    }
                    onChange={(e) => {
                      if (e.target.value === "Autre")
                        setFormData({ ...formData, natureLitige: "" });
                      else
                        setFormData({
                          ...formData,
                          natureLitige: e.target.value,
                        });
                    }}
                  >
                    <option value="Eau">Eau</option>
                    <option value="Électricité">Électricité</option>
                    <option value="Assainissement">Assainissement</option>
                    <option value="Autre">Autre...</option>
                  </select>
                  {!["Eau", "Électricité", "Assainissement"].includes(
                    formData.natureLitige,
                  ) && (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Précisez la nature du litige"
                      style={{ marginTop: "8px" }}
                      value={formData.natureLitige}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          natureLitige: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>Type Créance</label>
                  <select
                    className="form-control"
                    value={formData.typeCreance}
                    onChange={(e) =>
                      setFormData({ ...formData, typeCreance: e.target.value })
                    }
                  >
                    <option>Client</option>
                    <option>Partenaire</option>
                    <option>Tiers</option>
                  </select>
                </div>
              </div>

              {formData.typeProcedure === "Recours Juridictionnel" && (
                <>
                  <div className="form-group">
                    <label>État du dossier</label>
                    <select
                      className="form-control"
                      value={formData.statut}
                      onChange={(e) =>
                        setFormData({ ...formData, statut: e.target.value })
                      }
                    >
                      <option value="En cours">En cours</option>
                      <option value="Jugement rendu">Jugement rendu</option>
                      <option value="Recours">Recours</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Classification</label>
                      <select
                        className="form-control"
                        value={formData.classification}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            classification: e.target.value,
                          })
                        }
                      >
                        <option>Administratif</option>
                        <option>Civil</option>
                        <option>Social</option>
                        <option>Pénal</option>
                        <option>Commercial</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Prochaine Audience</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.prochaineAudience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prochaineAudience: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tribunal</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.tribunal}
                        onChange={(e) =>
                          setFormData({ ...formData, tribunal: e.target.value })
                        }
                        placeholder="Ex: Tribunal de Commerce Casablanca"
                      />
                    </div>
                    <div className="form-group">
                      <label>Avocat</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.avocat}
                        onChange={(e) =>
                          setFormData({ ...formData, avocat: e.target.value })
                        }
                        placeholder="Nom de l'avocat"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Risque Financier</label>
                      <select
                        className="form-control"
                        value={formData.risqueFinancier}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            risqueFinancier: e.target.value,
                          })
                        }
                      >
                        <option value="Faible">🟢 Faible</option>
                        <option value="Moyen">🟡 Moyen</option>
                        <option value="Élevé">🔴 Élevé</option>
                        <option value="Critique">⚫ Critique</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Direction concernée</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.directionConcernee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            directionConcernee: e.target.value,
                          })
                        }
                        placeholder="Ex: Direction Eau, DFC..."
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.typeProcedure === "Règlement Amiable" && (
                <>
                  <div className="form-group">
                    <label>État du dossier</label>
                    <select
                      className="form-control"
                      value={formData.statut}
                      onChange={(e) =>
                        setFormData({ ...formData, statut: e.target.value })
                      }
                    >
                      <option value="En cours">En cours</option>
                      <option value="Accord conclu">Accord conclu</option>
                      <option value="Échec du règlement amiable">
                        Échec du règlement amiable
                      </option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Propositions de règlement</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.propositionsAmiable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propositionsAmiable: e.target.value,
                        })
                      }
                      placeholder="Saisissez vos propositions ici..."
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Date de clôture</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dateCloture}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateCloture: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginTop: "20px" }}>
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

              {formData.typeProcedure === "Recours Juridictionnel" && (
                <div className="form-group">
                  <label>Avancement ({formData.avancementPourcentage}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    style={{ width: "100%" }}
                    value={formData.avancementPourcentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        avancementPourcentage: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}

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

      {/* Table */}
      <div className="table-container card">
        <table className="table">
          <thead>
            <tr>
              <th>N° Dossier</th>
              <th>Type</th>
              <th>Nature du litige</th>
              <th>Montant</th>
              <th>Risque</th>
              <th>Avancement</th>
              <th>Pièces</th>
              <th>Statut</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((dossier) => (
              <tr key={dossier._id}>
                <td style={{ fontWeight: 600 }}>{dossier.numeroDossier}</td>
                <td>{dossier.typeCreance}</td>
                <td>{dossier.natureLitige || dossier.activite}</td>
                <td>{dossier.montant?.toLocaleString()} MAD</td>
                <td>
                  <span
                    style={{
                      color: riskColor(dossier.risqueFinancier),
                      fontWeight: 600,
                    }}
                  >
                    ● {dossier.risqueFinancier || "—"}
                  </span>
                </td>
                <td>
                  <div className="mini-progress">
                    <div
                      className="mini-progress-fill"
                      style={{
                        width: `${dossier.avancementPourcentage || 0}%`,
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {dossier.avancementPourcentage || 0}%
                  </span>
                </td>
                <td>
                  {dossier.piecesJointes && dossier.piecesJointes.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {dossier.piecesJointes.map((pj, i) => (
                        <a
                          key={i}
                          href={pj.startsWith('http') ? pj : `${import.meta.env.VITE_API_URL}${pj.replace(/^\\//, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Voir document ${i + 1}`}
                          style={{
                            color: "#023047",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.8rem",
                            textDecoration: "none",
                          }}
                        >
                          <Paperclip size={14} /> Doc {i + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <span
                    className={`status status-${dossier.statut === "En cours" ? "info" : dossier.statut === "En justice" || dossier.statut === "Recours" || dossier.statut === "Jugement rendu" ? "warning" : "success"}`}
                  >
                    {dossier.statut}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div
                    className="action-buttons"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <button
                      className="btn-icon"
                      onClick={() => setShowDetail(dossier)}
                      title="Voir détail"
                    >
                      <Eye size={18} />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          className="btn-icon"
                          onClick={() => handleEditClick(dossier)}
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDelete(dossier._id)}
                          title="Supprimer"
                        >
                          <Trash size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recouvrement;
