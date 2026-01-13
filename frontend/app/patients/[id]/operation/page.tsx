'use client';

import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const operationNotesSchema = z.object({
  surgeryName: z.string().min(1, 'Surgery name is required'),
  surgeonName: z.string().min(1, 'Surgeon name is required'),
  assistantNames: z.string().optional(),
  anesthesiologistName: z.string().optional(),
  
  // Pre-operative
  preOpDiagnosis: z.string().min(1, 'Pre-operative diagnosis is required'),
  indication: z.string().min(1, 'Indication for surgery is required'),
  
  // Intra-operative
  procedurePerformed: z.string().min(1, 'Procedure performed is required'),
  findings: z.string().min(1, 'Operative findings are required'),
  technique: z.string().optional(),
  specimens: z.string().optional(),
  
  // Post-operative
  postOpDiagnosis: z.string().min(1, 'Post-operative diagnosis is required'),
  complications: z.string().optional(),
  bloodLoss: z.string().optional(),
  drains: z.string().optional(),
  
  // Timings
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  
  // Additional
  postOpInstructions: z.string().optional(),
  notes: z.string().optional(),
});

type OperationNotesFormData = z.infer<typeof operationNotesSchema>;

export default function PatientOperationNotesPage() {
  const params = useParams();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperationNotesFormData>({
    resolver: zodResolver(operationNotesSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: OperationNotesFormData) =>
      api.post('/operation-notes', { ...data, patientId }),
    onSuccess: () => {
      alert('Operation notes created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create operation notes');
    },
  });

  const onSubmit = (data: OperationNotesFormData) => {
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
          <h1 className="text-2xl font-bold mb-6">Operation Notes</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Surgical Team */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Surgical Team</h2>
              
              <div>
                <Label htmlFor="surgeonName">Surgeon Name *</Label>
                <Input id="surgeonName" {...register('surgeonName')} />
                {errors.surgeonName && (
                  <p className="text-red-500 text-sm mt-1">{errors.surgeonName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="assistantNames">Assistant Surgeon(s)</Label>
                <Input id="assistantNames" {...register('assistantNames')} placeholder="Comma separated if multiple" />
              </div>

              <div>
                <Label htmlFor="anesthesiologistName">Anesthesiologist</Label>
                <Input id="anesthesiologistName" {...register('anesthesiologistName')} />
              </div>
            </div>

            {/* Surgery Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Surgery Details</h2>
              
              <div>
                <Label htmlFor="surgeryName">Surgery Name *</Label>
                <Input id="surgeryName" {...register('surgeryName')} placeholder="e.g., Appendectomy" />
                {errors.surgeryName && (
                  <p className="text-red-500 text-sm mt-1">{errors.surgeryName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input type="datetime-local" id="startTime" {...register('startTime')} />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input type="datetime-local" id="endTime" {...register('endTime')} />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Pre-operative */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pre-operative</h2>
              
              <div>
                <Label htmlFor="preOpDiagnosis">Pre-operative Diagnosis *</Label>
                <textarea
                  id="preOpDiagnosis"
                  {...register('preOpDiagnosis')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.preOpDiagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.preOpDiagnosis.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="indication">Indication for Surgery *</Label>
                <textarea
                  id="indication"
                  {...register('indication')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.indication && (
                  <p className="text-red-500 text-sm mt-1">{errors.indication.message}</p>
                )}
              </div>
            </div>

            {/* Intra-operative */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Intra-operative</h2>
              
              <div>
                <Label htmlFor="procedurePerformed">Procedure Performed *</Label>
                <textarea
                  id="procedurePerformed"
                  {...register('procedurePerformed')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Detailed description of the procedure"
                />
                {errors.procedurePerformed && (
                  <p className="text-red-500 text-sm mt-1">{errors.procedurePerformed.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="findings">Operative Findings *</Label>
                <textarea
                  id="findings"
                  {...register('findings')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Description of findings during surgery"
                />
                {errors.findings && (
                  <p className="text-red-500 text-sm mt-1">{errors.findings.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="technique">Surgical Technique</Label>
                <textarea
                  id="technique"
                  {...register('technique')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Open/Laparoscopic, approach, suture materials, etc."
                />
              </div>

              <div>
                <Label htmlFor="specimens">Specimens Sent</Label>
                <Input id="specimens" {...register('specimens')} placeholder="e.g., Appendix for histopathology" />
              </div>

              <div>
                <Label htmlFor="bloodLoss">Estimated Blood Loss</Label>
                <Input id="bloodLoss" {...register('bloodLoss')} placeholder="e.g., 200ml" />
              </div>

              <div>
                <Label htmlFor="drains">Drains Placed</Label>
                <Input id="drains" {...register('drains')} placeholder="e.g., 16F drain in right iliac fossa" />
              </div>
            </div>

            {/* Post-operative */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Post-operative</h2>
              
              <div>
                <Label htmlFor="postOpDiagnosis">Post-operative Diagnosis *</Label>
                <textarea
                  id="postOpDiagnosis"
                  {...register('postOpDiagnosis')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.postOpDiagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.postOpDiagnosis.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="complications">Complications</Label>
                <textarea
                  id="complications"
                  {...register('complications')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Any intra-operative complications"
                />
              </div>

              <div>
                <Label htmlFor="postOpInstructions">Post-operative Instructions</Label>
                <textarea
                  id="postOpInstructions"
                  {...register('postOpInstructions')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Post-op care, medications, monitoring instructions"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Saving...' : 'Save Operation Notes'}
              </Button>
              <Link href={`/patients/${patientId}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
