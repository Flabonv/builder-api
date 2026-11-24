import { getTrailDig } from "../api";
import { useApi } from "../hooks/useApi";
import type { TrailDigDetail } from "../types/api";
import { useAuth } from "../auth/useAuth";
import Button from "./Button";

function DigDetailData({id, title, date_time, time_minutes, number_people, tags, description } : TrailDigDetail) {
    const { state } = useAuth();
    const when = new Date(date_time).toLocaleString("fr-CA", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit",
    });
    const duration = `${Math.floor(time_minutes / 60)} h ${String(time_minutes % 60).padStart(2, "0")}`;

    return (
        <>
            <header className="box__header">
                <div className="box__title">
                    <h2>{title}</h2>
                    <p className="detail__when">{when}</p>
                </div>
                {state.status === "authenticated" &&
                    <div className="box__actions">
                        <Button href={`/digs/${id}/edit`} arrow={false}>Modifier</Button>
                    </div>
                }
            </header>

            <dl className="detail-facts">
                <div className="detail-fact">
                    <dt className="field__label">Durée</dt>
                    <dd>{duration}</dd>
                </div>
                <div className="detail-fact">
                    <dt className="field__label">Bénévoles</dt>
                    <dd>{number_people}</dd>
                </div>
                <div className="detail-fact">
                    <dt className="field__label">Projets</dt>
                    <dd className="detail-fact__tags">
                        {tags.length === 0
                            ? <span className="field__hint">Aucun</span>
                            : tags.map((tag) => <span className="tag-pill" key={tag.id}>{tag.name}</span>)}
                    </dd>
                </div>
            </dl>

            <section className="detail__section">
                <h3 className="field__label">Description</h3>
                <p className="detail__desc">{description || "Aucune description."}</p>
            </section>
        </>
    );
}

export default function DigDetail({ id }: { id: number }) {
    const dig = useApi(() => getTrailDig(id), [id]);
    return (
        <>
          {dig.status === "loading" && <p>Chargement</p>}
          {dig.status === "error" && <h2>{dig.message}</h2>}
          {dig.status === "success" && <DigDetailData {...dig.data}/> }
        </>

    );
}
