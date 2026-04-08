import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, HeartPulse, Syringe, Stethoscope, FileText, Bone, PawPrint, Download } from 'lucide-react';
import { getPatient, type Patient } from '../services/patients';
import { getConsultations, getVaccinations, getPrescriptions } from '../services/clinical';
import { generatePatientPDF } from '../services/pdfExport';

export function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPatient(id).then((p) => {
      setPatient(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function handleExportPDF() {
    if (!patient || !id) return;
    setExporting(true);
    try {
      const [consultations, vaccinations, prescriptions] = await Promise.all([
        getConsultations(id),
        getVaccinations(id),
        getPrescriptions(id),
      ]);
      generatePatientPDF(patient, consultations, vaccinations, prescriptions);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <PawPrint className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="font-headline font-bold text-lg text-slate-600 mb-1">Paciente no encontrado</h3>
        <Link to="/patients" className="text-primary font-bold text-sm hover:underline mt-4">Volver a Pacientes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Link to="/patients" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a Pacientes
        </Link>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl font-bold text-sm clay-shadow-coral active:scale-95 transition-transform disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Generando...' : 'Exportar PDF'}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-container to-secondary-container relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl border-4 border-surface-container-lowest bg-white overflow-hidden shadow-md flex items-center justify-center">
            {patient.imageUrl ? (
              <img src={patient.imageUrl} alt={patient.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-primary">{patient.name.charAt(0)}</span>
            )}
          </div>
          <div className="absolute bottom-4 right-6 flex gap-3">
            <span className={`text-[10px] font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${
              patient.status === 'active'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${patient.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
              {patient.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
            </span>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Info */}
          <div className="col-span-1 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold font-headline text-teal-900 mb-1">{patient.name}</h1>
              <p className="text-sm font-medium text-slate-500">
                {patient.breed} {patient.sex === 'male' ? '• Macho' : patient.sex === 'female' ? '• Hembra' : ''}
                {patient.neutered ? ' (Esterilizado)' : ''}
              </p>
            </div>

            <div className="space-y-4">
              <InfoRow label="Especie" value={patient.species} />
              <InfoRow label="Edad" value={`${patient.age} ${patient.age === 1 ? 'año' : 'años'}`} />
              {patient.weight && <InfoRow label="Peso" value={`${patient.weight} kg`} />}
              {patient.microchip && <InfoRow label="Microchip" value={patient.microchip} />}
              <InfoRow label="Propietario" value={patient.ownerName} />
            </div>
          </div>

          {/* Vitals placeholder */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <VitalCard icon={HeartPulse} label="Frec. Cardíaca" value="--" unit="lpm" color="text-error" note="Sin registro" />
            <VitalCard icon={Syringe} label="Vacunas" value="--" unit="" color="text-secondary" note="Ver registros" />
            <VitalCard icon={Stethoscope} label="Consultas" value="--" unit="" color="text-primary" note="Ver historial" />
            <VitalCard icon={FileText} label="Recetas" value="--" unit="" color="text-tertiary" note="Ver activas" />
          </div>
        </div>
      </div>

      {/* Notes */}
      {patient.notes && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 p-6">
          <h3 className="font-bold text-slate-800 mb-2">Notas</h3>
          <p className="text-sm text-slate-600">{patient.notes}</p>
        </div>
      )}

      {/* Main CTA - Historia Clínica */}
      <Link
        to={`/patients/${id}/consultation`}
        className="block bg-gradient-to-r from-primary to-[#FF8E8E] p-6 rounded-3xl clay-shadow-coral hover:scale-[1.01] transition-transform"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-headline font-bold text-xl text-white">Historia Clínica SOAP</h3>
            <p className="text-white/80 text-sm">Registrar nueva consulta o ver historial médico</p>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-2xl">
            <span className="text-white font-bold text-sm">Abrir →</span>
          </div>
        </div>
      </Link>

      {/* Other Clinical Actions */}
      <h2 className="text-xl font-bold font-headline text-teal-900 pt-2">Otros Registros</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ClinicalCard to={`/patients/${id}/vaccinations`} icon={Syringe} title="Vacunaciones" desc="Registrar inmunizaciones" color="secondary" />
        <ClinicalCard to={`/patients/${id}/prescription`} icon={FileText} title="Recetas" desc="Gestionar medicamentos" color="tertiary" />
        <div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/15 transition-all flex flex-col items-center text-center gap-4 opacity-50">
          <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center">
            <Bone className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">Lab (Próximamente)</h3>
            <p className="text-xs text-slate-500">Análisis y diagnósticos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function VitalCard({ icon: Icon, label, value, unit, color, note }: {
  icon: typeof HeartPulse; label: string; value: string; unit: string; color: string; note: string;
}) {
  return (
    <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between border border-transparent hover:border-outline-variant/20 transition-colors">
      <div className={`flex items-center gap-2 ${color} mb-2`}>
        <Icon className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-800">{value} <span className="text-sm font-medium text-slate-500">{unit}</span></p>
        <p className="text-[10px] text-slate-400 mt-1">{note}</p>
      </div>
    </div>
  );
}

function ClinicalCard({ to, icon: Icon, title, desc, color }: {
  to: string; icon: typeof Stethoscope; title: string; desc: string; color: string;
}) {
  return (
    <Link to={to} className={`group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/15 hover:border-${color}/30 transition-all flex flex-col items-center text-center gap-4`}>
      <div className={`w-16 h-16 rounded-full bg-${color}/10 text-${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </Link>
  );
}
