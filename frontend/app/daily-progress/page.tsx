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

const dailyProgressSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  dateOfNote: z.string().min(1, 'Date is required'),
  timeOfNote: z.string().min(1, 'Time is required'),
  
  // SOAP Format
  subjective: z.string().min(1, 'Subjective findings are required'),
  objective: z.string().min(1, 'Objective findings are required'),
  assessment: z.string().min(1, 'Assessment is required'),
  plan: z.string().min(1, 'Plan is required'),
  
  // Vitals
  bp: z.string().optional(),
  pulse: z.string().optional(),
  temperature: z.string().optional(),
  respiratoryRate: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  
  // Additional
  generalCondition: z.string().optional(),
  investigations: z.string().optional(),
  consultations: z.string().optional(),
});

type DailyProgressFormData = z.infer<typeof dailyProgressSchema>;

export default function DailyProgressPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DailyProgressFormData>({
    resolver: zodResolver(dailyProgressSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: DailyProgressFormData) => api.post('/api/clinical/daily-progress-note', data),
    onSuccess: () => {
      alert('Daily progress note saved successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: DailyProgressFormData) => {
    createMutation.mutate(data);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Daily Progress Note (DPN)</h1>
          <p className="text-gray-600 mt-2">SOAP Format - Subjective, Objective, Assessment, Plan</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Info & Date/Time */}
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
              <Label htmlFor="dateOfNote">Date *</Label>
              <Input
                id="dateOfNote"
                type="date"
                {...register('dateOfNote')}
                defaultValue={getCurrentDate()}
              />
              {errors.dateOfNote && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfNote.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="timeOfNote">Time *</Label>
              <Input
                id="timeOfNote"
                type="time"
                {...register('timeOfNote')}
                defaultValue={getCurrentTime()}
              />
              {errors.timeOfNote && (
                <p className="text-red-500 text-sm mt-1">{errors.timeOfNote.message}</p>
              )}
            </div>
          </div>

          {/* Vital Signs */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="bp">BP</Label>
                <Input
                  id="bp"
                  {...register('bp')}
                  placeholder="120/80"
                />
              </div>

              <div>
                <Label htmlFor="pulse">Pulse</Label>
                <Input
                  id="pulse"
                  {...register('pulse')}
                  placeholder="80/min"
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temp (°F)</Label>
                <Input
                  id="temperature"
                  {...register('temperature')}
                  placeholder="98.6"
                />
              </div>

              <div>
                <Label htmlFor="respiratoryRate">RR</Label>
                <Input
                  id="respiratoryRate"
                  {...register('respiratoryRate')}
                  placeholder="16/min"
                />
              </div>

              <div>
                <Label htmlFor="oxygenSaturation">SpO₂ (%)</Label>
                <Input
                  id="oxygenSaturation"
                  {...register('oxygenSaturation')}
                  placeholder="98"
                />
              </div>
            </div>
          </div>

          {/* General Condition */}
          <div>
            <Label htmlFor="generalCondition">General Condition</Label>
            <Input
              id="generalCondition"
              {...register('generalCondition')}
              placeholder="e.g., Stable, Comfortable, Anxious"
            />
          </div>

          {/* SOAP Format */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">SOAP Note</h3>

            {/* Subjective */}
            <div>
              <Label htmlFor="subjective">
                <span className="text-blue-600 font-bold">S</span>ubjective *
              </Label>
              <p className="text-sm text-gray-500 mb-2">Patient's complaints, symptoms, feelings</p>
              <textarea
                id="subjective"
                {...register('subjective')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="What the patient says..."
              />
              {errors.subjective && (
                <p className="text-red-500 text-sm mt-1">{errors.subjective.message}</p>
              )}
            </div>

            {/* Objective */}
            <div>
              <Label htmlFor="objective">
                <span className="text-green-600 font-bold">O</span>bjective *
              </Label>
              <p className="text-sm text-gray-500 mb-2">Physical examination, lab results, observations</p>
              <textarea
                id="objective"
                {...register('objective')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="What you observe and measure..."
              />
              {errors.objective && (
                <p className="text-red-500 text-sm mt-1">{errors.objective.message}</p>
              )}
            </div>

            {/* Assessment */}
            <div>
              <Label htmlFor="assessment">
                <span className="text-orange-600 font-bold">A</span>ssessment *
              </Label>
              <p className="text-sm text-gray-500 mb-2">Diagnosis, clinical impression, progress evaluation</p>
              <textarea
                id="assessment"
                {...register('assessment')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Your clinical assessment..."
              />
              {errors.assessment && (
                <p className="text-red-500 text-sm mt-1">{errors.assessment.message}</p>
              )}
            </div>

            {/* Plan */}
            <div>
              <Label htmlFor="plan">
                <span className="text-purple-600 font-bold">P</span>lan *
              </Label>
              <p className="text-sm text-gray-500 mb-2">Treatment plan, orders, follow-up</p>
              <textarea
                id="plan"
                {...register('plan')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Your management plan..."
              />
              {errors.plan && (
                <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>
              )}
            </div>
          </div>

          {/* Additional Sections */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <Label htmlFor="investigations">Investigations Ordered</Label>
              <textarea
                id="investigations"
                {...register('investigations')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Lab tests, imaging, etc."
              />
            </div>

            <div>
              <Label htmlFor="consultations">Consultations</Label>
              <textarea
                id="consultations"
                {...register('consultations')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Specialist consultations requested"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Daily Progress Note'}
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

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-semibold mb-2">📋 SOAP Format Guide:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Subjective:</strong> Patient's symptoms, complaints, history (what they tell you)</li>
            <li><strong>Objective:</strong> Physical exam findings, vitals, lab results (what you observe)</li>
            <li><strong>Assessment:</strong> Your diagnosis or clinical impression</li>
            <li><strong>Plan:</strong> Treatment orders, investigations, follow-up (what you'll do)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
