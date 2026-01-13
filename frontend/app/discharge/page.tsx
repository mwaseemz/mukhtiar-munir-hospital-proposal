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

const dischargeSummarySchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  dischargeType: z.enum(['REGULAR', 'LAMA', 'DOR', 'ABSCONDED', 'REFERRED']),
  admissionDate: z.string().min(1, 'Admission date is required'),
  dischargeDate: z.string().min(1, 'Discharge date is required'),
  dischargeTime: z.string().min(1, 'Discharge time is required'),
  admissionDiagnosis: z.string().min(1, 'Admission diagnosis is required'),
  hospitalCourse: z.string().min(1, 'Hospital course is required'),
  finalDiagnosis: z.string().min(1, 'Final diagnosis is required'),
  conditionAtDischarge: z.string().min(1, 'Condition at discharge is required'),
  dischargeMedications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    instructions: z.string(),
  })).optional(),
  followUpInstructions: z.string().min(1, 'Follow-up instructions are required'),
  followUpDate: z.string().optional(),
  followUpWith: z.string().optional(),
  lamaReason: z.string().optional(),
  dorReason: z.string().optional(),
});

type DischargeSummaryFormData = z.infer<typeof dischargeSummarySchema>;

export default function DischargePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DischargeSummaryFormData>({
    resolver: zodResolver(dischargeSummarySchema),
    defaultValues: {
      dischargeType: 'REGULAR',
      dischargeMedications: [],
    },
  });

  const dischargeType = watch('dischargeType');

  const createMutation = useMutation({
    mutationFn: (data: DischargeSummaryFormData) => api.post('/api/discharge/summary', data),
    onSuccess: () => {
      alert('Discharge summary created successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: DischargeSummaryFormData) => {
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
    <div className="container mx-auto p-6 max-w-5xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Discharge Summary</h1>
          <p className="text-gray-600 mt-2">Complete patient discharge documentation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="dischargeType">Discharge Type *</Label>
              <select
                id="dischargeType"
                {...register('dischargeType')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="REGULAR">Regular Discharge</option>
                <option value="LAMA">LAMA (Left Against Medical Advice)</option>
                <option value="DOR">DOR (Discharged On Request)</option>
                <option value="ABSCONDED">Absconded</option>
                <option value="REFERRED">Referred</option>
              </select>
            </div>
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="admissionDate">Admission Date *</Label>
              <Input
                id="admissionDate"
                type="date"
                {...register('admissionDate')}
              />
              {errors.admissionDate && (
                <p className="text-red-500 text-sm mt-1">{errors.admissionDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dischargeDate">Discharge Date *</Label>
              <Input
                id="dischargeDate"
                type="date"
                {...register('dischargeDate')}
                defaultValue={getCurrentDate()}
              />
              {errors.dischargeDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dischargeDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dischargeTime">Discharge Time *</Label>
              <Input
                id="dischargeTime"
                type="time"
                {...register('dischargeTime')}
                defaultValue={getCurrentTime()}
              />
              {errors.dischargeTime && (
                <p className="text-red-500 text-sm mt-1">{errors.dischargeTime.message}</p>
              )}
            </div>
          </div>

          {/* LAMA/DOR Reason */}
          {(dischargeType === 'LAMA' || dischargeType === 'DOR') && (
            <div>
              <Label htmlFor={dischargeType === 'LAMA' ? 'lamaReason' : 'dorReason'}>
                {dischargeType} Reason *
              </Label>
              <textarea
                id={dischargeType === 'LAMA' ? 'lamaReason' : 'dorReason'}
                {...register(dischargeType === 'LAMA' ? 'lamaReason' : 'dorReason')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder={`Reason for ${dischargeType}`}
              />
            </div>
          )}

          {/* Diagnoses */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Clinical Summary</h3>

            <div>
              <Label htmlFor="admissionDiagnosis">Admission Diagnosis *</Label>
              <Input
                id="admissionDiagnosis"
                {...register('admissionDiagnosis')}
                placeholder="Primary diagnosis at admission"
              />
              {errors.admissionDiagnosis && (
                <p className="text-red-500 text-sm mt-1">{errors.admissionDiagnosis.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="finalDiagnosis">Final Diagnosis *</Label>
              <Input
                id="finalDiagnosis"
                {...register('finalDiagnosis')}
                placeholder="Final diagnosis at discharge"
              />
              {errors.finalDiagnosis && (
                <p className="text-red-500 text-sm mt-1">{errors.finalDiagnosis.message}</p>
              )}
            </div>
          </div>

          {/* Hospital Course */}
          <div>
            <Label htmlFor="hospitalCourse">Hospital Course *</Label>
            <p className="text-sm text-gray-500 mb-2">Brief summary of hospital stay, treatments, procedures</p>
            <textarea
              id="hospitalCourse"
              {...register('hospitalCourse')}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Describe the patient's hospital course..."
            />
            {errors.hospitalCourse && (
              <p className="text-red-500 text-sm mt-1">{errors.hospitalCourse.message}</p>
            )}
          </div>

          {/* Condition at Discharge */}
          <div>
            <Label htmlFor="conditionAtDischarge">Condition at Discharge *</Label>
            <Input
              id="conditionAtDischarge"
              {...register('conditionAtDischarge')}
              placeholder="e.g., Stable, Improved, Satisfactory"
            />
            {errors.conditionAtDischarge && (
              <p className="text-red-500 text-sm mt-1">{errors.conditionAtDischarge.message}</p>
            )}
          </div>

          {/* Discharge Medications */}
          {dischargeType === 'REGULAR' && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Discharge Medications</h3>
              <p className="text-sm text-gray-500 mb-4">Add medications manually in JSON format or individually</p>
              <textarea
                {...register('dischargeMedications')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder='[{"name": "Paracetamol", "dosage": "500mg TDS", "instructions": "After meals"}]'
              />
            </div>
          )}

          {/* Follow-up Instructions */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Follow-up Instructions</h3>

            <div>
              <Label htmlFor="followUpInstructions">Instructions *</Label>
              <textarea
                id="followUpInstructions"
                {...register('followUpInstructions')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Follow-up care instructions, activity restrictions, diet, etc."
              />
              {errors.followUpInstructions && (
                <p className="text-red-500 text-sm mt-1">{errors.followUpInstructions.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  {...register('followUpDate')}
                />
              </div>

              <div>
                <Label htmlFor="followUpWith">Follow-up With</Label>
                <Input
                  id="followUpWith"
                  {...register('followUpWith')}
                  placeholder="Doctor name or clinic"
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
              {createMutation.isPending ? 'Creating...' : 'Create Discharge Summary'}
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

        <div className="mt-6 p-4 bg-yellow-50 rounded-md">
          <h4 className="font-semibold mb-2">⚠️ Important:</h4>
          <ul className="text-sm space-y-1">
            <li>• Regular Discharge: Complete all sections including medications and follow-up</li>
            <li>• LAMA/DOR: Must document reason and obtain signed form</li>
            <li>• Ensure all pending investigations and consultations are completed</li>
            <li>• Final bill must be cleared before discharge</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
