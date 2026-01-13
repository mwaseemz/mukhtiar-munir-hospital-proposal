'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const medicalHistorySchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
  presentIllness: z.string().min(1, 'History of present illness is required'),
  duration: z.string().min(1, 'Duration is required'),
  onset: z.enum(['SUDDEN', 'GRADUAL', 'INSIDIOUS']),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE']),
  pastMedicalHistory: z.string().optional(),
  pastSurgicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  familyHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  systemicReview: z.string().optional(),
  provisionalDiagnosis: z.string().min(1, 'Provisional diagnosis is required'),
  treatmentPlan: z.string().optional(),
});

type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>;

export default function MedicalHistoryPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicalHistoryFormData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      onset: 'GRADUAL',
      severity: 'MODERATE',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: MedicalHistoryFormData) => api.post('/api/clinical/medical-history', data),
    onSuccess: () => {
      alert('Medical history recorded successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: MedicalHistoryFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Medical History & Examination</h1>
          <p className="text-gray-600 mt-2">Complete patient medical history form</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Selection */}
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

          {/* Chief Complaint */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Chief Complaint</h3>
            <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
            <textarea
              id="chiefComplaint"
              {...register('chiefComplaint')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Main complaint of the patient"
            />
            {errors.chiefComplaint && (
              <p className="text-red-500 text-sm mt-1">{errors.chiefComplaint.message}</p>
            )}
          </div>

          {/* History of Present Illness */}
          <div>
            <h3 className="text-xl font-semibold mb-4">History of Present Illness</h3>
            <Label htmlFor="presentIllness">Details *</Label>
            <textarea
              id="presentIllness"
              {...register('presentIllness')}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Detailed history of present illness"
            />
            {errors.presentIllness && (
              <p className="text-red-500 text-sm mt-1">{errors.presentIllness.message}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  {...register('duration')}
                  placeholder="e.g., 3 days, 2 weeks"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="onset">Onset *</Label>
                <select
                  id="onset"
                  {...register('onset')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="SUDDEN">Sudden</option>
                  <option value="GRADUAL">Gradual</option>
                  <option value="INSIDIOUS">Insidious</option>
                </select>
              </div>

              <div>
                <Label htmlFor="severity">Severity *</Label>
                <select
                  id="severity"
                  {...register('severity')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Past History */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Past History</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pastMedicalHistory">Past Medical History</Label>
                <textarea
                  id="pastMedicalHistory"
                  {...register('pastMedicalHistory')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Any previous medical conditions"
                />
              </div>

              <div>
                <Label htmlFor="pastSurgicalHistory">Past Surgical History</Label>
                <textarea
                  id="pastSurgicalHistory"
                  {...register('pastSurgicalHistory')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Any previous surgeries"
                />
              </div>
            </div>
          </div>

          {/* Allergies & Medications */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Allergies & Current Medications</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  {...register('allergies')}
                  placeholder="Food, drug, or other allergies"
                />
              </div>

              <div>
                <Label htmlFor="currentMedications">Current Medications</Label>
                <textarea
                  id="currentMedications"
                  {...register('currentMedications')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="List all current medications"
                />
              </div>
            </div>
          </div>

          {/* Family & Social History */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Family & Social History</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="familyHistory">Family History</Label>
                <textarea
                  id="familyHistory"
                  {...register('familyHistory')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Relevant family medical history"
                />
              </div>

              <div>
                <Label htmlFor="socialHistory">Social History</Label>
                <textarea
                  id="socialHistory"
                  {...register('socialHistory')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Smoking, alcohol, occupation, etc."
                />
              </div>
            </div>
          </div>

          {/* Systemic Review */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Systemic Review</h3>
            <Label htmlFor="systemicReview">Review of Systems</Label>
            <textarea
              id="systemicReview"
              {...register('systemicReview')}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="CVS, RS, GIT, CNS, etc."
            />
          </div>

          {/* Diagnosis & Treatment Plan */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Assessment & Plan</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="provisionalDiagnosis">Provisional Diagnosis *</Label>
                <Input
                  id="provisionalDiagnosis"
                  {...register('provisionalDiagnosis')}
                  placeholder="Initial diagnosis"
                />
                {errors.provisionalDiagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.provisionalDiagnosis.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <textarea
                  id="treatmentPlan"
                  {...register('treatmentPlan')}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Initial management plan"
                />
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
              {createMutation.isPending ? 'Saving...' : 'Save Medical History'}
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
