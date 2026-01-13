'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const operationNotesSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  operationDate: z.string().min(1, 'Operation date is required'),
  operationTime: z.string().min(1, 'Operation time is required'),
  
  // Pre-operative
  preOperativeDiagnosis: z.string().min(1, 'Pre-operative diagnosis is required'),
  plannedProcedure: z.string().min(1, 'Planned procedure is required'),
  
  // Surgical Team
  surgeonName: z.string().min(1, 'Surgeon name is required'),
  assistantSurgeon: z.string().optional(),
  anesthetistName: z.string().min(1, 'Anesthetist name is required'),
  scrubNurse: z.string().optional(),
  
  // Procedure Details
  procedurePerformed: z.string().min(1, 'Procedure performed is required'),
  findings: z.string().min(1, 'Operative findings are required'),
  technique: z.string().min(1, 'Operative technique is required'),
  
  // Complications & Blood Loss
  complications: z.string().optional(),
  bloodLoss: z.string().optional(),
  bloodTransfusion: z.string().optional(),
  
  // Specimens & Drains
  specimens: z.string().optional(),
  drainsInserted: z.string().optional(),
  
  // Post-operative
  postOperativeDiagnosis: z.string().min(1, 'Post-operative diagnosis is required'),
  postOperativeInstructions: z.string().min(1, 'Post-operative instructions are required'),
  
  // Closure & Duration
  closure: z.string().optional(),
  operationDuration: z.string().optional(),
});

type OperationNotesFormData = z.infer<typeof operationNotesSchema>;

export default function OperationNotesPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OperationNotesFormData>({
    resolver: zodResolver(operationNotesSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: OperationNotesFormData) => api.post('/api/surgical/operation-notes', data),
    onSuccess: () => {
      alert('Operation notes saved successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: OperationNotesFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Operation Notes</h1>
          <p className="text-gray-600 mt-2">Detailed surgical documentation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient & Date/Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="patientId">Patient ID / MR Number *</Label>
              <Input
                id="patientId"
                {...register('patientId')}
                placeholder="Enter patient ID"
              />
              {errors.patientId && (
                <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="operationDate">Operation Date *</Label>
              <Input
                id="operationDate"
                type="date"
                {...register('operationDate')}
              />
              {errors.operationDate && (
                <p className="text-red-500 text-sm mt-1">{errors.operationDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="operationTime">Operation Time *</Label>
              <Input
                id="operationTime"
                type="time"
                {...register('operationTime')}
              />
              {errors.operationTime && (
                <p className="text-red-500 text-sm mt-1">{errors.operationTime.message}</p>
              )}
            </div>
          </div>

          {/* Pre-operative */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Pre-operative Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="preOperativeDiagnosis">Pre-operative Diagnosis *</Label>
                <Input
                  id="preOperativeDiagnosis"
                  {...register('preOperativeDiagnosis')}
                  placeholder="Primary diagnosis"
                />
                {errors.preOperativeDiagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.preOperativeDiagnosis.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="plannedProcedure">Planned Procedure *</Label>
                <Input
                  id="plannedProcedure"
                  {...register('plannedProcedure')}
                  placeholder="Planned surgical procedure"
                />
                {errors.plannedProcedure && (
                  <p className="text-red-500 text-sm mt-1">{errors.plannedProcedure.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Surgical Team */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Surgical Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="surgeonName">Surgeon *</Label>
                <Input
                  id="surgeonName"
                  {...register('surgeonName')}
                  placeholder="Primary surgeon name"
                />
                {errors.surgeonName && (
                  <p className="text-red-500 text-sm mt-1">{errors.surgeonName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="assistantSurgeon">Assistant Surgeon</Label>
                <Input
                  id="assistantSurgeon"
                  {...register('assistantSurgeon')}
                  placeholder="Assistant surgeon name"
                />
              </div>

              <div>
                <Label htmlFor="anesthetistName">Anesthetist *</Label>
                <Input
                  id="anesthetistName"
                  {...register('anesthetistName')}
                  placeholder="Anesthetist name"
                />
                {errors.anesthetistName && (
                  <p className="text-red-500 text-sm mt-1">{errors.anesthetistName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="scrubNurse">Scrub Nurse</Label>
                <Input
                  id="scrubNurse"
                  {...register('scrubNurse')}
                  placeholder="Scrub nurse name"
                />
              </div>
            </div>
          </div>

          {/* Operative Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Operative Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="procedurePerformed">Procedure Performed *</Label>
                <Input
                  id="procedurePerformed"
                  {...register('procedurePerformed')}
                  placeholder="Actual procedure performed"
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
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Detailed operative findings"
                />
                {errors.findings && (
                  <p className="text-red-500 text-sm mt-1">{errors.findings.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="technique">Operative Technique *</Label>
                <textarea
                  id="technique"
                  {...register('technique')}
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Step-by-step description of the procedure"
                />
                {errors.technique && (
                  <p className="text-red-500 text-sm mt-1">{errors.technique.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Complications & Blood Loss */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Complications & Blood Loss</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="complications">Intraoperative Complications</Label>
                <textarea
                  id="complications"
                  {...register('complications')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Any complications encountered"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodLoss">Estimated Blood Loss</Label>
                  <Input
                    id="bloodLoss"
                    {...register('bloodLoss')}
                    placeholder="e.g., 300mL"
                  />
                </div>

                <div>
                  <Label htmlFor="bloodTransfusion">Blood Transfusion</Label>
                  <Input
                    id="bloodTransfusion"
                    {...register('bloodTransfusion')}
                    placeholder="e.g., 2 units PRBC"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specimens & Drains */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Specimens & Drains</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="specimens">Specimens Sent for Histopathology</Label>
                <textarea
                  id="specimens"
                  {...register('specimens')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="List specimens sent"
                />
              </div>

              <div>
                <Label htmlFor="drainsInserted">Drains Inserted</Label>
                <Input
                  id="drainsInserted"
                  {...register('drainsInserted')}
                  placeholder="e.g., 1 tube drain in right iliac fossa"
                />
              </div>
            </div>
          </div>

          {/* Closure & Duration */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Closure & Duration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="closure">Wound Closure</Label>
                <Input
                  id="closure"
                  {...register('closure')}
                  placeholder="e.g., Mass closure with 1-0 PDS, skin with 3-0 nylon"
                />
              </div>

              <div>
                <Label htmlFor="operationDuration">Operation Duration</Label>
                <Input
                  id="operationDuration"
                  {...register('operationDuration')}
                  placeholder="e.g., 2 hours 30 minutes"
                />
              </div>
            </div>
          </div>

          {/* Post-operative */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Post-operative</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="postOperativeDiagnosis">Post-operative Diagnosis *</Label>
                <Input
                  id="postOperativeDiagnosis"
                  {...register('postOperativeDiagnosis')}
                  placeholder="Final diagnosis"
                />
                {errors.postOperativeDiagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.postOperativeDiagnosis.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="postOperativeInstructions">Post-operative Instructions *</Label>
                <textarea
                  id="postOperativeInstructions"
                  {...register('postOperativeInstructions')}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Post-op care, antibiotics, pain management, monitoring instructions"
                />
                {errors.postOperativeInstructions && (
                  <p className="text-red-500 text-sm mt-1">{errors.postOperativeInstructions.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Operation Notes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
