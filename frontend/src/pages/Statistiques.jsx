import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Scale, Shield, FileText } from 'lucide-react';
import './Module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6', '#EC4899'];

const Statistiques = () => {
    const [contentieuxStats, setContentieuxStats] = useState(null);
    const [contratsStats, setContratsStats] = useState(null);
    const [assurancesStats, setAssurancesStats] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [o, c, ct, a, t] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}api/stats/overview`),
                    axios.get(`${import.meta.env.VITE_API_URL}api/stats/contentieux`),
                    axios.get(`${import.meta.env.VITE_API_URL}api/stats/contrats`),
                    axios.get(`${import.meta.env.VITE_API_URL}api/stats/assurances`),
                    axios.get(`${import.meta.env.VITE_API_URL}api/stats/timeline`),
                ]);
                setOverview(o.data);
                setContentieuxStats(c.data);
                setContratsStats(ct.data);
                setAssurancesStats(a.data);
                setTimeline(t.data);
            } catch (error) { console.error(error); }
        };
        fetchAll();
    }, []);

    const formatMAD = (v) => v ? v.toLocaleString('fr-MA') + ' MAD' : '0 MAD';

    return (
        <div className="module-container">
            <div className="module-header">
                <h1>Statistiques & Reporting Stratégique</h1>
            </div>

            {/* Summary KPIs */}
            {overview && (
                <div className="kpi-grid">
                    <div className="kpi-card blue">
                        <Scale size={28} />
                        <div>
                            <span className="kpi-value">{overview.totalDossiers}</span>
                            <span className="kpi-label">Dossiers Contentieux</span>
                        </div>
                    </div>
                    <div className="kpi-card green">
                        <TrendingUp size={28} />
                        <div>
                            <span className="kpi-value">{overview.tauxRecouvrement}%</span>
                            <span className="kpi-label">Taux de Recouvrement</span>
                        </div>
                    </div>
                    <div className="kpi-card orange">
                        <FileText size={28} />
                        <div>
                            <span className="kpi-value">{overview.totalContrats}</span>
                            <span className="kpi-label">Contrats ({overview.contratsActifs} actifs)</span>
                        </div>
                    </div>
                    <div className="kpi-card purple">
                        <Shield size={28} />
                        <div>
                            <span className="kpi-value">{overview.totalAssurances}</span>
                            <span className="kpi-label">Assurances ({overview.assurancesDeclarees} en attente)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Financial Summary */}
            {overview && (
                <div className="financial-summary card">
                    <h3>Résumé Financier</h3>
                    <div className="financial-row">
                        <div className="fin-item">
                            <span className="fin-label">Coût Total Contentieux</span>
                            <span className="fin-value">{formatMAD(overview.montantTotalContentieux)}</span>
                        </div>
                        <div className="fin-item">
                            <span className="fin-label">Montant Recouvré</span>
                            <span className="fin-value green">{formatMAD(overview.montantRecouvre)}</span>
                        </div>
                        <div className="fin-item">
                            <span className="fin-label">Exposition aux Risques</span>
                            <span className="fin-value red">{formatMAD(overview.expositionRisque)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline Chart */}
            {timeline.length > 0 && (
                <div className="card chart-section">
                    <h3>Évolution Mensuelle — Tous Modules</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={timeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="Contentieux" stackId="1" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="Contrats" stackId="1" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="Assurances" stackId="1" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Charts Grid */}
            <div className="charts-row">
                {/* Contentieux by Status */}
                {contentieuxStats?.parStatut?.length > 0 && (
                    <div className="card chart-section">
                        <h3>Contentieux par Statut</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={contentieuxStats.parStatut} cx="50%" cy="50%"
                                    label={({ name, value }) => `${name} (${value})`}
                                    outerRadius={90} dataKey="value">
                                    {contentieuxStats.parStatut.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Contentieux by Activity */}
                {contentieuxStats?.parActivite?.length > 0 && (
                    <div className="card chart-section">
                        <h3>Contentieux par Activité</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={contentieuxStats.parActivite}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Contrats by Type */}
                {contratsStats?.parType?.length > 0 && (
                    <div className="card chart-section">
                        <h3>Contrats par Type</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={contratsStats.parType} cx="50%" cy="50%"
                                    label={({ name, value }) => `${name} (${value})`}
                                    outerRadius={90} dataKey="value">
                                    {contratsStats.parType.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Assurances by Service */}
                {assurancesStats?.parService?.length > 0 && (
                    <div className="card chart-section">
                        <h3>Assurances par Service</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={assurancesStats.parService}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Assurances KPIs */}
            {assurancesStats && (
                <div className="card chart-section">
                    <h3>Indicateurs d'Efficacité — Assurances</h3>
                    <div className="financial-row">
                        <div className="fin-item">
                            <span className="fin-label">Total Demandé</span>
                            <span className="fin-value">{formatMAD(assurancesStats.totalDemande)}</span>
                        </div>
                        <div className="fin-item">
                            <span className="fin-label">Total Accordé</span>
                            <span className="fin-value green">{formatMAD(assurancesStats.totalAccorde)}</span>
                        </div>
                        <div className="fin-item">
                            <span className="fin-label">Taux d'Indemnisation</span>
                            <span className="fin-value blue">{assurancesStats.tauxIndemnisation}%</span>
                        </div>
                        <div className="fin-item">
                            <span className="fin-label">Délai Moyen</span>
                            <span className="fin-value">{assurancesStats.delaiMoyen} jours</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Risk Analysis */}
            {contentieuxStats?.parRisque?.length > 0 && (
                <div className="card chart-section">
                    <h3>Analyse du Niveau de Risque</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={contentieuxStats.parRisque} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {contentieuxStats.parRisque.map((entry, i) => {
                                    const riskColors = { 'Faible': '#10B981', 'Moyen': '#F59E0B', 'Élevé': '#EF4444', 'Critique': '#7C2D12' };
                                    return <Cell key={i} fill={riskColors[entry.name] || COLORS[i]} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Statistiques;
