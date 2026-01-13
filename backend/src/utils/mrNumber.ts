import prisma from '../config/database';
import { getCached, setCached } from '../config/redis';

/**
 * Generate MR Number in format: 001/26/I/P
 * Format breakdown:
 * - 001: Sequential number (3 digits)
 * - 26: Year (last 2 digits of current year)
 * - I: Patient type (I=Indoor/Inpatient, OP=Outpatient)
 * - P: Admission location (P=Private, W=Ward, N=Nursery, IC=ICU)
 */
export async function generateMRNumber(
  admissionType: 'EMERGENCY' | 'PLANNED' | 'OPD',
  admissionLocation: 'WARD' | 'PRIVATE_ROOM' | 'NURSERY' | 'ICU'
): Promise<string> {
  // Get current year (last 2 digits)
  const year = new Date().getFullYear().toString().slice(-2);
  
  // Determine patient type code
  const patientTypeCode = admissionType === 'OPD' ? 'OP' : 'I';
  
  // Determine location code
  const locationCode = getLocationCode(admissionLocation);
  
  // Get the sequential number for this year
  const cacheKey = `mr_number_seq_${year}`;
  let lastSequence = await getCached<number>(cacheKey);
  
  if (!lastSequence) {
    // Get the highest sequential number from database for current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    
    const lastPatient = await prisma.patient.findFirst({
      where: {
        admissionDate: {
          gte: startOfYear,
        },
      },
      orderBy: { admissionDate: 'desc' },
      select: { mrNumber: true },
    });
    
    if (lastPatient) {
      // Extract sequence from format: 001/26/I/P -> 001
      const parts = lastPatient.mrNumber.split('/');
      lastSequence = parseInt(parts[0]) || 0;
    } else {
      lastSequence = 0;
    }
  }
  
  // Increment sequence
  const newSequence = lastSequence + 1;
  
  // Update cache
  await setCached(cacheKey, newSequence, 86400 * 365); // Cache for 1 year
  
  // Format: 001/26/I/P
  const paddedSequence = newSequence.toString().padStart(3, '0');
  const mrNumber = `${paddedSequence}/${year}/${patientTypeCode}/${locationCode}`;
  
  return mrNumber;
}

/**
 * Convert admission location to MR code
 */
function getLocationCode(location: string): string {
  const codes: Record<string, string> = {
    WARD: 'W',
    PRIVATE_ROOM: 'P',
    NURSERY: 'N',
    ICU: 'IC',
  };
  return codes[location] || 'W';
}

/**
 * Parse MR Number to extract components
 */
export function parseMRNumber(mrNumber: string): {
  sequence: number;
  year: string;
  patientType: string;
  location: string;
} | null {
  const parts = mrNumber.split('/');
  if (parts.length !== 4) return null;
  
  return {
    sequence: parseInt(parts[0]),
    year: parts[1],
    patientType: parts[2],
    location: parts[3],
  };
}

/**
 * Format MR Number for display
 */
export function formatMRNumber(
  sequence: number,
  year: string,
  patientType: string,
  location: string
): string {
  const paddedSequence = sequence.toString().padStart(3, '0');
  return `${paddedSequence}/${year}/${patientType}/${location}`;
}
