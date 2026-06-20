import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  FileText,
  Trash,
  Edit,
  Plus,
  Shield,
  Scale,
  Activity,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [actions, setActions] = useState([]);
  const [overview, setOverview] = useState(null);
  const [contentieuxStats, setContentieuxStats] = useState(null);
  const [assurancesStats, setAssurancesStats] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    type: "Recouvrement",
    dateEcheance: "",
    statut: "Urgent",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo && userInfo.role === "Admin";
  const canViewAll =
    userInfo &&
    (userInfo.role === "Admin" || userInfo.role === "Directeur Général");

  const fetchActions = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/actions`,
      );
      setActions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const [overviewRes, contentieuxRes, assurancesRes, timelineRes] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}api/stats/overview`),
          axios.get(`${import.meta.env.VITE_API_URL}api/stats/contentieux`),
          axios.get(`${import.meta.env.VITE_API_URL}api/stats/assurances`),
          axios.get(`${import.meta.env.VITE_API_URL}api/stats/timeline`),
        ]);
      setOverview(overviewRes.data);
      setContentieuxStats(contentieuxRes.data);
      setAssurancesStats(assurancesRes.data);
      setTimelineData(timelineRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActions();
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette action ?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}api/actions/${id}`);
        fetchActions();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (action) => {
    setFormData({
      titre: action.titre,
      type: action.type,
      dateEcheance: action.dateEcheance.split("T")[0],
      statut: action.statut,
    });
    setCurrentId(action._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleNew = () => {
    setFormData({
      titre: "",
      type: "Recouvrement",
      dateEcheance: "",
      statut: "Urgent",
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}api/actions/${currentId}`,
          formData,
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}api/actions`,
          formData,
        );
      }
      setShowModal(false);
      fetchActions();
    } catch (error) {
      console.error(error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8B5CF6"];
  const RISK_COLORS = {
    Faible: "#10B981",
    Moyen: "#F59E0B",
    Élevé: "#EF4444",
    Critique: "#7C2D12",
  };

  const formatMAD = (val) => {
    if (!val) return "0 MAD";
    return val.toLocaleString("fr-MA") + " MAD";
  };

  return (
    <div className="dashboard-container">
      <h1 className="page-title">
        Tableau de Bord Stratégique — SIGAJA (SRM-LS)
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#64748b",
          marginTop: "-15px",
          marginBottom: "30px",
          fontSize: "1rem",
          fontWeight: 500,
        }}
      >
        Système Informatisé de Gestion des Affaires Juridiques et des Assurances
        (Société Régionale Multiservices - Laâyoune Sakia El Hamra)
      </p>

      {/* KPI Cards — Real Data */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <Scale size={24} color="white" />
          </div>
          <div className="stat-info">
            <h3>Dossiers Contentieux</h3>
            <p>
              {overview?.dossiersEnCours ?? "—"}{" "}
              <span className="stat-sub">
                / {overview?.totalDossiers ?? 0} total
              </span>
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green">
            <TrendingUp size={24} color="white" />
          </div>
          <div className="stat-info">
            <h3>Taux de Recouvrement</h3>
            <p>{overview?.tauxRecouvrement ?? 0}%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow">
            <Shield size={24} color="white" />
          </div>
          <div className="stat-info">
            <h3>Assurances en Attente</h3>
            <p>
              {overview?.assurancesDeclarees ?? 0}{" "}
              <span className="stat-sub">
                / {overview?.totalAssurances ?? 0} total
              </span>
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-red">
            <AlertTriangle size={24} color="white" />
          </div>
          <div className="stat-info">
            <h3>Exposition aux Risques</h3>
            <p>{formatMAD(overview?.expositionRisque)}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Répartition des Contentieux par Statut</h3>
          {contentieuxStats?.parStatut?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentieuxStats.parStatut}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentieuxStats.parStatut.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data-msg">Aucun dossier contentieux enregistré</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Répartition des Assurances par Type</h3>
          {assurancesStats?.parType?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assurancesStats.parType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assurancesStats.parType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data-msg">Aucune assurance enregistrée</p>
          )}
        </div>
      </div>

      {/* Timeline Chart */}
      {timelineData.length > 0 && (
        <div className="chart-card full-width">
          <h3>Évolution Mensuelle — Tous Modules</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="Contentieux"
                stackId="1"
                stroke="#0088FE"
                fill="#0088FE"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Contrats"
                stackId="1"
                stroke="#00C49F"
                fill="#00C49F"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Assurances"
                stackId="1"
                stroke="#FFBB28"
                fill="#FFBB28"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Risk Indicator */}
      {contentieuxStats?.parRisque?.length > 0 && (
        <div className="chart-card full-width">
          <h3>Niveau d'Exposition aux Risques Juridiques</h3>
          <div className="risk-bars">
            {contentieuxStats.parRisque.map((r, i) => (
              <div key={i} className="risk-bar-item">
                <span className="risk-label">{r.name}</span>
                <div className="risk-bar-track">
                  <div
                    className="risk-bar-fill"
                    style={{
                      width: `${(r.value / contentieuxStats.total) * 100}%`,
                      backgroundColor: RISK_COLORS[r.name] || "#888",
                    }}
                  ></div>
                </div>
                <span className="risk-count">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Overview */}
      {overview &&
        (overview.montantTotalContentieux > 0 ||
          overview.montantRecouvre > 0) && (
          <div className="stats-grid financial-grid">
            <div className="stat-card financial">
              <h4>Coût Total Contentieux</h4>
              <p className="financial-value">
                {formatMAD(overview.montantTotalContentieux)}
              </p>
            </div>
            <div className="stat-card financial">
              <h4>Montant Recouvré</h4>
              <p className="financial-value green">
                {formatMAD(overview.montantRecouvre)}
              </p>
            </div>
            <div className="stat-card financial">
              <h4>Contrats Actifs</h4>
              <p className="financial-value blue">
                {overview.contratsActifs} / {overview.totalContrats}
              </p>
            </div>
            <div className="stat-card financial">
              <h4>Actions Urgentes</h4>
              <p className="financial-value red">{overview.actionsUrgentes}</p>
            </div>
          </div>
        )}

      {/* Priority Actions Table */}
      <div className="recent-activity-card">
        <div className="recent-header">
          <h3>Actions Prioritaires</h3>
          {isAdmin && (
            <button
              className="btn-sm"
              onClick={handleNew}
              title="Ajouter une tâche"
            >
              <Plus size={16} /> Ajouter
            </button>
          )}
        </div>

        {actions.length === 0 ? (
          <p style={{ padding: "20px", color: "#666" }}>
            Aucune action prioritaire pour le moment.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Dossier / Titre</th>
                <th>Type</th>
                <th>Date Échéance</th>
                <th>Statut</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action._id}>
                  <td>{action.titre}</td>
                  <td>{action.type}</td>
                  <td>{new Date(action.dateEcheance).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status status-${action.statut === "Urgent" ? "urgent" : action.statut === "À renouveler" ? "warning" : "info"}`}
                    >
                      {action.statut}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(action)}
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(action._id)}
                        title="Supprimer"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isAdmin && showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {isEditMode ? "Modifier Action" : "Nouvelle Action Prioritaire"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titre / Dossier Concerné</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                  placeholder="Ex: #REC-2023-001"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option>Recouvrement</option>
                  <option>Contrat</option>
                  <option>Assurance</option>
                  <option>Administratif</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date Échéance</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.dateEcheance}
                  onChange={(e) =>
                    setFormData({ ...formData, dateEcheance: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  className="form-control"
                  value={formData.statut}
                  onChange={(e) =>
                    setFormData({ ...formData, statut: e.target.value })
                  }
                >
                  <option>Urgent</option>
                  <option>À renouveler</option>
                  <option>En cours</option>
                  <option>Traité</option>
                </select>
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
