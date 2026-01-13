'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const investigationProfileSchema = z.object({
  // Hematology
  cbc: z.boolean().optional(),
  hemoglobin: z.boolean().optional(),
  tlc: z.boolean().optional(),
  plateletCount: z.boolean().optional(),
  esr: z.boolean().optional(),
  
  // Blood Chemistry
  bloodSugarRandom: z.boolean().optional(),
  bloodSugarFasting: z.boolean().optional(),
  hba1c: z.boolean().optional(),
  renalFunctionTest: z.boolean().optional(),
  liverFunctionTest: z.boolean().optional(),
  
  // Viral Markers
  hbsAg: z.boolean().optional(),
  antiHCV: z.boolean().optional(),
  hiv: z.boolean().optional(),
  
  // Coagulation Profile
  pt: z.boolean().optional(),
  aptt: z.boolean().optional(),
  inr: z.boolean().optional(),
  
  // Imaging
  xrayChest: z.boolean().optional(),
  xrayAbdomen: z.boolean().optional(),
  ultrasound: z.boolean().optional(),
  ctScan: z.boolean().optional(),
  mri: z.boolean().optional(),
  ecg: z.boolean().optional(),
  echo: z.boolean().optional(),
  
  // Urine Analysis
  urineRE: z.boolean().optional(),
  urineCulture: z.boolean().optional(),
  
  // Others
  bloodGrouping: z.boolean().optional(),
  crossMatching: z.boolean().optional(),
  
  additionalTests: z.string().optional(),
  notes: z.string().optional(),
});

type InvestigationProfileData = z.infer<typeof investigationProfileSchema>;

export default function InvestigationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvestigationProfileData>({
    resolver: zodResolver(investigationProfileSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: InvestigationProfileData) =>
      api.post(`/patients/${patientId}/investigation-profile`, data),
    onSuccess: () => {
      alert('Investigation profile saved successfully!');
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to save investigation profile');
    },
  });

  const onSubmit = (data: InvestigationProfileData) => {
    mutation.mutate(data);
  };

  const CheckboxField = ({ id, label, register }: any) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        {...register(id)}
        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-sm cursor-pointer select-none">
        {label}
      </label>
    </div>
  );

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
            <FileCheck className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold">Investigation Profile</h1>
              <p className="text-sm text-gray-600">Check investigations completed for this patient</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm font-medium text-blue-800">
              ℹ️ Select all investigations that have been completed. This helps track pre-admission requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hematology */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-600" />
                Hematology
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                <CheckboxField id="cbc" label="Complete Blood Count (CBC)" register={register} />
                <CheckboxField id="hemoglobin" label="Hemoglobin" register={register} />
                <CheckboxField id="tlc" label="Total Leukocyte Count (TLC)" register={register} />
                <CheckboxField id="plateletCount" label="Platelet Count" register={register} />
                <CheckboxField id="esr" label="ESR (Erythrocyte Sedimentation Rate)" register={register} />
              </div>
            </div>

            {/* Blood Chemistry */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Blood Chemistry
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                <CheckboxField id="bloodSugarRandom" label="Blood Sugar (Random)" register={register} />
                <CheckboxField id="bloodSugarFasting" label="Blood Sugar (Fasting)" register={register} />
                <CheckboxField id="hba1c" label="HbA1c" register={register} />
                <CheckboxField id="renalFunctionTest" label="Renal Function Test (RFT)" register={register} />
                <CheckboxField id="liverFunctionTest" label="Liver Function Test (LFT)" register={register} />
              </div>
            </div>

            {/* Viral Markers */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
                Viral Markers (Required for Surgery)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                <CheckboxField id="hbsAg" label="HBsAg (Hepatitis B)" register={register} />
                <CheckboxField id="antiHCV" label="Anti-HCV (Hepatitis C)" register={register} />
                <CheckboxField id="hiv" label="HIV" register={register} />
              </div>
            </div>

            {/* Coagulation Profile */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Coagulation Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                <CheckboxField id="pt" label="PT (Prothrombin Time)" register={register} />
                <CheckboxField id="aptt" label="APTT (Activated Partial Thromboplastin Time)" register={register} />
                <CheckboxField id="inr" label="INR (International Normalized Ratio)" register={register} />
              </div>
            </div>

            {/* Imaging Studies */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Imaging Studies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                <CheckboxField id="xrayChest" label="X-Ray Chest" register={register} />
                <CheckboxField id="xrayAbdomen" label="X-Ray Abdomen" register={register} />
                <CheckboxField id="ultrasound" label="Ultrasound" register={register} />
                <CheckboxField id="ctScan" label="CT Scan" register={register} />
                <CheckboxField id="mri" label="MRI" register={register} />
                <CheckboxField id="ecg" label="ECG (Electrocardiogram)" register={register} />
                <CheckboxField id="echo" label="Echocardiography" register={register} />
              </div>
            </div>

            {/* Urine Analysis */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                Urine Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                <CheckboxField id="urineRE" label="Urine R/E (Routine Examination)" register={register} />
                <CheckboxField id="urineCulture" label="Urine Culture" register={register} />
              </div>
            </div>

            {/* Blood Bank */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-600" />
                Blood Bank
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                <CheckboxField id="bloodGrouping" label="Blood Grouping & Typing" register={register} />
                <CheckboxField id="crossMatching" label="Cross-Matching" register={register} />
              </div>
            </div>

            {/* Additional Tests */}
            <div>
              <label className="block text-sm font-medium mb-2">Additional Tests</label>
              <textarea
                {...register('additionalTests')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="List any other investigations completed..."
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Any additional notes about investigations..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Saving...' : 'Save Investigation Profile'}
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
