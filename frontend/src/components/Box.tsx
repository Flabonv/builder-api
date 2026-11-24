import Button from "./Button";
import Item, { type ItemProps } from "./Item";

interface BoxProps {
    title: string;
    subtitle?: string;
    href?: string;
    href2?: string;
    items: ItemProps[]
}

export default function Box({title, subtitle, href, href2, items}: BoxProps) {
    return (
      <section className="box">
        <header className="box__header">
          <div className="box__title">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {(href || href2) &&
            <div className="box__actions">
              {href && <Button href={href}>Voir tout</Button>}
              {href2 && <Button href={href2} arrow={false} ariaLabel="Ajouter" className="btn--icon">+</Button>}
            </div>
          }
        </header>
        {items.length === 0 ? <p>Aucune donnée à afficher</p> : <div className="list"> {items.map((item) => <Item key={item.id} {...item} />)} </div>}
      </section>
    );
}
