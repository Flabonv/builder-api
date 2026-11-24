import { useParams } from "react-router";
import { NOT_FOUND } from "../messages";
import DigUpdate from "../components/DigUpdate";
import { useAuth } from "../auth/useAuth";

export default function DigUpdatePage() {
    const { state } = useAuth();
    const { id } = useParams();
    const idNumber = Number(id);
    const isValidId = Number.isInteger(idNumber) && idNumber > 0

    return  (
        <main className="portal">
            {
                state.status !== "authenticated" ? <p>Must be authenticated</p> :
                <section className="box">{
                    (!isValidId) ? <h2>{NOT_FOUND}</h2> : <DigUpdate id={idNumber}/>
                    }
            </section>}
        </main>
    );
}
