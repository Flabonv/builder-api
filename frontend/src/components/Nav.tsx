import { useAuth } from "../auth/useAuth";
import LoginForm from "./LoginForm";

export default function Nav() {
  const { state, logout } = useAuth();
    return (
      <nav className="nav">
        <a className="brand" href="#">
            <svg
              className="brand__symbol"
              viewBox="0 0 42 42"
              fill="none"
              stroke="#263d32"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="13" cy="21" r="11"/>
              <circle cx="25" cy="21" r="11"/>
            </svg>
            <div className="brand__text">
              <p className="brand__name">Dig DH</p>
              <p className="brand__tagline">Corvées dans le DH</p>
            </div>
        </a>
        <div className="menu">
            <a href="#">Projets</a>
            <a href="#">Corvées</a>
            <a href="#">Contact</a>
            <div className="nav__auth">
              {state.status === "anonymous" && <LoginForm />}
              {state.status === "authenticated" && (
                <>
                <span>Bonjour {state.user.name}</span>
                <button type="button" onClick={logout}>Déconnexion</button>
                </>
              )}
            </div>
        </div>
      </nav>
    );
}
