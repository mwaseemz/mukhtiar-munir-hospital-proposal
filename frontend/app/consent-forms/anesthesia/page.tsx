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
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

const anesthesiaConsentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  // Patient Information (Auto-filled)
  patientName: z.string(),
  patientAge: z.string(),
  patientGender: z.string(),
  mrNumber: z.string(),
  
  // Anesthesia Details
  anesthesiaType: z.enum(['GENERAL', 'SPINAL', 'EPIDURAL', 'LOCAL', 'REGIONAL', 'SEDATION']),
  anesthesiologistName: z.string().min(1, 'ماہر بے ہوشی کا نام / Anesthesiologist name is required'),
  procedureName: z.string().min(1, 'طریقہ کار / Procedure name is required'),
  
  // Pre-anesthesia Assessment
  allergiesChecked: z.boolean().refine(val => val === true, {
    message: 'الرجی چیک ضروری ہے / Allergy check is mandatory',
  }),
  medicationsReviewed: z.boolean().refine(val => val === true, {
    message: 'ادویات کا جائزہ ضروری ہے / Medication review is mandatory',
  }),
  fastingConfirmed: z.boolean().refine(val => val === true, {
    message: 'روزہ کی تصدیق / Fasting confirmation is mandatory',
  }),
  
  // Risks Understanding (Urdu + English)
  anesthesiaRisksUnderstood: z.boolean().refine(val => val === true, {
    message: 'بے ہوشی کے خطرات سمجھنا ضروری ہے / Must understand anesthesia risks',
  }),
  aspirationRiskUnderstood: z.boolean().refine(val => val === true, {
    message: 'سانس میں چیز جانے کا خطرہ / Aspiration risk must be understood',
  }),
  cardiovascularRisksUnderstood: z.boolean().refine(val => val === true, {
    message: 'دل کے خطرات / Cardiovascular risks must be understood',
  }),
  neurologicalRisksUnderstood: z.boolean().refine(val => val === true, {
    message: 'اعصابی خطرات / Neurological risks must be understood',
  }),
  
  // Guardian/Patient Consent
  guardianName: z.string().min(1, 'سرپرست کا نام / Guardian name is required'),
  guardianRelation: z.string().min(1, 'رشتہ / Relation is required'),
  guardianCNIC: z.string().min(13, 'شناختی کارڈ نمبر / CNIC must be 13 digits'),
  guardianPhone: z.string().min(1, 'فون نمبر / Phone is required'),
  
  // Final Consent
  anesthesiaConsentGiven: z.boolean().refine(val => val === true, {
    message: 'بے ہوشی کی رضامندی ضروری ہے / Anesthesia consent is mandatory',
  }),
  monitoringConsentGiven: z.boolean().refine(val => val === true, {
    message: 'نگرانی کی رضامندی / Monitoring consent is required',
  }),
  emergencyConsentGiven: z.boolean().refine(val => val === true, {
    message: 'ایمرجنسی رضامندی / Emergency consent is required',
  }),
});

type AnesthesiaConsentFormData = z.infer<typeof anesthesiaConsentSchema>;

export default function AnesthesiaConsentPage() {
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
  } = useForm<AnesthesiaConsentFormData>({
    resolver: zodResolver(anesthesiaConsentSchema),
    defaultValues: {
      anesthesiaType: 'GENERAL',
      allergiesChecked: false,
      medicationsReviewed: false,
      fastingConfirmed: false,
      anesthesiaRisksUnderstood: false,
      aspirationRiskUnderstood: false,
      cardiovascularRisksUnderstood: false,
      neurologicalRisksUnderstood: false,
      anesthesiaConsentGiven: false,
      monitoringConsentGiven: false,
      emergencyConsentGiven: false,
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
    mutationFn: (data: AnesthesiaConsentFormData) =>
      consentFormApi.create({
        patientId: data.patientId,
        formType: 'ANESTHESIA',
        language: 'URDU',
        formData: data,
        status: 'PENDING',
      }),
    onSuccess: (response) => {
      alert('بے ہوشی رضامندی فارم محفوظ ہو گیا! / Anesthesia Consent Form saved!');
      router.push(`/patients/${patientId}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to save consent form');
    },
  });

  const onSubmit = (data: AnesthesiaConsentFormData) => {
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
          <CardHeader className="bg-green-50 border-b-2 border-green-200">
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-green-900">
                رضامندی فارم برائے بے ہوشی
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-green-700">
                CONSENT FORM FOR ANESTHESIA
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

              {/* Anesthesia Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center border-b-2 pb-2">
                  بے ہوشی کی تفصیلات / Anesthesia Details
                </h3>

                <div>
                  <Label className="text-right block">قسم بے ہوشی / Type of Anesthesia *</Label>
                  <select
                    {...register('anesthesiaType')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
                  >
                    <option value="GENERAL">جنرل اینستھیزیا / General Anesthesia</option>
                    <option value="SPINAL">سپائنل اینستھیزیا / Spinal Anesthesia</option>
                    <option value="EPIDURAL">ایپیڈورل اینستھیزیا / Epidural Anesthesia</option>
                    <option value="LOCAL">لوکل اینستھیزیا / Local Anesthesia</option>
                    <option value="REGIONAL">ریجنل اینستھیزیا / Regional Anesthesia</option>
                    <option value="SEDATION">سیڈیشن / Sedation</option>
                  </select>
                </div>

                <div>
                  <Label className="text-right block">ماہر بے ہوشی کا نام / Anesthesiologist Name *</Label>
                  <Input {...register('anesthesiologistName')} placeholder="ڈاکٹر کا نام / Doctor's name" />
                  {errors.anesthesiologistName && (
                    <p className="text-sm text-red-500 mt-1">{errors.anesthesiologistName.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-right block">طریقہ کار / Procedure Name *</Label>
                  <Input {...register('procedureName')} placeholder="آپریشن کا نام / Name of operation" />
                  {errors.procedureName && (
                    <p className="text-sm text-red-500 mt-1">{errors.procedureName.message}</p>
                  )}
                </div>
              </div>

              {/* Pre-anesthesia Assessment */}
              <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-md space-y-3">
                <h3 className="text-lg font-semibold text-center text-blue-900">
                  بے ہوشی سے پہلے جانچ / Pre-Anesthesia Assessment
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('allergiesChecked')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      الرجی کی جانچ مکمل ہو چکی ہے
                      <br />
                      <span className="text-xs text-gray-600">
                        Allergy check has been completed
                      </span>
                    </span>
                  </label>
                  {errors.allergiesChecked && (
                    <p className="text-sm text-red-500">{errors.allergiesChecked.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('medicationsReviewed')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      تمام ادویات کا جائزہ لیا گیا ہے
                      <br />
                      <span className="text-xs text-gray-600">
                        All medications have been reviewed
                      </span>
                    </span>
                  </label>
                  {errors.medicationsReviewed && (
                    <p className="text-sm text-red-500">{errors.medicationsReviewed.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('fastingConfirmed')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      مریض نے فاسٹنگ کی ہے (6-8 گھنٹے کھانے سے پرہیز)
                      <br />
                      <span className="text-xs text-gray-600">
                        Patient has been fasting (6-8 hours NPO)
                      </span>
                    </span>
                  </label>
                  {errors.fastingConfirmed && (
                    <p className="text-sm text-red-500">{errors.fastingConfirmed.message}</p>
                  )}
                </div>
              </div>

              {/* Anesthesia Risks (Urdu) */}
              <div className="bg-red-50 border-2 border-red-300 p-4 rounded-md space-y-3">
                <h3 className="text-lg font-semibold text-center text-red-900">
                  بے ہوشی کے خطرات / Anesthesia Risks
                </h3>
                <div className="text-sm text-red-900 space-y-2 leading-relaxed">
                  <p>
                    <strong>⚠️ انتہائی اہم:</strong> بے ہوشی میں خطرات شامل ہو سکتے ہیں جیسے کہ الرجک ری ایکشن، 
                    سانس میں مسائل، دل کے مسائل، بلڈ پریشر میں تبدیلی، یا بہت کم صورتوں میں موت۔
                  </p>
                  <p className="text-xs text-red-800">
                    <strong>Very Important:</strong> Anesthesia may involve risks including allergic reactions, 
                    breathing problems, cardiac issues, blood pressure changes, or in very rare cases, death.
                  </p>
                </div>

                <div className="space-y-3 mt-4">
                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('anesthesiaRisksUnderstood')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      میں بے ہوشی کے تمام خطرات کو سمجھتا/سمجھتی ہوں
                      <br />
                      <span className="text-xs text-gray-600">
                        I understand all the risks of anesthesia
                      </span>
                    </span>
                  </label>
                  {errors.anesthesiaRisksUnderstood && (
                    <p className="text-sm text-red-500">{errors.anesthesiaRisksUnderstood.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('aspirationRiskUnderstood')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      سانس میں کھانا یا مائع جانے کا خطرہ سمجھتا/سمجھتی ہوں
                      <br />
                      <span className="text-xs text-gray-600">
                        I understand the risk of aspiration
                      </span>
                    </span>
                  </label>
                  {errors.aspirationRiskUnderstood && (
                    <p className="text-sm text-red-500">{errors.aspirationRiskUnderstood.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('cardiovascularRisksUnderstood')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      دل اور خون کی نالیوں کے خطرات سمجھتا/سمجھتی ہوں
                      <br />
                      <span className="text-xs text-gray-600">
                        I understand cardiovascular risks
                      </span>
                    </span>
                  </label>
                  {errors.cardiovascularRisksUnderstood && (
                    <p className="text-sm text-red-500">{errors.cardiovascularRisksUnderstood.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('neurologicalRisksUnderstood')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      اعصابی خطرات سمجھتا/سمجھتی ہوں (جیسے فالج، اعصاب کو نقصان)
                      <br />
                      <span className="text-xs text-gray-600">
                        I understand neurological risks (e.g., stroke, nerve damage)
                      </span>
                    </span>
                  </label>
                  {errors.neurologicalRisksUnderstood && (
                    <p className="text-sm text-red-500">{errors.neurologicalRisksUnderstood.message}</p>
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
                      {...register('anesthesiaConsentGiven')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm font-semibold">
                      میں بے ہوشی کی مکمل رضامندی دیتا/دیتی ہوں
                      <br />
                      <span className="text-xs text-gray-600 font-normal">
                        I give my full consent for anesthesia
                      </span>
                    </span>
                  </label>
                  {errors.anesthesiaConsentGiven && (
                    <p className="text-sm text-red-500">{errors.anesthesiaConsentGiven.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('monitoringConsentGiven')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      آپریشن کے دوران مسلسل نگرانی کی رضامندی دیتا/دیتی ہوں
                      <br />
                      <span className="text-xs text-gray-600">
                        I consent to continuous monitoring during the procedure
                      </span>
                    </span>
                  </label>
                  {errors.monitoringConsentGiven && (
                    <p className="text-sm text-red-500">{errors.monitoringConsentGiven.message}</p>
                  )}

                  <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('emergencyConsentGiven')}
                      className="w-5 h-5 rounded border-gray-300 mt-1"
                    />
                    <span className="text-sm">
                      ایمرجنسی میں فوری علاج کی رضامندی دیتا/دیتی ہوں
                      <br />
                      <span className="text-xs text-gray-600">
                        I consent to emergency treatment if required
                      </span>
                    </span>
                  </label>
                  {errors.emergencyConsentGiven && (
                    <p className="text-sm text-red-500">{errors.emergencyConsentGiven.message}</p>
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
