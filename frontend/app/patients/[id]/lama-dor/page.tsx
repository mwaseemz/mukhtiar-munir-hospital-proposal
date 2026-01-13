'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const lamaDorSchema = z.object({
  type: z.enum(['LAMA', 'DOR']),
  reason: z.string().min(1, 'Reason is required'),
  doctorStatement: z.string().min(1, 'Doctor statement is required'),
  risksExplained: z.boolean(),
  patientOrRelativeStatement: z.string().optional(),
  witnessName: z.string().optional(),
  witnessRelation: z.string().optional(),
  notes: z.string().optional(),
});

type LamaDorData = z.infer<typeof lamaDorSchema>;

export default function LamaDorPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LamaDorData>({
    resolver: zodResolver(lamaDorSchema),
    defaultValues: {
      type: 'LAMA',
      risksExplained: false,
    },
  });

  const selectedType = watch('type');

  const mutation = useMutation({
    mutationFn: (data: LamaDorData) =>
      api.post(`/patients/${patientId}/lama-dor`, data),
    onSuccess: () => {
      alert('LAMA/DOR form created successfully! This must be printed for signatures and uploaded.');
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create LAMA/DOR form');
    },
  });

  const onSubmit = (data: LamaDorData) => {
    if (!data.risksExplained) {
      alert('You must confirm that risks have been explained to the patient/relative before proceeding.');
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
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold">LAMA / DOR Form</h1>
              <p className="text-sm text-gray-600">Leave Against Medical Advice / Discharge On Request</p>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
            <p className="text-sm font-medium text-orange-800">
              ⚠️ Use this form when patient leaves against medical advice or requests discharge before completion of treatment
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Type Selection */}
            <div>
              <Label htmlFor="type">Form Type *</Label>
              <select
                id="type"
                {...register('type')}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="LAMA">LAMA (Leave Against Medical Advice)</option>
                <option value="DOR">DOR (Discharge On Request)</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">What is {selectedType}?</h3>
              {selectedType === 'LAMA' ? (
                <p className="text-xs text-gray-700">
                  <strong>LAMA (Leave Against Medical Advice):</strong> Patient chooses to leave the hospital 
                  despite medical team's advice to continue treatment. This form protects the hospital from liability.
                </p>
              ) : (
                <p className="text-xs text-gray-700">
                  <strong>DOR (Discharge On Request):</strong> Patient requests discharge when treatment is complete 
                  or nearly complete, but before formal medical discharge. Less serious than LAMA.
                </p>
              )}
            </div>

            {/* Reason */}
            <div>
              <Label htmlFor="reason">Reason for {selectedType} *</Label>
              <textarea
                id="reason"
                {...register('reason')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Why is the patient leaving against medical advice or requesting discharge?"
              />
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Example: "Patient wants to go home due to family emergency" or "Financial constraints"
              </p>
            </div>

            {/* Doctor's Statement */}
            <div>
              <Label htmlFor="doctorStatement">Doctor's Statement *</Label>
              <textarea
                id="doctorStatement"
                {...register('doctorStatement')}
                rows={5}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Doctor's professional statement about the patient's condition and recommendation..."
              />
              {errors.doctorStatement && (
                <p className="text-red-500 text-sm mt-1">{errors.doctorStatement.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Example: "Patient's condition requires continued hospitalization and monitoring. Leaving at this stage 
                poses significant health risks including infection, bleeding, and complications. I strongly advise against 
                discharge at this time."
              </p>
            </div>

            {/* Risks Explained Checkbox */}
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="risksExplained"
                  {...register('risksExplained')}
                  className="w-5 h-5 mt-0.5"
                />
                <div>
                  <Label htmlFor="risksExplained" className="cursor-pointer font-semibold">
                    I confirm that all risks and consequences have been explained to the patient/relative *
                  </Label>
                  <p className="text-xs text-red-700 mt-1">
                    This includes risks of: complications, deterioration of condition, death, and loss of 
                    opportunity for treatment. Patient/relative understands these risks.
                  </p>
                </div>
              </div>
              {errors.risksExplained && (
                <p className="text-red-500 text-sm mt-2">{errors.risksExplained.message}</p>
              )}
            </div>

            {/* Patient/Relative Statement */}
            <div>
              <Label htmlFor="patientOrRelativeStatement">Patient/Relative Statement (Optional)</Label>
              <textarea
                id="patientOrRelativeStatement"
                {...register('patientOrRelativeStatement')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Patient or relative's statement acknowledging the risks..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Patient/relative can provide their own statement acknowledging understanding
              </p>
            </div>

            {/* Witness Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Witness Information (if applicable)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="witnessName">Witness Name</Label>
                  <input
                    id="witnessName"
                    type="text"
                    {...register('witnessName')}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <Label htmlFor="witnessRelation">Witness Relation to Patient</Label>
                  <input
                    id="witnessRelation"
                    type="text"
                    {...register('witnessRelation')}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="e.g., Hospital Staff, Family Member"
                  />
                </div>
              </div>
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

            {/* Next Steps */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium mb-2">📝 After Submission - Required Steps:</p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li><strong>Print the form</strong> immediately</li>
                <li><strong>Doctor signs and stamps</strong> the form</li>
                <li><strong>Patient/Relative signs</strong> acknowledging risks</li>
                <li><strong>Witness signs</strong> (if present)</li>
                <li><strong>Scan and upload</strong> the signed form back to system</li>
                <li><strong>Keep original</strong> in patient file for legal purposes</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Creating Form...' : 'Create LAMA/DOR Form'}
              </Button>
              <Link href={`/patients/${patientId}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>

          {/* Legal Notice */}
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium mb-1">⚖️ Legal Protection:</p>
            <p className="text-xs text-gray-600">
              This form serves as legal protection for the hospital and medical staff. It documents that 
              the patient was informed of risks and chose to leave/discharge against medical advice. 
              All signatures must be obtained for the form to be valid.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
