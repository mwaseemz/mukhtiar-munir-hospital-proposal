'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Download, Upload, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface ConsentForm {
  id: string;
  type: 'GENERAL_ADMISSION' | 'OPERATION' | 'ANESTHESIA';
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED';
  uploadedAt?: string;
  uploadedBy?: string;
  fileUrl?: string;
}

export default function PatientConsentsPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [consents, setConsents] = useState<ConsentForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsents();
  }, [patientId]);

  const fetchConsents = async () => {
    try {
      const response = await api.get(`/consent-forms/patient/${patientId}`);
      setConsents(response.data);
    } catch (error) {
      console.error('Error fetching consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (type: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    formData.append('type', type);

    try {
      await api.post('/file-upload/consent', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchConsents();
      alert('Consent form uploaded successfully!');
    } catch (error) {
      console.error('Error uploading consent:', error);
      alert('Error uploading consent form');
    }
  };

  const consentTypes = [
    {
      type: 'GENERAL_ADMISSION',
      title: 'General Admission Consent',
      description: 'Required at time of admission',
      language: 'English'
    },
    {
      type: 'OPERATION',
      title: 'Operation Consent Form (اجازت نامہ برائے آپریشن)',
      description: 'Required before surgery',
      language: 'Urdu'
    },
    {
      type: 'ANESTHESIA',
      title: 'Anesthesia Consent Form (رضامندی برائے بیہوشی)',
      description: 'Required before anesthesia',
      language: 'Urdu'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'UPLOADED':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-50 border-green-200';
      case 'UPLOADED':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getConsentByType = (type: string) => {
    return consents.find(c => c.type === type);
  };

  const allConsentsUploaded = consentTypes.every(ct => {
    const consent = getConsentByType(ct.type);
    return consent && (consent.status === 'UPLOADED' || consent.status === 'VERIFIED');
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-600" />
            Consent Forms
          </h1>
          <p className="text-gray-600 mt-1">Manage and verify patient consent forms</p>
        </div>
        {allConsentsUploaded ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">All Consents Complete</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Missing Consents</span>
          </div>
        )}
      </div>

      {/* Critical Warning */}
      {!allConsentsUploaded && (
        <Card className="p-4 bg-red-50 border-2 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">CRITICAL: Missing Consent Forms</p>
              <p className="text-sm text-red-700 mt-1">
                All three consent forms must be uploaded before the patient can proceed to surgery or receive anesthesia.
                This is a mandatory compliance requirement.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Consent Forms List */}
      <div className="space-y-4">
        {consentTypes.map((consentType) => {
          const consent = getConsentByType(consentType.type);
          const status = consent?.status || 'PENDING';

          return (
            <Card key={consentType.type} className={`p-6 border-2 ${getStatusColor(status)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(status)}
                    <h3 className="text-lg font-semibold">{consentType.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                      {consentType.language}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{consentType.description}</p>

                  {consent ? (
                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="text-gray-700">
                          <strong>Status:</strong>{' '}
                          <span className={
                            status === 'VERIFIED' ? 'text-green-700 font-semibold' :
                            status === 'UPLOADED' ? 'text-yellow-700 font-semibold' :
                            'text-red-700 font-semibold'
                          }>
                            {status}
                          </span>
                        </p>
                        {consent.uploadedAt && (
                          <p className="text-gray-600">
                            <strong>Uploaded:</strong>{' '}
                            {new Date(consent.uploadedAt).toLocaleString()}
                          </p>
                        )}
                        {consent.uploadedBy && (
                          <p className="text-gray-600">
                            <strong>Uploaded by:</strong> {consent.uploadedBy}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {consent.fileUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(consent.fileUrl, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            View/Download
                          </Button>
                        )}
                        {status === 'PENDING' && (
                          <label>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(consentType.type, file);
                              }}
                            />
                            <Button size="sm" asChild>
                              <span>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Signed Form
                              </span>
                            </Button>
                          </label>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(consentType.type, file);
                          }}
                        />
                        <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Signed Form
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800">Consent Form Process</p>
            <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
              <li>Receptionist generates consent forms from the system</li>
              <li>Print the forms and obtain physical signatures from patient/guardian</li>
              <li>Scan the signed forms</li>
              <li>Upload scanned copies here</li>
              <li>Doctor/Consultant verifies the uploaded forms</li>
            </ol>
            <p className="text-sm text-blue-700 mt-2">
              <strong>Supported formats:</strong> PDF, JPG, PNG (max 5MB per file)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
