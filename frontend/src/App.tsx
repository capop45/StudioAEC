import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminRoute } from './components/AdminRoute';
import { HomePage } from './pages/HomePage';
import { TreinamentosPage } from './pages/TreinamentosPage';
import { TrackDetailPage } from './pages/TrackDetailPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { BibliotecasPage } from './pages/BibliotecasPage';
import { OrientacoesPage } from './pages/OrientacoesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { QuemSouPage } from './pages/QuemSouPage';
import { ContatoPage } from './pages/ContatoPage';
import { LoginPage } from './pages/LoginPage';
import { PlanningPage } from './pages/admin/PlanningPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="treinamentos" element={<TreinamentosPage />} />
        <Route path="treinamentos/:slug" element={<TrackDetailPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="bibliotecas" element={<BibliotecasPage />} />
        <Route path="orientacoes" element={<OrientacoesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="quem-somos" element={<QuemSouPage />} />
        <Route path="contato" element={<ContatoPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* aliases para preservar URLs antigas */}
        <Route path="trilhas" element={<Navigate to="/treinamentos" replace />} />
        <Route path="trilhas/:slug" element={<TrackDetailPage />} />
        <Route path="quem-sou" element={<Navigate to="/quem-somos" replace />} />
        <Route path="portifolio" element={<Navigate to="/portfolio" replace />} />
        <Route
          path="admin/planejamento"
          element={
            <AdminRoute>
              <PlanningPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
