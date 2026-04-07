import { useState, useEffect, type FormEvent } from 'react';
import { Building2, Plus, X, Check, Users, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getClinicsByOwner, createClinic, updateClinic, type Clinic, type ClinicInput } from '../services/clinics';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function Settings() {
  const { user } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editClinic, setEditClinic] = useState<Clinic | null>(null);

  useEffect(() => { if (user) loadClinics(); }, [user]);

  async function loadClinics() {
    setLoading(true);
    try { setClinics(await getClinicsByOwner(user!.uid)); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function selectClinic(clinicId: string) {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { clinicId });
    window.location.reload();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-headline text-on-surface">Ajustes</h1>
        <p className="text-sm text-on-surface-variant mt-1">Gestiona tu perfil y clínicas</p>
      </div>

      {/* Profile Section */}
      <section className="bg-surface-container-lowest rounded-3xl clay-shadow p-6">
        <h2 className="font-headline font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Mi Perfil
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
            {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <span className="text-2xl font-bold">{user?.displayName?.charAt(0)}</span>}
          </div>
          <div>
            <p className="font-bold text-on-surface text-lg">{user?.displayName}</p>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary mt-1 inline-block">
              {user?.role === 'veterinarian' ? 'VETERINARIO' : user?.role === 'staff' ? 'STAFF' : 'PROPIETARIO'}
            </span>
          </div>
        </div>
      </section>

      {/* Clinics Section */}
      <section className="bg-surface-container-lowest rounded-3xl clay-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
            <Building2 className="w-5 h-5 text-tertiary" /> Mis Clínicas
          </h2>
          <button onClick={() => { setEditClinic(null); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-2xl font-bold text-sm clay-shadow-coral active:scale-95 transition-transform">
            <Plus className="w-4 h-4" /> Nueva Clínica
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
        ) : clinics.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-outline-variant mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No tienes clínicas registradas</p>
            <p className="text-xs text-on-surface-variant mt-1">Crea tu primera clínica para organizar tu trabajo</p>
            <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-2xl font-semibold text-sm mt-4 clay-shadow-coral">Crear Clínica</button>
          </div>
        ) : (
          <div className="space-y-3">
            {clinics.map((clinic) => {
              const isActive = user?.clinicId === clinic.id;
              return (
                <div key={clinic.id} className={`p-5 rounded-2xl border-2 transition-all ${isActive ? 'border-primary bg-primary/5' : 'border-outline-variant/15 hover:border-primary/30'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-on-surface">{clinic.name}</h3>
                        {isActive && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary text-on-primary">ACTIVA</span>}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-on-surface-variant">
                        {clinic.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {clinic.address}</span>}
                        {clinic.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {clinic.phone}</span>}
                        {clinic.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {clinic.email}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditClinic(clinic); setShowForm(true); }} className="text-xs font-bold text-primary hover:underline">Editar</button>
                      {!isActive && (
                        <button onClick={() => selectClinic(clinic.id)} className="flex items-center gap-1 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-xl hover:bg-secondary/20 transition-colors">
                          <Check className="w-3 h-3" /> Activar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showForm && (
        <ClinicForm
          existing={editClinic}
          userId={user!.uid}
          onClose={() => { setShowForm(false); setEditClinic(null); }}
          onSaved={() => { setShowForm(false); setEditClinic(null); loadClinics(); }}
        />
      )}
    </div>
  );
}

function ClinicForm({ existing, userId, onClose, onSaved }: {
  existing: Clinic | null; userId: string; onClose: () => void; onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ClinicInput>({
    name: existing?.name || '',
    address: existing?.address || '',
    phone: existing?.phone || '',
    email: existing?.email || '',
    ownerId: userId,
  });
  const set = (k: keyof ClinicInput, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      if (existing) await updateClinic(existing.id, form);
      else await createClinic(form);
      onSaved();
    } catch (err) { console.error(err); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-md clay-shadow" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <h2 className="font-headline font-bold text-xl text-on-surface">{existing ? 'Editar Clínica' : 'Nueva Clínica'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-xl"><X className="w-5 h-5 text-on-surface-variant" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Nombre de la clínica *</label>
            <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Clínica Veterinaria Central"
              className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Dirección</label>
            <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Calle, ciudad"
              className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Teléfono</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+57..."
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contacto@..."
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-2xl clay-shadow-coral active:scale-[0.98] disabled:opacity-50 transition-transform">
            {saving ? 'Guardando...' : existing ? 'Actualizar' : 'Crear Clínica'}
          </button>
        </form>
      </div>
    </div>
  );
}
