import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'medication' | 'vaccine' | 'supply' | 'equipment';
  quantity: number;
  unit: string;             // tabletas, ml, dosis, unidades
  minStock: number;         // alert threshold
  cost?: number;            // cost per unit
  supplier?: string;
  expirationDate?: string;  // YYYY-MM-DD
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type InventoryInput = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;

const inventoryRef = collection(db, 'inventory');

export async function addItem(data: InventoryInput): Promise<string> {
  const ref = await addDoc(inventoryRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function getItem(id: string): Promise<InventoryItem | null> {
  const snap = await getDoc(doc(db, 'inventory', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as InventoryItem;
}

export async function getAllItems(): Promise<InventoryItem[]> {
  const q = query(inventoryRef, orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InventoryItem);
}

export async function updateItem(id: string, data: Partial<InventoryInput>): Promise<void> {
  await updateDoc(doc(db, 'inventory', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'inventory', id));
}

export function getLowStockItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter((i) => i.quantity <= i.minStock);
}

export function getExpiringSoon(items: InventoryItem[], daysAhead = 30): InventoryItem[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + daysAhead);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  return items.filter((i) => i.expirationDate && i.expirationDate <= cutoffStr);
}
