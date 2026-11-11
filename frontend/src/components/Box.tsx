import Button from "./Button";
import Item, { type ItemProps } from "./Item";

interface BoxProps {
    title: string;
    subtitle: string;
    href?: string;
    items: ItemProps[]
}

export default function Box({title, subtitle, href, items}: BoxProps) {
    return (
      <section className="box">
        <header className="box__header">
          <div className="box__title">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <Button href={href}>Voir tout</Button>
        </header>
        {items.length === 0 ? <p>Aucune donnée à afficher</p> : <div className="list"> {items.map((item) => <Item key={item.id} {...item} />)} </div>}
      </section>
    );
}
