'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const advancedSearchSchema = z.object({
  // Patient Demographics
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  mrNumber: z.string().optional(),
  cnic: z.string().optional(),
  phoneNumber: z.string().optional(),
  
  // Clinical
  admissionLocation: z.enum(['WARD', 'PRIVATE', 'NURSERY', 'ICU', '']).optional(),
  patientType: z.enum(['SURGERY', 'MEDICINE', '']).optional(),
  status: z.enum(['ADMITTED', 'DISCHARGED', 'TRANSFERRED', 'DECEASED', '']).optional(),
  
  // Date Ranges
  admissionDateFrom: z.string().optional(),
  admissionDateTo: z.string().optional(),
  dischargeDateFrom: z.string().optional(),
  dischargeDateTo: z.string().optional(),
  
  // Age Range
  ageFrom: z.number().optional(),
  ageTo: z.number().optional(),
  
  // Gender
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', '']).optional(),
  
  // Viral Markers
  antiHCV: z.boolean().optional(),
  hbsAg: z.boolean().optional(),
  hiv: z.boolean().optional(),
});

type AdvancedSearchFormData = z.infer<typeof advancedSearchSchema>;

export default function AdvancedSearchPage() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<AdvancedSearchFormData>({
    resolver: zodResolver(advancedSearchSchema),
  });

  const onSubmit = async (data: AdvancedSearchFormData) => {
    setIsSearching(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/api/patients/advanced-search?${params.toString()}`);
      setSearchResults(response.data);
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Advanced Patient Search</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Filters */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Search Filters</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Demographics */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Demographics</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="mrNumber">MR Number</Label>
                  <Input
                    id="mrNumber"
                    {...register('mrNumber')}
                    placeholder="MR001/26/W/S"
                  />
                </div>

                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="First name"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <Label htmlFor="cnic">CNIC</Label>
                  <Input
                    id="cnic"
                    {...register('cnic')}
                    placeholder="12345-1234567-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Age Range */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 text-gray-700">Age Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="ageFrom">From</Label>
                  <Input
                    id="ageFrom"
                    type="number"
                    {...register('ageFrom', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="ageTo">To</Label>
                  <Input
                    id="ageTo"
                    type="number"
                    {...register('ageTo', { valueAsNumber: true })}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Clinical */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 text-gray-700">Clinical</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="admissionLocation">Admission Location</Label>
                  <select
                    id="admissionLocation"
                    {...register('admissionLocation')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="WARD">Ward</option>
                    <option value="PRIVATE">Private</option>
                    <option value="NURSERY">Nursery</option>
                    <option value="ICU">ICU</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="patientType">Patient Type</Label>
                  <select
                    id="patientType"
                    {...register('patientType')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="SURGERY">Surgery</option>
                    <option value="MEDICINE">Medicine</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    {...register('status')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="ADMITTED">Admitted</option>
                    <option value="DISCHARGED">Discharged</option>
                    <option value="TRANSFERRED">Transferred</option>
                    <option value="DECEASED">Deceased</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date Ranges */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 text-gray-700">Admission Date</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="admissionDateFrom">From</Label>
                  <Input
                    id="admissionDateFrom"
                    type="date"
                    {...register('admissionDateFrom')}
                  />
                </div>
                <div>
                  <Label htmlFor="admissionDateTo">To</Label>
                  <Input
                    id="admissionDateTo"
                    type="date"
                    {...register('admissionDateTo')}
                  />
                </div>
              </div>
            </div>

            {/* Viral Markers */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 text-gray-700">Viral Markers</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="antiHCV"
                    {...register('antiHCV')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="antiHCV" className="cursor-pointer">
                    HCV Positive
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hbsAg"
                    {...register('hbsAg')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="hbsAg" className="cursor-pointer">
                    HBsAg Positive
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hiv"
                    {...register('hiv')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="hiv" className="cursor-pointer">
                    HIV Positive
                  </Label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  reset();
                  setSearchResults([]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </form>
        </Card>

        {/* Search Results */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">
            Search Results
            {searchResults.length > 0 && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({searchResults.length} patients found)
              </span>
            )}
          </h2>

          {searchResults.length === 0 && !isSearching && (
            <div className="text-center py-12 text-gray-500">
              <p>No search results yet. Use the filters to search for patients.</p>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-12 text-gray-500">
              <p>Searching...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((patient: any) => (
                <div
                  key={patient.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/patients/${patient.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">MR#: {patient.mrNumber}</p>
                      <p className="text-sm text-gray-600">
                        {patient.age} years | {patient.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        {patient.admissionLocation} | {patient.patientType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          patient.status === 'ADMITTED'
                            ? 'bg-green-100 text-green-800'
                            : patient.status === 'DISCHARGED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Viral Markers */}
                  {(patient.antiHCV || patient.hbsAg || patient.hiv) && (
                    <div className="mt-2 flex gap-2">
                      {patient.antiHCV && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          HCV+
                        </span>
                      )}
                      {patient.hbsAg && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          HBsAg+
                        </span>
                      )}
                      {patient.hiv && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          HIV+
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
