import { getTrailDigs } from "../api";
import { useApi } from "../hooks/useApi";
import { digToItem, pastDigs, upcomingDigs } from "../mappers";
import Box from "../components/Box";
import { useAuth } from "../auth/useAuth";

export default function DigsPage () {
    const digs = useApi(getTrailDigs);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { state } = useAuth();

    return (
        <main className="portal">
            {digs.status === "loading" && <p>Chargement</p>}
            {digs.status === "error" && <p>{digs.message}</p>}
            {digs.status === "success" &&
              <div className="portal__boxes">
                <Box title="Corvées à venir"
                     items={upcomingDigs(digs.data, today).map(digToItem)}
                     href2={state.status === "authenticated" ? "/digs/new" : "" }
                />
                <Box title="Corvées passées"
                     items={pastDigs(digs.data, today).map(digToItem)}
                />
              </div>
            }
        </main>
    );
}
