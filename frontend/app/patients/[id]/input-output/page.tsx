'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Plus, Save } from 'lucide-react';
import { api } from '@/lib/api';

interface IOEntry {
  id: string;
  time: string;
  
  // Input
  oralIntake: number;
  ivFluids: number;
  bloodProducts: number;
  
  // Output
  urineOutput: number;
  drainOutput: number;
  vomiting: number;
  stool: string;
  
  nurseSignature: string;
  createdAt: string;
}

export default function PatientInputOutputPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [entries, setEntries] = useState<IOEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);

  const [newEntry, setNewEntry] = useState({
    oralIntake: 0,
    ivFluids: 0,
    bloodProducts: 0,
    urineOutput: 0,
    drainOutput: 0,
    vomiting: 0,
    stool: '',
  });

  useEffect(() => {
    fetchIOEntries();
  }, [patientId]);

  const fetchIOEntries = async () => {
    try {
      const response = await api.get(`/input-output/${patientId}/today`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching I/O entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/input-output', {
        patientId,
        ...newEntry,
      });
      setNewEntry({
        oralIntake: 0,
        ivFluids: 0,
        bloodProducts: 0,
        urineOutput: 0,
        drainOutput: 0,
        vomiting: 0,
        stool: '',
      });
      setShowNewEntry(false);
      fetchIOEntries();
      alert('I/O entry saved successfully!');
    } catch (error) {
      console.error('Error saving I/O entry:', error);
      alert('Error saving I/O entry');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalInput = entries.reduce((sum, entry) => 
      sum + (entry.oralIntake || 0) + (entry.ivFluids || 0) + (entry.bloodProducts || 0), 0
    );
    const totalOutput = entries.reduce((sum, entry) => 
      sum + (entry.urineOutput || 0) + (entry.drainOutput || 0) + (entry.vomiting || 0), 0
    );
    return { totalInput, totalOutput, balance: totalInput - totalOutput };
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Input/Output Chart Monitoring
          </h1>
          <p className="text-gray-600 mt-1">24-hour fluid balance monitoring</p>
        </div>
        <Button
          onClick={() => setShowNewEntry(!showNewEntry)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-green-50 border-2 border-green-200">
          <p className="text-sm text-gray-600">Total Input (24h)</p>
          <p className="text-3xl font-bold text-green-700">{totals.totalInput} ml</p>
        </Card>
        <Card className="p-4 bg-orange-50 border-2 border-orange-200">
          <p className="text-sm text-gray-600">Total Output (24h)</p>
          <p className="text-3xl font-bold text-orange-700">{totals.totalOutput} ml</p>
        </Card>
        <Card className={`p-4 border-2 ${
          totals.balance >= 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className="text-sm text-gray-600">Fluid Balance</p>
          <p className={`text-3xl font-bold ${
            totals.balance >= 0 ? 'text-blue-700' : 'text-red-700'
          }`}>
            {totals.balance > 0 ? '+' : ''}{totals.balance} ml
          </p>
        </Card>
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">New I/O Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 text-green-700">INPUT (in mL)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Oral Intake</Label>
                  <Input
                    type="number"
                    value={newEntry.oralIntake}
                    onChange={(e) => setNewEntry({ ...newEntry, oralIntake: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>IV Fluids</Label>
                  <Input
                    type="number"
                    value={newEntry.ivFluids}
                    onChange={(e) => setNewEntry({ ...newEntry, ivFluids: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Blood Products</Label>
                  <Input
                    type="number"
                    value={newEntry.bloodProducts}
                    onChange={(e) => setNewEntry({ ...newEntry, bloodProducts: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-orange-700">OUTPUT (in mL)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Urine Output</Label>
                  <Input
                    type="number"
                    value={newEntry.urineOutput}
                    onChange={(e) => setNewEntry({ ...newEntry, urineOutput: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Drain Output</Label>
                  <Input
                    type="number"
                    value={newEntry.drainOutput}
                    onChange={(e) => setNewEntry({ ...newEntry, drainOutput: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Vomiting</Label>
                  <Input
                    type="number"
                    value={newEntry.vomiting}
                    onChange={(e) => setNewEntry({ ...newEntry, vomiting: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Stool/Bowel Movements</Label>
              <Input
                type="text"
                value={newEntry.stool}
                onChange={(e) => setNewEntry({ ...newEntry, stool: e.target.value })}
                placeholder="e.g., 1x formed stool"
              />
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

      {/* Today's Entries Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Entries</h3>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No entries for today</p>
            <p className="text-sm mt-2">Click "New Entry" to add the first entry</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-right text-green-700">Oral</th>
                  <th className="p-2 text-right text-green-700">IV</th>
                  <th className="p-2 text-right text-green-700">Blood</th>
                  <th className="p-2 text-right text-green-700 font-bold">Total In</th>
                  <th className="p-2 text-right text-orange-700">Urine</th>
                  <th className="p-2 text-right text-orange-700">Drain</th>
                  <th className="p-2 text-right text-orange-700">Vomit</th>
                  <th className="p-2 text-right text-orange-700 font-bold">Total Out</th>
                  <th className="p-2 text-left">Stool</th>
                  <th className="p-2 text-left">Nurse</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const totalIn = (entry.oralIntake || 0) + (entry.ivFluids || 0) + (entry.bloodProducts || 0);
                  const totalOut = (entry.urineOutput || 0) + (entry.drainOutput || 0) + (entry.vomiting || 0);
                  
                  return (
                    <tr key={entry.id} className="border-t">
                      <td className="p-2 font-medium">
                        {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-2 text-right">{entry.oralIntake || '-'}</td>
                      <td className="p-2 text-right">{entry.ivFluids || '-'}</td>
                      <td className="p-2 text-right">{entry.bloodProducts || '-'}</td>
                      <td className="p-2 text-right font-bold text-green-700">{totalIn}</td>
                      <td className="p-2 text-right">{entry.urineOutput || '-'}</td>
                      <td className="p-2 text-right">{entry.drainOutput || '-'}</td>
                      <td className="p-2 text-right">{entry.vomiting || '-'}</td>
                      <td className="p-2 text-right font-bold text-orange-700">{totalOut}</td>
                      <td className="p-2">{entry.stool || '-'}</td>
                      <td className="p-2 text-xs text-gray-600">{entry.nurseSignature}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-gray-400 font-bold bg-gray-50">
                  <td className="p-2">TOTALS</td>
                  <td className="p-2 text-right">
                    {entries.reduce((sum, e) => sum + (e.oralIntake || 0), 0)}
                  </td>
                  <td className="p-2 text-right">
                    {entries.reduce((sum, e) => sum + (e.ivFluids || 0), 0)}
                  </td>
                  <td className="p-2 text-right">
                    {entries.reduce((sum, e) => sum + (e.bloodProducts || 0), 0)}
                  </td>
                  <td className="p-2 text-right text-green-700">{totals.totalInput}</td>
                  <td className="p-2 text-right">
                    {entries.reduce((sum, e) => sum + (e.urineOutput || 0), 0)}
                  </td>
                  <td className="p-2 text-right">
                    {entries.reduce((sum, e) => sum + (e.drainOutput || 0), 0)}
                  </td>
                  <td className="p-2 text-right">
                    {entries.reduce((sum, e) => sum + (e.vomiting || 0), 0)}
                  </td>
                  <td className="p-2 text-right text-orange-700">{totals.totalOutput}</td>
                  <td className="p-2" colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
