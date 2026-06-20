import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileText, BarChart3, Database, Droplets, Zap, ArrowRight, ChevronRight } from "lucide-react";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Navbar / Header */}
      <header className="landing-header">
        <div className="logo-container">
          <img src="/srm_logo_official.webp" alt="SRM Laâyoune Logo" className="srm-logo" />
          <div className="logo-text">
            <h2>SRM Laâyoune</h2>
            <span>Société Régionale Multiservices</span>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#features">Fonctionnalités</a>
          <a href="#about">À propos</a>
          <a href="#services">Services</a>
        </nav>
        <button className="btn-login-nav" onClick={handleLoginClick}>
          <span>Espace Collaborateur</span>
          <ArrowRight size={16} />
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-image">
          <img src="/srm_hero.webp" alt="Laâyoune" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <span className="hero-badge">
            <Zap size={14} />
            Plateforme Interne SRM-LS
          </span>
          <h1 className="hero-title">
            SIGAJA
          </h1>
          <p className="hero-tagline">
            Système Intégré de Gestion des <strong>Affaires Juridiques</strong> et des <strong>Assurances</strong>
          </p>
          <p className="hero-subtitle">
            Entité unique et moderne garantissant la distribution d’eau potable, d'électricité et l’assainissement liquide dans toute la région de Laâyoune – Sakia El Hamra.
          </p>
          <div className="hero-actions">
            <button className="btn-primary-hero" onClick={handleLoginClick}>
              Se connecter à SIGAJA
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <Droplets size={20} />
              <div>
                <span className="stat-number">Eau</span>
                <span className="stat-label">Potable</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <Zap size={20} />
              <div>
                <span className="stat-number">Électricité</span>
                <span className="stat-label">Distribution</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <ShieldCheck size={20} />
              <div>
                <span className="stat-number">Assainissement</span>
                <span className="stat-label">Liquide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-badge">Fonctionnalités</span>
          <h2>Une solution complète pour la gestion juridique</h2>
          <p>Conçue spécialement pour les besoins de la SRM Laâyoune-Sakia El Hamra</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-blue">
              <FileText size={28} />
            </div>
            <h3>Gestion des Contentieux</h3>
            <p>Suivi détaillé des dossiers de recouvrement, audiences, recours et litiges avec système d'avancement en temps réel.</p>
            <span className="feature-link">
              En savoir plus <ChevronRight size={14} />
            </span>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-green">
              <Database size={28} />
            </div>
            <h3>Gestion Contractuelle</h3>
            <p>Bibliothèque numérique de tous les contrats, marchés publics et partenariats avec alertes automatiques d'expiration.</p>
            <span className="feature-link">
              En savoir plus <ChevronRight size={14} />
            </span>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-amber">
              <ShieldCheck size={28} />
            </div>
            <h3>Suivi des Assurances</h3>
            <p>Déclaration d'incidents, suivi des indemnisations, et gestion des polices d'assurance pour l'ensemble des activités.</p>
            <span className="feature-link">
              En savoir plus <ChevronRight size={14} />
            </span>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-purple">
              <BarChart3 size={28} />
            </div>
            <h3>Tableaux de Bord & KPIs</h3>
            <p>Statistiques en temps réel, indicateurs de performance et reporting global sur l'activité juridique et financière.</p>
            <span className="feature-link">
              En savoir plus <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </section>

      {/* About / Image Section */}
      <section className="about-section" id="about">
        <div className="about-content">
          <span className="section-badge">À propos de la SRM</span>
          <h2>Au service de la région Laâyoune-Sakia El Hamra</h2>
          <p>
            La Société Régionale Multiservices (SRM-LS) a pour objectif de moderniser et de renforcer les infrastructures de base afin d'améliorer la qualité des services offerts aux clients.
          </p>
          <p>
            SIGAJA est la plateforme numérique interne de la SRM, conçue pour digitaliser et optimiser 
            la gestion des affaires juridiques, des contrats et des assurances de l'entreprise.
          </p>
          <button className="btn-secondary" onClick={handleLoginClick}>
            Accéder à la plateforme
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="about-image">
          <img src="/feature_legal.png" alt="Bureau juridique SRM" />
        </div>
      </section>

      {/* Services Banner */}
      <section className="services-section" id="services">
        <div className="services-bg" style={{ backgroundColor: 'var(--primary-color)' }}>
          <img src="/srm_hero.webp" alt="Infrastructure SRM" style={{ opacity: 0.2 }} />
          <div className="services-overlay"></div>
        </div>
        <div className="services-content">
          <h2>Infrastructure au service des citoyens</h2>
          <p>La SRM gère l'ensemble des services essentiels de distribution d'eau, d'électricité et d'assainissement pour la région.</p>
          <div className="services-cards">
            <div className="service-card">
              <Droplets size={32} />
              <h4>Eau Potable</h4>
              <p>Distribution et gestion du réseau d'eau potable</p>
            </div>
            <div className="service-card">
              <Zap size={32} />
              <h4>Électricité</h4>
              <p>Distribution de l'énergie électrique dans la région</p>
            </div>
            <div className="service-card">
              <ShieldCheck size={32} />
              <h4>Assainissement</h4>
              <p>Gestion du réseau d'assainissement liquide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src="/srm_logo_official.webp" alt="SRM Logo" className="footer-srm-logo" />
              <div>
                <h3>SIGAJA</h3>
                <span>Système Intégré de Gestion des Affaires Juridiques et des Assurances</span>
              </div>
            </div>
            <p className="footer-description">
              Société Régionale Multiservices Laâyoune-Sakia El Hamra<br />
              Avenue des FAR, Laâyoune, Maroc
            </p>
          </div>
          <div className="footer-right">
            <p>© {new Date().getFullYear()} SRM Laâyoune-Sakia El Hamra. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
