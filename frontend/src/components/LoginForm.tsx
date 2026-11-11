import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../api.ts"
import { useAuth } from "../auth/useAuth.ts";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();               // stop the browser from reloading the page
    setError(null);

  try {
    await login(email, password);
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            const message = err.fields.non_field_errors?.[0] ?? err.detail ?? "Connexion refusée.";
            setError(message);
        } else {
            setError("Impossible de joindre le serveur.");
        }
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <input
        className="login__input"
        type="email"
        required
        placeholder="Courriel"
        aria-label="Courriel"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="login__input"
        type="password"
        required
        placeholder="Mot de passe"
        aria-label="Mot de passe"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn" type="submit">Connexion</button>
      {error && <p className="login__error" role="alert">{error}</p>}
    </form>
  );
}
