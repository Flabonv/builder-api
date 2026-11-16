import { BrowserRouter, Routes, Route, Outlet/*, Link */} from "react-router";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";

function Layout() {
  return (
    <div className="page">
      <Nav />
      <Outlet /> {/* the matched child page renders here */}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="digs" element={<main className="portal"><h2>Corvées</h2></main>} />
          <Route path="digs/:id" element={<main className="portal"><h2>Détail de corvée</h2></main>} />
          <Route path="*" element={<main className="portal"><h2>Introuvable</h2></main>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
