import { Link } from "react-router";

export interface ItemProps {
    id: number;
    title: string;
    description?: string;
    meta: string;
    detail?: string;
    href?: string;
}

function ItemCard({title, description, meta, detail}: ItemProps) {
  return(
    <article className="item">
      <div className="item__content">
        <p className="item__title">{title}</p>
        {description && <p className="item__desc">{description}</p>}
      </div>
      <div className="item__meta"><strong>{meta}</strong>{detail && <span>{detail}</span>}</div>
    </article>
  );
}

export default function Item(props : ItemProps) {
    return (
       props.href ?
          <Link className="item-link" to={props.href}>
            <ItemCard {...props} />
          </Link> :
          <ItemCard {...props} />
    );
}
