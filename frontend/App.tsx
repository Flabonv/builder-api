import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Box from "./components/Box";
import { useFetch } from "./hooks/useFetch";
import { fetchProjects, fetchChores } from "./api";
import type { Entry } from "./types";

export default function App() {
  const projects = useFetch<Entry>(fetchProjects);
  const chores = useFetch<Entry>(fetchChores);

  return (
    <div className="page">
      <Nav />

      <main className="portal">
        <div className="portal__boxes">
          <Box
            id="projets"
            title="Projets"
            subtitle="Les initiatives et activités en cours dans le quartier."
            items={projects.data}
            status={projects.status}
            onRetry={projects.reload}
          />
          <Box
            id="corvees"
            title="Corvées"
            subtitle="Les tâches et besoins à couvrir dans les prochains jours."
            items={chores.data}
            status={chores.status}
            onRetry={chores.reload}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
