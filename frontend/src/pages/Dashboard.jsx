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
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <Scale size={28} />
          <div>
            <span className="kpi-value">{overview?.dossiersEnCours ?? "—"}</span>
            <span className="kpi-label">Dossiers Contentieux ({overview?.totalDossiers ?? 0} total)</span>
          </div>
        </div>
        <div className="kpi-card green">
          <TrendingUp size={28} />
          <div>
            <span className="kpi-value">{overview?.tauxRecouvrement ?? 0}%</span>
            <span className="kpi-label">Taux de Recouvrement</span>
          </div>
        </div>
        <div className="kpi-card orange">
          <Shield size={28} />
          <div>
            <span className="kpi-value">{overview?.assurancesDeclarees ?? 0}</span>
            <span className="kpi-label">Assurances en Attente ({overview?.totalAssurances ?? 0} total)</span>
          </div>
        </div>
        <div className="kpi-card red">
          <AlertTriangle size={28} />
          <div>
            <span className="kpi-value" style={{ fontSize: '1.4rem' }}>{formatMAD(overview?.expositionRisque)}</span>
            <span className="kpi-label">Exposition aux Risques</span>
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
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {contentieuxStats.parStatut.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                />
                <Legend iconType="circle" />
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
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {assurancesStats.parType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                />
                <Legend iconType="circle" />
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
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorContentieux" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorContrats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAssurances" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Area
                type="monotone"
                dataKey="Contentieux"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorContentieux)"
              />
              <Area
                type="monotone"
                dataKey="Contrats"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorContrats)"
              />
              <Area
                type="monotone"
                dataKey="Assurances"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAssurances)"
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
          <div className="financial-summary">
            <h3>Résumé Financier et Opérationnel</h3>
            <div className="financial-row">
              <div className="fin-item">
                <span className="fin-label">Coût Total Contentieux</span>
                <span className="fin-value">
                  {formatMAD(overview.montantTotalContentieux)}
                </span>
              </div>
              <div className="fin-item">
                <span className="fin-label">Montant Recouvré</span>
                <span className="fin-value green">
                  {formatMAD(overview.montantRecouvre)}
                </span>
              </div>
              <div className="fin-item">
                <span className="fin-label">Contrats Actifs</span>
                <span className="fin-value blue">
                  {overview.contratsActifs} / {overview.totalContrats}
                </span>
              </div>
              <div className="fin-item">
                <span className="fin-label">Actions Urgentes</span>
                <span className="fin-value red">{overview.actionsUrgentes}</span>
              </div>
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
          <div className="empty-state" style={{ margin: '20px', border: 'none' }}>
            <div className="empty-state-icon">
              <Activity size={32} />
            </div>
            <h3>Aucune action prioritaire</h3>
            <p>Tout est à jour. Aucune action urgente n'est requise.</p>
          </div>
        ) : (
          <div className="table-container" style={{ margin: '20px', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.04)' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Dossier / Titre</th>
                  <th>Type</th>
                  <th>Date Échéance</th>
                  <th>Statut</th>
                  {isAdmin && <th style={{textAlign: 'right'}}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action._id}>
                    <td style={{ fontWeight: 600 }}>{action.titre}</td>
                    <td>{action.type}</td>
                    <td>{new Date(action.dateEcheance).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`status status-${action.statut === "Urgent" ? "urgent" : action.statut === "À renouveler" ? "warning" : action.statut === "Traité" ? "success" : "info"}`}
                      >
                        {action.statut}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{textAlign: 'right'}}>
                        <div className="action-buttons" style={{justifyContent: 'flex-end'}}>
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
