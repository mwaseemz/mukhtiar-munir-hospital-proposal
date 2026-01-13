'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ClipboardList, Plus, Save, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

interface DPNEntry {
  id: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdBy: string;
  createdAt: string;
}

export default function PatientDailyProgressPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [entries, setEntries] = useState<DPNEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);

  const [newEntry, setNewEntry] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  useEffect(() => {
    fetchDPNEntries();
  }, [patientId]);

  const fetchDPNEntries = async () => {
    try {
      const response = await api.get(`/daily-progress/${patientId}`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching DPN entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/daily-progress', {
        patientId,
        ...newEntry,
      });
      setNewEntry({
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
      });
      setShowNewEntry(false);
      fetchDPNEntries();
      alert('Daily Progress Note saved successfully!');
    } catch (error) {
      console.error('Error saving DPN:', error);
      alert('Error saving Daily Progress Note');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString();
  const hasTodayEntry = entries.some(entry => 
    new Date(entry.date).toLocaleDateString() === today
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Daily Progress Notes (SOAP Format)
          </h1>
          <p className="text-gray-600 mt-1">Subjective, Objective, Assessment, Plan</p>
        </div>
        <Button
          onClick={() => setShowNewEntry(!showNewEntry)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={hasTodayEntry && !showNewEntry}
        >
          <Plus className="w-4 h-4 mr-2" />
          {hasTodayEntry ? 'Today\'s Entry Complete' : 'New Entry'}
        </Button>
      </div>

      {/* Critical Warning */}
      {!hasTodayEntry && (
        <Card className="p-4 bg-red-50 border-2 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">CRITICAL: Today's DPN Missing</p>
              <p className="text-sm text-red-700 mt-1">
                Daily Progress Note must be entered before medication administration can proceed.
                This is a mandatory requirement for patient safety and compliance.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">New Daily Progress Note - {today}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>S - Subjective (Patient's Complaints) *</Label>
              <textarea
                value={newEntry.subjective}
                onChange={(e) => setNewEntry({ ...newEntry, subjective: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="What the patient reports (symptoms, complaints, how they feel)..."
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Example: "Patient reports feeling better, pain reduced to 3/10, appetite improving"
              </p>
            </div>

            <div>
              <Label>O - Objective (Clinical Findings) *</Label>
              <textarea
                value={newEntry.objective}
                onChange={(e) => setNewEntry({ ...newEntry, objective: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Measurable observations (vitals, exam findings, lab results)..."
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Example: "BP: 120/80, HR: 72, Temp: 98.6°F, Wound clean and dry, no signs of infection"
              </p>
            </div>

            <div>
              <Label>A - Assessment (Clinical Impression) *</Label>
              <textarea
                value={newEntry.assessment}
                onChange={(e) => setNewEntry({ ...newEntry, assessment: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Your clinical assessment and diagnosis..."
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Example: "Post-operative day 3, recovering well, no complications noted"
              </p>
            </div>

            <div>
              <Label>P - Plan (Management Plan) *</Label>
              <textarea
                value={newEntry.plan}
                onChange={(e) => setNewEntry({ ...newEntry, plan: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Treatment plan and next steps..."
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Example: "Continue current medications, mobilize patient, remove drain tomorrow, discharge in 2 days if stable"
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Entry'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewEntry(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Previous Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Previous Entries</h3>
        
        {entries.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No daily progress notes yet</p>
            <p className="text-sm mt-2">Click "New Entry" to create the first entry</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const entryDate = new Date(entry.date);
              const isToday = entryDate.toLocaleDateString() === today;
              
              return (
                <Card key={entry.id} className={`p-6 ${isToday ? 'border-2 border-green-200 bg-green-50' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {entryDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <p className="text-sm text-gray-600">
                        By: {entry.createdBy} | {new Date(entry.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {isToday && (
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-blue-700 mb-1">S - Subjective</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.subjective}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-700 mb-1">O - Objective</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.objective}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-700 mb-1">A - Assessment</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.assessment}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 mb-1">P - Plan</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.plan}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <ClipboardList className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800">SOAP Note Format</p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li><strong>S (Subjective):</strong> What the patient tells you</li>
              <li><strong>O (Objective):</strong> What you observe and measure</li>
              <li><strong>A (Assessment):</strong> Your clinical interpretation</li>
              <li><strong>P (Plan):</strong> What you will do next</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
