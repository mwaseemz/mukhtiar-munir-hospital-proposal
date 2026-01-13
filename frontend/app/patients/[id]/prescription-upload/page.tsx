'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, FileText, X } from 'lucide-react';
import Link from 'next/link';

export default function PrescriptionUploadPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('patientId', patientId);
        formData.append('documentType', 'prescription');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedFiles(prev => [...prev, { name: file.name, url: data.fileUrl, uploadedAt: new Date() }]);
        } else {
          alert(`Failed to upload ${file.name}`);
        }
      }
      alert('Prescription(s) uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload prescription');
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
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Prescription Upload</h1>
              <p className="text-sm text-gray-600">Upload external doctor prescriptions and letterheads</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm font-medium text-blue-800">
              ℹ️ This is for prescriptions written by consultants on their letterheads. Upload scanned copies or photos.
            </p>
          </div>

          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Prescription Documents</h3>
              <p className="text-gray-600 mb-4">
                Scan or photograph the prescription and upload here for digital record keeping
              </p>
              
              <label htmlFor="prescription-upload" className="cursor-pointer">
                <Button type="button" disabled={uploading} className="pointer-events-none">
                  {uploading ? 'Uploading...' : 'Select Files'}
                </Button>
                <input
                  id="prescription-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                  disabled={uploading}
                  multiple
                />
              </label>
              
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG (Max 10MB per file)
              </p>
            </div>

            {/* Use Case Examples */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📋 When to use this:</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Patient comes with external consultant prescription</li>
                <li>Doctor writes prescription on personal letterhead</li>
                <li>Referral letters from other hospitals</li>
                <li>Historical prescriptions from previous visits</li>
              </ul>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recently Uploaded</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded {file.uploadedAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workflow Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">📝 Workflow:</h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Consultant writes prescription on letterhead</li>
                <li>Patient brings prescription to hospital</li>
                <li>Staff scans or photographs the prescription</li>
                <li>Upload here for permanent digital record</li>
                <li>Prescription becomes part of patient file</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Link href={`/patients/${patientId}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Done - Back to Patient Profile
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
