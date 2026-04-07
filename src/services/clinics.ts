import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  ownerId: string;       // user who created it
  createdAt?: Timestamp;
}

export type ClinicInput = Omit<Clinic, 'id' | 'createdAt'>;

const clinicsRef = collection(db, 'clinics');

export async function createClinic(data: ClinicInput): Promise<string> {
  const ref = await addDoc(clinicsRef, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getClinic(id: string): Promise<Clinic | null> {
  const snap = await getDoc(doc(db, 'clinics', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Clinic;
}

export async function getClinicsByOwner(ownerId: string): Promise<Clinic[]> {
  const q = query(clinicsRef, where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Clinic);
}

export async function updateClinic(id: string, data: Partial<ClinicInput>): Promise<void> {
  await updateDoc(doc(db, 'clinics', id), data);
}

/** Assign a user to a clinic */
export async function assignUserToClinic(userId: string, clinicId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { clinicId });
}
