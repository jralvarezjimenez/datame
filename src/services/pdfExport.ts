import { jsPDF } from 'jspdf';
import type { Patient } from './patients';
import type { Consultation, Vaccination, Prescription } from './clinical';

const MARGIN = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function addHeader(doc: jsPDF, patient: Patient) {
  // Logo area
  doc.setFillColor(255, 107, 107); // coral primary
  doc.roundedRect(MARGIN, 10, 12, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DM', MARGIN + 6, 18, { align: 'center' });

  // Title
  doc.setTextColor(45, 35, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA ME — Historia Clínica Veterinaria', MARGIN + 16, 18);

  doc.setFontSize(7);
  doc.setTextColor(120, 110, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento generado conforme a Ley 576/2000 (Colombia) — Formato SOAP', MARGIN + 16, 23);

  // Divider
  doc.setDrawColor(222, 208, 196);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 27, PAGE_WIDTH - MARGIN, 27);

  // Patient info box
  doc.setFillColor(255, 245, 239); // warm cream
  doc.roundedRect(MARGIN, 30, CONTENT_WIDTH, 28, 3, 3, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(45, 35, 25);
  doc.text(patient.name, MARGIN + 6, 40);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(92, 79, 66);

  const info = [
    `Especie: ${patient.species}`,
    `Raza: ${patient.breed}`,
    `Edad: ${patient.age} ${patient.age === 1 ? 'año' : 'años'}`,
    patient.weight ? `Peso: ${patient.weight} kg` : '',
    `Sexo: ${patient.sex === 'male' ? 'Macho' : patient.sex === 'female' ? 'Hembra' : 'N/D'}`,
    patient.neutered ? 'Esterilizado: Sí' : '',
    patient.microchip ? `Microchip: ${patient.microchip}` : '',
  ].filter(Boolean);

  const col1 = info.slice(0, 4);
  const col2 = info.slice(4);

  col1.forEach((line, i) => doc.text(line, MARGIN + 6, 47 + i * 4));
  col2.forEach((line, i) => doc.text(line, MARGIN + CONTENT_WIDTH / 2, 47 + i * 4));

  doc.text(`Propietario: ${patient.ownerName}`, MARGIN + 6, 47 + Math.max(col1.length, col2.length) * 4);

  return 62; // Y position after header
}

function addPageFooter(doc: jsPDF, pageNum: number) {
  const y = 285;
  doc.setDrawColor(222, 208, 196);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  doc.setFontSize(7);
  doc.setTextColor(158, 142, 126);
  doc.setFont('helvetica', 'normal');
  doc.text(`DATA ME — Historia Clínica Veterinaria — Generado: ${new Date().toLocaleDateString('es-ES')}`, MARGIN, y + 4);
  doc.text(`Página ${pageNum}`, PAGE_WIDTH - MARGIN, y + 4, { align: 'right' });
}

function checkPageBreak(doc: jsPDF, y: number, needed: number, pageNum: { value: number }): number {
  if (y + needed > 275) {
    addPageFooter(doc, pageNum.value);
    doc.addPage();
    pageNum.value++;
    return 15;
  }
  return y;
}

function addSOAPSection(doc: jsPDF, y: number, letter: string, title: string, content: string, r: number, g: number, b: number): number {
  if (!content) return y;

  // Letter badge
  doc.setFillColor(r, g, b);
  doc.roundedRect(MARGIN, y, 8, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(letter, MARGIN + 4, y + 5.5, { align: 'center' });

  // Title
  doc.setTextColor(45, 35, 25);
  doc.setFontSize(9);
  doc.text(title, MARGIN + 11, y + 5.5);

  // Content
  doc.setTextColor(92, 79, 66);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(content, CONTENT_WIDTH - 12);
  doc.text(lines, MARGIN + 11, y + 12);

  return y + 14 + lines.length * 3.5;
}

export function generatePatientPDF(
  patient: Patient,
  consultations: Consultation[],
  vaccinations: Vaccination[],
  prescriptions: Prescription[],
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageNum = { value: 1 };

  let y = addHeader(doc, patient);

  // Consultations (SOAP)
  if (consultations.length > 0) {
    y = checkPageBreak(doc, y, 15, pageNum);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 107);
    doc.text('CONSULTAS — FORMATO SOAP', MARGIN, y + 4);
    doc.setDrawColor(255, 107, 107);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 6, PAGE_WIDTH - MARGIN, y + 6);
    y += 12;

    consultations.forEach((c) => {
      y = checkPageBreak(doc, y, 50, pageNum);

      // Consultation header
      doc.setFillColor(255, 240, 232);
      doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 10, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 35, 25);
      doc.text(`${c.date} — ${c.reason}`, MARGIN + 4, y + 6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(92, 79, 66);
      doc.text(`Dr(a). ${c.vetName}`, PAGE_WIDTH - MARGIN - 4, y + 6.5, { align: 'right' });
      y += 14;

      // Vitals
      if (c.vitals) {
        const vitalsArr = [
          c.vitals.weight ? `Peso: ${c.vitals.weight}kg` : '',
          c.vitals.temperature ? `Temp: ${c.vitals.temperature}°C` : '',
          c.vitals.heartRate ? `FC: ${c.vitals.heartRate}lpm` : '',
          c.vitals.respiratoryRate ? `FR: ${c.vitals.respiratoryRate}rpm` : '',
          c.vitals.mucousMembranes ? `Mucosas: ${c.vitals.mucousMembranes}` : '',
          c.vitals.capillaryRefillTime ? `TRC: ${c.vitals.capillaryRefillTime}s` : '',
          c.vitals.bodyCondition ? `CC: ${c.vitals.bodyCondition}/9` : '',
          c.vitals.hydration ? `Hidratación: ${c.vitals.hydration}` : '',
        ].filter(Boolean).join('  •  ');

        if (vitalsArr) {
          doc.setFontSize(7);
          doc.setTextColor(158, 142, 126);
          doc.text(`Signos Vitales: ${vitalsArr}`, MARGIN + 4, y);
          y += 5;
        }
      }

      // SOAP fields
      y = addSOAPSection(doc, y, 'S', 'Subjetivo', c.subjective, 255, 107, 107);
      y = addSOAPSection(doc, y, 'O', 'Objetivo', c.objective, 81, 207, 102);
      y = addSOAPSection(doc, y, 'A', 'Análisis', c.assessment || c.diagnosis, 132, 94, 247);
      y = addSOAPSection(doc, y, 'P', 'Plan', c.plan || c.treatment, 255, 107, 107);

      if (c.notes) {
        doc.setFontSize(7);
        doc.setTextColor(158, 142, 126);
        doc.text(`Notas: ${c.notes}`, MARGIN + 4, y);
        y += 5;
      }

      y += 6;
    });
  }

  // Vaccinations
  if (vaccinations.length > 0) {
    y = checkPageBreak(doc, y, 20, pageNum);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(81, 207, 102);
    doc.text('VACUNACIONES', MARGIN, y + 4);
    doc.setDrawColor(81, 207, 102);
    doc.line(MARGIN, y + 6, PAGE_WIDTH - MARGIN, y + 6);
    y += 12;

    // Table header
    doc.setFillColor(212, 245, 218);
    doc.rect(MARGIN, y, CONTENT_WIDTH, 7, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 94, 40);
    doc.text('Vacuna', MARGIN + 3, y + 5);
    doc.text('Aplicación', MARGIN + 60, y + 5);
    doc.text('Próxima', MARGIN + 95, y + 5);
    doc.text('Veterinario', MARGIN + 130, y + 5);
    doc.text('Estado', MARGIN + 155, y + 5);
    y += 9;

    vaccinations.forEach((v) => {
      y = checkPageBreak(doc, y, 7, pageNum);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(92, 79, 66);
      doc.setFontSize(7);
      doc.text(v.vaccine, MARGIN + 3, y + 4);
      doc.text(v.dateAdministered, MARGIN + 60, y + 4);
      doc.text(v.nextDueDate, MARGIN + 95, y + 4);
      doc.text(v.vetName, MARGIN + 130, y + 4);

      const statusColor = { valid: [34, 197, 94], due_soon: [245, 158, 11], overdue: [239, 68, 68] };
      const statusText = { valid: 'Vigente', due_soon: 'Próxima', overdue: 'Vencida' };
      const sc = statusColor[v.status] || [150, 150, 150];
      doc.setTextColor(sc[0], sc[1], sc[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(statusText[v.status] || v.status, MARGIN + 155, y + 4);
      y += 6;
    });
    y += 6;
  }

  // Prescriptions
  if (prescriptions.length > 0) {
    y = checkPageBreak(doc, y, 20, pageNum);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(132, 94, 247);
    doc.text('RECETAS', MARGIN, y + 4);
    doc.setDrawColor(132, 94, 247);
    doc.line(MARGIN, y + 6, PAGE_WIDTH - MARGIN, y + 6);
    y += 12;

    prescriptions.forEach((p) => {
      y = checkPageBreak(doc, y, 12, pageNum);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 35, 25);
      doc.setFontSize(8);
      doc.text(p.medication, MARGIN + 3, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(92, 79, 66);
      doc.setFontSize(7);
      doc.text(`${p.dosage} — ${p.frequency} | ${p.startDate} → ${p.endDate} | Dr(a). ${p.vetName}`, MARGIN + 3, y + 9);

      const isActive = p.status === 'active';
      doc.setTextColor(isActive ? 255 : 150, isActive ? 107 : 150, isActive ? 107 : 150);
      doc.setFont('helvetica', 'bold');
      doc.text(isActive ? 'ACTIVA' : 'COMPLETADA', PAGE_WIDTH - MARGIN - 3, y + 4, { align: 'right' });
      y += 13;
    });
  }

  addPageFooter(doc, pageNum.value);

  // Save
  const filename = `HC_${patient.name}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
