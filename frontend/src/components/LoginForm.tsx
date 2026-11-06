import { useState } from "react";
import type { FormEvent } from "react";
import { login, ApiError } from "../api.ts"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();               // stop the browser from reloading the page
    setError(null);

  try {
    const result = await login({ email, password });
    console.log(result.token);
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
    <section className="box">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="form__error">{error}</p>}
        <button className="btn" type="submit">Connexion</button>
      </form>
    </section>
  );
}
