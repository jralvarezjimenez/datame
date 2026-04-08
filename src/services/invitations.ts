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

export interface Invitation {
  id: string;
  patientId: string;
  patientName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  invitedBy: string;        // vet uid
  invitedByName: string;    // vet display name
  clinicName?: string;
  status: 'pending' | 'accepted' | 'expired';
  code: string;             // unique 6-char code
  createdAt?: Timestamp;
}

export type InvitationInput = Omit<Invitation, 'id' | 'createdAt'>;

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function createInvitation(data: Omit<InvitationInput, 'code' | 'status'>): Promise<Invitation> {
  const code = generateCode();
  const invitation: Omit<Invitation, 'id'> = {
    ...data,
    code,
    status: 'pending',
  };
  const ref = await addDoc(collection(db, 'invitations'), { ...invitation, createdAt: serverTimestamp() });
  return { id: ref.id, ...invitation };
}

export async function getInvitationByCode(code: string): Promise<Invitation | null> {
  const q = query(collection(db, 'invitations'), where('code', '==', code.toUpperCase()), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Invitation;
}

export async function acceptInvitation(invitationId: string, ownerUid: string): Promise<void> {
  // Mark invitation as accepted
  await updateDoc(doc(db, 'invitations', invitationId), { status: 'accepted' });

  // Get the invitation to find the patient
  const invSnap = await getDoc(doc(db, 'invitations', invitationId));
  if (!invSnap.exists()) return;
  const inv = invSnap.data();

  // Update the patient's ownerId to the new owner
  await updateDoc(doc(db, 'patients', inv.patientId), { ownerId: ownerUid });
}

export async function getInvitationsForPatient(patientId: string): Promise<Invitation[]> {
  const q = query(collection(db, 'invitations'), where('patientId', '==', patientId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Invitation);
}

// Generate share links
const APP_URL = 'https://gen-lang-client-0300464282.web.app';

export function generateWhatsAppInvite(invitation: Invitation, ownerName?: string): string {
  const message = [
    `Hola${ownerName ? ` ${ownerName}` : ''},`,
    ``,
    `El Dr(a). ${invitation.invitedByName} te invita a DATA ME para que puedas ver la historia clínica de *${invitation.patientName}*.`,
    ``,
    `Tu código de acceso es: *${invitation.code}*`,
    ``,
    `Entra aquí: ${APP_URL}/invite/${invitation.code}`,
    ``,
    `— DATA ME`,
  ].join('\n');

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function generateEmailInvite(invitation: Invitation): { subject: string; body: string } {
  return {
    subject: `DATA ME - Acceso a la historia clínica de ${invitation.patientName}`,
    body: [
      `El Dr(a). ${invitation.invitedByName} te invita a DATA ME para que puedas ver la historia clínica de ${invitation.patientName}.`,
      ``,
      `Tu código de acceso es: ${invitation.code}`,
      ``,
      `Entra aquí: ${APP_URL}/invite/${invitation.code}`,
      ``,
      `— DATA ME`,
    ].join('\n'),
  };
}
