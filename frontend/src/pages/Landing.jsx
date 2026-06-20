import { useNavigate } from "react-router-dom";
import { User, Info, ArrowRight } from "lucide-react";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Premium Glass Navbar */}
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
        {/* Background Elements */}
        <div className="hero-image-container">
          <img src="/srm_hero.webp" alt="SRM Infrastructure" className="hero-image" />
          <div className="hero-overlay-gradient"></div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-badge">
            SRM Laâyoune - Sakia El Hamra
          </div>
          <h1>
            <span>SIGAJA</span>
          </h1>
          <p style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f8fafc', marginBottom: '10px' }}>
            Système Intégré de Gestion des Affaires Juridiques et des Assurances
          </p>
          <p>
            Plateforme numérique sécurisée pour la gestion centralisée des contentieux, contrats et assurances de la Société Régionale Multiservices.
          </p>

          {/* Glass Cards Wrapper */}
          <div className="glass-cards-wrapper">
            <div className="glass-card">
              <div className="card-icon-wrapper">
                <User size={28} />
              </div>
              <h3>Espace Collaborateur</h3>
              <p>Accès sécurisé à la plateforme SIGAJA pour la gestion des affaires juridiques, des contrats et des assurances.</p>
              <button className="btn-glass" onClick={handleLoginClick}>
                Se Connecter <ArrowRight size={18} />
              </button>
            </div>

            <div className="glass-card accent">
              <div className="card-icon-wrapper">
                <Info size={28} />
              </div>
              <h3>Espace Public</h3>
              <p>Découvrez nos services, nos engagements, et accédez aux dernières actualités et appels d'offres de la région.</p>
              <a href="https://www.srm-ls.ma/" target="_blank" rel="noreferrer" className="btn-glass">
                Site Officiel <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dramatic Presentation Section */}
      <section className="presentation-section">
        <div className="presentation-container">
          <div className="presentation-image-wrapper">
            <img src="/feature_legal.png" alt="Infrastructure SRM" />
          </div>
          
          <div className="presentation-content">
            <div className="gold-dash-premium"></div>
            <h2>Une Infrastructure<br />de Pointe</h2>
            <p>
              La Société Régionale Multiservices (SRM-LS) a pour objectif de moderniser et de renforcer les infrastructures de base.
            </p>
            <p>
              Grâce à notre plateforme interne centralisée, nous assurons une gestion fluide et transparente des projets vitaux pour la région, offrant ainsi un service public irréprochable aux citoyens de Laâyoune - Sakia El Hamra.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
