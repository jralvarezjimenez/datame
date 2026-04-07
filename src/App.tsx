import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { PatientProfile } from './pages/PatientProfile';
import { Vaccination } from './pages/Vaccination';
import { Consultation } from './pages/Consultation';
import { Prescription } from './pages/Prescription';
import { Agenda } from './pages/Agenda';
import { Alerts } from './pages/Alerts';
import { Portal } from './pages/Portal';
import { Inventory } from './pages/Inventory';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected App */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientProfile />} />
            <Route path="/patients/:id/vaccinations" element={<Vaccination />} />
            <Route path="/patients/:id/consultation" element={<Consultation />} />
            <Route path="/patients/:id/prescription" element={<Prescription />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/portal" element={<Portal />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
