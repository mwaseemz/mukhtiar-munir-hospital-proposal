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

const receivingSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  receivingDate: z.string().min(1, "Date is required"),
  receivingTime: z.string().min(1, "Time is required"),
  receivedBy: z.string().min(1, "Received by is required"),
  handedOverBy: z.string().min(1, "Handed over by is required"),
  
  // Verification Checklist
  identityVerified: z.boolean(),
  procedureVerified: z.boolean(),
  consentVerified: z.boolean(),
  siteMarked: z.boolean(),
  investigationsChecked: z.boolean(),
  
  // Patient Condition
  consciousness: z.string().min(1, "Consciousness level is required"),
  
  // Vitals
  bp: z.string().min(1, "Blood pressure is required"),
  pulse: z.number().min(1, "Pulse is required"),
  temp: z.number().min(1, "Temperature is required"),
  respiration: z.number().min(1, "Respiration is required"),
  spo2: z.number().min(1, "SpO2 is required"),
  
  notes: z.string().optional(),
});

type ReceivingFormData = z.infer<typeof receivingSchema>;

export default function ReceivingInOTPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceivingFormData>({
    resolver: zodResolver(receivingSchema),
    defaultValues: {
      patientId,
      receivingDate: new Date().toISOString().split("T")[0],
      receivingTime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      identityVerified: false,
      procedureVerified: false,
      consentVerified: false,
      siteMarked: false,
      investigationsChecked: false,
      consciousness: "Alert",
    },
  });

  const createReceivingMutation = useMutation({
    mutationFn: (data: any) => api.post("/ot-protocols/receiving-in-ot", data),
    onSuccess: () => {
      alert("Receiving in OT record created successfully!");
      router.push(`/patients/${patientId}`);
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const onSubmit = (data: ReceivingFormData) => {
    const payload = {
      patientId: data.patientId,
      receivingDate: new Date(data.receivingDate),
      receivingTime: data.receivingTime,
      receivedBy: data.receivedBy,
      handedOverBy: data.handedOverBy,
      identityVerified: data.identityVerified,
      procedureVerified: data.procedureVerified,
      consentVerified: data.consentVerified,
      siteMarked: data.siteMarked,
      investigationsChecked: data.investigationsChecked,
      consciousness: data.consciousness,
      vitals: {
        bp: data.bp,
        pulse: data.pulse,
        temp: data.temp,
        respiration: data.respiration,
        spo2: data.spo2,
      },
      notes: data.notes,
    };

    createReceivingMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Protocol: Receiving Patient in OT
            </h1>
            <p className="text-gray-600 mt-2">
              Verify all details when receiving patient in Operation Theatre
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient ID (Hidden) */}
            <input type="hidden" {...register("patientId")} />

            {/* Date, Time and Staff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receivingDate">Receiving Date *</Label>
                <Input
                  id="receivingDate"
                  type="date"
                  {...register("receivingDate")}
                />
                {errors.receivingDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.receivingDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="receivingTime">Receiving Time *</Label>
                <Input
                  id="receivingTime"
                  type="time"
                  {...register("receivingTime")}
                />
                {errors.receivingTime && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.receivingTime.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="receivedBy">Received By (OT Nurse) *</Label>
                <Input
                  id="receivedBy"
                  {...register("receivedBy")}
                  placeholder="OT Nurse name"
                />
                {errors.receivedBy && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.receivedBy.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="handedOverBy">Handed Over By (Ward Nurse) *</Label>
                <Input
                  id="handedOverBy"
                  {...register("handedOverBy")}
                  placeholder="Ward Nurse name"
                />
                {errors.handedOverBy && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.handedOverBy.message}
                  </p>
                )}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                WHO Surgical Safety Checklist - Sign In
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("identityVerified")}
                    className="w-5 h-5"
                  />
                  <span>Patient Identity Verified (Name, MR Number)</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("procedureVerified")}
                    className="w-5 h-5"
                  />
                  <span>Procedure Verified with Patient/Consent Form</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("consentVerified")}
                    className="w-5 h-5"
                  />
                  <span>Consent Form Signed and Verified</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("siteMarked")}
                    className="w-5 h-5"
                  />
                  <span>Surgical Site Marked</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("investigationsChecked")}
                    className="w-5 h-5"
                  />
                  <span>All Investigations Available and Reviewed</span>
                </label>
              </div>
            </div>

            {/* Patient Condition */}
            <div>
              <Label htmlFor="consciousness">Consciousness Level *</Label>
              <select
                id="consciousness"
                {...register("consciousness")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Alert">Alert</option>
                <option value="Drowsy">Drowsy</option>
                <option value="Confused">Confused</option>
                <option value="Unconscious">Unconscious</option>
              </select>
              {errors.consciousness && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.consciousness.message}
                </p>
              )}
            </div>

            {/* Vitals on Arrival */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Vitals on Arrival in OT</h3>
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
                placeholder="Any discrepancies or additional observations"
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
                disabled={createReceivingMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {createReceivingMutation.isPending
                  ? "Submitting..."
                  : "Complete Receiving"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
