import Nav from "./components/Nav";
import type { ItemProps } from "./components/Item";
import Box from "./components/Box";

export default function App() {
  const projects: ItemProps[] = [
    { title: "Chômeuse", meta: "60h réalisées" },
    { title: "Zoobé", meta: "80h réalisées" },
  ];
  const digs: ItemProps[] = [
    {
      title: "Gros jump dans la chômeuse",
      description: "Construire un gros jump pour sender.",
      meta: "3 bénévoles",
      detail: "samedi le 26 octobre.",
    },
    {
      title: "Flatter les Kick",
      description: "Plusieurs kicks ont des ruts.",
      meta: "1 bénévoles",
      detail: "dimanche le 29 octobre.",
    },
  ];
  return (
    <div className="page">
      <Nav />
      <main className="portal">
        <div className="portal__boxes">
          <Box title="Projets" subtitle="Les chantiers en cours" items={projects} />
          <Box title="Digs" subtitle="Les corvées à venir" items={digs} />
        </div>
      </main>
    </div>
  );
}
