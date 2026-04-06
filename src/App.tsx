import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/patients/:id/vaccinations" element={<Vaccination />} />
          <Route path="/patients/:id/consultation" element={<Consultation />} />
          <Route path="/patients/:id/prescription" element={<Prescription />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/portal" element={<Portal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
