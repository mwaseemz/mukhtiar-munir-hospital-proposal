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
import { ArrowLeft, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const physicalExamSchema = z.object({
  // General Physical Examination
  generalAppearance: z.string().optional(),
  consciousness: z.string().optional(),
  
  // Vital Signs
  bloodPressure: z.string().min(1, 'Blood pressure is required'),
  pulse: z.string().min(1, 'Pulse is required'),
  temperature: z.string().min(1, 'Temperature is required'),
  respiratoryRate: z.string().min(1, 'Respiratory rate is required'),
  oxygenSaturation: z.string().optional(),
  
  // Physical Examination
  pallor: z.boolean().optional(),
  jaundice: z.boolean().optional(),
  cyanosis: z.boolean().optional(),
  clubbing: z.boolean().optional(),
  edema: z.boolean().optional(),
  lymphadenopathy: z.boolean().optional(),
  
  // Systemic Examination
  cardiovascularSystem: z.string().optional(),
  respiratorySystem: z.string().optional(),
  gastrointestinalSystem: z.string().optional(),
  centralNervousSystem: z.string().optional(),
  musculoskeletalSystem: z.string().optional(),
  
  // Additional Findings
  otherFindings: z.string().optional(),
  
  notes: z.string().optional(),
});

type PhysicalExamData = z.infer<typeof physicalExamSchema>;

export default function PhysicalExaminationPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhysicalExamData>({
    resolver: zodResolver(physicalExamSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: PhysicalExamData) =>
      api.post(`/patients/${patientId}/physical-exam`, data),
    onSuccess: () => {
      alert('Physical examination recorded successfully!');
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to save physical examination');
    },
  });

  const onSubmit = (data: PhysicalExamData) => {
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
            <Stethoscope className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold">General Physical Examination</h1>
              <p className="text-sm text-gray-600">Complete physical examination by Medical Officer</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* General Appearance */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">General Appearance</h2>
              
              <div>
                <Label htmlFor="generalAppearance">General Appearance</Label>
                <Input id="generalAppearance" {...register('generalAppearance')} placeholder="e.g., Well-nourished, alert" />
              </div>

              <div>
                <Label htmlFor="consciousness">Consciousness Level</Label>
                <select
                  id="consciousness"
                  {...register('consciousness')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select consciousness level</option>
                  <option value="ALERT">Alert</option>
                  <option value="DROWSY">Drowsy</option>
                  <option value="CONFUSED">Confused</option>
                  <option value="UNCONSCIOUS">Unconscious</option>
                </select>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Vital Signs</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure (mmHg) *</Label>
                  <Input id="bloodPressure" {...register('bloodPressure')} placeholder="120/80" />
                  {errors.bloodPressure && (
                    <p className="text-red-500 text-sm mt-1">{errors.bloodPressure.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pulse">Pulse (bpm) *</Label>
                  <Input id="pulse" {...register('pulse')} placeholder="75" />
                  {errors.pulse && (
                    <p className="text-red-500 text-sm mt-1">{errors.pulse.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="temperature">Temperature (°F) *</Label>
                  <Input id="temperature" {...register('temperature')} placeholder="98.6" />
                  {errors.temperature && (
                    <p className="text-red-500 text-sm mt-1">{errors.temperature.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="respiratoryRate">Respiratory Rate (per min) *</Label>
                  <Input id="respiratoryRate" {...register('respiratoryRate')} placeholder="16" />
                  {errors.respiratoryRate && (
                    <p className="text-red-500 text-sm mt-1">{errors.respiratoryRate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="oxygenSaturation">Oxygen Saturation (SpO₂)</Label>
                  <Input id="oxygenSaturation" {...register('oxygenSaturation')} placeholder="98%" />
                </div>
              </div>
            </div>

            {/* Physical Examination Findings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Physical Examination Findings</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pallor" {...register('pallor')} className="w-4 h-4" />
                  <Label htmlFor="pallor" className="cursor-pointer">Pallor</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="jaundice" {...register('jaundice')} className="w-4 h-4" />
                  <Label htmlFor="jaundice" className="cursor-pointer">Jaundice</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="cyanosis" {...register('cyanosis')} className="w-4 h-4" />
                  <Label htmlFor="cyanosis" className="cursor-pointer">Cyanosis</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="clubbing" {...register('clubbing')} className="w-4 h-4" />
                  <Label htmlFor="clubbing" className="cursor-pointer">Clubbing</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="edema" {...register('edema')} className="w-4 h-4" />
                  <Label htmlFor="edema" className="cursor-pointer">Edema</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="lymphadenopathy" {...register('lymphadenopathy')} className="w-4 h-4" />
                  <Label htmlFor="lymphadenopathy" className="cursor-pointer">Lymphadenopathy</Label>
                </div>
              </div>
            </div>

            {/* Systemic Examination */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Systemic Examination</h2>
              
              <div>
                <Label htmlFor="cardiovascularSystem">Cardiovascular System</Label>
                <textarea
                  id="cardiovascularSystem"
                  {...register('cardiovascularSystem')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Heart sounds, murmurs, etc."
                />
              </div>

              <div>
                <Label htmlFor="respiratorySystem">Respiratory System</Label>
                <textarea
                  id="respiratorySystem"
                  {...register('respiratorySystem')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Breath sounds, air entry, etc."
                />
              </div>

              <div>
                <Label htmlFor="gastrointestinalSystem">Gastrointestinal System</Label>
                <textarea
                  id="gastrointestinalSystem"
                  {...register('gastrointestinalSystem')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Abdomen examination findings"
                />
              </div>

              <div>
                <Label htmlFor="centralNervousSystem">Central Nervous System</Label>
                <textarea
                  id="centralNervousSystem"
                  {...register('centralNervousSystem')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Neurological examination findings"
                />
              </div>

              <div>
                <Label htmlFor="musculoskeletalSystem">Musculoskeletal System</Label>
                <textarea
                  id="musculoskeletalSystem"
                  {...register('musculoskeletalSystem')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Joint, bone, muscle examination"
                />
              </div>
            </div>

            {/* Other Findings */}
            <div>
              <Label htmlFor="otherFindings">Other Findings</Label>
              <textarea
                id="otherFindings"
                {...register('otherFindings')}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Any additional findings or observations"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Clinical notes"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Saving...' : 'Save Physical Examination'}
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
