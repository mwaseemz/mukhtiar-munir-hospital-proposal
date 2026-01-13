'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { patientApi } from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  fatherName: z.string().min(1, 'Father name is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.coerce.number().min(0, 'Age must be positive'),
  cnic: z.string().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  alternatePhone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  emergencyContact: z.string().min(1, 'Emergency contact name is required'),
  emergencyPhone: z.string().min(1, 'Emergency phone is required'),
  admissionType: z.enum(['EMERGENCY', 'PLANNED', 'OPD']),
  admissionLocation: z.enum(['WARD', 'PRIVATE_ROOM', 'NURSERY', 'ICU']),
  patientType: z.enum(['SURGERY', 'MEDICINE']),
  department: z.string().min(1, 'Department is required'),
  wardNumber: z.string().optional(),
  bedNumber: z.string().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  previousSurgeries: z.string().optional(),
  chronicDiseases: z.string().optional(),
  // Viral Markers
  antiHCV: z.boolean().optional(),
  hbsAg: z.boolean().optional(),
  hiv: z.boolean().optional(),
  viralMarkersDate: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function RegisterPatientPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'MALE',
      admissionType: 'PLANNED',
      admissionLocation: 'WARD',
      patientType: 'MEDICINE',
      antiHCV: false,
      hbsAg: false,
      hiv: false,
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: (data: PatientFormData) => patientApi.create(data),
    onSuccess: (response) => {
      const patient = response.data;
      alert(`Patient registered successfully!\nMR Number: ${patient.mrNumber}`);
      router.push(`/patients/${patient.id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to register patient');
    },
  });

  const onSubmit = (data: PatientFormData) => {
    setError('');
    createPatientMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register New Patient</CardTitle>
            <CardDescription>
              Fill in the patient details below. MR Number will be auto-generated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" {...register('firstName')} />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" {...register('lastName')} />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fatherName">Father Name *</Label>
                    <Input id="fatherName" {...register('fatherName')} />
                    {errors.fatherName && (
                      <p className="text-sm text-red-500 mt-1">{errors.fatherName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      {...register('gender')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input id="age" type="number" {...register('age')} />
                    {errors.age && (
                      <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cnic">CNIC</Label>
                    <Input id="cnic" placeholder="12345-1234567-1" {...register('cnic')} />
                  </div>

                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input id="bloodGroup" placeholder="A+, B+, O+, etc." {...register('bloodGroup')} />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input id="phoneNumber" placeholder="+92-300-1234567" {...register('phoneNumber')} />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input id="alternatePhone" placeholder="+92-300-1234567" {...register('alternatePhone')} />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" {...register('address')} />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" {...register('city')} />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Contact Name *</Label>
                    <Input id="emergencyContact" {...register('emergencyContact')} />
                    {errors.emergencyContact && (
                      <p className="text-sm text-red-500 mt-1">{errors.emergencyContact.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                    <Input id="emergencyPhone" placeholder="+92-300-1234567" {...register('emergencyPhone')} />
                    {errors.emergencyPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.emergencyPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Admission Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Admission Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admissionType">Admission Type *</Label>
                    <select
                      id="admissionType"
                      {...register('admissionType')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="EMERGENCY">Emergency</option>
                      <option value="PLANNED">Planned</option>
                      <option value="OPD">OPD</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="admissionLocation">Admission Location *</Label>
                    <select
                      id="admissionLocation"
                      {...register('admissionLocation')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="WARD">Ward</option>
                      <option value="PRIVATE_ROOM">Private Room</option>
                      <option value="NURSERY">Nursery</option>
                      <option value="ICU">ICU</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="patientType">Patient Type *</Label>
                    <select
                      id="patientType"
                      {...register('patientType')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="MEDICINE">Medicine</option>
                      <option value="SURGERY">Surgery</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input id="department" placeholder="Surgery, Medicine, etc." {...register('department')} />
                    {errors.department && (
                      <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="wardNumber">Ward Number</Label>
                    <Input id="wardNumber" {...register('wardNumber')} />
                  </div>

                  <div>
                    <Label htmlFor="bedNumber">Bed Number</Label>
                    <Input id="bedNumber" {...register('bedNumber')} />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Medical History</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Input id="allergies" placeholder="List any known allergies" {...register('allergies')} />
                  </div>

                  <div>
                    <Label htmlFor="previousSurgeries">Previous Surgeries</Label>
                    <Input id="previousSurgeries" placeholder="List previous surgeries" {...register('previousSurgeries')} />
                  </div>

                  <div>
                    <Label htmlFor="chronicDiseases">Chronic Diseases</Label>
                    <Input id="chronicDiseases" placeholder="Diabetes, Hypertension, etc." {...register('chronicDiseases')} />
                  </div>
                </div>
              </div>

              {/* Viral Markers (Critical for Surgery) */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Viral Markers (Critical for Surgery)</h3>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800 mb-3">
                      ⚠️ <strong>Important:</strong> Viral marker testing is mandatory for all surgical patients.
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('antiHCV')}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium">Anti-HCV (Hepatitis C) - Positive</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hbsAg')}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium">HBsAg (Hepatitis B) - Positive</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('hiv')}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium">HIV - Positive</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="viralMarkersDate">Test Date</Label>
                    <Input id="viralMarkersDate" type="date" {...register('viralMarkersDate')} />
                    <p className="text-xs text-gray-500 mt-1">Date when viral markers were tested</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createPatientMutation.isPending}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createPatientMutation.isPending ? 'Registering...' : 'Register Patient'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={createPatientMutation.isPending}
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
