export interface ItemProps {
    title: string;
    description?: string;
    meta: string;
    detail?: string;
}

export default function Item({title, description, meta, detail}: ItemProps) {
    return (
        <article className="item">
          <div className="item__content">
            <p className="item__title">{title}</p>
            {description && <p className="item__desc">{description}</p>}
          </div>
          <div className="item__meta"><strong>{meta}</strong>{detail && <span>{detail}</span>}</div>
        </article>
    );
}
