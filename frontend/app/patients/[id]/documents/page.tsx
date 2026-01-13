'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PatientDocumentsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    formData.append('documentType', 'general');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Document uploaded successfully!');
      } else {
        alert('Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href={`/patients/${patientId}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patient Profile
          </Button>
        </Link>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Patient Documents</h1>

          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-gray-600 mb-4">
                Upload consent forms, prescriptions, lab reports, and other documents
              </p>
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" disabled={uploading} className="pointer-events-none">
                  {uploading ? 'Uploading...' : 'Select File'}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,.doc,.docx"
                  disabled={uploading}
                />
              </label>
              
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, Images, Word documents (Max 10MB)
              </p>
            </div>

            {/* Document List Placeholder */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">Consent Form - General.pdf</p>
                    <p className="text-sm text-gray-500">Uploaded on Jan 13, 2026</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">Lab Report - CBC.pdf</p>
                    <p className="text-sm text-gray-500">Uploaded on Jan 12, 2026</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>

                <p className="text-sm text-gray-500 text-center py-8">
                  No documents uploaded yet. Use the upload section above to add documents.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
