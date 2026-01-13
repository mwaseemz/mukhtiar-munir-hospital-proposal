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

const bloodTransfusionSchema = z.object({
  productType: z.enum(['WHOLE_BLOOD', 'PACKED_RBC', 'PLATELETS', 'FFP', 'CRYOPRECIPITATE']),
  bagNumber: z.string().min(1, 'Bag number is required'),
  bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']),
  volume: z.string().min(1, 'Volume is required'),
  
  // Pre-transfusion
  indication: z.string().min(1, 'Indication is required'),
  preTransfusionVitals: z.string().min(1, 'Pre-transfusion vitals are required'),
  crossMatchingDone: z.boolean(),
  
  // Transfusion
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  rate: z.string().optional(),
  
  // Monitoring
  vitalsDuringTransfusion: z.string().optional(),
  reactions: z.string().optional(),
  
  // Post-transfusion
  postTransfusionVitals: z.string().optional(),
  outcome: z.string().optional(),
  notes: z.string().optional(),
});

type BloodTransfusionFormData = z.infer<typeof bloodTransfusionSchema>;

export default function PatientBloodTransfusionPage() {
  const params = useParams();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BloodTransfusionFormData>({
    resolver: zodResolver(bloodTransfusionSchema),
    defaultValues: {
      crossMatchingDone: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BloodTransfusionFormData) =>
      api.post('/blood-transfusion', { ...data, patientId }),
    onSuccess: () => {
      alert('Blood transfusion record created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create blood transfusion record');
    },
  });

  const onSubmit = (data: BloodTransfusionFormData) => {
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
          <h1 className="text-2xl font-bold mb-6">Blood Transfusion Record</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Blood Product Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Blood Product Details</h2>
              
              <div>
                <Label htmlFor="productType">Product Type *</Label>
                <select
                  id="productType"
                  {...register('productType')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select product type</option>
                  <option value="WHOLE_BLOOD">Whole Blood</option>
                  <option value="PACKED_RBC">Packed RBCs</option>
                  <option value="PLATELETS">Platelets</option>
                  <option value="FFP">Fresh Frozen Plasma (FFP)</option>
                  <option value="CRYOPRECIPITATE">Cryoprecipitate</option>
                </select>
                {errors.productType && (
                  <p className="text-red-500 text-sm mt-1">{errors.productType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bagNumber">Bag Number *</Label>
                <Input id="bagNumber" {...register('bagNumber')} />
                {errors.bagNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.bagNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <select
                  id="bloodGroup"
                  {...register('bloodGroup')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select blood group</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                </select>
                {errors.bloodGroup && (
                  <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="volume">Volume (ml) *</Label>
                <Input id="volume" {...register('volume')} placeholder="e.g., 350" />
                {errors.volume && (
                  <p className="text-red-500 text-sm mt-1">{errors.volume.message}</p>
                )}
              </div>
            </div>

            {/* Pre-Transfusion */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pre-Transfusion</h2>
              
              <div>
                <Label htmlFor="indication">Indication *</Label>
                <textarea
                  id="indication"
                  {...register('indication')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Reason for transfusion"
                />
                {errors.indication && (
                  <p className="text-red-500 text-sm mt-1">{errors.indication.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="preTransfusionVitals">Pre-Transfusion Vitals *</Label>
                <textarea
                  id="preTransfusionVitals"
                  {...register('preTransfusionVitals')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="BP, HR, Temp, RR, SpO2"
                />
                {errors.preTransfusionVitals && (
                  <p className="text-red-500 text-sm mt-1">{errors.preTransfusionVitals.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="crossMatchingDone"
                  {...register('crossMatchingDone')}
                  className="w-4 h-4"
                />
                <Label htmlFor="crossMatchingDone" className="cursor-pointer">
                  Cross-matching Done
                </Label>
              </div>
            </div>

            {/* Transfusion Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Transfusion Details</h2>
              
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input type="datetime-local" id="startTime" {...register('startTime')} />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input type="datetime-local" id="endTime" {...register('endTime')} />
              </div>

              <div>
                <Label htmlFor="rate">Transfusion Rate</Label>
                <Input id="rate" {...register('rate')} placeholder="e.g., 100 ml/hour" />
              </div>

              <div>
                <Label htmlFor="vitalsDuringTransfusion">Vitals During Transfusion</Label>
                <textarea
                  id="vitalsDuringTransfusion"
                  {...register('vitalsDuringTransfusion')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Monitor vitals every 15 minutes"
                />
              </div>

              <div>
                <Label htmlFor="reactions">Adverse Reactions</Label>
                <textarea
                  id="reactions"
                  {...register('reactions')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Fever, chills, rash, dyspnea, etc."
                />
              </div>
            </div>

            {/* Post-Transfusion */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Post-Transfusion</h2>
              
              <div>
                <Label htmlFor="postTransfusionVitals">Post-Transfusion Vitals</Label>
                <textarea
                  id="postTransfusionVitals"
                  {...register('postTransfusionVitals')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="BP, HR, Temp, RR, SpO2"
                />
              </div>

              <div>
                <Label htmlFor="outcome">Outcome</Label>
                <textarea
                  id="outcome"
                  {...register('outcome')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Patient response to transfusion"
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
                {mutation.isPending ? 'Saving...' : 'Save Transfusion Record'}
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
