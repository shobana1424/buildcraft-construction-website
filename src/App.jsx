import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { ToastHost } from './components/common/Misc';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSites from './pages/admin/AdminSites';
import RegisterSite from './pages/admin/RegisterSite';
import SiteDetail from './pages/admin/SiteDetail';
import AdminMaterials from './pages/admin/AdminMaterials';
import AdminMessages from './pages/admin/AdminMessages';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminReports from './pages/admin/AdminReports';
import AdminClients from './pages/admin/AdminClients';

import ClientDashboard from './pages/client/ClientDashboard';
import ClientProgress from './pages/client/ClientProgress';
import ClientMaterials from './pages/client/ClientMaterials';
import ClientMessages from './pages/client/ClientMessages';

// Role-based route guard (frontend demo only - not real security).
function RequireRole({ role, children }) {
  const { user } = useApp();
  if (!user) return <Navigate to={`/${role}/login`} replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<Login role="admin" />} />
        <Route path="/client/login" element={<Login role="client" />} />

        <Route path="/admin" element={<RequireRole role="admin"><DashboardLayout role="admin" /></RequireRole>}>
          <Route index element={<AdminDashboard />} />
          <Route path="sites" element={<AdminSites />} />
          <Route path="sites/new" element={<RegisterSite />} />
          <Route path="sites/:siteId" element={<SiteDetail />} />
          <Route path="materials" element={<AdminMaterials />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="clients" element={<AdminClients />} />
        </Route>

        <Route path="/client" element={<RequireRole role="client"><DashboardLayout role="client" /></RequireRole>}>
          <Route index element={<ClientDashboard />} />
          <Route path="progress" element={<ClientProgress />} />
          <Route path="materials" element={<ClientMaterials />} />
          <Route path="messages" element={<ClientMessages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </>
  );
}
