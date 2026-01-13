'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';

const estimateFormSchema = z.object({
  admissionLocation: z.enum(['VIP_ROOM', 'PRIVATE_ROOM', 'ECONOMY_ROOM', 'WARD', 'ICU', 'NICU']),
  roomCharges: z.string().min(1, 'Room charges are required'),
  surgeryCharges: z.string().optional(),
  anesthesiaCharges: z.string().optional(),
  otCharges: z.string().optional(),
  consultantCharges: z.string().optional(),
  medicineCharges: z.string().optional(),
  labInvestigationCharges: z.string().optional(),
  xrayCharges: z.string().optional(),
  otherCharges: z.string().optional(),
  additionalComments: z.string().optional(),
  totalEstimate: z.string().min(1, 'Total estimate is required'),
  paymentReceived: z.string().optional(),
  paymentStatus: z.enum(['FULL_PAYMENT', 'PARTIAL_PAYMENT', 'PENDING']),
});

type EstimateFormData = z.infer<typeof estimateFormSchema>;

export default function PatientEstimatePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      paymentStatus: 'PENDING',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EstimateFormData) =>
      api.post(`/patients/${patientId}/estimate`, data),
    onSuccess: () => {
      alert('Estimate form created successfully! This will be printed for signatures.');
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create estimate form');
    },
  });

  const onSubmit = (data: EstimateFormData) => {
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
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold">Estimate Form</h1>
              <p className="text-sm text-gray-600">Treatment cost estimation at admission</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm font-medium text-yellow-800">
              ⚠️ Important: 100% payment will be received at time of admission (as per hospital policy)
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Admission Location */}
            <div>
              <Label htmlFor="admissionLocation">Admission Location *</Label>
              <select
                id="admissionLocation"
                {...register('admissionLocation')}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select location</option>
                <option value="VIP_ROOM">VIP Room</option>
                <option value="PRIVATE_ROOM">Private Room</option>
                <option value="ECONOMY_ROOM">Economy Room</option>
                <option value="WARD">Ward</option>
                <option value="ICU">ICU</option>
                <option value="NICU">NICU/Nursery</option>
              </select>
              {errors.admissionLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.admissionLocation.message}</p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Cost Breakdown</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roomCharges">Room Charges (per day) *</Label>
                  <Input 
                    id="roomCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('roomCharges')} 
                  />
                  {errors.roomCharges && (
                    <p className="text-red-500 text-sm mt-1">{errors.roomCharges.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="surgeryCharges">Surgery Charges</Label>
                  <Input 
                    id="surgeryCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('surgeryCharges')} 
                  />
                </div>

                <div>
                  <Label htmlFor="anesthesiaCharges">Anesthesia Charges</Label>
                  <Input 
                    id="anesthesiaCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('anesthesiaCharges')} 
                  />
                </div>

                <div>
                  <Label htmlFor="otCharges">OT Charges</Label>
                  <Input 
                    id="otCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('otCharges')} 
                  />
                </div>

                <div>
                  <Label htmlFor="consultantCharges">Consultant Charges</Label>
                  <Input 
                    id="consultantCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('consultantCharges')} 
                  />
                </div>

                <div>
                  <Label htmlFor="medicineCharges">Medicine Charges</Label>
                  <Input 
                    id="medicineCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('medicineCharges')} 
                  />
                </div>

                <div>
                  <Label htmlFor="labInvestigationCharges">Lab Investigation Charges</Label>
                  <Input 
                    id="labInvestigationCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('labInvestigationCharges')} 
                  />
                </div>

                <div>
                  <Label htmlFor="xrayCharges">X-Ray / Imaging Charges</Label>
                  <Input 
                    id="xrayCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('xrayCharges')} 
                  />
                </div>

                <div>
                  <Label htmlFor="otherCharges">Other Charges</Label>
                  <Input 
                    id="otherCharges" 
                    type="number"
                    placeholder="₨ 0" 
                    {...register('otherCharges')} 
                  />
                </div>
              </div>
            </div>

            {/* Additional Comments */}
            <div>
              <Label htmlFor="additionalComments">Additional Comments / Package Details</Label>
              <textarea
                id="additionalComments"
                {...register('additionalComments')}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., Total package ₨70,000 with medicines included. X-ray and other tests separate charges will apply."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use this space for package deals or special terms
              </p>
            </div>

            {/* Total Estimate */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label htmlFor="totalEstimate">Total Estimated Cost *</Label>
              <Input 
                id="totalEstimate" 
                type="number"
                placeholder="₨ 0" 
                {...register('totalEstimate')} 
                className="text-lg font-bold bg-white"
              />
              {errors.totalEstimate && (
                <p className="text-red-500 text-sm mt-1">{errors.totalEstimate.message}</p>
              )}
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Payment Information</h2>
              
              <div>
                <Label htmlFor="paymentReceived">Payment Received (at admission)</Label>
                <Input 
                  id="paymentReceived" 
                  type="number"
                  placeholder="₨ 0" 
                  {...register('paymentReceived')} 
                />
              </div>

              <div>
                <Label htmlFor="paymentStatus">Payment Status *</Label>
                <select
                  id="paymentStatus"
                  {...register('paymentStatus')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PARTIAL_PAYMENT">Partial Payment</option>
                  <option value="FULL_PAYMENT">Full Payment (100%)</option>
                </select>
              </div>
            </div>

            {/* Note about signatures */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium mb-2">📝 After submission:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Print this form for physical signatures</li>
                <li>Receptionist signature required</li>
                <li>Patient/Guardian signature required</li>
                <li>Scan and upload the signed copy back to the system</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Creating Estimate...' : 'Create Estimate Form'}
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
