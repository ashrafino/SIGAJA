import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/app");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 2. Connexion Réelle via API
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}api/auth/login`,
        { email, password },
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/app");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect",
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>SIGAJA (SRM-LS)</h2>
          <p
            style={{
              fontSize: "0.85rem",
              lineHeight: "1.4",
              marginTop: "10px",
            }}
          >
            Système Informatisé de Gestion des Affaires Juridiques et des
            Assurances
            <br />
            (Société Régionale Multiservices - Laâyoune Sakia El Hamra)
          </p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Professionnel</label>
            <input
              type="text" // Changé en text pour permettre juste "admin"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@srm.ma"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Se connecter
          </button>
        </form>
        <div className="login-footer">
          <p>Mot de passe oublié ? Contactez le support IT.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
