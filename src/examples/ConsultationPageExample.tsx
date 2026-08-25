/**
 * Example Implementation of Consultation Session UI
 * This file demonstrates how to integrate the ConsultantVideoSession
 * component into your application with proper setup and state management
 */

import React, { useState, useEffect } from "react";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import ConsultantVideoSession from "@/components/consultant/consultation/ConsultantVideoSession";
import { useConsultationSession } from "@/hooks/useConsultationSession";
import {
  generateTextReport,
  generateHtmlReport,
  downloadReport,
  sendReportToServer,
} from "@/lib/consultationUtils";
import {
  initializeStreamClient,
  getOrCreateCall,
  joinCall,
} from "@/lib/streamClient";
import { useGetStreamToken } from "@/lib/actions/generalQueriesAndMutation";
import { useTokenStore } from "@/store/TokenStore";
import { useUserContext } from "@/context/AuthContext";

/**
 * Main Consultation Page Component
 * This component handles the full consultation workflow
 */
export function ConsultationPage() {
  const { accessToken } = useTokenStore();
  const {
    data: streamToken,
    error: streamTokenError,
    isPending,
  } = useGetStreamToken(accessToken);
  const { userContext } = useUserContext();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [callId] = useState("consultation-" + Date.now());

  // Initialize Stream IO client
  useEffect(() => {
    const setupStreamClient = async () => {
      setLoading(true);
      try {
        if (streamTokenError) {
          throw streamTokenError;
        }

        if (!streamToken) {
          throw new Error("Stream token is not available");
        }
        console.log("Received Stream Token:", streamToken);
        console.log("User Context:", userContext.user_id);
        const userToken = streamToken.data.token;
        // 2. Initialize Stream IO client
        const streamClient = await initializeStreamClient(
          userContext?.user_id || "unknown_user",
          userToken,
          "Unknown User",
          "consultant",
        );
        // 3. Get or create call
        const call = await getOrCreateCall(streamClient, callId);

        // 4. Join call
        await joinCall(call, true);

        setClient(streamClient);
        setCall(call);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Failed to initialize consultation:", err);
      } finally {
        setLoading(false);
      }
    };
    setupStreamClient();
  }, [streamToken, streamTokenError, userContext]);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-600 rounded-full"></div>
          </div>
          <p className="text-gray-600">Initializing consultation...</p>
        </div>
      </div>
    );
  }
  if (error || streamTokenError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-700 text-sm">
            {error || streamTokenError?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call!}>
        <ConsultationSessionWrapper callId={callId} />
      </StreamCall>
    </StreamVideo>
  );
}

/**
 * Wrapper component for the consultation session
 * Handles session-specific logic and state management
 */
interface ConsultationSessionWrapperProps {
  callId: string;
}

function ConsultationSessionWrapper({
  callId,
}: ConsultationSessionWrapperProps) {
  const session = useConsultationSession(callId);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Handle session end
  const handleEndSession = async () => {
    try {
      setIsEndingSession(true);

      // Get final stats
      const stats = session.getSessionStats();
      console.log("Session Stats:", stats);

      // Generate report
      const report = session.generateConsultationReport();
      console.log("Consultation Report:", report);

      // Optional: Send report to server
      // await sendReportToServer(report, '/api/consultations/save');

      // End the call
      await session.endSession();

      // Show confirmation
      alert("Consultation ended successfully");

      // Navigate back or show summary
      // navigate('/dashboard');
    } catch (error) {
      console.error("Error ending session:", error);
      alert("Failed to end session. Please try again.");
    } finally {
      setIsEndingSession(false);
    }
  };

  // Handle report download
  const handleDownloadReport = (format: "text" | "html") => {
    const report = session.generateConsultationReport();

    const consultationData = {
      callId: report.callId,
      consultantName: "Dr. Sarah Johnson", // Get from props/context
      patientName: "John Doe", // Get from props/context
      consultationDate: new Date().toLocaleDateString(),
      consultationTime: new Date().toLocaleTimeString(),
      duration: report.stats.duration,
      chiefComplaint: "Follow-up consultation",
      notes: report.notes,
      prescriptions: report.prescriptions,
    };

    const filename = `consultation-${callId}-${Date.now()}`;

    if (format === "text") {
      const textReport = generateTextReport(consultationData);
      downloadReport(textReport, `${filename}.txt`, "text/plain");
    } else if (format === "html") {
      const htmlReport = generateHtmlReport(consultationData);
      downloadReport(htmlReport, `${filename}.html`, "text/html");
    }

    setShowReportMenu(false);
  };

  // Handle recording toggle
  const handleToggleRecording = async () => {
    try {
      await session.toggleRecording();
      const statusMessage = session.isRecording
        ? "Recording started"
        : "Recording stopped";
      console.log(statusMessage);
    } catch (error) {
      console.error("Error toggling recording:", error);
      alert("Failed to toggle recording");
    }
  };

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation</h1>
          <p className="text-gray-600 text-sm">ID: {callId}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Session Stats */}
          <div className="flex gap-6 px-6 border-r border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {session.notes.length}
              </p>
              <p className="text-xs text-gray-600">Notes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {session.prescriptions.length}
              </p>
              <p className="text-xs text-gray-600">Prescriptions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {session.participantCount}
              </p>
              <p className="text-xs text-gray-600">Participants</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleToggleRecording}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                session.isRecording
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
              title={session.isRecording ? "Stop Recording" : "Start Recording"}
            >
              {session.isRecording ? "● Recording" : "Record"}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReportMenu(!showReportMenu)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Download Report
              </button>

              {showReportMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleDownloadReport("text")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-medium text-sm"
                  >
                    Download as Text
                  </button>
                  <button
                    onClick={() => handleDownloadReport("html")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-medium text-sm border-t border-gray-200"
                  >
                    Download as HTML
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleEndSession}
              disabled={isEndingSession}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isEndingSession ? "Ending..." : "End Session"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ConsultantVideoSession
          data={{
            consultationId: "CONS-2024-001",
            patientName: "John Doe",
            startTime: "14:30",
            reason: "Headache",
            channel: "video",
            consultantName: "Dr. Sarah Johnson",
            status: "active",
            patientData: {
              age: "45",
              allergies: ["Penicillin"],
              conditions: ["Hypertension"],
              gender: "Male",
              insurance: "HealthPlus Gold",
              lastVisit: "2024-01-15",
              name: "John Doe",
            },
          }}

          onEndSession={handleEndSession}
        />
      </div>
    </div>
  );
}

/**
 * Alternative: Consultation Summary Page (shown after session ends)
 */
interface ConsultationSummaryProps {
  callId: string;
  consultationData: {
    patientName: string;
    consultantName: string;
    duration: number;
    notesCount: number;
    prescriptionsCount: number;
  };
  onClose: () => void;
}

export function ConsultationSummary({
  callId,
  consultationData,
  onClose,
}: ConsultationSummaryProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Consultation Complete
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-semibold text-gray-900">
              {consultationData.patientName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Consultant:</span>
            <span className="font-semibold text-gray-900">
              {consultationData.consultantName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-900">
              {Math.floor(consultationData.duration / 60)} minutes
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Clinical Notes:</span>
            <span className="font-semibold text-blue-600">
              {consultationData.notesCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Prescriptions:</span>
            <span className="font-semibold text-green-600">
              {consultationData.prescriptionsCount}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Navigate to consultation history
              // navigate(`/consultations/${callId}`);
              onClose();
            }}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsultationPage;
