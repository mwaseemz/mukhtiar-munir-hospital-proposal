'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileCheck, Save, AlertTriangle, Download } from 'lucide-react';
import { api } from '@/lib/api';

export default function PatientDischargePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [dischargeType, setDischargeType] = useState<'REGULAR' | 'LAMA' | 'DOR'>('REGULAR');

  const [regularDischarge, setRegularDischarge] = useState({
    admissionDate: '',
    dischargeDate: '',
    finalDiagnosis: '',
    treatmentSummary: '',
    operationProcedure: '',
    complications: '',
    conditionAtDischarge: '',
    dischargeMedications: '',
    followUpInstructions: '',
    diet: '',
    activity: '',
    warnings: '',
  });

  const [lamaData, setLamaData] = useState({
    reason: '',
    patientStatement: '',
    witnessName: '',
    witnessRelation: '',
  });

  const [blockingIssues, setBlockingIssues] = useState<string[]>([]);

  useEffect(() => {
    checkDischargeReadiness();
  }, [patientId]);

  const checkDischargeReadiness = async () => {
    try {
      const response = await api.get(`/blocking/discharge-readiness/${patientId}`);
      setBlockingIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error checking discharge readiness:', error);
    }
  };

  const handleRegularDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blockingIssues.length > 0) {
      alert('Cannot discharge: Please resolve all blocking issues first');
      return;
    }

    setLoading(true);
    try {
      await api.post('/discharge-summary', {
        patientId,
        type: 'REGULAR',
        ...regularDischarge,
      });
      alert('Patient discharged successfully!');
      router.push(`/patients/${patientId}`);
    } catch (error) {
      console.error('Error processing discharge:', error);
      alert('Error processing discharge');
    } finally {
      setLoading(false);
    }
  };

  const handleLAMA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/discharge-summary', {
        patientId,
        type: dischargeType,
        ...lamaData,
      });
      alert('LAMA/DOR form submitted successfully!');
      router.push(`/patients/${patientId}`);
    } catch (error) {
      console.error('Error processing LAMA/DOR:', error);
      alert('Error processing LAMA/DOR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-blue-600" />
          Discharge Management
        </h1>
        <p className="text-gray-600 mt-1">Process patient discharge or LAMA/DOR</p>
      </div>

      {/* Blocking Issues */}
      {blockingIssues.length > 0 && dischargeType === 'REGULAR' && (
        <Card className="p-4 bg-red-50 border-2 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Cannot Discharge - Blocking Issues</p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                {blockingIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
              <p className="text-sm text-red-700 mt-2">
                Resolve all issues before regular discharge. For emergency situations, use LAMA/DOR instead.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Discharge Type Selector */}
      <Card className="p-6">
        <Label>Discharge Type</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <Button
            type="button"
            variant={dischargeType === 'REGULAR' ? 'default' : 'outline'}
            onClick={() => setDischargeType('REGULAR')}
            className={dischargeType === 'REGULAR' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Regular Discharge
          </Button>
          <Button
            type="button"
            variant={dischargeType === 'LAMA' ? 'default' : 'outline'}
            onClick={() => setDischargeType('LAMA')}
            className={dischargeType === 'LAMA' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            LAMA (Against Medical Advice)
          </Button>
          <Button
            type="button"
            variant={dischargeType === 'DOR' ? 'default' : 'outline'}
            onClick={() => setDischargeType('DOR')}
            className={dischargeType === 'DOR' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
          >
            DOR (Discharge on Request)
          </Button>
        </div>
      </Card>

      {/* Regular Discharge Form */}
      {dischargeType === 'REGULAR' && (
        <form onSubmit={handleRegularDischarge} className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Discharge Summary</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Admission Date *</Label>
                  <Input
                    type="date"
                    value={regularDischarge.admissionDate}
                    onChange={(e) => setRegularDischarge({ ...regularDischarge, admissionDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Discharge Date *</Label>
                  <Input
                    type="date"
                    value={regularDischarge.dischargeDate}
                    onChange={(e) => setRegularDischarge({ ...regularDischarge, dischargeDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Final Diagnosis *</Label>
                <textarea
                  value={regularDischarge.finalDiagnosis}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, finalDiagnosis: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                  placeholder="Final diagnosis at discharge..."
                  required
                />
              </div>

              <div>
                <Label>Treatment Summary *</Label>
                <textarea
                  value={regularDischarge.treatmentSummary}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, treatmentSummary: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Brief summary of treatment provided during admission..."
                  required
                />
              </div>

              <div>
                <Label>Operation/Procedure (if applicable)</Label>
                <textarea
                  value={regularDischarge.operationProcedure}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, operationProcedure: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                  placeholder="Details of any surgical procedures..."
                />
              </div>

              <div>
                <Label>Complications</Label>
                <textarea
                  value={regularDischarge.complications}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, complications: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                  placeholder="Any complications during hospital stay..."
                />
              </div>

              <div>
                <Label>Condition at Discharge *</Label>
                <select
                  value={regularDischarge.conditionAtDischarge}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, conditionAtDischarge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select condition...</option>
                  <option value="Improved">Improved</option>
                  <option value="Stable">Stable</option>
                  <option value="Unchanged">Unchanged</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <Label>Discharge Medications *</Label>
                <textarea
                  value={regularDischarge.dischargeMedications}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, dischargeMedications: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="List all medications with dosage and duration..."
                  required
                />
              </div>

              <div>
                <Label>Follow-up Instructions *</Label>
                <textarea
                  value={regularDischarge.followUpInstructions}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, followUpInstructions: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="When and where to follow up, what to monitor..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Diet Instructions</Label>
                  <Input
                    value={regularDischarge.diet}
                    onChange={(e) => setRegularDischarge({ ...regularDischarge, diet: e.target.value })}
                    placeholder="e.g., Low salt diet"
                  />
                </div>
                <div>
                  <Label>Activity Restrictions</Label>
                  <Input
                    value={regularDischarge.activity}
                    onChange={(e) => setRegularDischarge({ ...regularDischarge, activity: e.target.value })}
                    placeholder="e.g., Light activity only"
                  />
                </div>
              </div>

              <div>
                <Label>Warning Signs (When to Return)</Label>
                <textarea
                  value={regularDischarge.warnings}
                  onChange={(e) => setRegularDischarge({ ...regularDischarge, warnings: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Warning signs that require immediate medical attention..."
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || blockingIssues.length > 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : 'Complete Discharge'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Print Preview
            </Button>
          </div>
        </form>
      )}

      {/* LAMA/DOR Form */}
      {(dischargeType === 'LAMA' || dischargeType === 'DOR') && (
        <form onSubmit={handleLAMA} className="space-y-6">
          <Card className="p-6 bg-orange-50 border-2 border-orange-200">
            <h3 className="text-lg font-semibold mb-4 text-orange-800">
              {dischargeType === 'LAMA' ? 'Leave Against Medical Advice' : 'Discharge on Request'}
            </h3>
            <p className="text-sm text-orange-700 mb-4">
              {dischargeType === 'LAMA' 
                ? 'Patient is leaving against medical advice. Medical team recommends continued treatment.'
                : 'Patient is requesting discharge. Medical condition allows for discharge but optimal timing may differ.'
              }
            </p>
            
            <div className="space-y-4">
              <div>
                <Label>Reason for {dischargeType} *</Label>
                <textarea
                  value={lamaData.reason}
                  onChange={(e) => setLamaData({ ...lamaData, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Reason why patient is leaving..."
                  required
                />
              </div>

              <div>
                <Label>Patient/Guardian Statement *</Label>
                <textarea
                  value={lamaData.patientStatement}
                  onChange={(e) => setLamaData({ ...lamaData, patientStatement: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Patient acknowledges that they are leaving against medical advice and understand the risks..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Witness Name *</Label>
                  <Input
                    value={lamaData.witnessName}
                    onChange={(e) => setLamaData({ ...lamaData, witnessName: e.target.value })}
                    placeholder="Full name of witness"
                    required
                  />
                </div>
                <div>
                  <Label>Witness Relation *</Label>
                  <Input
                    value={lamaData.witnessRelation}
                    onChange={(e) => setLamaData({ ...lamaData, witnessRelation: e.target.value })}
                    placeholder="e.g., Brother, Friend, etc."
                    required
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded border">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> This form will be printed and require physical signatures from:
                </p>
                <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
                  <li>Patient or Guardian</li>
                  <li>Witness</li>
                  <li>Attending Doctor</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2">
                  After printing and obtaining signatures, scan and upload the signed form.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Processing...' : `Submit ${dischargeType} Form`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Print Form
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
