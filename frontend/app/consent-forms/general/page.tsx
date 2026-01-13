'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { patientApi, consentFormApi } from '@/lib/api';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  CheckSquare, 
  Upload,
  Download,
  User
} from 'lucide-react';

const consentSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.coerce.number().min(0),
  gender: z.string().min(1),
  guardianName: z.string().min(1, 'Guardian name is required'),
  guardianRelation: z.string().min(1, 'Relation is required'),
  cnic: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  
  // Consent acknowledgements
  informedAboutCondition: z.boolean(),
  informedAboutTreatment: z.boolean(),
  informedAboutRisks: z.boolean(),
  informedAboutAlternatives: z.boolean(),
  consentForTreatment: z.boolean(),
  consentForInvestigations: z.boolean(),
  consentForBloodTransfusion: z.boolean(),
  consentForPhotography: z.boolean(),
  consentForTeaching: z.boolean(),
  
  // Additional information
  additionalComments: z.string().optional(),
});

type ConsentFormData = z.infer<typeof consentSchema>;

export default function GeneralAdmissionConsentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  const queryClient = useQueryClient();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { data: patientData, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientApi.getById(patientId!),
    enabled: !!patientId,
  });

  const patient = patientData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      informedAboutCondition: false,
      informedAboutTreatment: false,
      informedAboutRisks: false,
      informedAboutAlternatives: false,
      consentForTreatment: false,
      consentForInvestigations: false,
      consentForBloodTransfusion: false,
      consentForPhotography: false,
      consentForTeaching: false,
    },
  });

  // Auto-fill from patient data
  useEffect(() => {
    if (patient) {
      setValue('patientName', `${patient.firstName} ${patient.lastName}`);
      setValue('age', patient.age);
      setValue('gender', patient.gender);
      setValue('cnic', patient.cnic || '');
      setValue('address', patient.address);
      
      // Set guardian as emergency contact if not specified
      setValue('guardianName', patient.emergencyContact);
      setValue('guardianRelation', 'Guardian');
    }
  }, [patient, setValue]);

  const createConsentMutation = useMutation({
    mutationFn: (data: any) => consentFormApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consent-forms'] });
      router.push('/consent-forms');
    },
  });

  const onSubmit = (data: ConsentFormData) => {
    if (!patientId) {
      alert('Patient ID is required');
      return;
    }

    // Check if all required consents are checked
    const allChecked = 
      data.informedAboutCondition &&
      data.informedAboutTreatment &&
      data.informedAboutRisks &&
      data.informedAboutAlternatives &&
      data.consentForTreatment &&
      data.consentForInvestigations;

    if (!allChecked) {
      alert('Please check all required consent items');
      return;
    }

    const formData = {
      patientId,
      formType: 'GENERAL_ADMISSION',
      patientName: data.patientName,
      age: data.age,
      gender: data.gender,
      guardianName: data.guardianName,
      guardianRelation: data.guardianRelation,
      cnic: data.cnic,
      address: data.address,
      formData: {
        informedAboutCondition: data.informedAboutCondition,
        informedAboutTreatment: data.informedAboutTreatment,
        informedAboutRisks: data.informedAboutRisks,
        informedAboutAlternatives: data.informedAboutAlternatives,
        consentForTreatment: data.consentForTreatment,
        consentForInvestigations: data.consentForInvestigations,
        consentForBloodTransfusion: data.consentForBloodTransfusion,
        consentForPhotography: data.consentForPhotography,
        consentForTeaching: data.consentForTeaching,
        additionalComments: data.additionalComments,
      },
    };

    createConsentMutation.mutate(formData);
  };

  const allRequiredChecked = watch([
    'informedAboutCondition',
    'informedAboutTreatment',
    'informedAboutRisks',
    'informedAboutAlternatives',
    'consentForTreatment',
    'consentForInvestigations',
  ]).every(Boolean);

  if (patientLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientId || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Patient Required</h2>
            <p className="text-gray-600 mb-4">
              Please select a patient from the consent forms list
            </p>
            <Button onClick={() => router.push('/consent-forms')}>
              Go to Consent Forms
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                General Admission Consent Form
              </h1>
              <p className="text-gray-600 mt-2">
                Patient: {patient.firstName} {patient.lastName} ({patient.mrNumber})
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    {...register('patientName')}
                    className={errors.patientName ? 'border-red-500' : ''}
                  />
                  {errors.patientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age')}
                      className={errors.age ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      {...register('gender')}
                      className="w-full h-10 px-3 py-2 border rounded-md"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cnic">CNIC</Label>
                  <Input
                    id="cnic"
                    {...register('cnic')}
                    placeholder="00000-0000000-0"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle>Guardian / Attendant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guardianName">Guardian Name *</Label>
                  <Input
                    id="guardianName"
                    {...register('guardianName')}
                    className={errors.guardianName ? 'border-red-500' : ''}
                  />
                  {errors.guardianName && (
                    <p className="text-red-500 text-sm mt-1">{errors.guardianName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="guardianRelation">Relation to Patient *</Label>
                  <Input
                    id="guardianRelation"
                    {...register('guardianRelation')}
                    placeholder="e.g., Father, Mother, Spouse"
                    className={errors.guardianRelation ? 'border-red-500' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Declarations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Consent Declarations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Information Provided */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">I confirm that I have been informed about:</h4>
                
                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('informedAboutCondition')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    <strong>My medical condition</strong> and the nature of my illness/disease
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('informedAboutTreatment')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    <strong>Proposed treatment/procedure</strong> and what it involves
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('informedAboutRisks')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    <strong>Risks and complications</strong> associated with the treatment
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('informedAboutAlternatives')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    <strong>Alternative treatment options</strong> and their implications
                  </span>
                </label>
              </div>

              {/* Consents */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-gray-900">I hereby consent to:</h4>
                
                <label className="flex items-start gap-3 p-3 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consentForTreatment')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-blue-900">
                    Receive the proposed medical treatment and care
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consentForInvestigations')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-blue-900">
                    Undergo necessary investigations and diagnostic procedures
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consentForBloodTransfusion')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    Blood transfusion if deemed necessary by the medical team
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consentForPhotography')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    Medical photography for documentation purposes
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consentForTeaching')}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    My case being used for teaching purposes (maintaining confidentiality)
                  </span>
                </label>
              </div>

              {/* Additional Comments */}
              <div className="pt-4 border-t">
                <Label htmlFor="additionalComments">Additional Comments (Optional)</Label>
                <textarea
                  id="additionalComments"
                  {...register('additionalComments')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                  placeholder="Any specific concerns or requests..."
                />
              </div>

              {/* Validation Message */}
              {!allRequiredChecked && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> All required consent items (marked in blue) must be checked before submitting
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Signed Document (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload scanned copy of signed consent form
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" type="button" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                {uploadedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {uploadedFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createConsentMutation.isPending || !allRequiredChecked}
              className="min-w-32"
            >
              {createConsentMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Consent Form
                </span>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
