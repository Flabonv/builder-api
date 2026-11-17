import { Link } from "react-router";
import { NOT_FOUND } from "../messages";

export default function NotFoundPage() {
  return (
    <main className="portal">
      <section className="box">
        <div className="box__title">
          <h2>{NOT_FOUND}</h2>
          <p>Cette page n'existe pas.</p>
        </div>
        <Link className="btn" to="/">Retour à l'accueil</Link>
      </section>
    </main>
  );
}
