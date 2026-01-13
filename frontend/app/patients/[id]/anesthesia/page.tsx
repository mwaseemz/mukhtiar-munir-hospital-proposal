'use client';

import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const anesthesiaRecordSchema = z.object({
  surgeryId: z.string().min(1, 'Surgery ID is required'),
  anesthesiaType: z.enum(['GENERAL', 'SPINAL', 'EPIDURAL', 'LOCAL', 'SEDATION', 'REGIONAL']),
  preAnesthesiaAssessment: z.string().min(1, 'Pre-anesthesia assessment is required'),
  asaClass: z.enum(['ASA_I', 'ASA_II', 'ASA_III', 'ASA_IV', 'ASA_V', 'ASA_VI']),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  
  // Induction
  inductionTime: z.string().min(1, 'Induction time is required'),
  inductionAgents: z.string().min(1, 'Induction agents are required'),
  
  // Maintenance
  maintenanceAgents: z.string().min(1, 'Maintenance agents are required'),
  ventilationMode: z.string().optional(),
  
  // Monitoring
  monitoringDetails: z.string().optional(),
  
  // IV Access & Fluids
  ivAccess: z.string().optional(),
  fluidsGiven: z.string().optional(),
  bloodProducts: z.string().optional(),
  
  // Complications
  complications: z.string().optional(),
  
  // Recovery
  emergenceTime: z.string().optional(),
  recoveryNotes: z.string().optional(),
});

type AnesthesiaRecordFormData = z.infer<typeof anesthesiaRecordSchema>;

export default function PatientAnesthesiaPage() {
  const params = useParams();
  const patientId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnesthesiaRecordFormData>({
    resolver: zodResolver(anesthesiaRecordSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: AnesthesiaRecordFormData) =>
      api.post('/anesthesia-records', { ...data, patientId }),
    onSuccess: () => {
      alert('Anesthesia record created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create anesthesia record');
    },
  });

  const onSubmit = (data: AnesthesiaRecordFormData) => {
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
          <h1 className="text-2xl font-bold mb-6">Anesthesia Record</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Surgery Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Surgery Information</h2>
              
              <div>
                <Label htmlFor="surgeryId">Surgery ID</Label>
                <Input id="surgeryId" {...register('surgeryId')} />
                {errors.surgeryId && (
                  <p className="text-red-500 text-sm mt-1">{errors.surgeryId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="anesthesiaType">Anesthesia Type</Label>
                <select
                  id="anesthesiaType"
                  {...register('anesthesiaType')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select type</option>
                  <option value="GENERAL">General</option>
                  <option value="SPINAL">Spinal</option>
                  <option value="EPIDURAL">Epidural</option>
                  <option value="LOCAL">Local</option>
                  <option value="SEDATION">Sedation</option>
                  <option value="REGIONAL">Regional</option>
                </select>
                {errors.anesthesiaType && (
                  <p className="text-red-500 text-sm mt-1">{errors.anesthesiaType.message}</p>
                )}
              </div>
            </div>

            {/* Pre-Anesthesia Assessment */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pre-Anesthesia Assessment</h2>
              
              <div>
                <Label htmlFor="preAnesthesiaAssessment">Assessment</Label>
                <textarea
                  id="preAnesthesiaAssessment"
                  {...register('preAnesthesiaAssessment')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.preAnesthesiaAssessment && (
                  <p className="text-red-500 text-sm mt-1">{errors.preAnesthesiaAssessment.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="asaClass">ASA Classification</Label>
                <select
                  id="asaClass"
                  {...register('asaClass')}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select ASA class</option>
                  <option value="ASA_I">ASA I - Normal healthy patient</option>
                  <option value="ASA_II">ASA II - Mild systemic disease</option>
                  <option value="ASA_III">ASA III - Severe systemic disease</option>
                  <option value="ASA_IV">ASA IV - Severe disease, constant threat to life</option>
                  <option value="ASA_V">ASA V - Moribund, not expected to survive</option>
                  <option value="ASA_VI">ASA VI - Brain-dead, organ donor</option>
                </select>
                {errors.asaClass && (
                  <p className="text-red-500 text-sm mt-1">{errors.asaClass.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Input id="allergies" {...register('allergies')} />
              </div>

              <div>
                <Label htmlFor="currentMedications">Current Medications</Label>
                <textarea
                  id="currentMedications"
                  {...register('currentMedications')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            {/* Induction */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Induction</h2>
              
              <div>
                <Label htmlFor="inductionTime">Induction Time</Label>
                <Input type="datetime-local" id="inductionTime" {...register('inductionTime')} />
                {errors.inductionTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.inductionTime.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="inductionAgents">Induction Agents</Label>
                <textarea
                  id="inductionAgents"
                  {...register('inductionAgents')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Propofol 150mg, Fentanyl 100mcg"
                />
                {errors.inductionAgents && (
                  <p className="text-red-500 text-sm mt-1">{errors.inductionAgents.message}</p>
                )}
              </div>
            </div>

            {/* Maintenance */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Maintenance</h2>
              
              <div>
                <Label htmlFor="maintenanceAgents">Maintenance Agents</Label>
                <textarea
                  id="maintenanceAgents"
                  {...register('maintenanceAgents')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Sevoflurane 1-2%, O2/Air mixture"
                />
                {errors.maintenanceAgents && (
                  <p className="text-red-500 text-sm mt-1">{errors.maintenanceAgents.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ventilationMode">Ventilation Mode</Label>
                <Input id="ventilationMode" {...register('ventilationMode')} placeholder="e.g., IPPV, Spontaneous" />
              </div>

              <div>
                <Label htmlFor="monitoringDetails">Monitoring Details</Label>
                <textarea
                  id="monitoringDetails"
                  {...register('monitoringDetails')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., ECG, SpO2, NIBP, Capnography"
                />
              </div>
            </div>

            {/* IV Access & Fluids */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">IV Access & Fluids</h2>
              
              <div>
                <Label htmlFor="ivAccess">IV Access</Label>
                <Input id="ivAccess" {...register('ivAccess')} placeholder="e.g., 18G left forearm" />
              </div>

              <div>
                <Label htmlFor="fluidsGiven">Fluids Given</Label>
                <textarea
                  id="fluidsGiven"
                  {...register('fluidsGiven')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Ringer's Lactate 1000ml, Normal Saline 500ml"
                />
              </div>

              <div>
                <Label htmlFor="bloodProducts">Blood Products</Label>
                <textarea
                  id="bloodProducts"
                  {...register('bloodProducts')}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g., Packed RBCs 2 units"
                />
              </div>
            </div>

            {/* Complications & Recovery */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Complications & Recovery</h2>
              
              <div>
                <Label htmlFor="complications">Complications</Label>
                <textarea
                  id="complications"
                  {...register('complications')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Any complications during anesthesia"
                />
              </div>

              <div>
                <Label htmlFor="emergenceTime">Emergence Time</Label>
                <Input type="datetime-local" id="emergenceTime" {...register('emergenceTime')} />
              </div>

              <div>
                <Label htmlFor="recoveryNotes">Recovery Notes</Label>
                <textarea
                  id="recoveryNotes"
                  {...register('recoveryNotes')}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Post-anesthesia recovery observations"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Saving...' : 'Save Anesthesia Record'}
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
