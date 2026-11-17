import { getTrailDig } from "../api";
import { useApi } from "../hooks/useApi";
import type { TrailDigDetail } from "../types/api";

function DigDetailData({title, date_time, time_minutes, number_people, tags, description } : TrailDigDetail) {
    const when = new Date(date_time).toLocaleString("fr-CA", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit",
    });

    return (
        <div>
            <h2>Titre: {title}</h2>
            <p>Description: {description}</p>
            <p>Quand: {when}</p>
            <p>Durée: {Math.floor(time_minutes / 60)}h{String(time_minutes % 60).padStart(2, "0")}</p>
            <p>Nombre de bénévoles: {number_people}</p>
            <p>Projet : </p>
            <ul>{tags.map((tag) => <li key={tag.id}>{tag.name}</li>)}</ul>
        </div>
    );
}

export default function DigDetail({ id }: { id: number }) {
    const dig = useApi(() => getTrailDig(id), [id]);
    return (
        <>
          {dig.status === "loading" && <p>Chargement</p>}
          {dig.status === "error" && <p>{dig.message}</p>}
          {dig.status === "success" && <DigDetailData {...dig.data}/> }
        </>

    );
}
