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

const inputOutputSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  
  // Input
  inputType: z.enum(['ORAL', 'IV', 'ENTERAL', 'OTHER']),
  inputAmount: z.number().min(0, 'Must be positive'),
  inputDetails: z.string().optional(),
  
  // Output
  outputType: z.enum(['URINE', 'STOOL', 'VOMIT', 'DRAIN', 'BLOOD_LOSS', 'OTHER']),
  outputAmount: z.number().min(0, 'Must be positive'),
  outputDetails: z.string().optional(),
  
  // Notes
  notes: z.string().optional(),
});

type InputOutputFormData = z.infer<typeof inputOutputSchema>;

export default function InputOutputPage() {
  const [patientId, setPatientId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<InputOutputFormData>({
    resolver: zodResolver(inputOutputSchema),
    defaultValues: {
      inputType: 'ORAL',
      outputType: 'URINE',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InputOutputFormData) => api.post('/api/input-output', data),
    onSuccess: () => {
      alert('I/O entry recorded successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: InputOutputFormData) => {
    createMutation.mutate({
      ...data,
      inputAmount: Number(data.inputAmount),
      outputAmount: Number(data.outputAmount),
    });
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Input/Output Chart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record Entry */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Record I/O Entry</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient & DateTime */}
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
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  defaultValue={getCurrentDate()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                  defaultValue={getCurrentTime()}
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* INPUT Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 text-green-700">💧 INPUT</h3>

              <div>
                <Label htmlFor="inputType">Input Type *</Label>
                <select
                  id="inputType"
                  {...register('inputType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ORAL">Oral (PO)</option>
                  <option value="IV">IV (Intravenous)</option>
                  <option value="ENTERAL">Enteral (Tube Feeding)</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="inputAmount">Amount (mL) *</Label>
                <Input
                  id="inputAmount"
                  type="number"
                  {...register('inputAmount', { valueAsNumber: true })}
                  placeholder="e.g., 500"
                />
                {errors.inputAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.inputAmount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="inputDetails">Details (Optional)</Label>
                <Input
                  id="inputDetails"
                  {...register('inputDetails')}
                  placeholder="e.g., Normal saline, Water"
                />
              </div>
            </div>

            {/* OUTPUT Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 text-orange-700">💧 OUTPUT</h3>

              <div>
                <Label htmlFor="outputType">Output Type *</Label>
                <select
                  id="outputType"
                  {...register('outputType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="URINE">Urine</option>
                  <option value="STOOL">Stool</option>
                  <option value="VOMIT">Vomit</option>
                  <option value="DRAIN">Drain</option>
                  <option value="BLOOD_LOSS">Blood Loss</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="outputAmount">Amount (mL) *</Label>
                <Input
                  id="outputAmount"
                  type="number"
                  {...register('outputAmount', { valueAsNumber: true })}
                  placeholder="e.g., 300"
                />
                {errors.outputAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.outputAmount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="outputDetails">Details (Optional)</Label>
                <Input
                  id="outputDetails"
                  {...register('outputDetails')}
                  placeholder="e.g., Color, consistency"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                {...register('notes')}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any relevant notes"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Recording...' : 'Record I/O Entry'}
            </Button>
          </form>
        </Card>

        {/* Summary Card */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Daily Summary</h2>

          <p className="text-gray-500 mb-4">
            {patientId && selectedDate
              ? `Showing summary for ${selectedDate}`
              : 'Enter patient ID and date to view summary'}
          </p>

          {patientId && selectedDate && (
            <div className="space-y-6">
              {/* Total Input */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Total Input</h3>
                <p className="text-3xl font-bold text-green-600">--- mL</p>
                <p className="text-sm text-gray-600 mt-2">Oral + IV + Enteral</p>
              </div>

              {/* Total Output */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Total Output</h3>
                <p className="text-3xl font-bold text-orange-600">--- mL</p>
                <p className="text-sm text-gray-600 mt-2">Urine + Drains + Other</p>
              </div>

              {/* Net Balance */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Net Balance</h3>
                <p className="text-3xl font-bold text-blue-600">--- mL</p>
                <p className="text-sm text-gray-600 mt-2">Input - Output</p>
              </div>

              <div className="text-sm text-gray-500 italic">
                Note: Fetch summary data from API to display actual values
              </div>
            </div>
          )}

          {/* Guide */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold mb-2">📋 I/O Chart Guidelines:</h4>
            <ul className="text-sm space-y-1">
              <li>• Record all intake (oral, IV, tube feeding)</li>
              <li>• Record all output (urine, drains, vomit)</li>
              <li>• Measure and document accurately</li>
              <li>• Note color and consistency for outputs</li>
              <li>• Monitor for fluid imbalance</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
