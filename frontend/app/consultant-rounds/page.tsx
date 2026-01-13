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

const consultantRoundSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  dateOfRound: z.string().min(1, 'Date is required'),
  timeOfRound: z.string().min(1, 'Time is required'),
  
  // Clinical Assessment
  clinicalAssessment: z.string().min(1, 'Clinical assessment is required'),
  currentStatus: z.string().min(1, 'Current status is required'),
  
  // New Orders
  newOrders: z.array(z.object({
    orderType: z.string(),
    details: z.string(),
    priority: z.enum(['ROUTINE', 'URGENT', 'STAT']),
  })).optional(),
  
  // Plan & Instructions
  plan: z.string().min(1, 'Management plan is required'),
  specialInstructions: z.string().optional(),
  
  // Follow-up
  nextReviewDate: z.string().optional(),
  expectedDischarge: z.string().optional(),
});

type ConsultantRoundFormData = z.infer<typeof consultantRoundSchema>;

export default function ConsultantRoundsPage() {
  const [patientId, setPatientId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsultantRoundFormData>({
    resolver: zodResolver(consultantRoundSchema),
  });

  // Fetch pending orders for acknowledgement
  const { data: pendingOrders } = useQuery({
    queryKey: ['pending-orders', patientId],
    queryFn: () => api.get(`/api/consultant-rounds/${patientId}/pending-orders`).then((res) => res.data),
    enabled: !!patientId,
  });

  const createMutation = useMutation({
    mutationFn: (data: ConsultantRoundFormData) => api.post('/api/consultant-rounds', data),
    onSuccess: () => {
      alert('Consultant round recorded successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (orderId: string) => api.post(`/api/consultant-rounds/orders/${orderId}/acknowledge`),
    onSuccess: () => {
      alert('Order acknowledged successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: ConsultantRoundFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Consultant Rounds</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Round */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">New Consultant Round</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient & Date/Time */}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfRound">Date *</Label>
                <Input
                  id="dateOfRound"
                  type="date"
                  {...register('dateOfRound')}
                />
                {errors.dateOfRound && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfRound.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeOfRound">Time *</Label>
                <Input
                  id="timeOfRound"
                  type="time"
                  {...register('timeOfRound')}
                />
                {errors.timeOfRound && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeOfRound.message}</p>
                )}
              </div>
            </div>

            {/* Clinical Assessment */}
            <div>
              <Label htmlFor="clinicalAssessment">Clinical Assessment *</Label>
              <textarea
                id="clinicalAssessment"
                {...register('clinicalAssessment')}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Current clinical assessment, examination findings"
              />
              {errors.clinicalAssessment && (
                <p className="text-red-500 text-sm mt-1">{errors.clinicalAssessment.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currentStatus">Current Status *</Label>
              <Input
                id="currentStatus"
                {...register('currentStatus')}
                placeholder="e.g., Improving, Stable, Deteriorating"
              />
              {errors.currentStatus && (
                <p className="text-red-500 text-sm mt-1">{errors.currentStatus.message}</p>
              )}
            </div>

            {/* Management Plan */}
            <div>
              <Label htmlFor="plan">Management Plan *</Label>
              <textarea
                id="plan"
                {...register('plan')}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Ongoing treatment plan, investigations, consultations"
              />
              {errors.plan && (
                <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <textarea
                id="specialInstructions"
                {...register('specialInstructions')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any special instructions for nursing staff"
              />
            </div>

            {/* Follow-up */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nextReviewDate">Next Review Date</Label>
                <Input
                  id="nextReviewDate"
                  type="date"
                  {...register('nextReviewDate')}
                />
              </div>

              <div>
                <Label htmlFor="expectedDischarge">Expected Discharge</Label>
                <Input
                  id="expectedDischarge"
                  type="date"
                  {...register('expectedDischarge')}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Record Consultant Round'}
            </Button>
          </form>
        </Card>

        {/* Pending Orders for Acknowledgement */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Orders Requiring Acknowledgement</h2>

          {!patientId && (
            <p className="text-gray-500">Enter a patient ID to view pending orders</p>
          )}

          {pendingOrders && pendingOrders.length === 0 && (
            <p className="text-gray-500">No pending orders for this patient</p>
          )}

          {pendingOrders && pendingOrders.length > 0 && (
            <div className="space-y-4">
              {pendingOrders.map((order: any) => (
                <div key={order.id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{order.orderType}</h3>
                      <p className="text-sm text-gray-600">{order.details}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.priority === 'STAT' ? 'bg-red-100 text-red-800' :
                      order.priority === 'URGENT' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Ordered: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => acknowledgeMutation.mutate(order.id)}
                    disabled={acknowledgeMutation.isPending}
                  >
                    Acknowledge Order
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Guide */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold mb-2">📋 Consultant Round Guidelines:</h4>
            <ul className="text-sm space-y-1">
              <li>• Review all investigation results</li>
              <li>• Assess patient's progress</li>
              <li>• Update management plan</li>
              <li>• Acknowledge and act on pending orders</li>
              <li>• Document clearly for team communication</li>
              <li>• Set next review date</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
