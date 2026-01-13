'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { patientApi } from '@/lib/api';
import { ArrowLeft, Save, Plus, Trash2, Calculator } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { DigitalSignature, SignatureData } from '@/components/DigitalSignature';
import { useAuthStore } from '@/lib/store';

const estimateItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0, 'Unit price must be positive'),
  amount: z.coerce.number().min(0),
});

const estimateFormSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  // Patient Information (Auto-filled)
  patientName: z.string(),
  mrNumber: z.string(),
  
  // Operation Details
  operationType: z.string().min(1, 'Operation type is required'),
  surgeonName: z.string().min(1, 'Surgeon name is required'),
  estimatedDuration: z.string().min(1, 'Estimated duration is required'),
  
  // Estimate Items
  items: z.array(estimateItemSchema).min(1, 'At least one item is required'),
  
  // Totals
  subtotal: z.coerce.number(),
  tax: z.coerce.number(),
  discount: z.coerce.number().min(0),
  total: z.coerce.number(),
  
  // Payment Terms
  advancePayment: z.coerce.number().min(0),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID']),
  
  // Notes
  notes: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type EstimateFormData = z.infer<typeof estimateFormSchema>;

const defaultItems = [
  { description: 'OT Charges', quantity: 1, unitPrice: 0, amount: 0 },
  { description: 'Surgeon Fee', quantity: 1, unitPrice: 0, amount: 0 },
  { description: 'Anesthetist Fee', quantity: 1, unitPrice: 0, amount: 0 },
  { description: 'Medicines & Supplies', quantity: 1, unitPrice: 0, amount: 0 },
  { description: 'Ward/ICU Charges (per day)', quantity: 1, unitPrice: 0, amount: 0 },
];

export default function EstimateFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  const [error, setError] = useState('');
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const { user } = useAuthStore();

  // Fetch patient details
  const { data: patientData } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientApi.getById(patientId!),
    enabled: !!patientId,
  });

  const patient = patientData?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues: {
      items: defaultItems,
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      advancePayment: 0,
      paymentStatus: 'PENDING',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items');
  const watchDiscount = watch('discount');

  // Auto-calculate totals
  useEffect(() => {
    const subtotal = watchItems.reduce((sum, item) => {
      const amount = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + amount;
    }, 0);

    const tax = subtotal * 0.05; // 5% tax (adjust as needed)
    const discount = watchDiscount || 0;
    const total = subtotal + tax - discount;

    setValue('subtotal', subtotal);
    setValue('tax', tax);
    setValue('total', total);
  }, [watchItems, watchDiscount, setValue]);

  // Auto-fill patient data
  useEffect(() => {
    if (patient) {
      setValue('patientId', patient.id);
      setValue('patientName', `${patient.firstName} ${patient.lastName}`);
      setValue('mrNumber', patient.mrNumber);
    }
  }, [patient, setValue]);

  const createEstimateMutation = useMutation({
    mutationFn: (data: any) => {
      // TODO: Call API to create estimate
      return Promise.resolve({ data: {} });
    },
    onSuccess: () => {
      alert('Estimate Form saved successfully!');
      router.push(`/patients/${patientId}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to save estimate form');
    },
  });

  const onSubmit = (data: EstimateFormData) => {
    if (!signature) {
      setError('Digital signature is required');
      return;
    }
    setError('');
    createEstimateMutation.mutate({ ...data, signature });
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Loading patient information...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = watch('subtotal');
  const tax = watch('tax');
  const discount = watch('discount');
  const total = watch('total');
  const advancePayment = watch('advancePayment');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-blue-900">
                Estimate Form / Treatment Cost Estimation
              </CardTitle>
              <CardDescription className="text-sm font-semibold text-blue-700">
                Surgery & Hospitalization Cost Breakdown
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-md border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Name:</span> {patient.firstName} {patient.lastName}
                  </div>
                  <div>
                    <span className="font-semibold">MR Number:</span> {patient.mrNumber}
                  </div>
                  <div>
                    <span className="font-semibold">Age:</span> {patient.age} years
                  </div>
                  <div>
                    <span className="font-semibold">Gender:</span> {patient.gender}
                  </div>
                </div>
              </div>

              {/* Operation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Operation Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Operation Type *</Label>
                    <Input {...register('operationType')} placeholder="e.g., Appendectomy" />
                    {errors.operationType && (
                      <p className="text-sm text-red-500 mt-1">{errors.operationType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Surgeon Name *</Label>
                    <Input {...register('surgeonName')} placeholder="Dr. Name" />
                    {errors.surgeonName && (
                      <p className="text-sm text-red-500 mt-1">{errors.surgeonName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Estimated Duration *</Label>
                    <Input {...register('estimatedDuration')} placeholder="e.g., 2-3 hours" />
                    {errors.estimatedDuration && (
                      <p className="text-sm text-red-500 mt-1">{errors.estimatedDuration.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 pb-2">
                  <h3 className="text-lg font-semibold">Cost Breakdown</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0, amount: 0 })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold">Description</th>
                        <th className="text-center p-3 text-sm font-semibold w-24">Qty</th>
                        <th className="text-right p-3 text-sm font-semibold w-32">Unit Price</th>
                        <th className="text-right p-3 text-sm font-semibold w-32">Amount</th>
                        <th className="text-center p-3 text-sm font-semibold w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => {
                        const quantity = watchItems[index]?.quantity || 0;
                        const unitPrice = watchItems[index]?.unitPrice || 0;
                        const amount = quantity * unitPrice;

                        return (
                          <tr key={field.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <Input
                                {...register(`items.${index}.description` as const)}
                                placeholder="Item description"
                                className="w-full"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                {...register(`items.${index}.quantity` as const)}
                                className="w-full text-center"
                                min="1"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                {...register(`items.${index}.unitPrice` as const)}
                                className="w-full text-right"
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="p-2 text-right font-semibold">
                              Rs. {amount.toLocaleString()}
                            </td>
                            <td className="p-2 text-center">
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-md">
                <div className="space-y-3 max-w-md ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Subtotal:</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Tax (5%):</span>
                    <span>Rs. {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Discount:</span>
                    <div className="flex items-center gap-2">
                      <span>Rs.</span>
                      <Input
                        type="number"
                        {...register('discount')}
                        className="w-32 text-right"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="border-t-2 border-blue-300 pt-3 flex justify-between text-lg font-bold">
                    <span>Total Estimate:</span>
                    <span className="text-blue-700">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Payment Terms</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Advance Payment Required *</Label>
                    <Input
                      type="number"
                      {...register('advancePayment')}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Remaining: Rs. {(total - advancePayment).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label>Payment Status *</Label>
                    <select
                      {...register('paymentStatus')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PARTIAL">Partial Payment</option>
                      <option value="PAID">Fully Paid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Additional Information</h3>

                <div>
                  <Label>Notes</Label>
                  <textarea
                    {...register('notes')}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div>
                  <Label>Special Instructions</Label>
                  <textarea
                    {...register('specialInstructions')}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Special instructions or requirements..."
                  />
                </div>
              </div>

              {/* Digital Signature */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Signature</h3>
                <DigitalSignature
                  userName={user?.firstName + ' ' + user?.lastName || 'User'}
                  userRole={user?.role || 'Staff'}
                  onSignatureComplete={setSignature}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createEstimateMutation.isPending || !signature}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createEstimateMutation.isPending ? 'Saving...' : 'Save Estimate Form'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={createEstimateMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Card className="mt-4 bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center text-xs text-gray-700">
            <p className="font-semibold mb-1">⚠️ Important</p>
            <p>This is an estimate only. Actual costs may vary based on complications, additional procedures, or extended hospital stay.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
