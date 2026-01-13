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
import { ArrowLeft, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';

const criticalNoteSchema = z.object({
  severity: z.enum(['CRITICAL', 'HIGH', 'MODERATE']),
  category: z.enum(['VITAL_SIGNS', 'RESPIRATORY', 'CARDIAC', 'NEUROLOGICAL', 'OTHER']),
  observation: z.string().min(1, 'Observation is required'),
  actionTaken: z.string().min(1, 'Action taken is required'),
  outcome: z.string().optional(),
  notes: z.string().optional(),
});

type CriticalNoteData = z.infer<typeof criticalNoteSchema>;

export default function CriticalNotesPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CriticalNoteData>({
    resolver: zodResolver(criticalNoteSchema),
    defaultValues: {
      severity: 'HIGH',
      category: 'VITAL_SIGNS',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CriticalNoteData) =>
      api.post(`/patients/${patientId}/critical-notes`, data),
    onSuccess: () => {
      alert('Critical note recorded successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to record critical note');
    },
  });

  const onSubmit = (data: CriticalNoteData) => {
    mutation.mutate(data);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MODERATE':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
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
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold">Critical Notes</h1>
              <p className="text-sm text-gray-600">Document critical events and interventions</p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm font-medium text-red-800">
              ⚠️ Use this form to document any critical situation, emergency intervention, or significant change in patient condition
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Severity */}
              <div>
                <Label htmlFor="severity">Severity Level *</Label>
                <select
                  id="severity"
                  {...register('severity')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="MODERATE">Moderate</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                {errors.severity && (
                  <p className="text-red-500 text-sm mt-1">{errors.severity.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="VITAL_SIGNS">Vital Signs</option>
                  <option value="RESPIRATORY">Respiratory</option>
                  <option value="CARDIAC">Cardiac</option>
                  <option value="NEUROLOGICAL">Neurological</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Observation */}
            <div>
              <Label htmlFor="observation">Observation / Critical Event *</Label>
              <textarea
                id="observation"
                {...register('observation')}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Describe the critical observation or event in detail..."
              />
              {errors.observation && (
                <p className="text-red-500 text-sm mt-1">{errors.observation.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Example: "Patient BP dropped to 90/60, became drowsy at 14:30"
              </p>
            </div>

            {/* Action Taken */}
            <div>
              <Label htmlFor="actionTaken">Action Taken / Intervention *</Label>
              <textarea
                id="actionTaken"
                {...register('actionTaken')}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Describe the immediate actions and interventions performed..."
              />
              {errors.actionTaken && (
                <p className="text-red-500 text-sm mt-1">{errors.actionTaken.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Example: "IV fluids increased, O2 administered, consultant called"
              </p>
            </div>

            {/* Outcome */}
            <div>
              <Label htmlFor="outcome">Outcome / Patient Response</Label>
              <textarea
                id="outcome"
                {...register('outcome')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Describe the patient's response to intervention..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: "BP stabilized to 120/80 after 30 minutes, patient alert"
              </p>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Any additional context or information..."
              />
            </div>

            {/* Info boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">When to use Critical Notes:</h3>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                  <li>Sudden deterioration in condition</li>
                  <li>Emergency interventions</li>
                  <li>Significant vital sign changes</li>
                  <li>Code blue/red situations</li>
                  <li>Transfer to ICU</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">Required Information:</h3>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                  <li>Time-stamped automatically</li>
                  <li>Signed by responsible staff</li>
                  <li>Consultant must be notified</li>
                  <li>Follow-up notes required</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                {mutation.isPending ? 'Recording...' : 'Record Critical Note'}
              </Button>
              <Link href={`/patients/${patientId}`}>
                <Button type="button" variant="outline">Close</Button>
              </Link>
            </div>
          </form>

          {/* Signature Note */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium mb-1">📝 Digital Signature:</p>
            <p className="text-xs text-gray-600">
              This critical note will be automatically signed with your digital signature and timestamp. 
              All critical notes require consultant review within 1 hour.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
