import Nav from "./components/Nav";
import Box from "./components/Box";
import { getTags, getTrailDigs } from "./api";
import { digToItem, tagToItem, upcomingDigs } from "./mappers";
import { useApi } from "./hooks/useApi";

export default function App() {
  const tags = useApi(getTags);
  const digs = useApi(getTrailDigs);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return (
    <div className="page">
      <Nav />
      <main className="portal">
        <div className="portal__boxes">
          {tags.status === "loading" && <p>Chargement</p>}
          {tags.status === "error" && <p>{tags.message}</p>}
          {tags.status === "success" && <Box title="Projets" subtitle="Les chantiers en cours" items={tags.data.map(tagToItem)} />}

          {digs.status === "loading" && <p>Chargement</p>}
          {digs.status === "error" && <p>{digs.message}</p>}
          {digs.status === "success" && <Box title="Digs" subtitle="Les corvées à venir" items={
            upcomingDigs(digs.data, today).map(digToItem)
            } />}
        </div>
      </main>
    </div>
  );
}
