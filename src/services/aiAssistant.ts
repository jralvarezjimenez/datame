import { GoogleGenAI } from '@google/genai';

const GEMINI_KEY = typeof process !== 'undefined' && process.env?.GEMINI_API_KEY
  ? process.env.GEMINI_API_KEY
  : '';

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!GEMINI_KEY || GEMINI_KEY === 'MY_GEMINI_API_KEY') return null;
  if (!ai) ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
  return ai;
}

export function isAIAvailable(): boolean {
  return getAI() !== null;
}

const SYSTEM_PROMPT = `Eres un asistente veterinario clínico experto. Tu rol es ayudar al veterinario a completar historias clínicas en formato SOAP.

REGLAS IMPORTANTES:
- Responde SOLO en español
- Sé conciso y clínico, usa terminología veterinaria apropiada
- NO hagas diagnósticos definitivos, siempre sugiere "diferenciales a considerar"
- Incluye siempre la recomendación de confirmar con exámenes complementarios cuando aplique
- Formato de respuesta: texto plano, sin markdown

Contexto: Clínica veterinaria en Colombia/LATAM.`;

/**
 * Given quick notes from the vet, generate a complete SOAP record.
 */
export async function generateSOAP(input: {
  species: string;
  breed: string;
  age: number;
  weight?: number;
  quickNotes: string;
}): Promise<{ subjective: string; objective: string; assessment: string; plan: string } | null> {
  const client = getAI();
  if (!client) return null;

  const prompt = `El veterinario ingresó estas notas rápidas sobre un paciente:

Especie: ${input.species}
Raza: ${input.breed}
Edad: ${input.age} años
${input.weight ? `Peso: ${input.weight} kg` : ''}

Notas del veterinario: "${input.quickNotes}"

Genera una historia clínica SOAP completa basada en estas notas. Responde EXACTAMENTE en este formato JSON (sin bloques de código):
{"subjective":"...","objective":"...","assessment":"...","plan":"..."}

- Subjective: Lo que el propietario reporta (expande las notas del vet en narrativa del propietario)
- Objective: Hallazgos del examen físico sugeridos según los síntomas
- Assessment: Diagnóstico presuntivo y 2-3 diagnósticos diferenciales
- Plan: Tratamiento sugerido, medicamentos con dosis estimadas, y seguimiento`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    });

    const text = response.text?.trim() || '';
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      subjective: parsed.subjective || '',
      objective: parsed.objective || '',
      assessment: parsed.assessment || '',
      plan: parsed.plan || '',
    };
  } catch (err) {
    console.error('AI generation error:', err);
    return null;
  }
}

/**
 * Suggest differential diagnoses based on symptoms.
 */
export async function suggestDiagnosis(input: {
  species: string;
  symptoms: string;
}): Promise<string | null> {
  const client = getAI();
  if (!client) return null;

  const prompt = `Especie: ${input.species}
Síntomas: ${input.symptoms}

Lista 3-5 diagnósticos diferenciales más probables para estos síntomas. Para cada uno incluye:
- Nombre del diagnóstico
- Probabilidad relativa (alta/media/baja)
- Examen confirmatorio recomendado

Responde en texto plano, sin markdown.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });
    return response.text?.trim() || null;
  } catch (err) {
    console.error('AI diagnosis error:', err);
    return null;
  }
}
