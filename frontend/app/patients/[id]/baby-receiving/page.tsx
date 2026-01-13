'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tantml:query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Baby } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const babyReceivingSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE']),
  weight: z.string().min(1, 'Weight is required'),
  length: z.string().optional(),
  headCircumference: z.string().optional(),
  
  // Apgar Score
  apgarScore1Min: z.string().min(1, 'Apgar score at 1 min is required'),
  apgarScore5Min: z.string().min(1, 'Apgar score at 5 min is required'),
  apgarScore10Min: z.string().optional(),
  
  // Vitamin K
  vitaminKGiven: z.boolean(),
  vitaminKDose: z.string().optional(),
  vitaminKTime: z.string().optional(),
  
  // Examination
  generalCondition: z.string().optional(),
  skinColor: z.string().optional(),
  cry: z.string().optional(),
  activity: z.string().optional(),
  
  // Abnormalities
  congenitalAbnormalities: z.string().optional(),
  
  notes: z.string().optional(),
});

type BabyReceivingData = z.infer<typeof babyReceivingSchema>;

export default function BabyReceivingPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string; // This is the mother's patient ID
  const [footPrintFile, setFootPrintFile] = useState<File | null>(null);
  const [babyPhotoFile, setBabyPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BabyReceivingData>({
    resolver: zodResolver(babyReceivingSchema),
    defaultValues: {
      vitaminKGiven: true,
    },
  });

  const vitaminKGiven = watch('vitaminKGiven');

  const mutation = useMutation({
    mutationFn: async (data: BabyReceivingData) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (footPrintFile) formData.append('footPrint', footPrintFile);
      if (babyPhotoFile) formData.append('babyPhoto', babyPhotoFile);

      return api.post(`/patients/${patientId}/baby-receiving`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      alert('Baby receiving notes recorded successfully!');
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to record baby receiving notes');
    },
  });

  const onSubmit = (data: BabyReceivingData) => {
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
            <Baby className="w-8 h-8 text-pink-600" />
            <div>
              <h1 className="text-2xl font-bold">Baby Receiving Notes</h1>
              <p className="text-sm text-gray-600">Newborn assessment and documentation</p>
            </div>
          </div>

          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 mb-6">
            <p className="text-sm font-medium text-pink-800">
              👶 Document newborn assessment immediately after delivery
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="weight">Birth Weight (kg) *</Label>
                  <Input id="weight" {...register('weight')} placeholder="3.2" />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input id="length" {...register('length')} placeholder="50" />
                </div>

                <div>
                  <Label htmlFor="headCircumference">Head Circumference (cm)</Label>
                  <Input id="headCircumference" {...register('headCircumference')} placeholder="34" />
                </div>
              </div>
            </div>

            {/* Apgar Score */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Apgar Score</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="apgarScore1Min">At 1 Minute *</Label>
                  <Input 
                    id="apgarScore1Min" 
                    type="number" 
                    min="0" 
                    max="10"
                    {...register('apgarScore1Min')} 
                    placeholder="0-10" 
                  />
                  {errors.apgarScore1Min && (
                    <p className="text-red-500 text-sm mt-1">{errors.apgarScore1Min.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apgarScore5Min">At 5 Minutes *</Label>
                  <Input 
                    id="apgarScore5Min" 
                    type="number" 
                    min="0" 
                    max="10"
                    {...register('apgarScore5Min')} 
                    placeholder="0-10" 
                  />
                  {errors.apgarScore5Min && (
                    <p className="text-red-500 text-sm mt-1">{errors.apgarScore5Min.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apgarScore10Min">At 10 Minutes (if needed)</Label>
                  <Input 
                    id="apgarScore10Min" 
                    type="number" 
                    min="0" 
                    max="10"
                    {...register('apgarScore10Min')} 
                    placeholder="0-10" 
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Apgar Score: 7-10 (Normal), 4-6 (Moderately Abnormal), 0-3 (Low - requires intervention)
              </p>
            </div>

            {/* Vitamin K Administration */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Vitamin K Administration</h2>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vitaminKGiven"
                  {...register('vitaminKGiven')}
                  className="w-4 h-4"
                />
                <Label htmlFor="vitaminKGiven" className="cursor-pointer">
                  Vitamin K Given
                </Label>
              </div>

              {vitaminKGiven && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vitaminKDose">Dose</Label>
                    <Input id="vitaminKDose" {...register('vitaminKDose')} placeholder="1mg IM" />
                  </div>

                  <div>
                    <Label htmlFor="vitaminKTime">Time Given</Label>
                    <Input 
                      id="vitaminKTime" 
                      type="time"
                      {...register('vitaminKTime')} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Examination Findings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Examination Findings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="generalCondition">General Condition</Label>
                  <select
                    id="generalCondition"
                    {...register('generalCondition')}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select condition</option>
                    <option value="ACTIVE">Active</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="skinColor">Skin Color</Label>
                  <select
                    id="skinColor"
                    {...register('skinColor')}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select</option>
                    <option value="PINK">Pink (Normal)</option>
                    <option value="PALE">Pale</option>
                    <option value="CYANOTIC">Cyanotic</option>
                    <option value="JAUNDICED">Jaundiced</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="cry">Cry</Label>
                  <select
                    id="cry"
                    {...register('cry')}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select</option>
                    <option value="LUSTY">Lusty (Strong)</option>
                    <option value="WEAK">Weak</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="activity">Activity</Label>
                  <select
                    id="activity"
                    {...register('activity')}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SLUGGISH">Sluggish</option>
                    <option value="LIMP">Limp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Congenital Abnormalities */}
            <div>
              <Label htmlFor="congenitalAbnormalities">Congenital Abnormalities (if any)</Label>
              <textarea
                id="congenitalAbnormalities"
                {...register('congenitalAbnormalities')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Document any visible abnormalities..."
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Required Documentation</h2>
              
              <div>
                <Label htmlFor="footPrint">Baby Foot Print (Image) *</Label>
                <Input
                  id="footPrint"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFootPrintFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Take a clear photo of the baby's foot print for identification
                </p>
              </div>

              <div>
                <Label htmlFor="babyPhoto">Baby Photo</Label>
                <Input
                  id="babyPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBabyPhotoFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Photo of the newborn for medical records
                </p>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Any additional observations or notes..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-medium mb-2">📝 After submission:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Guardian's signature will be required on printed form</li>
                <li>Staff signature and stamp auto-applied</li>
                <li>Baby will be registered as a new patient linked to mother</li>
                <li>Foot print and photo will be attached to baby's record</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Recording...' : 'Record Baby Receiving Notes'}
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
