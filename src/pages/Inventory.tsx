import { useState, useEffect, type FormEvent } from 'react';
import { Package, Plus, X, AlertTriangle, Search, Trash2, Edit3, Check } from 'lucide-react';
import { getAllItems, addItem, updateItem, deleteItem, getLowStockItems, getExpiringSoon, type InventoryItem, type InventoryInput } from '../services/inventory';

const categoryLabel: Record<string, string> = { medication: 'Medicamento', vaccine: 'Vacuna', supply: 'Insumo', equipment: 'Equipo' };
const categoryColor: Record<string, string> = {
  medication: 'bg-primary/10 text-primary',
  vaccine: 'bg-secondary/10 text-secondary',
  supply: 'bg-tertiary/10 text-tertiary',
  equipment: 'bg-on-surface-variant/10 text-on-surface-variant',
};

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try { setItems(await getAllItems()); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const lowStock = getLowStockItems(items);
  const expiring = getExpiringSoon(items);

  const filtered = items.filter((i) => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.supplier || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || i.category === catFilter;
    return matchSearch && matchCat;
  });

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este item del inventario?')) return;
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function openEdit(item: InventoryItem) {
    setEditItem(item);
    setShowForm(true);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface">Inventario</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {loading ? 'Cargando...' : `${items.length} items • ${lowStock.length} stock bajo`}
          </p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl font-bold text-sm clay-shadow-coral active:scale-95 transition-transform">
          <Plus className="w-5 h-5" /> Agregar Item
        </button>
      </div>

      {/* Alerts */}
      {!loading && (lowStock.length > 0 || expiring.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStock.length > 0 && (
            <div className="bg-error-container/20 border border-error/20 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-on-surface">Stock Bajo ({lowStock.length})</p>
                <p className="text-xs text-on-surface-variant mt-1">{lowStock.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}</p>
              </div>
            </div>
          )}
          {expiring.length > 0 && (
            <div className="bg-tertiary-container/20 border border-tertiary/20 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-on-surface">Por Vencer ({expiring.length})</p>
                <p className="text-xs text-on-surface-variant mt-1">{expiring.map((i) => `${i.name} (${i.expirationDate})`).join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o proveedor..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest rounded-2xl clay-shadow text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="bg-surface-container-lowest rounded-2xl px-4 py-2.5 clay-shadow text-sm outline-none focus:ring-2 focus:ring-primary border-none cursor-pointer">
          <option value="">Todas las categorías</option>
          <option value="medication">Medicamentos</option>
          <option value="vaccine">Vacunas</option>
          <option value="supply">Insumos</option>
          <option value="equipment">Equipos</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-16 text-center clay-shadow">
          <Package className="w-16 h-16 text-outline-variant mx-auto mb-4" />
          <h3 className="font-bold text-lg text-on-surface mb-1">{items.length === 0 ? 'Inventario vacío' : 'Sin resultados'}</h3>
          {items.length === 0 && (
            <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-2xl font-semibold text-sm mt-4 clay-shadow-coral">Agregar Primer Item</button>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl clay-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Vencimiento</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Costo</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((item) => {
                  const isLow = item.quantity <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-on-surface">{item.name}</p>
                        {item.supplier && <p className="text-xs text-on-surface-variant">{item.supplier}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${categoryColor[item.category]}`}>
                          {categoryLabel[item.category].toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${isLow ? 'text-error' : 'text-on-surface'}`}>
                          {item.quantity} {item.unit}
                        </span>
                        {isLow && <span className="text-[10px] text-error font-bold ml-2">BAJO</span>}
                        <p className="text-[10px] text-on-surface-variant">Mín: {item.minStock}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{item.expirationDate || '—'}</td>
                      <td className="px-6 py-4 text-sm text-on-surface font-medium">{item.cost ? `$${item.cost.toLocaleString()}` : '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => openEdit(item)} className="p-2 rounded-xl hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-surface-container-low">
            <p className="text-xs text-on-surface-variant">{filtered.length} de {items.length} items</p>
          </div>
        </div>
      )}

      {showForm && (
        <InventoryForm
          existing={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); loadData(); }}
        />
      )}
    </div>
  );
}

function InventoryForm({ existing, onClose, onSaved }: {
  existing: InventoryItem | null; onClose: () => void; onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<InventoryInput>({
    name: existing?.name || '',
    category: existing?.category || 'medication',
    quantity: existing?.quantity ?? 0,
    unit: existing?.unit || 'unidades',
    minStock: existing?.minStock ?? 5,
    cost: existing?.cost,
    supplier: existing?.supplier || '',
    expirationDate: existing?.expirationDate || '',
    notes: existing?.notes || '',
  });

  const set = (k: keyof InventoryInput, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      if (existing) await updateItem(existing.id, form);
      else await addItem(form);
      onSaved();
    } catch (err) { console.error(err); setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto clay-shadow" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/15">
          <h2 className="font-headline font-bold text-xl text-on-surface">{existing ? 'Editar Item' : 'Nuevo Item'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-xl"><X className="w-5 h-5 text-on-surface-variant" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Nombre *</label>
            <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Amoxicilina 500mg"
              className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Categoría</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none cursor-pointer">
                <option value="medication">Medicamento</option>
                <option value="vaccine">Vacuna</option>
                <option value="supply">Insumo</option>
                <option value="equipment">Equipo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Unidad</label>
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)}
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none cursor-pointer">
                <option>unidades</option>
                <option>tabletas</option>
                <option>dosis</option>
                <option>ml</option>
                <option>frascos</option>
                <option>cajas</option>
                <option>pares</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Cantidad</label>
              <input type="number" min={0} value={form.quantity || ''} onChange={(e) => set('quantity', Number(e.target.value))}
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Stock mínimo</label>
              <input type="number" min={0} value={form.minStock || ''} onChange={(e) => set('minStock', Number(e.target.value))}
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Costo/u</label>
              <input type="number" min={0} step={100} value={form.cost || ''} onChange={(e) => set('cost', Number(e.target.value))} placeholder="$"
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Proveedor</label>
              <input type="text" value={form.supplier} onChange={(e) => set('supplier', e.target.value)} placeholder="Opcional"
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Vencimiento</label>
              <input type="date" value={form.expirationDate} onChange={(e) => set('expirationDate', e.target.value)}
                className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary border-none" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-2xl clay-shadow-coral active:scale-[0.98] disabled:opacity-50 transition-transform">
            {saving ? 'Guardando...' : existing ? 'Actualizar Item' : 'Agregar al Inventario'}
          </button>
        </form>
      </div>
    </div>
  );
}
