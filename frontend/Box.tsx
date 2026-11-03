import type { Entry, FetchStatus } from "../types";
import Button from "./Button";
import Item from "./Item";

interface BoxProps {
  id: string;
  title: string;
  subtitle: string;
  items: Entry[];
  status: FetchStatus;
  onRetry: () => void;
  seeAllHref?: string;
}

export default function Box({ id, title, subtitle, items, status, onRetry, seeAllHref }: BoxProps) {
  return (
    <section className="box" id={id}>
      <header className="box__header">
        <div className="box__title">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <Button href={seeAllHref}>Voir tout</Button>
      </header>

      <div className="list" aria-busy={status === "loading"}>
        {status === "loading" &&
          Array.from({ length: 4 }, (_, i) => <div key={i} className="item item--skeleton" />)}

        {status === "error" && (
          <div className="list__message" role="alert">
            <p>Impossible de charger les données.</p>
            <button className="btn" type="button" onClick={onRetry}>Réessayer</button>
          </div>
        )}

        {status === "success" && items.length === 0 && (
          <p className="list__message">Rien à afficher pour le moment.</p>
        )}

        {status === "success" &&
          items.map(({ id: itemId, ...rest }) => <Item key={itemId} {...rest} />)}
      </div>
    </section>
  );
}
