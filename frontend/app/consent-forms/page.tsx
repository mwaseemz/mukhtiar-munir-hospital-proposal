'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { patientApi } from '@/lib/api';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { useState } from 'react';

export default function ConsentFormsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: patientsData, isLoading } = useQuery({
    queryKey: ['patients-for-consent', searchQuery],
    queryFn: () => patientApi.search({ q: searchQuery, limit: 50 }),
  });

  const patients = patientsData?.data || [];

  const consentFormTypes = [
    {
      id: 'general',
      title: 'General Admission Consent',
      description: 'Required for all admissions',
      language: 'English',
      icon: FileText,
      color: 'blue',
    },
    {
      id: 'operation',
      title: 'Operation Consent',
      description: 'Required before any surgical procedure',
      language: 'Urdu',
      icon: FileText,
      color: 'orange',
    },
    {
      id: 'anesthesia',
      title: 'Anesthesia Consent',
      description: 'Required before anesthesia administration',
      language: 'Urdu',
      icon: FileText,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Consent Forms</h1>
          <p className="text-gray-600 mt-2">
            Manage patient consent forms for admissions, operations, and anesthesia
          </p>
        </div>

        {/* Form Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {consentFormTypes.map((formType) => {
            const Icon = formType.icon;
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-900',
              orange: 'bg-orange-50 border-orange-200 text-orange-900',
              purple: 'bg-purple-50 border-purple-200 text-purple-900',
            }[formType.color];

            return (
              <Card key={formType.id} className={`border-2 ${colorClasses}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className="h-8 w-8 mb-2" />
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
                      {formType.language}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{formType.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm opacity-90 mb-4">{formType.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/consent-forms/${formType.id}`)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Patient Search for Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Patient for Consent Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by MR Number, Name, or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Searching...</p>
                </div>
              ) : patients.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {patients.map((patient: any) => (
                    <div
                      key={patient.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/consent-forms/general?patientId=${patient.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {patient.mrNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {patient.gender} • {patient.age}y
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(patient.admissionDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-600">
                  <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No patients found</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Start typing to search for patients</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">0</p>
                </div>
                <Clock className="h-8 w-8 text-orange-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">0</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Requires Attention</p>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Forms</p>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
                <FileText className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
