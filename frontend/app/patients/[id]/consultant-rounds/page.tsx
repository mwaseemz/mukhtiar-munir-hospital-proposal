'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileHeart, Plus, Save, CheckCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface ConsultantRound {
  id: string;
  date: string;
  problems: string;
  examination: string;
  assessment: string;
  plan: string;
  orders: string;
  consultantSignature: string;
  registrarVerification?: string;
  verifiedAt?: string;
  createdAt: string;
}

export default function PatientConsultantRoundsPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [rounds, setRounds] = useState<ConsultantRound[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewRound, setShowNewRound] = useState(false);

  const [newRound, setNewRound] = useState({
    problems: '',
    examination: '',
    assessment: '',
    plan: '',
    orders: '',
  });

  useEffect(() => {
    fetchConsultantRounds();
  }, [patientId]);

  const fetchConsultantRounds = async () => {
    try {
      const response = await api.get(`/consultant-rounds/${patientId}`);
      setRounds(response.data);
    } catch (error) {
      console.error('Error fetching consultant rounds:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/consultant-rounds', {
        patientId,
        ...newRound,
      });
      setNewRound({
        problems: '',
        examination: '',
        assessment: '',
        plan: '',
        orders: '',
      });
      setShowNewRound(false);
      fetchConsultantRounds();
      alert('Consultant round saved successfully!');
    } catch (error) {
      console.error('Error saving consultant round:', error);
      alert('Error saving consultant round');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (roundId: string) => {
    try {
      await api.post(`/consultant-rounds/${roundId}/verify`);
      fetchConsultantRounds();
      alert('Round verified successfully!');
    } catch (error) {
      console.error('Error verifying round:', error);
      alert('Error verifying round');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileHeart className="w-6 h-6 text-blue-600" />
            Consultant Rounds & Order Management
          </h1>
          <p className="text-gray-600 mt-1">Daily consultant assessments and orders</p>
        </div>
        <Button
          onClick={() => setShowNewRound(!showNewRound)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Round
        </Button>
      </div>

      {/* New Round Form */}
      {showNewRound && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">New Consultant Round</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Current Problems & Complaints *</Label>
              <textarea
                value={newRound.problems}
                onChange={(e) => setNewRound({ ...newRound, problems: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="List current problems and patient complaints..."
                required
              />
            </div>

            <div>
              <Label>Examination Findings *</Label>
              <textarea
                value={newRound.examination}
                onChange={(e) => setNewRound({ ...newRound, examination: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Physical examination findings, vitals, system review..."
                required
              />
            </div>

            <div>
              <Label>Assessment *</Label>
              <textarea
                value={newRound.assessment}
                onChange={(e) => setNewRound({ ...newRound, assessment: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Clinical assessment and impression..."
                required
              />
            </div>

            <div>
              <Label>Plan *</Label>
              <textarea
                value={newRound.plan}
                onChange={(e) => setNewRound({ ...newRound, plan: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Management plan and next steps..."
                required
              />
            </div>

            <div>
              <Label>Orders & Instructions *</Label>
              <textarea
                value={newRound.orders}
                onChange={(e) => setNewRound({ ...newRound, orders: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Specific orders: medications, investigations, procedures, monitoring..."
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Example: "Continue IV antibiotics, Order CBC and electrolytes tomorrow, Mobilize patient twice daily"
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Round'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewRound(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Previous Rounds */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Consultant Round History</h3>
        
        {rounds.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <FileHeart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No consultant rounds yet</p>
            <p className="text-sm mt-2">Click "New Round" to create the first round</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {rounds.map((round) => {
              const isVerified = !!round.registrarVerification;
              const roundDate = new Date(round.date);
              
              return (
                <Card key={round.id} className={`p-6 ${
                  isVerified ? 'border-2 border-green-200' : 'border-2 border-yellow-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {roundDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Consultant: {round.consultantSignature} | {new Date(round.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isVerified ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-semibold">Verified</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-semibold">Pending Verification</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleVerify(round.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Verify as Registrar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-blue-700 mb-1">Problems</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{round.problems}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-700 mb-1">Examination</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{round.examination}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-700 mb-1">Assessment</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{round.assessment}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 mb-1">Plan</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{round.plan}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                      <p className="font-semibold text-blue-700 mb-2">Orders & Instructions</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{round.orders}</p>
                    </div>
                  </div>

                  {isVerified && (
                    <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                      <p>
                        <strong>Verified by Registrar:</strong> {round.registrarVerification}
                      </p>
                      <p>
                        <strong>Verification Time:</strong> {round.verifiedAt && new Date(round.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <FileHeart className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800">Registrar Verification Required</p>
            <p className="text-sm text-blue-700 mt-1">
              All consultant rounds must be acknowledged and verified by the on-duty registrar/medical officer.
              This ensures clear communication and accountability for patient care orders.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
