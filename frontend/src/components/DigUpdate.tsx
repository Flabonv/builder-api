import { getTrailDig, updateTrailDig } from "../api";
import { useAuth } from "../auth/useAuth";
import DigForm from "../components/DigForm";
import type { NewTrailDig } from "../types/api";
import { digToDigForm } from "../mappers";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router";

export default function DigUpdate({ id }: { id: number }) {
    const navigate = useNavigate();
    const { state } = useAuth();
    async function submitUpdate(newTrailDig: NewTrailDig): Promise<void> {
        if (state.status === "authenticated") {
            const updated = await updateTrailDig(id, newTrailDig, state.token);
            navigate(`/digs/${updated.id}`)
        }
    }
    const dig = useApi(() => getTrailDig(id), [id]);

    return (
        <>
          {dig.status === "loading" && <p>Chargement</p>}
          {dig.status === "error" && <h2>{dig.message}</h2>}
          {dig.status === "success" &&
            <>
              <div className="box__title"><h2>Modifier la corvée</h2></div>
              <DigForm onSubmit={submitUpdate} initial={digToDigForm(dig.data)}/>
            </>
          }
        </>
    );
}
