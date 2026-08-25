import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PatientConsultation from "@/components/patient/consultation/PatientConsultationSession";
import { ConsultationJoinData } from "@/types";

/**
 * Example Patient Consultation Page
 * This page demonstrates how to use the PatientConsultation component
 * with real consultation data from your backend
 */
const PatientConsultationPage: React.FC = () => {
  const { callId } = useParams<{ callId: string }>();

  if (!callId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Consultation Link
          </h1>
          <p className="text-gray-600">
            The consultation ID is missing. Please use a valid link to join the
            consultation.
          </p>
        </div>
      </div>
    );
  }

  const consultationData: ConsultationJoinData = {
    callId,
    apiKey: import.meta.env.VITE_STREAM_IO_API_KEY || "",
    token: "", // This will be fetched from backend
    user: {
      id: "", // Will be populated from auth context
      name: "", // Will be populated from auth context
    },
  };

  return <PatientConsultation {...consultationData} />;
};

export default PatientConsultationPage;
