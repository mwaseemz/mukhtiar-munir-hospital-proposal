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
import { ArrowLeft, ClipboardList } from 'lucide-react';
import Link from 'next/link';

const postOpOrdersSchema = z.object({
  surgeryId: z.string().min(1, 'Surgery ID is required'),
  
  // Monitoring
  vitalSignsFrequency: z.string().min(1, 'Vitals monitoring frequency is required'),
  neurologicalCheck: z.boolean().optional(),
  fluidBalanceMonitoring: z.boolean().optional(),
  
  // Position & Activity
  position: z.string().optional(),
  activityLevel: z.string().optional(),
  
  // Diet
  dietOrders: z.string().optional(),
  npoUntil: z.string().optional(),
  
  // IV Fluids
  ivFluids: z.string().optional(),
  
  // Medications
  analgesics: z.string().optional(),
  antibiotics: z.string().optional(),
  antiemetics: z.string().optional(),
  otherMedications: z.string().optional(),
  
  // Drains & Tubes
  drainsManagement: z.string().optional(),
  catheterManagement: z.string().optional(),
  ngTubeManagement: z.string().optional(),
  
  // Wound Care
  dressingInstructions: z.string().optional(),
  woundCheckFrequency: z.string().optional(),
  
  // Labs & Investigations
  labOrders: z.string().optional(),
  imagingOrders: z.string().optional(),
  
  // Special Instructions
  specialInstructions: z.string().optional(),
  
  // Consultations
  consultationsNeeded: z.string().optional(),
  
  notes: z.string().optional(),
});

type PostOpOrdersData = z.infer<typeof postOpOrdersSchema>;

export default function PostOpOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostOpOrdersData>({
    resolver: zodResolver(postOpOrdersSchema),
    defaultValues: {
      vitalSignsFrequency: 'Every 1 hour for first 4 hours, then every 4 hours',
      position: 'Supine with head elevation',
      activityLevel: 'Bed rest for 24 hours',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PostOpOrdersData) =>
      api.post(`/patients/${patientId}/post-op-orders`, data),
    onSuccess: () => {
      alert('Post-operative orders recorded successfully!');
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to record post-operative orders');
    },
  });

  const onSubmit = (data: PostOpOrdersData) => {
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
            <ClipboardList className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold">Post-Operative Orders</h1>
              <p className="text-sm text-gray-600">Surgeon's orders immediately after surgery</p>
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6">
            <p className="text-sm font-medium text-indigo-800">
              📋 Surgeon fills this form immediately in the theater after completing the operation
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Surgery ID */}
            <div>
              <Label htmlFor="surgeryId">Surgery/Operation ID *</Label>
              <Input
                id="surgeryId"
                {...register('surgeryId')}
                placeholder="Link to operation record"
              />
              {errors.surgeryId && (
                <p className="text-red-500 text-sm mt-1">{errors.surgeryId.message}</p>
              )}
            </div>

            {/* Monitoring Orders */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Monitoring Orders</h2>
              
              <div>
                <Label htmlFor="vitalSignsFrequency">Vital Signs Monitoring Frequency *</Label>
                <Input
                  id="vitalSignsFrequency"
                  {...register('vitalSignsFrequency')}
                  placeholder="e.g., Every 15 min for 1 hour, then hourly"
                />
                {errors.vitalSignsFrequency && (
                  <p className="text-red-500 text-sm mt-1">{errors.vitalSignsFrequency.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="neurologicalCheck"
                    {...register('neurologicalCheck')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="neurologicalCheck" className="cursor-pointer">
                    Neurological Checks Required
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="fluidBalanceMonitoring"
                    {...register('fluidBalanceMonitoring')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="fluidBalanceMonitoring" className="cursor-pointer">
                    Strict Fluid Balance Monitoring
                  </Label>
                </div>
              </div>
            </div>

            {/* Position & Activity */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Position & Activity</h2>
              
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  {...register('position')}
                  placeholder="e.g., Supine, Semi-Fowler's, Prone"
                />
              </div>

              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Input
                  id="activityLevel"
                  {...register('activityLevel')}
                  placeholder="e.g., Bed rest, Mobilize after 6 hours"
                />
              </div>
            </div>

            {/* Diet Orders */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Diet Orders</h2>
              
              <div>
                <Label htmlFor="dietOrders">Diet Instructions</Label>
                <Input
                  id="dietOrders"
                  {...register('dietOrders')}
                  placeholder="e.g., NPO, Clear liquids, Regular diet"
                />
              </div>

              <div>
                <Label htmlFor="npoUntil">NPO (Nothing by mouth) Until</Label>
                <Input
                  id="npoUntil"
                  type="datetime-local"
                  {...register('npoUntil')}
                />
              </div>
            </div>

            {/* IV Fluids */}
            <div>
              <Label htmlFor="ivFluids">IV Fluids Orders</Label>
              <textarea
                id="ivFluids"
                {...register('ivFluids')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., NS 1000ml over 8 hours, then RL 500ml/8hr"
              />
            </div>

            {/* Medications */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Medications</h2>
              
              <div>
                <Label htmlFor="analgesics">Analgesics (Pain Relief)</Label>
                <textarea
                  id="analgesics"
                  {...register('analgesics')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Inj. Diclofenac 75mg IM BD, Tab. Paracetamol 500mg TDS"
                />
              </div>

              <div>
                <Label htmlFor="antibiotics">Antibiotics</Label>
                <textarea
                  id="antibiotics"
                  {...register('antibiotics')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Inj. Ceftriaxone 1g IV BD for 5 days"
                />
              </div>

              <div>
                <Label htmlFor="antiemetics">Antiemetics (Anti-nausea)</Label>
                <textarea
                  id="antiemetics"
                  {...register('antiemetics')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Inj. Metoclopramide 10mg IV TDS PRN"
                />
              </div>

              <div>
                <Label htmlFor="otherMedications">Other Medications</Label>
                <textarea
                  id="otherMedications"
                  {...register('otherMedications')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Any other medications..."
                />
              </div>
            </div>

            {/* Drains & Tubes Management */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Drains & Tubes Management</h2>
              
              <div>
                <Label htmlFor="drainsManagement">Surgical Drains</Label>
                <textarea
                  id="drainsManagement"
                  {...register('drainsManagement')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Keep on free drainage, monitor output, remove when <30ml/24hr"
                />
              </div>

              <div>
                <Label htmlFor="catheterManagement">Urinary Catheter</Label>
                <textarea
                  id="catheterManagement"
                  {...register('catheterManagement')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Remove after 24 hours, monitor urine output"
                />
              </div>

              <div>
                <Label htmlFor="ngTubeManagement">NG Tube (Nasogastric)</Label>
                <textarea
                  id="ngTubeManagement"
                  {...register('ngTubeManagement')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Keep on free drainage, aspirate 4-hourly"
                />
              </div>
            </div>

            {/* Wound Care */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Wound Care</h2>
              
              <div>
                <Label htmlFor="dressingInstructions">Dressing Instructions</Label>
                <textarea
                  id="dressingInstructions"
                  {...register('dressingInstructions')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Keep dry, change dressing after 48 hours"
                />
              </div>

              <div>
                <Label htmlFor="woundCheckFrequency">Wound Check Frequency</Label>
                <Input
                  id="woundCheckFrequency"
                  {...register('woundCheckFrequency')}
                  placeholder="e.g., Check daily for signs of infection"
                />
              </div>
            </div>

            {/* Labs & Investigations */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Labs & Investigations</h2>
              
              <div>
                <Label htmlFor="labOrders">Laboratory Orders</Label>
                <textarea
                  id="labOrders"
                  {...register('labOrders')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., CBC tomorrow morning, RFT after 48 hours"
                />
              </div>

              <div>
                <Label htmlFor="imagingOrders">Imaging Orders</Label>
                <textarea
                  id="imagingOrders"
                  {...register('imagingOrders')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Chest X-ray if respiratory distress"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <textarea
                id="specialInstructions"
                {...register('specialInstructions')}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Any specific post-operative instructions or precautions..."
              />
            </div>

            {/* Consultations */}
            <div>
              <Label htmlFor="consultationsNeeded">Consultations Needed</Label>
              <textarea
                id="consultationsNeeded"
                {...register('consultationsNeeded')}
                rows={2}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="e.g., Request cardiology consult if chest pain, ICU transfer if deterioration"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Any additional post-operative notes..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium mb-1">📝 Surgeon's Responsibility:</p>
              <p className="text-xs text-gray-600">
                These orders guide the post-operative care team. All orders will be digitally signed and time-stamped. 
                Ward staff will follow these orders strictly and record all actions in treatment tickets.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Saving Orders...' : 'Save Post-Op Orders'}
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
