import { getTrailDig } from "../api";
import { useApi } from "../hooks/useApi";
import type { TrailDigDetail } from "../types/api";
import { useAuth } from "../auth/useAuth";
import { Link } from "react-router";

function DigDetailData({id, title, date_time, time_minutes, number_people, tags, description } : TrailDigDetail) {
    const { state } = useAuth();
    const when = new Date(date_time).toLocaleString("fr-CA", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit",
    });

    return (
        <div>
            <h2>Titre: {title}</h2>
            <p>Quand: {when}</p>
            <p>Durée: {Math.floor(time_minutes / 60)}h{String(time_minutes % 60).padStart(2, "0")}</p>
            <p>Nombre de bénévoles: {number_people}</p>
            <p>Projet : </p>
            <ul>{tags.map((tag) => <li key={tag.id}>{tag.name}</li>)}</ul>
            <p>Description: {description}</p>
            {(state.status === "authenticated") && <Link className="btn" to={`/digs/${id}/edit`}>Modifier</Link> }
        </div>
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
