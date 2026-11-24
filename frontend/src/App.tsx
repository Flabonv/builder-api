import { BrowserRouter, Routes, Route, Outlet/*, Link */} from "react-router";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import DigDetailPage from "./pages/DigDetailPage";
import DigsPage from "./pages/DigsPage";
import NotFoundPage from "./pages/NotFoundPage";
import DigCreationPage from "./pages/DigCreationPage";
import DigUpdatePage from "./pages/DigUpdatePage";

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
          <Route path="digs" element={<DigsPage />} />
          <Route path="digs/:id" element={<DigDetailPage />} />
          <Route path="digs/new" element={<DigCreationPage />} />
          <Route path="digs/:id/edit" element={<DigUpdatePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
