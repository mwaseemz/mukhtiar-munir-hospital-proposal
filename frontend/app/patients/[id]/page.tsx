'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Pill, 
  Activity, 
  Stethoscope, 
  FileCheck,
  AlertTriangle,
  Lock,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  Phone,
  Heart,
  Syringe,
  FileHeart,
  ClipboardList,
  TrendingUp,
  Download,
  Upload,
  Droplet,
  FolderOpen,
  DollarSign,
  FileSearch,
  Baby,
  LogOut,
  UserCheck,
  Settings,
  ArrowRightLeft,
  Clipboard,
  HeartPulse,
  Plus,
  Trash2
} from 'lucide-react';
import { api, patientApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';

interface Patient {
  id: string;
  mrNumber: string;
  name: string;
  fatherName: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  admissionDate: string;
  admissionLocation: string;
  patientType: string;
  status: string;
}

interface StatusCardProps {
  title: string;
  value: string;
  status: 'complete' | 'warning' | 'active' | 'blocked';
  icon: any;
  onClick?: () => void;
}

function StatusCard({ title, value, status, icon: Icon, onClick }: StatusCardProps) {
  const statusColors = {
    complete: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    active: 'bg-blue-50 border-blue-200 text-blue-700',
    blocked: 'bg-red-50 border-red-200 text-red-700',
  };

  const statusIcons = {
    complete: CheckCircle,
    warning: AlertTriangle,
    active: Activity,
    blocked: Lock,
  };

  const StatusIcon = statusIcons[status];

  return (
    <Card 
      className={`p-4 border-2 ${statusColors[status]} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon className="w-6 h-6" />
          <StatusIcon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}

interface BlockingAlert {
  type: string;
  message: string;
  severity: 'error' | 'warning';
}

function BlockingAlerts({ alerts }: { alerts: BlockingAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
            alert.severity === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{alert.type}</p>
            <p className="text-sm mt-1">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const { user } = useAuthStore();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingAlerts, setBlockingAlerts] = useState<BlockingAlert[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const deletePatientMutation = useMutation({
    mutationFn: () => patientApi.delete(patientId),
    onSuccess: () => {
      toast.success('Patient deleted successfully');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete patient');
    },
  });

  const handleDeletePatient = () => {
    deletePatientMutation.mutate();
  };

  useEffect(() => {
    fetchPatientData();
    checkBlockingConditions();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBlockingConditions = async () => {
    try {
      const response = await api.get(`/blocking/check-all/${patientId}`);
      const alerts: BlockingAlert[] = [];

      if (response.data.consentBlocked) {
        alerts.push({
          type: 'Missing Consents',
          message: response.data.consentMessage || 'Upload all 3 consent forms before proceeding',
          severity: 'error'
        });
      }

      if (response.data.dpnBlocked) {
        alerts.push({
          type: 'Daily Progress Note Required',
          message: response.data.dpnMessage || 'Today\'s DPN must be entered before medication administration',
          severity: 'error'
        });
      }

      if (response.data.treatmentBlocked) {
        alerts.push({
          type: 'Treatment Administration Pending',
          message: response.data.treatmentMessage || 'Medications due for administration',
          severity: 'warning'
        });
      }

      setBlockingAlerts(alerts);
    } catch (error) {
      console.error('Error checking blocking conditions:', error);
    }
  };

  // Workflow-based organization of patient forms
  const workflowSections = [
    {
      title: '1. Admission & Assessment',
      icon: UserCheck,
      color: 'bg-blue-500',
      forms: [
        { label: 'Estimate Form', icon: DollarSign, href: `/patients/${patientId}/estimate` },
        { label: 'Investigation Profile', icon: FileSearch, href: `/patients/${patientId}/investigation-profile` },
        { label: 'Prescription Upload', icon: Upload, href: `/patients/${patientId}/prescription-upload` },
        { label: 'Consent Forms', icon: FileCheck, href: `/patients/${patientId}/consents` },
        { label: 'Medical History', icon: FileText, href: `/patients/${patientId}/medical-history` },
        { label: 'Physical Exam', icon: Stethoscope, href: `/patients/${patientId}/physical-exam` },
      ]
    },
    {
      title: '2. Ward Care & Monitoring',
      icon: HeartPulse,
      color: 'bg-green-500',
      forms: [
        { label: 'Daily Progress Notes', icon: ClipboardList, href: `/patients/${patientId}/daily-progress` },
        { label: 'Treatment Tickets', icon: Pill, href: `/patients/${patientId}/treatment-tickets` },
        { label: 'Vital Signs', icon: Heart, href: `/patients/${patientId}/vital-signs` },
        { label: 'I/O Chart', icon: TrendingUp, href: `/patients/${patientId}/input-output` },
        { label: 'Consultant Rounds', icon: FileHeart, href: `/patients/${patientId}/consultant-rounds` },
        { label: 'Critical Notes', icon: AlertTriangle, href: `/patients/${patientId}/critical-notes` },
      ]
    },
    {
      title: '3. OT & Procedures',
      icon: Settings,
      color: 'bg-purple-500',
      forms: [
        { label: 'OT Shifting Protocol', icon: ArrowRightLeft, href: `/patients/${patientId}/ot-shifting` },
        { label: 'Anesthesia Record', icon: Syringe, href: `/patients/${patientId}/anesthesia` },
        { label: 'Operation Notes', icon: Stethoscope, href: `/patients/${patientId}/operation` },
        { label: 'Post-Op Orders', icon: Clipboard, href: `/patients/${patientId}/post-op-orders` },
      ]
    },
    {
      title: '4. Special Events',
      icon: Plus,
      color: 'bg-orange-500',
      forms: [
        { label: 'Baby Receiving Notes', icon: Baby, href: `/patients/${patientId}/baby-receiving` },
        { label: 'Blood Transfusion', icon: Droplet, href: `/patients/${patientId}/blood-transfusion` },
        { label: 'LAMA / DOR Form', icon: LogOut, href: `/patients/${patientId}/lama-dor` },
      ]
    },
    {
      title: '5. Discharge & Documentation',
      icon: FileCheck,
      color: 'bg-gray-600',
      forms: [
        { label: 'Discharge Summary', icon: FileCheck, href: `/patients/${patientId}/discharge` },
        { label: 'All Documents', icon: FolderOpen, href: `/patients/${patientId}/documents` },
      ]
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-600" />
          <p className="mt-4 text-gray-600">Patient not found</p>
          <Button onClick={() => router.push('/patients/search')} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Patient Header */}
      <Card className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <p className="text-blue-100">MR Number: {patient.mrNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Father: {patient.fatherName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Age: {patient.age} years | {patient.gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{patient.admissionLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex flex-col items-end gap-3">
              <div className="inline-block px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold">
                {patient.status}
              </div>
              <p className="text-sm text-blue-100">
                Type: {patient.patientType}
              </p>
              {user?.role === 'SUPER_ADMIN' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white border-red-700 hover:border-red-800"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Patient
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Patient Record?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <strong>{patient.name}</strong> (MR# {patient.mrNumber})?
                        <br /><br />
                        <span className="text-red-600 font-semibold">
                          This action cannot be undone. This will permanently delete:
                        </span>
                        <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                          <li>Patient demographic information</li>
                          <li>All medical records and history</li>
                          <li>All consent forms</li>
                          <li>Treatment orders and progress notes</li>
                          <li>All related documents and forms</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeletePatient}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deletePatientMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Blocking Alerts */}
      {blockingAlerts.length > 0 && (
        <div className="mb-6">
          <BlockingAlerts alerts={blockingAlerts} />
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatusCard
          title="Consents"
          value="3/3"
          status="complete"
          icon={FileCheck}
          onClick={() => router.push(`/patients/${patientId}/consents`)}
        />
        <StatusCard
          title="Daily Progress"
          value="Up to date"
          status="complete"
          icon={ClipboardList}
          onClick={() => router.push(`/patients/${patientId}/daily-progress`)}
        />
        <StatusCard
          title="Treatment"
          value="5 active"
          status="active"
          icon={Pill}
          onClick={() => router.push(`/patients/${patientId}/treatment`)}
        />
        <StatusCard
          title="Alerts"
          value={`${blockingAlerts.length} active`}
          status={blockingAlerts.length > 0 ? 'blocked' : 'complete'}
          icon={AlertTriangle}
        />
      </div>

      {/* Workflow-Based Navigation */}
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Patient Care Workflow
        </h2>
        
        {workflowSections.map((section, sectionIndex) => (
          <Card key={section.title} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg ${section.color} text-white`}>
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">{section.title}</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {section.forms.map((form) => (
                <Button
                  key={form.label}
                  onClick={() => router.push(form.href)}
                  variant="outline"
                  className="flex items-center gap-2 justify-start h-auto py-3 hover:bg-gray-50"
                >
                  <form.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">{form.label}</span>
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Card className="p-6">
        <div className="border-b mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'vitals', label: 'Vitals', icon: Heart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Full Name:</span>
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Father's Name:</span>
                  <p className="font-medium">{patient.fatherName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Age & Gender:</span>
                  <p className="font-medium">{patient.age} years | {patient.gender}</p>
                </div>
                <div>
                  <span className="text-gray-600">Contact:</span>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{patient.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Admission Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Admission Date:</span>
                  <p className="font-medium">{new Date(patient.admissionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="font-medium">{patient.admissionLocation}</p>
                </div>
                <div>
                  <span className="text-gray-600">Patient Type:</span>
                  <p className="font-medium">{patient.patientType}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="font-medium">{patient.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4" />
            <p>Patient activity timeline coming soon...</p>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Documents & Files</h3>
              <Button className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </div>
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>No documents uploaded yet</p>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <p>Vital signs monitoring coming soon...</p>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/patients/search')}
          className="flex items-center gap-2"
        >
          Back to Search
        </Button>
        <Button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Generate Full Patient File (PDF)
        </Button>
      </div>
    </div>
  );
}
