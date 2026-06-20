import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileText, Activity } from "lucide-react";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <nav className="main-nav">
        <div>
          <img src="/srm_logo_official.webp" alt="SRM Logo" className="nav-logo" />
        </div>
        <div className="nav-links">
          <a href="#">Espace Client</a>
          <a href="#">Appels d'Offres</a>
          <a href="#">À Propos</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">SRM Laâyoune - Sakia El Hamra</div>
            <h1>
              <span>SIGAJA</span>
            </h1>
            <h2 className="hero-subtitle">
              Système Intégré de Gestion des Affaires Juridiques et des Assurances
            </h2>
            <p className="hero-description">
              Une plateforme numérique d'entreprise conçue pour assurer le suivi, le contrôle et la gestion centralisée des contentieux, contrats et assurances de la Société Régionale Multiservices.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={handleLoginClick}>
                Accès Collaborateur
              </button>
              <a href="https://www.srm-ls.ma/" target="_blank" rel="noreferrer" className="btn-secondary">
                Portail Public
              </a>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
            <img src="/srm_hero.webp" alt="SRM Infrastructure" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={24} strokeWidth={2} />
              </div>
              <h3>Gestion des Contentieux</h3>
              <p>Suivi rigoureux des litiges et dossiers juridiques en cours avec alertes sur les échéances importantes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={24} strokeWidth={2} />
              </div>
              <h3>Suivi des Contrats</h3>
              <p>Centralisation des contrats d'abonnement et de prestation, garantissant la conformité de nos engagements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Activity size={24} strokeWidth={2} />
              </div>
              <h3>Couverture Assurances</h3>
              <p>Supervision des polices d'assurance et gestion des sinistres liés au réseau de distribution régional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="presentation-section">
        <div className="presentation-container">
          <div className="presentation-image-wrapper">
            <img src="/feature_legal.png" alt="Infrastructure SRM" />
          </div>
          
          <div className="presentation-content">
            <div className="gold-accent"></div>
            <h2>Une Infrastructure de Confiance</h2>
            <p>
              La Société Régionale Multiservices (SRM-LS) a pour mission de moderniser les infrastructures de base dans la région de Laâyoune - Sakia El Hamra. 
            </p>
            <p>
              Grâce à notre plateforme interne SIGAJA, nous assurons une gestion fluide, sécurisée et totalement transparente de nos affaires juridiques pour offrir le meilleur service public aux citoyens.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
