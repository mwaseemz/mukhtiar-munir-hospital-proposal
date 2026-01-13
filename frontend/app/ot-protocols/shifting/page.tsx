"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { api } from "@/lib/api";

const shiftingSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  shiftingDate: z.string().min(1, "Date is required"),
  shiftingTime: z.string().min(1, "Time is required"),
  shiftedBy: z.string().min(1, "Shifted by is required"),
  
  // Checklist
  consentVerified: z.boolean(),
  nbmStatus: z.boolean(),
  preOpMedication: z.boolean(),
  investigationsAttached: z.boolean(),
  ivLineSecured: z.boolean(),
  identificationVerified: z.boolean(),
  
  // Vitals
  bp: z.string().min(1, "Blood pressure is required"),
  pulse: z.number().min(1, "Pulse is required"),
  temp: z.number().min(1, "Temperature is required"),
  respiration: z.number().min(1, "Respiration is required"),
  spo2: z.number().min(1, "SpO2 is required"),
  
  notes: z.string().optional(),
});

type ShiftingFormData = z.infer<typeof shiftingSchema>;

export default function ShiftingToOTPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ShiftingFormData>({
    resolver: zodResolver(shiftingSchema),
    defaultValues: {
      patientId,
      shiftingDate: new Date().toISOString().split("T")[0],
      shiftingTime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      consentVerified: false,
      nbmStatus: false,
      preOpMedication: false,
      investigationsAttached: false,
      ivLineSecured: false,
      identificationVerified: false,
    },
  });

  const createShiftingMutation = useMutation({
    mutationFn: (data: any) => api.post("/ot-protocols/shifting-to-ot", data),
    onSuccess: () => {
      alert("Shifting to OT record created successfully!");
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: ShiftingFormData) => {
    const payload = {
      patientId: data.patientId,
      shiftingDate: new Date(data.shiftingDate),
      shiftingTime: data.shiftingTime,
      shiftedBy: data.shiftedBy,
      consentVerified: data.consentVerified,
      nbmStatus: data.nbmStatus,
      preOpMedication: data.preOpMedication,
      investigationsAttached: data.investigationsAttached,
      ivLineSecured: data.ivLineSecured,
      identificationVerified: data.identificationVerified,
      vitals: {
        bp: data.bp,
        pulse: data.pulse,
        temp: data.temp,
        respiration: data.respiration,
        spo2: data.spo2,
      },
      notes: data.notes,
    };

    createShiftingMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Protocol: Shifting Patient to OT
            </h1>
            <p className="text-gray-600 mt-2">
              Complete the checklist before shifting patient to Operation Theatre
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient ID (Hidden) */}
            <input type="hidden" {...register("patientId")} />

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shiftingDate">Shifting Date *</Label>
                <Input
                  id="shiftingDate"
                  type="date"
                  {...register("shiftingDate")}
                />
                {errors.shiftingDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.shiftingDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="shiftingTime">Shifting Time *</Label>
                <Input
                  id="shiftingTime"
                  type="time"
                  {...register("shiftingTime")}
                />
                {errors.shiftingTime && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.shiftingTime.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="shiftedBy">Shifted By (Nurse Name) *</Label>
                <Input
                  id="shiftedBy"
                  {...register("shiftedBy")}
                  placeholder="Nurse name"
                />
                {errors.shiftedBy && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.shiftedBy.message}
                  </p>
                )}
              </div>
            </div>

            {/* Pre-Shift Checklist */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Pre-Shift Checklist</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("consentVerified")}
                    className="w-5 h-5"
                  />
                  <span>Consent Form Verified</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("nbmStatus")}
                    className="w-5 h-5"
                  />
                  <span>NBM (Nil By Mouth) Status Verified</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("preOpMedication")}
                    className="w-5 h-5"
                  />
                  <span>Pre-Operative Medication Given</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("investigationsAttached")}
                    className="w-5 h-5"
                  />
                  <span>Investigations (X-ray, MRI, Lab Reports) Attached</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("ivLineSecured")}
                    className="w-5 h-5"
                  />
                  <span>IV Line Secured</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("identificationVerified")}
                    className="w-5 h-5"
                  />
                  <span>Patient Identification Verified (MR Number)</span>
                </label>
              </div>
            </div>

            {/* Vitals Before Shifting */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Vitals Before Shifting</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bp">Blood Pressure *</Label>
                  <Input
                    id="bp"
                    {...register("bp")}
                    placeholder="e.g., 120/80"
                  />
                  {errors.bp && (
                    <p className="text-sm text-red-600 mt-1">{errors.bp.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pulse">Pulse (bpm) *</Label>
                  <Input
                    id="pulse"
                    type="number"
                    {...register("pulse", { valueAsNumber: true })}
                    placeholder="e.g., 75"
                  />
                  {errors.pulse && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.pulse.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="temp">Temperature (°F) *</Label>
                  <Input
                    id="temp"
                    type="number"
                    step="0.1"
                    {...register("temp", { valueAsNumber: true })}
                    placeholder="e.g., 98.6"
                  />
                  {errors.temp && (
                    <p className="text-sm text-red-600 mt-1">{errors.temp.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="respiration">Respiration Rate *</Label>
                  <Input
                    id="respiration"
                    type="number"
                    {...register("respiration", { valueAsNumber: true })}
                    placeholder="e.g., 16"
                  />
                  {errors.respiration && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.respiration.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="spo2">SpO2 (%) *</Label>
                  <Input
                    id="spo2"
                    type="number"
                    {...register("spo2", { valueAsNumber: true })}
                    placeholder="e.g., 98"
                  />
                  {errors.spo2 && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.spo2.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                {...register("notes")}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any additional observations or concerns"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createShiftingMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createShiftingMutation.isPending
                  ? "Submitting..."
                  : "Complete Shifting"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
