'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const anesthesiaRecordSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
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

export default function AnesthesiaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AnesthesiaRecordFormData>({
    resolver: zodResolver(anesthesiaRecordSchema),
    defaultValues: {
      anesthesiaType: 'GENERAL',
      asaClass: 'ASA_II',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AnesthesiaRecordFormData) => api.post('/api/anesthesia', data),
    onSuccess: () => {
      alert('Anesthesia record saved successfully!');
      reset();
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: AnesthesiaRecordFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Anesthesia Record</h1>
          <p className="text-gray-600 mt-2">Complete anesthesia documentation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient & Surgery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientId">Patient ID / MR Number *</Label>
              <Input
                id="patientId"
                {...register('patientId')}
                placeholder="Enter patient ID"
              />
              {errors.patientId && (
                <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="surgeryId">Surgery ID *</Label>
              <Input
                id="surgeryId"
                {...register('surgeryId')}
                placeholder="Enter surgery/procedure ID"
              />
              {errors.surgeryId && (
                <p className="text-red-500 text-sm mt-1">{errors.surgeryId.message}</p>
              )}
            </div>
          </div>

          {/* Pre-Anesthesia Assessment */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Pre-Anesthesia Assessment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="anesthesiaType">Anesthesia Type *</Label>
                <select
                  id="anesthesiaType"
                  {...register('anesthesiaType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="GENERAL">General Anesthesia</option>
                  <option value="SPINAL">Spinal Anesthesia</option>
                  <option value="EPIDURAL">Epidural Anesthesia</option>
                  <option value="LOCAL">Local Anesthesia</option>
                  <option value="SEDATION">Sedation</option>
                  <option value="REGIONAL">Regional Block</option>
                </select>
              </div>

              <div>
                <Label htmlFor="asaClass">ASA Classification *</Label>
                <select
                  id="asaClass"
                  {...register('asaClass')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ASA_I">ASA I - Normal healthy patient</option>
                  <option value="ASA_II">ASA II - Mild systemic disease</option>
                  <option value="ASA_III">ASA III - Severe systemic disease</option>
                  <option value="ASA_IV">ASA IV - Life-threatening disease</option>
                  <option value="ASA_V">ASA V - Moribund patient</option>
                  <option value="ASA_VI">ASA VI - Brain-dead organ donor</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="preAnesthesiaAssessment">Pre-Anesthesia Assessment *</Label>
                <textarea
                  id="preAnesthesiaAssessment"
                  {...register('preAnesthesiaAssessment')}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Airway assessment, vitals, medical history, lab values, NPO status"
                />
                {errors.preAnesthesiaAssessment && (
                  <p className="text-red-500 text-sm mt-1">{errors.preAnesthesiaAssessment.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  {...register('allergies')}
                  placeholder="Drug allergies, latex, etc."
                />
              </div>

              <div>
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Input
                  id="currentMedications"
                  {...register('currentMedications')}
                  placeholder="Regular medications"
                />
              </div>
            </div>
          </div>

          {/* Induction */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Induction</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inductionTime">Induction Time *</Label>
                <Input
                  id="inductionTime"
                  type="time"
                  {...register('inductionTime')}
                />
                {errors.inductionTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.inductionTime.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="inductionAgents">Induction Agents *</Label>
                <Input
                  id="inductionAgents"
                  {...register('inductionAgents')}
                  placeholder="e.g., Propofol 100mg, Fentanyl 100mcg"
                />
                {errors.inductionAgents && (
                  <p className="text-red-500 text-sm mt-1">{errors.inductionAgents.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Maintenance</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="maintenanceAgents">Maintenance Agents *</Label>
                <Input
                  id="maintenanceAgents"
                  {...register('maintenanceAgents')}
                  placeholder="e.g., Sevoflurane 2%, O2+N2O"
                />
                {errors.maintenanceAgents && (
                  <p className="text-red-500 text-sm mt-1">{errors.maintenanceAgents.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ventilationMode">Ventilation Mode</Label>
                <Input
                  id="ventilationMode"
                  {...register('ventilationMode')}
                  placeholder="e.g., Controlled, Spontaneous, IPPV"
                />
              </div>

              <div>
                <Label htmlFor="monitoringDetails">Monitoring Details</Label>
                <textarea
                  id="monitoringDetails"
                  {...register('monitoringDetails')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="ECG, NIBP, SpO2, EtCO2, Temperature, etc."
                />
              </div>
            </div>
          </div>

          {/* IV Access & Fluids */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">IV Access & Fluids</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="ivAccess">IV Access</Label>
                <Input
                  id="ivAccess"
                  {...register('ivAccess')}
                  placeholder="e.g., 18G right forearm, 16G left hand"
                />
              </div>

              <div>
                <Label htmlFor="fluidsGiven">Fluids Given</Label>
                <Input
                  id="fluidsGiven"
                  {...register('fluidsGiven')}
                  placeholder="e.g., Ringer Lactate 1500mL, Normal Saline 500mL"
                />
              </div>

              <div>
                <Label htmlFor="bloodProducts">Blood Products</Label>
                <Input
                  id="bloodProducts"
                  {...register('bloodProducts')}
                  placeholder="e.g., PRBC 2 units, FFP 2 units"
                />
              </div>
            </div>
          </div>

          {/* Complications */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Complications & Events</h3>
            
            <div>
              <Label htmlFor="complications">Intraoperative Complications</Label>
              <textarea
                id="complications"
                {...register('complications')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any complications or adverse events"
              />
            </div>
          </div>

          {/* Recovery */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Emergence & Recovery</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergenceTime">Emergence Time</Label>
                <Input
                  id="emergenceTime"
                  type="time"
                  {...register('emergenceTime')}
                />
              </div>

              <div>
                <Label htmlFor="recoveryNotes">Recovery Notes</Label>
                <textarea
                  id="recoveryNotes"
                  {...register('recoveryNotes')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Extubation, pain control, PACU transfer details"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Anesthesia Record'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
