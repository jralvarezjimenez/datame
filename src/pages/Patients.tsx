import { useState, useEffect, type FormEvent } from 'react';
import { Search, Plus, X, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllPatients, getPatientsByOwner, createPatient, type Patient, type PatientInput } from '../services/patients';

export function Patients() {
  const { user, isVetOrStaff } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [user]);

  async function loadPatients() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getPatientsByOwner(user.uid);
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = patients.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.breed.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = !speciesFilter || p.species.toLowerCase() === speciesFilter.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  const speciesList = [...new Set(patients.map((p) => p.species))];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/15">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, propietario o raza..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary text-sm font-body outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-headline font-semibold text-sm transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Paciente</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider">Filtros</span>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="bg-surface-container-high border-none rounded-full px-4 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="">Especie: Todas</option>
            {speciesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {(search || speciesFilter) && (
            <button
              onClick={() => { setSearch(''); setSpeciesFilter(''); }}
              className="text-primary text-xs font-bold hover:underline px-2"
            >
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PawPrint className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="font-headline font-bold text-lg text-slate-600 mb-1">
              {patients.length === 0 ? 'Sin pacientes registrados' : 'Sin resultados'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {patients.length === 0
                ? 'Registra tu primer paciente para comenzar'
                : 'Intenta con otros términos de búsqueda'}
            </p>
            {patients.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold text-sm"
              >
                Registrar Paciente
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Mascota</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Especie / Raza</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Edad</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Propietario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 overflow-hidden shadow-sm flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
                          {patient.imageUrl ? (
                            <img src={patient.imageUrl} alt={patient.name} className="w-full h-full object-cover" />
                          ) : (
                            patient.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-headline font-bold text-teal-900">{patient.name}</p>
                          {patient.sex && (
                            <p className="text-[11px] font-medium text-slate-500">
                              {patient.sex === 'male' ? 'Macho' : 'Hembra'}
                              {patient.neutered ? ' (Esterilizado)' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-0.5 bg-secondary-container/20 text-on-secondary-container rounded text-[10px] font-bold uppercase mb-1 inline-block">
                        {patient.species}
                      </span>
                      <br />
                      <span className="text-sm font-medium text-slate-700">{patient.breed}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                      {patient.age} {patient.age === 1 ? 'año' : 'años'}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700 font-semibold">{patient.ownerName}</td>
                    <td className="px-6 py-5">
                      {patient.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          ACTIVO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-slate-500 text-[10px] font-black rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          INACTIVO
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          to={`/patients/${patient.id}/consultation`}
                          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-95"
                        >
                          + Historia Clínica
                        </Link>
                        <Link
                          to={`/patients/${patient.id}`}
                          className="bg-surface-container-high text-on-surface-variant px-3 py-2 rounded-lg text-xs font-bold transition-all inline-block hover:bg-surface-container-highest"
                        >
                          Perfil
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-6 py-4 bg-surface-container-low">
            <p className="text-xs text-slate-500 font-medium">
              Mostrando <span className="text-slate-900">{filtered.length}</span> de{' '}
              <span className="text-slate-900">{patients.length}</span> pacientes
            </p>
          </div>
        )}
      </div>

      {/* Create Patient Modal */}
      {showModal && (
        <CreatePatientModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); loadPatients(); }}
        />
      )}
    </div>
  );
}

function CreatePatientModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PatientInput>({
    name: '',
    species: 'Perro',
    breed: '',
    age: 0,
    weight: undefined,
    sex: 'male',
    neutered: false,
    microchip: '',
    imageUrl: '',
    ownerId: user?.uid || '',
    ownerName: user?.displayName || '',
    status: 'active',
    notes: '',
  });

  const set = (field: keyof PatientInput, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.species || !form.breed) return;
    setSaving(true);
    try {
      await createPatient(form);
      onCreated();
    } catch (err) {
      console.error('Error creating patient:', err);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-headline font-bold text-xl text-teal-900">Nuevo Paciente</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre de la mascota *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej: Cooper"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
            />
          </div>

          {/* Species + Breed */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Especie *</label>
              <select
                value={form.species}
                onChange={(e) => set('species', e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary border-none cursor-pointer"
              >
                <option>Perro</option>
                <option>Gato</option>
                <option>Ave</option>
                <option>Reptil</option>
                <option>Equino</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Raza *</label>
              <input
                type="text"
                required
                value={form.breed}
                onChange={(e) => set('breed', e.target.value)}
                placeholder="Ej: Golden Retriever"
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
              />
            </div>
          </div>

          {/* Age + Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Edad (años)</label>
              <input
                type="number"
                min={0}
                value={form.age || ''}
                onChange={(e) => set('age', Number(e.target.value))}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Peso (kg)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.weight || ''}
                onChange={(e) => set('weight', Number(e.target.value))}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
              />
            </div>
          </div>

          {/* Sex + Neutered */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sexo</label>
              <select
                value={form.sex}
                onChange={(e) => set('sex', e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary border-none cursor-pointer"
              >
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.neutered}
                  onChange={(e) => set('neutered', e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm font-medium text-slate-700">Esterilizado</span>
              </label>
            </div>
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre del propietario</label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => set('ownerName', e.target.value)}
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
            />
          </div>

          {/* Microchip */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Microchip</label>
            <input
              type="text"
              value={form.microchip}
              onChange={(e) => set('microchip', e.target.value)}
              placeholder="Opcional"
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
              placeholder="Alergias, condiciones especiales, etc."
              className="w-full bg-surface-container-high rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Registrar Paciente'}
          </button>
        </form>
      </div>
    </div>
  );
}
