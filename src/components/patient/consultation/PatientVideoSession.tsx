import React, { useState, useEffect } from "react";
import {
  CallControls,
  SpeakerLayout,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import {
  Clock,
  User,
  Phone as PhoneHangup,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Heart,
  FileText,
} from "lucide-react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useConsultationSession } from "@/hooks/useConsultationSession";

// Types for session data
interface ConsultationNote {
  id: string;
  timestamp: string;
  content: string;
  category: "observation" | "diagnosis" | "prescription" | "follow-up";
}

interface ConsultationSession {
  id: string;
  consultantName: string;
  consultantSpecialty: string;
  consultantImage?: string;
  chiefComplaint: string;
  scheduledTime: string;
  duration: number;
  consultationReason: string;
  symptoms?: string[];
}

// Session Timer Component
const SessionTimer: React.FC = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 text-white">
      <Clock size={18} className="animate-pulse" />
      <span className="font-mono font-semibold text-lg">
        {formatTime(time)}
      </span>
    </div>
  );
};

// Consultation Video View Component
const PatientVideoView: React.FC<{
  session: ConsultationSession;
  sessionInfo: ReturnType<typeof useConsultationSession>;
}> = ({ session, sessionInfo }) => {
  return (
    <>
      {sessionInfo.isSessionOngoing && (
        <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-lg relative">
          {/* Video Stream */}
          <div className="w-full h-full">
            <StreamTheme>
              <SpeakerLayout />
              <CallControls />
            </StreamTheme>
          </div>

          {/* Session Timer */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 rounded-lg px-4 py-2 backdrop-blur">
            <SessionTimer />
          </div>

          {/* Consultant Name Badge */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-lg px-4 py-2 backdrop-blur">
            <div className="flex items-center gap-2">
              <User size={16} className="text-indigo-400" />
              <div>
                <p className="text-white text-sm font-semibold">
                  {session.consultantName}
                </p>
                <p className="text-gray-300 text-xs">
                  {session.consultantSpecialty}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Consultation Info Component
const ConsultationInfo: React.FC<{ session: ConsultationSession }> = ({
  session,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Session Details</h3>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-600" />
        ) : (
          <ChevronDown size={20} className="text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-4 space-y-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chief Complaint
              </label>
              <p className="text-gray-900">{session.chiefComplaint}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Reason
              </label>
              <p className="text-gray-900">{session.consultationReason}</p>
            </div>

            {session.symptoms && session.symptoms.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Symptoms
                </label>
                <div className="flex flex-wrap gap-2">
                  {session.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      <Heart size={14} />
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Time
                </label>
                <p className="text-gray-900 text-sm">{session.scheduledTime}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Duration
                </label>
                <p className="text-gray-900 text-sm">
                  {session.duration} minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Consultation Notes View Component (Read-only for Patients)
const ConsultationNotesView: React.FC<{
  notes: ConsultationNote[];
}> = ({ notes }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const categoryColors = {
    observation: "bg-blue-100 text-blue-800",
    diagnosis: "bg-purple-100 text-purple-800",
    prescription: "bg-green-100 text-green-800",
    "follow-up": "bg-amber-100 text-amber-800",
  };

  const categoryIcons = {
    observation: <FileText size={14} />,
    diagnosis: <AlertCircle size={14} />,
    prescription: <CheckCircle size={14} />,
    "follow-up": <Clock size={14} />,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-indigo-600" />
          <h3 className="font-semibold text-gray-900">
            Session Notes ({notes.length})
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-600" />
        ) : (
          <ChevronDown size={20} className="text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 px-6 py-4 max-h-80 overflow-y-auto bg-gray-50">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">
                No notes added yet. The consultant will add notes during the
                session.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                          categoryColors[note.category]
                        }`}
                      >
                        {categoryIcons[note.category]}
                        {note.category.charAt(0).toUpperCase() +
                          note.category.slice(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {note.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Patient Video Session Component
interface PatientVideoSessionProps {
  session: ConsultationSession;
  notes?: ConsultationNote[];
  onEndSession: () => void;
}

const PatientVideoSession: React.FC<PatientVideoSessionProps> = ({
  session,
  notes = [],
  onEndSession,
}) => {
  const sessionInfo = useConsultationSession(session.id); // Initialize session management
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);

  useEffect(() => {
    // Check if participant is in the call
    if (sessionInfo.participantCount ?? 0 > 0) {
      setSessionStarted(true);
    }
  }, [sessionInfo.participantCount]);

  const handleEndSession = async () => {
    setShowEndSessionConfirm(false);
    await sessionInfo.endSession();
    onEndSession();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Consultation Session
          </h1>
          <p className="text-gray-600 mt-2">
            Speaking with {session.consultantName} •{" "}
            {session.consultantSpecialty}
          </p>
        </div>

        {/* Main Layout - Video and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <PatientVideoView session={session} sessionInfo={sessionInfo} />
          </div>

          {/* Right Sidebar - Session Info */}
          <div className="space-y-4 flex flex-col">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Status</h3>
                <div
                  className={`w-3 h-3 rounded-full ${
                    sessionStarted
                      ? "bg-green-500 animate-pulse"
                      : "bg-yellow-500"
                  }`}
                />
              </div>
              <p className="text-sm text-gray-600">
                {sessionStarted
                  ? "Consultation in progress"
                  : "Waiting for consultant to join"}
              </p>
              {sessionStarted && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <SessionTimer />
                </div>
              )}
            </div>

            {/* Consultant Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {session.consultantName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {session.consultantName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {session.consultantSpecialty}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEndSessionConfirm(true)}
                className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PhoneHangup size={18} />
                End Session
              </button>
            </div>

            {/* Consultation Info */}
            <div className="flex-shrink-0">
              <ConsultationInfo session={session} />
            </div>
          </div>
        </div>

        {/* Notes Section - Full Width */}
        <ConsultationNotesView notes={notes} />

        {/* End Session Confirmation Modal */}
        {showEndSessionConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                End Consultation Session?
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to end this consultation session? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndSessionConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndSession}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientVideoSession;
