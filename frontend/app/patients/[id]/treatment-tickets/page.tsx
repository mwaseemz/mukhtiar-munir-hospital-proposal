'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Pill, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const medicationAdminSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  route: z.enum(['IV', 'IM', 'ORAL', 'SC', 'TOPICAL', 'RECTAL', 'INHALATION']),
  dilution: z.string().optional(),
  frequency: z.enum(['STAT', 'OD', 'BD', 'TDS', 'QID', 'PRN', 'CONTINUOUS']),
  administeredAt: z.string().min(1, 'Administration time is required'),
  remarks: z.string().optional(),
});

type MedicationAdminData = z.infer<typeof medicationAdminSchema>;

export default function TreatmentTicketsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [checkDPN, setCheckDPN] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicationAdminData>({
    resolver: zodResolver(medicationAdminSchema),
    defaultValues: {
      route: 'IV',
      frequency: 'TDS',
      administeredAt: new Date().toISOString().slice(0, 16),
    },
  });

  // Check if morning DPN has been entered (blocking mechanism)
  const { data: dpnCheck } = useQuery({
    queryKey: ['dpn-check', patientId],
    queryFn: () => api.get(`/patients/${patientId}/dpn-check`).then((res) => res.data),
    enabled: checkDPN,
  });

  const mutation = useMutation({
    mutationFn: (data: MedicationAdminData) =>
      api.post(`/patients/${patientId}/medication-administration`, data),
    onSuccess: () => {
      alert('Medication administration recorded successfully!');
      reset({
        route: 'IV',
        frequency: 'TDS',
        administeredAt: new Date().toISOString().slice(0, 16),
      });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to record medication administration');
    },
  });

  const onSubmit = (data: MedicationAdminData) => {
    // Check blocking condition
    if (dpnCheck && !dpnCheck.morningDPNCompleted) {
      alert('⚠️ BLOCKED: Morning Daily Progress Notes (DPN) must be entered before administering medications!');
      return;
    }
    
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href={`/patients/${patientId}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patient Profile
          </Button>
        </Link>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Pill className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Treatment Tickets (Medication Administration)</h1>
              <p className="text-sm text-gray-600">Record medication and injection administration</p>
            </div>
          </div>

          {/* Blocking Alert */}
          {dpnCheck && !dpnCheck.morningDPNCompleted && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                <p className="text-sm font-bold text-red-800">
                  ⚠️ BLOCKED: Morning DPN not completed
                </p>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Morning Daily Progress Notes must be entered before administering medications. This is a mandatory check to ensure proper patient assessment.
              </p>
            </div>
          )}

          {dpnCheck && dpnCheck.morningDPNCompleted && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">
                  ✓ Morning DPN completed. You may administer medications.
                </p>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm font-medium text-yellow-800">
              📋 Important: Each medication administration MUST include signature, stamp, time, and date for PSC compliance
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Medication Name */}
            <div>
              <Label htmlFor="medicationName">Medication / Injection Name *</Label>
              <Input
                id="medicationName"
                {...register('medicationName')}
                placeholder="e.g., Paracetamol, Ceftriaxone"
              />
              {errors.medicationName && (
                <p className="text-red-500 text-sm mt-1">{errors.medicationName.message}</p>
              )}
            </div>

            {/* Dosage and Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  {...register('dosage')}
                  placeholder="e.g., 500mg, 1g, 2ml"
                />
                {errors.dosage && (
                  <p className="text-red-500 text-sm mt-1">{errors.dosage.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="route">Route of Administration *</Label>
                <select
                  id="route"
                  {...register('route')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="IV">IV (Intravenous)</option>
                  <option value="IM">IM (Intramuscular)</option>
                  <option value="ORAL">Oral</option>
                  <option value="SC">SC (Subcutaneous)</option>
                  <option value="TOPICAL">Topical</option>
                  <option value="RECTAL">Rectal</option>
                  <option value="INHALATION">Inhalation</option>
                </select>
              </div>
            </div>

            {/* Dilution */}
            <div>
              <Label htmlFor="dilution">Dilution (if applicable)</Label>
              <Input
                id="dilution"
                {...register('dilution')}
                placeholder="e.g., 100ml NS, 50ml D5W"
              />
              <p className="text-xs text-gray-500 mt-1">
                Specify diluent and volume for IV medications
              </p>
            </div>

            {/* Frequency and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <select
                  id="frequency"
                  {...register('frequency')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="STAT">STAT (Immediate)</option>
                  <option value="OD">OD (Once Daily)</option>
                  <option value="BD">BD (Twice Daily)</option>
                  <option value="TDS">TDS (Three Times Daily)</option>
                  <option value="QID">QID (Four Times Daily)</option>
                  <option value="PRN">PRN (As Needed)</option>
                  <option value="CONTINUOUS">Continuous</option>
                </select>
              </div>

              <div>
                <Label htmlFor="administeredAt">Administration Date & Time *</Label>
                <Input
                  id="administeredAt"
                  type="datetime-local"
                  {...register('administeredAt')}
                />
                {errors.administeredAt && (
                  <p className="text-red-500 text-sm mt-1">{errors.administeredAt.message}</p>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <Label htmlFor="remarks">Remarks / Notes</Label>
              <textarea
                id="remarks"
                {...register('remarks')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Any additional notes about administration..."
              />
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">Treatment Ticket Requirements:</h3>
              <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                <li><strong>Time & Date:</strong> Auto-recorded for each administration</li>
                <li><strong>Signature & Stamp:</strong> Auto-applied from your digital signature</li>
                <li><strong>Discontinuation:</strong> When stopping a medication, mark it as discontinued with signature</li>
                <li><strong>New Medications:</strong> Any new drug added must be recorded immediately</li>
                <li><strong>DPN Requirement:</strong> Morning DPN must be completed before medication administration</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={mutation.isPending || (dpnCheck && !dpnCheck.morningDPNCompleted)} 
                className="flex-1"
              >
                {mutation.isPending ? 'Recording...' : 'Record Administration'}
              </Button>
              <Link href={`/patients/${patientId}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>

          {/* Signature Note */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium mb-1">📝 Digital Signature & Stamp:</p>
            <p className="text-xs text-gray-600">
              This administration will be automatically signed with your digital signature and professional stamp. 
              The timestamp will be permanently recorded for audit purposes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
