import { useParams } from "react-router";
import DigDetail from "../components/DigDetail";
import { NOT_FOUND } from "../messages";

export default function DigDetailPage() {
    const { id } = useParams();
    const idNumber = Number(id);
    const isValidId = Number.isInteger(idNumber) && idNumber > 0

    return (
        <main className="portal">
            <section className="box">
                {(!isValidId) ? <h2>{NOT_FOUND}</h2> : <DigDetail id={idNumber}/>}
            </section>
        </main>
    );
}
