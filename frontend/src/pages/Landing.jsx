import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileText, BarChart3, Database } from "lucide-react";
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
          <img src="/srm_logo.png" alt="SRM Laâyoune Logo" className="srm-logo" />
          <div className="logo-text">
            <h2>SRM Laâyoune</h2>
            <span>Société Régionale Multiservices</span>
          </div>
        </div>
        <button className="btn-login-nav" onClick={handleLoginClick}>
          Espace Collaborateur
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Plateforme Interne</span>
          <h1 className="hero-title">
            Système Intégré de Gestion des <span className="highlight">Affaires Juridiques</span> et des <span className="highlight">Assurances</span>
          </h1>
          <p className="hero-subtitle">
            Centralisez, suivez et optimisez la gestion de vos contentieux, contrats, 
            assurances et alertes juridiques au sein d'une interface unique, sécurisée et professionnelle.
          </p>
          <div className="hero-actions">
            <button className="btn-primary-hero" onClick={handleLoginClick}>
              Se connecter à SIGAJA
            </button>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="glass-card mockup-card">
            <div className="mockup-header">
              <div className="dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar"></div>
              <div className="mockup-content">
                <div className="mockup-box header-box"></div>
                <div className="mockup-grid">
                  <div className="mockup-box"></div>
                  <div className="mockup-box"></div>
                  <div className="mockup-box"></div>
                </div>
                <div className="mockup-box large-box"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Fonctionnalités Principales</h2>
          <p>Une solution complète pour les services juridiques de la SRM-LS</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-blue">
              <FileText size={28} />
            </div>
            <h3>Gestion des Contentieux</h3>
            <p>Suivi détaillé des dossiers de recouvrement, audiences, recours et litiges avec système d'avancement.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-green">
              <Database size={28} />
            </div>
            <h3>Gestion Contractuelle</h3>
            <p>Bibliothèque numérique de tous les contrats, marchés publics et partenariats avec alertes d'expiration.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-yellow">
              <ShieldCheck size={28} />
            </div>
            <h3>Suivi des Assurances</h3>
            <p>Déclaration d'incidents, suivi des indemnisations, et gestion des polices d'assurance (Eau, Électricité).</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-purple">
              <BarChart3 size={28} />
            </div>
            <h3>Tableaux de Bord</h3>
            <p>Statistiques en temps réel, KPIs et reporting global sur l'activité juridique et financière de la SRM.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
             <img src="/srm_logo.png" alt="SRM Logo" className="footer-srm-logo" />
             <span>SIGAJA © {new Date().getFullYear()}</span>
          </div>
          <p>Société Régionale Multiservices Laâyoune-Sakia El Hamra</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
