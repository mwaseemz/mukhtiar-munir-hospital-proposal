'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill, Plus, Check, Clock, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

interface TreatmentOrder {
  id: string;
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string;
  status: string;
  administrations: Administration[];
}

interface Administration {
  id: string;
  scheduledTime: string;
  administeredTime?: string;
  administeredBy?: string;
  status: string;
}

export default function PatientTreatmentPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [orders, setOrders] = useState<TreatmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewOrder, setShowNewOrder] = useState(false);

  const [newOrder, setNewOrder] = useState({
    medication: '',
    dosage: '',
    route: 'IV',
    frequency: 'TDS',
    dilution: '',
    notes: '',
  });

  useEffect(() => {
    fetchTreatmentOrders();
  }, [patientId]);

  const fetchTreatmentOrders = async () => {
    try {
      const response = await api.get(`/treatment/patient/${patientId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching treatment orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/treatment/orders', {
        patientId,
        ...newOrder,
      });
      setNewOrder({
        medication: '',
        dosage: '',
        route: 'IV',
        frequency: 'TDS',
        dilution: '',
        notes: '',
      });
      setShowNewOrder(false);
      fetchTreatmentOrders();
    } catch (error) {
      console.error('Error creating treatment order:', error);
    }
  };

  const handleAdminister = async (orderId: string, scheduledTime: string) => {
    try {
      await api.post('/treatment/administer', {
        orderId,
        scheduledTime,
        notes: '',
      });
      fetchTreatmentOrders();
    } catch (error) {
      console.error('Error administering medication:', error);
    }
  };

  const routes = ['IV', 'IM', 'SC', 'PO', 'Topical', 'Inhalation'];
  const frequencies = ['OD', 'BD', 'TDS', 'QID', 'Q4H', 'Q6H', 'Q8H', 'Q12H', 'PRN', 'STAT'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Pill className="w-6 h-6 text-blue-600" />
            Treatment Tracking & Medication Administration
          </h1>
          <p className="text-gray-600 mt-1">Manage treatment orders and medication schedule</p>
        </div>
        <Button
          onClick={() => setShowNewOrder(!showNewOrder)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* New Order Form */}
      {showNewOrder && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">Create New Treatment Order</h3>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Medication Name *</Label>
                <Input
                  value={newOrder.medication}
                  onChange={(e) => setNewOrder({ ...newOrder, medication: e.target.value })}
                  placeholder="e.g., Injection Toradol"
                  required
                />
              </div>
              <div>
                <Label>Dosage *</Label>
                <Input
                  value={newOrder.dosage}
                  onChange={(e) => setNewOrder({ ...newOrder, dosage: e.target.value })}
                  placeholder="e.g., 30 mg"
                  required
                />
              </div>
              <div>
                <Label>Route *</Label>
                <select
                  value={newOrder.route}
                  onChange={(e) => setNewOrder({ ...newOrder, route: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  {routes.map((route) => (
                    <option key={route} value={route}>
                      {route}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Frequency *</Label>
                <select
                  value={newOrder.frequency}
                  onChange={(e) => setNewOrder({ ...newOrder, frequency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Label>Dilution Instructions</Label>
                <Input
                  value={newOrder.dilution}
                  onChange={(e) => setNewOrder({ ...newOrder, dilution: e.target.value })}
                  placeholder="e.g., Diluted in 10 cc"
                />
              </div>
              <div className="col-span-2">
                <Label>Additional Notes</Label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Create Order
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewOrder(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Active Orders */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Treatment Orders</h3>
        
        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading treatment orders...</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No treatment orders yet</p>
            <p className="text-sm mt-2">Click "New Order" to create the first treatment order</p>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{order.medication}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Dosage: <strong>{order.dosage}</strong></span>
                    <span>Route: <strong>{order.route}</strong></span>
                    <span>Frequency: <strong>{order.frequency}</strong></span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Administration Schedule */}
              <div className="border-t pt-4">
                <h5 className="text-sm font-semibold mb-3">Today's Schedule</h5>
                <div className="grid grid-cols-3 gap-3">
                  {order.administrations?.map((admin) => (
                    <div
                      key={admin.id}
                      className={`p-3 rounded-lg border-2 ${
                        admin.status === 'ADMINISTERED'
                          ? 'bg-green-50 border-green-200'
                          : admin.status === 'PENDING'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(admin.scheduledTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {admin.status === 'ADMINISTERED' && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      {admin.status === 'PENDING' ? (
                        <Button
                          size="sm"
                          onClick={() => handleAdminister(order.id, admin.scheduledTime)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Administer Now
                        </Button>
                      ) : admin.status === 'ADMINISTERED' ? (
                        <div className="text-xs text-gray-600">
                          By: {admin.administeredBy}
                          <br />
                          At: {admin.administeredTime && new Date(admin.administeredTime).toLocaleTimeString()}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Blocking Warning */}
      <Card className="p-4 bg-yellow-50 border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Blocking Rule Active</p>
            <p className="text-sm text-yellow-700 mt-1">
              Medication administration requires today's Daily Progress Note (DPN) to be entered first.
              If DPN is missing, medications cannot be administered.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
