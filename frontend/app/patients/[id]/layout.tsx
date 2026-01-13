'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Home, 
  User,
  AlertTriangle 
} from 'lucide-react';
import { api } from '@/lib/api';

interface Patient {
  id: string;
  mrNumber: string;
  name: string;
  status: string;
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  // Breadcrumb logic
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Home', href: '/dashboard', icon: Home },
      { label: 'Patients', href: '/patients/search', icon: User },
    ];

    if (patient) {
      breadcrumbs.push({
        label: `${patient.name} (${patient.mrNumber})`,
        href: `/patients/${patientId}`,
        icon: User,
      });

      // Add current page if not on patient profile
      if (paths.length > 2) {
        const currentPage = paths[paths.length - 1];
        const pageLabels: Record<string, string> = {
          'medical-history': 'Medical History',
          'treatment': 'Treatment',
          'daily-progress': 'Daily Progress',
          'input-output': 'I/O Chart',
          'anesthesia': 'Anesthesia',
          'operation': 'Operation Notes',
          'consultant-rounds': 'Consultant Rounds',
          'blood-transfusion': 'Blood Transfusion',
          'discharge': 'Discharge',
          'consents': 'Consents',
          'documents': 'Documents',
        };

        if (pageLabels[currentPage]) {
          breadcrumbs.push({
            label: pageLabels[currentPage],
            href: pathname,
            icon: User,
          });
        }
      }
    }

    return breadcrumbs;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The patient you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/patients/search')}>
            Back to Search
          </Button>
        </Card>
      </div>
    );
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span className="text-gray-400">/</span>}
                <button
                  onClick={() => router.push(crumb.href)}
                  className={`flex items-center gap-1 ${
                    index === breadcrumbs.length - 1
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <crumb.icon className="w-4 h-4" />
                  {crumb.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Context Bar */}
      <div className="bg-blue-600 text-white sticky top-[49px] z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/patients/${patientId}`)}
                className="text-white hover:bg-blue-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Profile
              </Button>
              <div className="border-l border-blue-400 pl-4">
                <span className="text-sm opacity-90">Current Patient:</span>
                <span className="ml-2 font-semibold">{patient.name}</span>
                <span className="ml-2 text-sm opacity-75">({patient.mrNumber})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                patient.status === 'ADMITTED' 
                  ? 'bg-green-500' 
                  : 'bg-gray-500'
              }`}>
                {patient.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
