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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { patientApi, consentFormApi } from '@/lib/api';
import { ArrowLeft, Save, Upload, FileText } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const operationConsentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  // Patient Information (Auto-filled)
  patientName: z.string(),
  patientAge: z.string(),
  patientGender: z.string(),
  mrNumber: z.string(),
  
  // Operation Details
  operationType: z.string().min(1, 'نام آپریشن درج کریں / Operation name is required'),
  surgeonName: z.string().min(1, 'سرجن کا نام درج کریں / Surgeon name is required'),
  anesthesiaType: z.enum(['GENERAL', 'SPINAL', 'LOCAL', 'REGIONAL']),
  
  // Risks Acknowledged (Urdu + English)
  risksUnderstood: z.boolean().refine(val => val === true, {
    message: 'آپ کو خطرات سمجھنا ضروری ہے / Must acknowledge risks',
  }),
  complicationsUnderstood: z.boolean().refine(val => val === true, {
    message: 'پیچیدگیاں سمجھنا ضروری ہے / Must understand complications',
  }),
  alternativesDiscussed: z.boolean().refine(val => val === true, {
    message: 'متبادل طریقے بتائے گئے / Alternatives must be discussed',
  }),
  
  // Guardian/Patient Consent
  guardianName: z.string().min(1, 'سرپرست کا نام / Guardian name is required'),
  guardianRelation: z.string().min(1, 'رشتہ / Relation is required'),
  guardianCNIC: z.string().min(13, 'شناختی کارڈ نمبر / CNIC must be 13 digits'),
  guardianPhone: z.string().min(1, 'فون نمبر / Phone is required'),
  
  // Consent Confirmation
  consentGiven: z.boolean().refine(val => val === true, {
    message: 'رضامندی ضروری ہے / Consent is mandatory',
  }),
  voluntaryConsent: z.boolean().refine(val => val === true, {
    message: 'رضاکارانہ رضامندی / Must be voluntary',
  }),
});

type OperationConsentFormData = z.infer<typeof operationConsentSchema>;

export default function OperationConsentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
    formState: { errors },
  } = useForm<OperationConsentFormData>({
    resolver: zodResolver(operationConsentSchema),
    defaultValues: {
      anesthesiaType: 'GENERAL',
      risksUnderstood: false,
      complicationsUnderstood: false,
      alternativesDiscussed: false,
      consentGiven: false,
      voluntaryConsent: false,
    },
  });

  // Auto-fill patient data
  useEffect(() => {
    if (patient) {
      setValue('patientId', patient.id);
      setValue('patientName', `${patient.firstName} ${patient.lastName}`);
      setValue('patientAge', `${patient.age} years`);
      setValue('patientGender', patient.gender);
      setValue('mrNumber', patient.mrNumber);
    }
  }, [patient, setValue]);

  const createConsentMutation = useMutation({
    mutationFn: (data: OperationConsentFormData) =>
      consentFormApi.create({
        patientId: data.patientId,
        formType: 'OPERATION',
        language: 'URDU',
        formData: data,
        status: 'PENDING',
      }),
    onSuccess: (response) => {
      alert('آپریشن رضامندی فارم محفوظ ہو گیا! / Operation Consent Form saved!');
      router.push(`/patients/${patientId}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to save consent form');
    },
  });

  const onSubmit = (data: OperationConsentFormData) => {
    setError('');
    createConsentMutation.mutate(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Loading patient information...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6" dir="ltr">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="bg-blue-50 border-b-2 border-blue-200">
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-blue-900">
                رضامندی فارم برائے آپریشن
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-blue-700">
                CONSENT FORM FOR OPERATION
              </CardDescription>
              <div className="text-sm text-gray-600 space-y-1 mt-3">
                <p className="font-semibold">تمام معلومات اردو اور انگریزی میں فراہم کی گئی ہیں</p>
                <p className="text-xs">All information provided in Urdu and English</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Information - Auto-filled */}
              <div className="bg-gray-50 p-4 rounded-md border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  مریض کی معلومات / Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">نام / Name:</span> {patient.firstName} {patient.lastName}
                  </div>
                  <div>
                    <span className="font-semibold">MR نمبر:</span> {patient.mrNumber}
                  </div>
                  <div>
                    <span className="font-semibold">عمر / Age:</span> {patient.age} سال
                  </div>
                  <div>
                    <span className="font-semibold">جنس / Gender:</span> {patient.gender}
                  </div>
                </div>
              </div>

              {/* Operation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center border-b-2 pb-2">
                  آپریشن کی تفصیلات / Operation Details
                </h3>

                <div>
                  <Label className="text-right block">نام آپریشن / Operation Name *</Label>
                  <Input {...register('operationType')} placeholder="مثال: اپینڈکس / Example: Appendectomy" />
                  {errors.operationType && (
                    <p className="text-sm text-red-500 mt-1">{errors.operationType.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-right block">سرجن کا نام / Surgeon Name *</Label>
                  <Input {...register('surgeonName')} placeholder="ڈاکٹر کا نام / Doctor's name" />
                  {errors.surgeonName && (
                    <p className="text-sm text-red-500 mt-1">{errors.surgeonName.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-right block">بے ہوشی کی قسم / Type of Anesthesia *</Label>
                  <select
                    {...register('anesthesiaType')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
                  >
                    <option value="GENERAL">جنرل اینستھیزیا / General Anesthesia</option>
                    <option value="SPINAL">سپائنل اینستھیزیا / Spinal Anesthesia</option>
                    <option value="LOCAL">لوکل اینستھیزیا / Local Anesthesia</option>
                    <option value="REGIONAL">ریجنل اینستھیزیا / Regional Anesthesia</option>
                  </select>
                </div>
              </div>

              {/* Risks and Understanding (Urdu) */}
              <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-md space-y-3">
                <h3 className="text-lg font-semibold text-center text-yellow-900">
                  خطرات اور احتیاطی تدابیر / Risks and Precautions
                </h3>
                <div className="text-sm text-yellow-900 space-y-2 leading-relaxed">
                  <p>
                    <strong>⚠️ اہم:</strong> آپریشن میں خطرات شامل ہو سکتے ہیں جیسے کہ خون بہنا، انفیکشن، 
                    بے ہوشی سے تعلق خطرات، یا دیگر پیچیدگیاں۔
                  </p>
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> Surgery may involve risks including bleeding, infection, 
                    anesthesia-related risks, or other complications.
                  </p>
                </div>

                <div className="space-y-3 mt-4">
                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('risksUnderstood')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      میں تصدیق کرتا/کرتی ہوں کہ مجھے آپریشن کے خطرات کی تفصیل سے آگاہ کر دیا گیا ہے
                      <br />
                      <span className="text-xs text-gray-600">
                        I confirm that I have been informed in detail about the risks of the operation
                      </span>
                    </span>
                  </label>
                  {errors.risksUnderstood && (
                    <p className="text-sm text-red-500">{errors.risksUnderstood.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('complicationsUnderstood')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      میں ممکنہ پیچیدگیوں کو سمجھتا/سمجھتی ہوں
                      <br />
                      <span className="text-xs text-gray-600">
                        I understand the potential complications
                      </span>
                    </span>
                  </label>
                  {errors.complicationsUnderstood && (
                    <p className="text-sm text-red-500">{errors.complicationsUnderstood.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('alternativesDiscussed')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      متبادل علاج کے طریقے مجھے بتائے گئے ہیں
                      <br />
                      <span className="text-xs text-gray-600">
                        Alternative treatment options have been discussed with me
                      </span>
                    </span>
                  </label>
                  {errors.alternativesDiscussed && (
                    <p className="text-sm text-red-500">{errors.alternativesDiscussed.message}</p>
                  )}
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center border-b-2 pb-2">
                  سرپرست کی معلومات / Guardian Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-right block">سرپرست کا نام / Guardian Name *</Label>
                    <Input {...register('guardianName')} />
                    {errors.guardianName && (
                      <p className="text-sm text-red-500 mt-1">{errors.guardianName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-right block">رشتہ / Relation *</Label>
                    <Input {...register('guardianRelation')} placeholder="مثال: والد، والدہ، شوہر" />
                    {errors.guardianRelation && (
                      <p className="text-sm text-red-500 mt-1">{errors.guardianRelation.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-right block">شناختی کارڈ نمبر / CNIC *</Label>
                    <Input {...register('guardianCNIC')} placeholder="12345-1234567-1" maxLength={15} />
                    {errors.guardianCNIC && (
                      <p className="text-sm text-red-500 mt-1">{errors.guardianCNIC.message}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-right block">فون نمبر / Phone Number *</Label>
                    <Input {...register('guardianPhone')} placeholder="+92-300-1234567" />
                    {errors.guardianPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.guardianPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Final Consent */}
              <div className="bg-green-50 border-2 border-green-300 p-4 rounded-md space-y-3">
                <h3 className="text-lg font-semibold text-center text-green-900">
                  حتمی رضامندی / Final Consent
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('consentGiven')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm font-semibold">
                      میں اپنی مکمل رضامندی دیتا/دیتی ہوں کہ مذکورہ آپریشن میرے / میرے مریض پر کیا جائے
                      <br />
                      <span className="text-xs text-gray-600 font-normal">
                        I give my full consent for the mentioned operation to be performed on me/my patient
                      </span>
                    </span>
                  </label>
                  {errors.consentGiven && (
                    <p className="text-sm text-red-500">{errors.consentGiven.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('voluntaryConsent')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      یہ رضامندی رضاکارانہ ہے اور کسی دباؤ کے بغیر دی گئی ہے
                      <br />
                      <span className="text-xs text-gray-600">
                        This consent is voluntary and given without any pressure
                      </span>
                    </span>
                  </label>
                  {errors.voluntaryConsent && (
                    <p className="text-sm text-red-500">{errors.voluntaryConsent.message}</p>
                  )}
                </div>
              </div>

              {/* Document Upload */}
              <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-3 text-center">
                  دستاویز اپ لوڈ / Document Upload
                </h3>
                <div className="space-y-2">
                  <Label className="text-right block text-sm">
                    دستخط شدہ فارم اپ لوڈ کریں (اختیاری) / Upload Signed Form (Optional)
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="text-sm"
                  />
                  {uploadedFile && (
                    <p className="text-xs text-green-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {uploadedFile.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    PDF, JPG, یا PNG (زیادہ سے زیادہ 10MB) / PDF, JPG, or PNG (Max 10MB)
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4" dir="ltr">
                <Button
                  type="submit"
                  disabled={createConsentMutation.isPending}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createConsentMutation.isPending ? 'Saving...' : 'محفوظ کریں / Save Consent Form'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={createConsentMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Card className="mt-4 bg-gray-50">
          <CardContent className="p-4 text-center text-xs text-gray-600">
            <p className="mb-1">
              یہ فارم قانونی دستاویز ہے۔ براہ کرم احتیاط سے پڑھیں اور سمجھیں
            </p>
            <p>This form is a legal document. Please read and understand carefully</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
