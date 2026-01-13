'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { patientApi } from '@/lib/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { DigitalSignature, SignatureData } from '@/components/DigitalSignature';
import { useAuthStore } from '@/lib/store';

const wardAdmissionSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  // Patient Information (Auto-filled)
  patientName: z.string(),
  mrNumber: z.string(),
  
  // Admission Details
  admittedFrom: z.enum(['EMERGENCY', 'OPD', 'OT', 'TRANSFER']),
  wardName: z.string().min(1, 'Ward name is required'),
  bedNumber: z.string().min(1, 'Bed number is required'),
  admissionDateTime: z.string().min(1, 'Admission date/time is required'),
  
  // Patient Condition on Arrival
  consciousness: z.enum(['ALERT', 'DROWSY', 'UNCONSCIOUS', 'CONFUSED']),
  breathing: z.enum(['NORMAL', 'LABORED', 'ASSISTED', 'ON_VENTILATOR']),
  
  // Vital Signs on Admission
  temperature: z.string().min(1, 'Temperature is required'),
  bloodPressure: z.string().min(1, 'Blood pressure is required'),
  pulse: z.string().min(1, 'Pulse is required'),
  respiratoryRate: z.string().min(1, 'Respiratory rate is required'),
  oxygenSaturation: z.string().min(1, 'Oxygen saturation is required'),
  
  // Physical Examination
  skinCondition: z.string().optional(),
  wounds: z.string().optional(),
  mobility: z.enum(['AMBULATORY', 'WITH_ASSISTANCE', 'BEDBOUND', 'WHEELCHAIR']),
  
  // Patient Belongings
  belongingsBrought: z.boolean(),
  belongingsDescription: z.string().optional(),
  valuablesSecured: z.boolean(),
  
  // IV Lines & Devices
  ivLinePresent: z.boolean(),
  ivLineDetails: z.string().optional(),
  catheterPresent: z.boolean(),
  catheterDetails: z.string().optional(),
  drainPresent: z.boolean(),
  drainDetails: z.string().optional(),
  
  // Medications on Admission
  medicationsContinued: z.boolean(),
  medicationsDetails: z.string().optional(),
  
  // Allergies & Alerts
  allergies: z.string().optional(),
  specialPrecautions: z.string().optional(),
  isolationRequired: z.boolean(),
  isolationType: z.string().optional(),
  
  // Risk Assessment
  fallRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  pressureUlcerRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  
  // Diet & Nutrition
  dietType: z.string().min(1, 'Diet type is required'),
  fluidRestriction: z.boolean(),
  fluidRestrictionDetails: z.string().optional(),
  
  // Initial Orders
  initialOrders: z.string().optional(),
  nursingInstructions: z.string().optional(),
  
  // Communication
  familyNotified: z.boolean(),
  familyContactNumber: z.string().optional(),
  patientOriented: z.boolean(),
  
  // Notes
  additionalNotes: z.string().optional(),
});

type WardAdmissionFormData = z.infer<typeof wardAdmissionSchema>;

export default function WardAdmissionPage() {
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
    formState: { errors },
  } = useForm<WardAdmissionFormData>({
    resolver: zodResolver(wardAdmissionSchema),
    defaultValues: {
      admittedFrom: 'EMERGENCY',
      consciousness: 'ALERT',
      breathing: 'NORMAL',
      mobility: 'AMBULATORY',
      belongingsBrought: false,
      valuablesSecured: false,
      ivLinePresent: false,
      catheterPresent: false,
      drainPresent: false,
      medicationsContinued: false,
      isolationRequired: false,
      fallRisk: 'LOW',
      pressureUlcerRisk: 'LOW',
      fluidRestriction: false,
      familyNotified: false,
      patientOriented: false,
      admissionDateTime: new Date().toISOString().slice(0, 16),
    },
  });

  // Auto-fill patient data
  useEffect(() => {
    if (patient) {
      setValue('patientId', patient.id);
      setValue('patientName', `${patient.firstName} ${patient.lastName}`);
      setValue('mrNumber', patient.mrNumber);
      setValue('wardName', patient.wardNumber || '');
      setValue('bedNumber', patient.bedNumber || '');
      setValue('allergies', patient.allergies || '');
    }
  }, [patient, setValue]);

  const createWardAdmissionMutation = useMutation({
    mutationFn: (data: any) => {
      // TODO: Call API to create ward admission record
      return Promise.resolve({ data: {} });
    },
    onSuccess: () => {
      alert('Ward Admission Protocol saved successfully!');
      router.push(`/patients/${patientId}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to save ward admission protocol');
    },
  });

  const onSubmit = (data: WardAdmissionFormData) => {
    if (!signature) {
      setError('Digital signature is required');
      return;
    }
    setError('');
    createWardAdmissionMutation.mutate({ ...data, signature });
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

  const ivLinePresent = watch('ivLinePresent');
  const catheterPresent = watch('catheterPresent');
  const drainPresent = watch('drainPresent');
  const isolationRequired = watch('isolationRequired');
  const fluidRestriction = watch('fluidRestriction');

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
          <CardHeader className="bg-green-50 border-b-2 border-green-200">
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-green-900">
                Protocol for Receiving Patient in Ward
              </CardTitle>
              <p className="text-sm text-gray-600">
                Complete checklist for ward admission
              </p>
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

              {/* Admission Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Admission Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Admitted From *</Label>
                    <select
                      {...register('admittedFrom')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="EMERGENCY">Emergency Department</option>
                      <option value="OPD">OPD</option>
                      <option value="OT">Operation Theater (Post-Op)</option>
                      <option value="TRANSFER">Transfer from Another Ward</option>
                    </select>
                  </div>

                  <div>
                    <Label>Admission Date/Time *</Label>
                    <Input type="datetime-local" {...register('admissionDateTime')} />
                  </div>

                  <div>
                    <Label>Ward Name *</Label>
                    <Input {...register('wardName')} placeholder="e.g., Medical Ward A" />
                    {errors.wardName && (
                      <p className="text-sm text-red-500 mt-1">{errors.wardName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Bed Number *</Label>
                    <Input {...register('bedNumber')} placeholder="e.g., B-12" />
                    {errors.bedNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.bedNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient Condition on Arrival */}
              <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-md space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-700" />
                  <h3 className="text-lg font-semibold text-yellow-900">Patient Condition on Arrival</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Level of Consciousness *</Label>
                    <select
                      {...register('consciousness')}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                    >
                      <option value="ALERT">Alert & Oriented</option>
                      <option value="DROWSY">Drowsy</option>
                      <option value="UNCONSCIOUS">Unconscious</option>
                      <option value="CONFUSED">Confused</option>
                    </select>
                  </div>

                  <div>
                    <Label>Breathing Status *</Label>
                    <select
                      {...register('breathing')}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                    >
                      <option value="NORMAL">Normal (Spontaneous)</option>
                      <option value="LABORED">Labored Breathing</option>
                      <option value="ASSISTED">Oxygen Assisted</option>
                      <option value="ON_VENTILATOR">On Ventilator</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Vital Signs on Admission */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Vital Signs on Admission</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Temperature (°F) *</Label>
                    <Input {...register('temperature')} placeholder="98.6" />
                    {errors.temperature && (
                      <p className="text-sm text-red-500 mt-1">{errors.temperature.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Blood Pressure (mmHg) *</Label>
                    <Input {...register('bloodPressure')} placeholder="120/80" />
                    {errors.bloodPressure && (
                      <p className="text-sm text-red-500 mt-1">{errors.bloodPressure.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Pulse (bpm) *</Label>
                    <Input {...register('pulse')} placeholder="72" />
                    {errors.pulse && (
                      <p className="text-sm text-red-500 mt-1">{errors.pulse.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Respiratory Rate *</Label>
                    <Input {...register('respiratoryRate')} placeholder="16/min" />
                    {errors.respiratoryRate && (
                      <p className="text-sm text-red-500 mt-1">{errors.respiratoryRate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>Oxygen Saturation (%) *</Label>
                    <Input {...register('oxygenSaturation')} placeholder="98%" />
                    {errors.oxygenSaturation && (
                      <p className="text-sm text-red-500 mt-1">{errors.oxygenSaturation.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Physical Examination */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Physical Examination</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Mobility Status *</Label>
                    <select
                      {...register('mobility')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="AMBULATORY">Ambulatory (Walking)</option>
                      <option value="WITH_ASSISTANCE">With Assistance</option>
                      <option value="BEDBOUND">Bedbound</option>
                      <option value="WHEELCHAIR">Wheelchair</option>
                    </select>
                  </div>

                  <div>
                    <Label>Skin Condition</Label>
                    <Input {...register('skinCondition')} placeholder="Normal, intact, dry..." />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Wounds / Surgical Sites</Label>
                    <textarea
                      {...register('wounds')}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Describe any wounds, surgical incisions, dressings..."
                    />
                  </div>
                </div>
              </div>

              {/* IV Lines & Devices */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">IV Lines & Medical Devices</h3>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('ivLinePresent')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <div>
                      <span className="text-sm font-semibold">IV Line Present</span>
                      {ivLinePresent && (
                        <div className="mt-2">
                          <Input
                            {...register('ivLineDetails')}
                            placeholder="Location, size, insertion date, fluids running..."
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('catheterPresent')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <div>
                      <span className="text-sm font-semibold">Urinary Catheter Present</span>
                      {catheterPresent && (
                        <div className="mt-2">
                          <Input
                            {...register('catheterDetails')}
                            placeholder="Type, size, insertion date..."
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('drainPresent')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <div>
                      <span className="text-sm font-semibold">Surgical Drain Present</span>
                      {drainPresent && (
                        <div className="mt-2">
                          <Input
                            {...register('drainDetails')}
                            placeholder="Type, location, output..."
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-red-50 border-2 border-red-300 p-4 rounded-md space-y-4">
                <h3 className="text-lg font-semibold text-red-900">Risk Assessment</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fall Risk *</Label>
                    <select
                      {...register('fallRisk')}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                    >
                      <option value="LOW">Low Risk</option>
                      <option value="MEDIUM">Medium Risk</option>
                      <option value="HIGH">High Risk</option>
                    </select>
                  </div>

                  <div>
                    <Label>Pressure Ulcer Risk *</Label>
                    <select
                      {...register('pressureUlcerRisk')}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                    >
                      <option value="LOW">Low Risk</option>
                      <option value="MEDIUM">Medium Risk</option>
                      <option value="HIGH">High Risk</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Diet & Nutrition */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">Diet & Nutrition</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Diet Type *</Label>
                    <Input {...register('dietType')} placeholder="Regular, Soft, Liquid, NPO..." />
                    {errors.dietType && (
                      <p className="text-sm text-red-500 mt-1">{errors.dietType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('fluidRestriction')}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                      <span className="text-sm font-semibold">Fluid Restriction</span>
                    </label>
                    {fluidRestriction && (
                      <div className="mt-2">
                        <Input
                          {...register('fluidRestrictionDetails')}
                          placeholder="Amount per day..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Isolation */}
              {isolationRequired && (
                <div className="bg-red-100 border-2 border-red-400 p-4 rounded-md">
                  <label className="flex items-center space-x-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      {...register('isolationRequired')}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-bold text-red-900">⚠️ Isolation Required</span>
                  </label>
                  <Input
                    {...register('isolationType')}
                    placeholder="Type: Contact, Droplet, Airborne..."
                  />
                </div>
              )}

              {/* Digital Signature */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b-2 pb-2">
                  Receiving Nurse Signature
                </h3>
                <DigitalSignature
                  userName={user?.firstName + ' ' + user?.lastName || 'User'}
                  userRole={user?.role || 'Nurse'}
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
                  disabled={createWardAdmissionMutation.isPending || !signature}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createWardAdmissionMutation.isPending ? 'Saving...' : 'Save Ward Admission Protocol'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={createWardAdmissionMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
