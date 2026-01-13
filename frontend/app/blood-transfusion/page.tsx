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

const bloodTransfusionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  bloodProduct: z.enum(['WHOLE_BLOOD', 'PRBC', 'FFP', 'PLATELETS', 'CRYOPRECIPITATE']),
  unitNumber: z.string().min(1, 'Unit number is required'),
  bloodGroup: z.enum(['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG']),
  volume: z.number().min(1, 'Volume must be positive'),
  
  // Pre-transfusion
  indication: z.string().min(1, 'Indication is required'),
  consentObtained: z.boolean(),
  crossmatchDone: z.boolean(),
  preVitals: z.object({
    bp: z.string(),
    pulse: z.string(),
    temperature: z.string(),
  }),
  
  // Transfusion Details
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  transfusionRate: z.string().optional(),
  
  // Monitoring
  monitoring: z.array(z.object({
    time: z.string(),
    bp: z.string(),
    pulse: z.string(),
    temperature: z.string(),
    observations: z.string().optional(),
  })).optional(),
  
  // Post-transfusion
  postVitals: z.object({
    bp: z.string().optional(),
    pulse: z.string().optional(),
    temperature: z.string().optional(),
  }).optional(),
  
  // Reactions
  reaction: z.boolean(),
  reactionDetails: z.string().optional(),
  
  // Completion
  completedSuccessfully: z.boolean().optional(),
  notes: z.string().optional(),
});

type BloodTransfusionFormData = z.infer<typeof bloodTransfusionSchema>;

export default function BloodTransfusionPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BloodTransfusionFormData>({
    resolver: zodResolver(bloodTransfusionSchema),
    defaultValues: {
      bloodProduct: 'PRBC',
      bloodGroup: 'O_POS',
      consentObtained: false,
      crossmatchDone: false,
      reaction: false,
    },
  });

  const reaction = watch('reaction');

  const createMutation = useMutation({
    mutationFn: (data: BloodTransfusionFormData) => api.post('/api/clinical/blood-transfusion', data),
    onSuccess: () => {
      alert('Blood transfusion record created successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: BloodTransfusionFormData) => {
    createMutation.mutate({
      ...data,
      volume: Number(data.volume),
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blood Transfusion Record</h1>
          <p className="text-gray-600 mt-2">Complete blood transfusion documentation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient & Product Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Patient & Product Information</h3>
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
                <Label htmlFor="bloodProduct">Blood Product *</Label>
                <select
                  id="bloodProduct"
                  {...register('bloodProduct')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="WHOLE_BLOOD">Whole Blood</option>
                  <option value="PRBC">PRBC (Packed RBC)</option>
                  <option value="FFP">FFP (Fresh Frozen Plasma)</option>
                  <option value="PLATELETS">Platelets</option>
                  <option value="CRYOPRECIPITATE">Cryoprecipitate</option>
                </select>
              </div>

              <div>
                <Label htmlFor="unitNumber">Unit Number *</Label>
                <Input
                  id="unitNumber"
                  {...register('unitNumber')}
                  placeholder="Blood bag unit number"
                />
                {errors.unitNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.unitNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <select
                  id="bloodGroup"
                  {...register('bloodGroup')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="A_POS">A+</option>
                  <option value="A_NEG">A-</option>
                  <option value="B_POS">B+</option>
                  <option value="B_NEG">B-</option>
                  <option value="AB_POS">AB+</option>
                  <option value="AB_NEG">AB-</option>
                  <option value="O_POS">O+</option>
                  <option value="O_NEG">O-</option>
                </select>
              </div>

              <div>
                <Label htmlFor="volume">Volume (mL) *</Label>
                <Input
                  id="volume"
                  type="number"
                  {...register('volume', { valueAsNumber: true })}
                  placeholder="e.g., 350"
                />
                {errors.volume && (
                  <p className="text-red-500 text-sm mt-1">{errors.volume.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="indication">Indication *</Label>
                <Input
                  id="indication"
                  {...register('indication')}
                  placeholder="Reason for transfusion"
                />
                {errors.indication && (
                  <p className="text-red-500 text-sm mt-1">{errors.indication.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pre-transfusion Checklist */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Pre-transfusion Checklist</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="consentObtained"
                  {...register('consentObtained')}
                  className="h-4 w-4"
                />
                <Label htmlFor="consentObtained" className="cursor-pointer">
                  Informed consent obtained *
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="crossmatchDone"
                  {...register('crossmatchDone')}
                  className="h-4 w-4"
                />
                <Label htmlFor="crossmatchDone" className="cursor-pointer">
                  Crossmatch completed *
                </Label>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Pre-transfusion Vital Signs</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="preVitals.bp">BP *</Label>
                    <Input
                      id="preVitals.bp"
                      {...register('preVitals.bp')}
                      placeholder="120/80"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preVitals.pulse">Pulse *</Label>
                    <Input
                      id="preVitals.pulse"
                      {...register('preVitals.pulse')}
                      placeholder="80/min"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preVitals.temperature">Temp (°F) *</Label>
                    <Input
                      id="preVitals.temperature"
                      {...register('preVitals.temperature')}
                      placeholder="98.6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transfusion Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Transfusion Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register('startTime')}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register('endTime')}
                />
              </div>

              <div>
                <Label htmlFor="transfusionRate">Rate</Label>
                <Input
                  id="transfusionRate"
                  {...register('transfusionRate')}
                  placeholder="e.g., 50mL/hr"
                />
              </div>
            </div>
          </div>

          {/* Reaction Monitoring */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Transfusion Reaction</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reaction"
                  {...register('reaction')}
                  className="h-4 w-4"
                />
                <Label htmlFor="reaction" className="cursor-pointer">
                  Transfusion reaction occurred
                </Label>
              </div>

              {reaction && (
                <div>
                  <Label htmlFor="reactionDetails">Reaction Details *</Label>
                  <textarea
                    id="reactionDetails"
                    {...register('reactionDetails')}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Type of reaction, symptoms, time of onset, actions taken"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Additional Notes</h3>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                {...register('notes')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any additional observations or notes"
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
              {createMutation.isPending ? 'Saving...' : 'Save Blood Transfusion Record'}
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

        <div className="mt-6 p-4 bg-red-50 rounded-md">
          <h4 className="font-semibold mb-2 text-red-800">⚠️ Important Safety Checks:</h4>
          <ul className="text-sm space-y-1 text-red-900">
            <li>• Verify patient identity with two identifiers</li>
            <li>• Check blood product label matches patient</li>
            <li>• Ensure crossmatch is compatible</li>
            <li>• Monitor for first 15 minutes closely</li>
            <li>• Check vitals every 30 minutes during transfusion</li>
            <li>• Stop transfusion immediately if reaction occurs</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
