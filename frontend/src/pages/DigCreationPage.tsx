import { createTrailDig } from "../api";
import { useAuth } from "../auth/useAuth";
import DigForm from "../components/DigForm";
import type { NewTrailDig } from "../types/api";
import { useNavigate } from "react-router";

export default function DigCreationPage() {
    const { state } = useAuth();
    const navigate = useNavigate();
    async function submitCreation(newTrailDig: NewTrailDig): Promise<void> {
        if (state.status === "authenticated") {
            const created = await createTrailDig(newTrailDig, state.token);
            navigate(`/digs/${created.id}`)
        }
    }
    return  (
        <main className="portal">
        {
            state.status !== "authenticated" ? <p>Must be authenticated</p> :
            <DigForm onSubmit={submitCreation} />
        }
        </main>
    );
}
