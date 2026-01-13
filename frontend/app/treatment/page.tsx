'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const treatmentOrderSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  route: z.enum(['ORAL', 'IV', 'IM', 'SC', 'TOPICAL', 'INHALED', 'RECTAL', 'OTHER']),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional(),
  indication: z.string().optional(),
  isPRN: z.boolean().optional(),
  prnInstructions: z.string().optional(),
});

type TreatmentOrderFormData = z.infer<typeof treatmentOrderSchema>;

export default function TreatmentPage() {
  const [patientId, setPatientId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TreatmentOrderFormData>({
    resolver: zodResolver(treatmentOrderSchema),
    defaultValues: {
      route: 'ORAL',
      isPRN: false,
    },
  });

  const isPRN = watch('isPRN');

  // Fetch active orders for patient
  const { data: orders } = useQuery({
    queryKey: ['treatment-orders', patientId],
    queryFn: () => api.get(`/api/treatment/${patientId}/orders`).then((res) => res.data),
    enabled: !!patientId,
  });

  const createMutation = useMutation({
    mutationFn: (data: TreatmentOrderFormData) => api.post('/api/treatment/orders', data),
    onSuccess: () => {
      alert('Treatment order created successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: TreatmentOrderFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Treatment Orders & Medication Administration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Order */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create Treatment Order</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="patientId">Patient ID / MR Number *</Label>
              <Input
                id="patientId"
                {...register('patientId')}
                placeholder="Enter patient ID"
                onChange={(e) => setPatientId(e.target.value)}
              />
              {errors.patientId && (
                <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="medicationName">Medication Name *</Label>
              <Input
                id="medicationName"
                {...register('medicationName')}
                placeholder="e.g., Paracetamol"
              />
              {errors.medicationName && (
                <p className="text-red-500 text-sm mt-1">{errors.medicationName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  {...register('dosage')}
                  placeholder="e.g., 500mg"
                />
                {errors.dosage && (
                  <p className="text-red-500 text-sm mt-1">{errors.dosage.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="route">Route *</Label>
                <select
                  id="route"
                  {...register('route')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ORAL">Oral</option>
                  <option value="IV">IV (Intravenous)</option>
                  <option value="IM">IM (Intramuscular)</option>
                  <option value="SC">SC (Subcutaneous)</option>
                  <option value="TOPICAL">Topical</option>
                  <option value="INHALED">Inhaled</option>
                  <option value="RECTAL">Rectal</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="frequency">Frequency *</Label>
              <Input
                id="frequency"
                {...register('frequency')}
                placeholder="e.g., TDS (3 times daily)"
              />
              {errors.frequency && (
                <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  {...register('duration')}
                  placeholder="e.g., 7 days"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="indication">Indication</Label>
              <Input
                id="indication"
                {...register('indication')}
                placeholder="Reason for medication"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPRN"
                {...register('isPRN')}
                className="h-4 w-4"
              />
              <Label htmlFor="isPRN" className="cursor-pointer">
                PRN (As Needed)
              </Label>
            </div>

            {isPRN && (
              <div>
                <Label htmlFor="prnInstructions">PRN Instructions</Label>
                <textarea
                  id="prnInstructions"
                  {...register('prnInstructions')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="When to give PRN medication"
                />
              </div>
            )}

            <div>
              <Label htmlFor="instructions">Special Instructions</Label>
              <textarea
                id="instructions"
                {...register('instructions')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Additional instructions"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Treatment Order'}
            </Button>
          </form>
        </Card>

        {/* Active Orders List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Active Treatment Orders</h2>

          {!patientId && (
            <p className="text-gray-500">Enter a patient ID to view active orders</p>
          )}

          {orders && orders.length === 0 && (
            <p className="text-gray-500">No active orders for this patient</p>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{order.medicationName}</h3>
                  <p className="text-sm text-gray-600">
                    {order.dosage} | {order.route} | {order.frequency}
                  </p>
                  {order.indication && (
                    <p className="text-sm text-gray-600">Indication: {order.indication}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                  {order.isPRN && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                      PRN
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
