"use client";

import dynamic from "next/dynamic";
import PatientRegistrationForm from "@/components/patient-registration-form";

const ProtectedRoute = dynamic(() => import("@/components/ProtectedRoute"), {
  ssr: false,
});

function DaftarPageContent() {
  return <PatientRegistrationForm />;
}

export default function DaftarPage() {
  return (
    <ProtectedRoute>
      <DaftarPageContent />
    </ProtectedRoute>
  );
}
