'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Save } from 'lucide-react';
import { api } from '@/lib/api';

export default function PatientMedicalHistoryPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    historyOfPresentingIllness: '',
    pastMedicalHistory: '',
    pastSurgicalHistory: '',
    familyHistory: '',
    drugHistory: '',
    allergies: '',
    
    // General Physical Examination
    generalAppearance: '',
    vitals: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
    },
    
    // Systemic Examination
    cardiovascular: '',
    respiratory: '',
    abdomen: '',
    neurological: '',
    musculoskeletal: '',
    
    clinicalImpression: '',
    provisionalDiagnosis: '',
    investigationsPlan: '',
    treatmentPlan: '',
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    try {
      const response = await api.get(`/medical-history/${patientId}`);
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/medical-history', {
        patientId,
        ...formData,
      });
      alert('Medical history saved successfully!');
    } catch (error) {
      console.error('Error saving medical history:', error);
      alert('Error saving medical history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Medical History & Examination
        </h1>
        <p className="text-gray-600 mt-1">Complete medical history and physical examination</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* History Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">History</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Chief Complaint *</Label>
              <textarea
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                placeholder="Main presenting complaint..."
                required
              />
            </div>

            <div>
              <Label>History of Presenting Illness (HPI) *</Label>
              <textarea
                value={formData.historyOfPresentingIllness}
                onChange={(e) => setFormData({ ...formData, historyOfPresentingIllness: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Detailed history of current illness..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Past Medical History</Label>
                <textarea
                  value={formData.pastMedicalHistory}
                  onChange={(e) => setFormData({ ...formData, pastMedicalHistory: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Previous medical conditions..."
                />
              </div>
              <div>
                <Label>Past Surgical History</Label>
                <textarea
                  value={formData.pastSurgicalHistory}
                  onChange={(e) => setFormData({ ...formData, pastSurgicalHistory: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Previous surgeries..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Family History</Label>
                <textarea
                  value={formData.familyHistory}
                  onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Family medical history..."
                />
              </div>
              <div>
                <Label>Drug History & Current Medications</Label>
                <textarea
                  value={formData.drugHistory}
                  onChange={(e) => setFormData({ ...formData, drugHistory: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Current medications and past drug history..."
                />
              </div>
            </div>

            <div>
              <Label>Known Allergies</Label>
              <textarea
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                placeholder="Drug allergies, food allergies, etc..."
              />
            </div>
          </div>
        </Card>

        {/* Physical Examination */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Physical Examination</h3>
          
          <div className="space-y-4">
            <div>
              <Label>General Appearance</Label>
              <textarea
                value={formData.generalAppearance}
                onChange={(e) => setFormData({ ...formData, generalAppearance: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                placeholder="Patient's general condition and appearance..."
              />
            </div>

            <div>
              <h4 className="font-semibold mb-3">Vital Signs</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Blood Pressure</Label>
                  <input
                    type="text"
                    value={formData.vitals.bloodPressure}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      vitals: { ...formData.vitals, bloodPressure: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="120/80 mmHg"
                  />
                </div>
                <div>
                  <Label>Heart Rate</Label>
                  <input
                    type="text"
                    value={formData.vitals.heartRate}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      vitals: { ...formData.vitals, heartRate: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="72 bpm"
                  />
                </div>
                <div>
                  <Label>Temperature</Label>
                  <input
                    type="text"
                    value={formData.vitals.temperature}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      vitals: { ...formData.vitals, temperature: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="98.6°F"
                  />
                </div>
                <div>
                  <Label>Respiratory Rate</Label>
                  <input
                    type="text"
                    value={formData.vitals.respiratoryRate}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      vitals: { ...formData.vitals, respiratoryRate: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="16 /min"
                  />
                </div>
                <div>
                  <Label>O₂ Saturation</Label>
                  <input
                    type="text"
                    value={formData.vitals.oxygenSaturation}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      vitals: { ...formData.vitals, oxygenSaturation: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="98%"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Systemic Examination</h4>
              <div className="space-y-3">
                <div>
                  <Label>Cardiovascular System</Label>
                  <textarea
                    value={formData.cardiovascular}
                    onChange={(e) => setFormData({ ...formData, cardiovascular: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Heart sounds, murmurs, etc..."
                  />
                </div>
                <div>
                  <Label>Respiratory System</Label>
                  <textarea
                    value={formData.respiratory}
                    onChange={(e) => setFormData({ ...formData, respiratory: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Breath sounds, chest expansion, etc..."
                  />
                </div>
                <div>
                  <Label>Abdomen</Label>
                  <textarea
                    value={formData.abdomen}
                    onChange={(e) => setFormData({ ...formData, abdomen: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Inspection, palpation, percussion, auscultation..."
                  />
                </div>
                <div>
                  <Label>Neurological System</Label>
                  <textarea
                    value={formData.neurological}
                    onChange={(e) => setFormData({ ...formData, neurological: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Consciousness, reflexes, motor/sensory function..."
                  />
                </div>
                <div>
                  <Label>Musculoskeletal System</Label>
                  <textarea
                    value={formData.musculoskeletal}
                    onChange={(e) => setFormData({ ...formData, musculoskeletal: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Joint examination, range of motion, etc..."
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Assessment & Plan */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Assessment & Plan</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Clinical Impression</Label>
              <textarea
                value={formData.clinicalImpression}
                onChange={(e) => setFormData({ ...formData, clinicalImpression: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Overall clinical impression..."
              />
            </div>

            <div>
              <Label>Provisional Diagnosis</Label>
              <textarea
                value={formData.provisionalDiagnosis}
                onChange={(e) => setFormData({ ...formData, provisionalDiagnosis: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                placeholder="Provisional/differential diagnosis..."
              />
            </div>

            <div>
              <Label>Investigations Plan</Label>
              <textarea
                value={formData.investigationsPlan}
                onChange={(e) => setFormData({ ...formData, investigationsPlan: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Labs, imaging, and other investigations needed..."
              />
            </div>

            <div>
              <Label>Treatment Plan</Label>
              <textarea
                value={formData.treatmentPlan}
                onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Management and treatment plan..."
              />
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Medical History'}
          </Button>
        </div>
      </form>
    </div>
  );
}
