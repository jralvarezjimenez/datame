import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight?: number;
  sex?: 'male' | 'female';
  neutered?: boolean;
  microchip?: string;
  imageUrl?: string;
  ownerId: string;
  ownerName: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type PatientInput = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

const patientsRef = collection(db, 'patients');

export async function createPatient(data: PatientInput): Promise<string> {
  const docRef = await addDoc(patientsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getPatient(id: string): Promise<Patient | null> {
  const snap = await getDoc(doc(db, 'patients', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Patient;
}

export async function getAllPatients(): Promise<Patient[]> {
  const q = query(patientsRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Patient);
}

export async function getPatientsByOwner(ownerId: string): Promise<Patient[]> {
  const q = query(patientsRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Patient);
}

export async function updatePatient(id: string, data: Partial<PatientInput>): Promise<void> {
  await updateDoc(doc(db, 'patients', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePatient(id: string): Promise<void> {
  await deleteDoc(doc(db, 'patients', id));
}
