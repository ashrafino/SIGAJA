import { useNavigate } from "react-router-dom";
import { Phone, Mail, Linkedin, Facebook, Instagram, User, Info, ArrowRight } from "lucide-react";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Top Bar - Dark Blue */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>
            <Phone size={14} style={{ marginRight: '8px' }} />
            Centre de relation client : 080 203 10 30
          </span>
          <span style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
            <Mail size={14} style={{ marginRight: '8px' }} />
            contact@srm-ls.ma
          </span>
        </div>
        <div className="top-bar-right">
          <span>اتصل بنا</span>
          <div className="social-icons">
            <Facebook size={16} />
            <Instagram size={16} />
            <Linkedin size={16} />
          </div>
        </div>
      </div>

      {/* Main Nav - White */}
      <nav className="main-nav">
        <div className="nav-links">
          <a href="#">الرئيسية</a>
          <a href="#">من نحن</a>
          <a href="#">فضاء الزبون</a>
          <a href="#">طلبات العروض</a>
          <a href="#">الموارد البشرية</a>
        </div>
        <div>
          <img src="/srm_logo_official.webp" alt="SRM Logo" className="nav-logo" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <img src="/srm_hero.webp" alt="SRM Hero Banner" className="hero-image" />
        
        {/* Overlapping Portals */}
        <div className="portal-cards-wrapper">
          <div className="portal-card">
            <div className="portal-icon">
              <User size={36} />
            </div>
            <h3>Espace Collaborateur</h3>
            <p>Accédez à SIGAJA pour gérer les affaires juridiques et les assurances.</p>
            <button className="portal-btn" onClick={handleLoginClick}>
              Se connecter
            </button>
          </div>

          <div className="portal-card accent">
            <div className="portal-icon">
              <Info size={36} />
            </div>
            <h3>Portail Fournisseurs</h3>
            <p>Consultez les appels d'offres et les règlements des marchés publics.</p>
            <a href="#" className="portal-btn" style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
              Découvrir
            </a>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="presentation-section">
        <div className="presentation-content">
          <div className="gold-separator">
            <div className="gold-dash long"></div>
            <div className="gold-dash short"></div>
            <div className="gold-dash short"></div>
          </div>
          <h2>Société Régionale Multiservices Laâyoune - Sakia El Hamra S.A</h2>
          <p>
            Entité unique et moderne garantissant la distribution d’eau potable, d'électricité et l’assainissement liquide dans toute la région de Laâyoune – Sakia El Hamra, dans le cadre d'un contrat de gestion de 30 ans.
          </p>
          <p>
            L'objectif principal de la SRM-LS est de moderniser et de renforcer les réseaux et les infrastructures de base afin d'améliorer leurs performances, de répondre à la demande croissante, et d'améliorer la qualité des services offerts aux clients.
          </p>
          <button className="btn-primary" style={{ marginTop: '20px', borderRadius: '999px' }} onClick={handleLoginClick}>
            Accéder à SIGAJA <ArrowRight size={16} />
          </button>
        </div>
        <div className="presentation-image">
          <img src="/feature_legal.png" alt="Présentation SRM" />
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-info">
            <img src="/srm_logo_official.webp" alt="SRM Logo" className="footer-logo" />
            <p style={{ marginTop: '20px' }}>
              Société Régionale Multiservices Laâyoune-Sakia El Hamra<br />
              Avenue des FAR, Laâyoune, Maroc
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SRM Laâyoune-Sakia El Hamra S.A. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
