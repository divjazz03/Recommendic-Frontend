import React, { useState, useEffect } from "react";
import {
  CallControls,
  SpeakerLayout,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import {
  Clock,
  User,
  FileText,
  Send,
  Download,
  RotateCcw,
  Phone as PhoneHangup,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { ConsultationResponseData } from "@/types";
import { useConsultationSession } from "@/hooks/useConsultationSession";
import { useEndConsultation } from "@/lib/actions/generalQueriesAndMutation";
import { useTokenStore } from "@/store/TokenStore";
import { toast } from "sonner";

// Types for notes and session data
interface ConsultationNote {
  id: string;
  timestamp: string;
  content: string;
  category: "observation" | "diagnosis" | "prescription" | "follow-up";
}

interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface ConsultationSession {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  chiefComplaint: string;
  scheduledTime: string;
  duration: number;
  patientHistory: string[];
  patientNotified: boolean;
}

interface ConsultantConsultationSessionProps {
  session: ConsultationSession;
  sessionInfo: ReturnType<typeof useConsultationSession>;
  onEndSession: () => void;
}

// Spotlight Video View Component
const ConsultationVideoView: React.FC<ConsultantConsultationSessionProps> = ({
  session,
  sessionInfo,
}) => {
  return (
    <>
      {sessionInfo.isSessionOngoing && (
        <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden shadow-lg relative">
          {/* Video Stream */}
          <div className="w-full h-full">
            <StreamTheme>
              <SpeakerLayout participantsBarPosition={"right"} />
              <CallControls />
            </StreamTheme>
          </div>

          {/* Session Timer */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 rounded-lg px-4 py-2 backdrop-blur">
            <SessionTimer />
          </div>

          {/* Patient Name Badge */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-lg px-4 py-2 backdrop-blur">
            <p className="text-white text-sm font-semibold">
              {session.patientName}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

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
      <Clock size={18} />
      <span className="font-mono font-semibold text-lg">
        {formatTime(time)}
      </span>
    </div>
  );
};

// Notes Section Component
const NotesSection: React.FC<{
  notes: ConsultationNote[];
  onAddNote: (note: ConsultationNote) => void;
}> = ({ notes, onAddNote }) => {
  const [noteContent, setNoteContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "observation" | "diagnosis" | "prescription" | "follow-up"
  >("observation");

  const handleAddNote = () => {
    if (noteContent.trim()) {
      const newNote: ConsultationNote = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        content: noteContent,
        category: selectedCategory,
      };
      onAddNote(newNote);
      setNoteContent("");
    }
  };

  const categoryColors = {
    observation: "bg-blue-100 text-blue-800",
    diagnosis: "bg-purple-100 text-purple-800",
    prescription: "bg-green-100 text-green-800",
    "follow-up": "bg-amber-100 text-amber-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText size={24} className="text-indigo-600" />
        Clinical Notes
      </h2>

      {/* Add Note Form */}
      <div className="mb-6 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value as
                  | "observation"
                  | "diagnosis"
                  | "prescription"
                  | "follow-up",
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="observation">Observation</option>
            <option value="diagnosis">Diagnosis</option>
            <option value="prescription">Prescription</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Note
          </label>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Type your clinical note here..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          onClick={handleAddNote}
          disabled={!noteContent.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 space-y-3 border-t pt-4">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No notes added yet. Start adding clinical notes...
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    categoryColors[note.category]
                  }`}
                >
                  {note.category.charAt(0).toUpperCase() +
                    note.category.slice(1)}
                </span>
                <span className="text-xs text-gray-500">{note.timestamp}</span>
              </div>
              <p className="text-sm text-gray-800">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Prescriptions Section Component
const PrescriptionsSection: React.FC<{
  prescriptions: PrescriptionItem[];
  onAddPrescription: (prescription: PrescriptionItem) => void;
}> = ({ prescriptions, onAddPrescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<PrescriptionItem>({
    id: "",
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  });

  const handleAddPrescription = () => {
    if (formData.medicineName.trim()) {
      const newPrescription: PrescriptionItem = {
        ...formData,
        id: Date.now().toString(),
      };
      onAddPrescription(newPrescription);
      setFormData({
        id: "",
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: "",
      });
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={24} className="text-green-600" />
          Prescriptions ({prescriptions.length})
        </h2>
        {isExpanded ? (
          <ChevronUp size={24} className="text-gray-600" />
        ) : (
          <ChevronDown size={24} className="text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <>
          {/* Add Prescription Form */}
          <div className="mb-6 space-y-3 border-b pb-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Medicine Name"
                value={formData.medicineName}
                onChange={(e) =>
                  setFormData({ ...formData, medicineName: e.target.value })
                }
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Dosage (e.g., 500mg)"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Frequency (e.g., 3x daily)"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 7 days)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <textarea
              placeholder="Additional notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full h-16 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleAddPrescription}
              disabled={!formData.medicineName.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Add Prescription
            </button>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-3">
            {prescriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No prescriptions added yet.
              </p>
            ) : (
              prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border border-green-200 rounded-lg p-4 bg-green-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {prescription.medicineName}
                    </h4>
                    <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded">
                      {prescription.dosage}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                    <p>
                      <span className="font-medium">Frequency:</span>{" "}
                      {prescription.frequency}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {prescription.duration}
                    </p>
                  </div>
                  {prescription.notes && (
                    <p className="text-sm text-gray-700 bg-white p-2 rounded border border-green-100">
                      {prescription.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Patient Information Panel Component
const PatientInfoPanel: React.FC<{ session: ConsultationSession }> = ({
  session,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User size={24} className="text-indigo-600" />
        Patient Information
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Name</p>
          <p className="font-semibold text-gray-900">{session.patientName}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Age / Gender</p>
          <p className="font-semibold text-gray-900">
            {session.patientAge} / {session.patientGender}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-500 mb-1">Chief Complaint</p>
        <p className="font-semibold text-gray-900">{session.chiefComplaint}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FileText size={20} className="text-indigo-600" />
          Medical History
        </h3>
        <ul className="space-y-2">
          {session.patientHistory.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 text-sm"
            >
              <span className="text-indigo-600 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Main Consultant Video Session Component
const ConsultantVideoSession: React.FC<{
  data: ConsultationResponseData;
  onEndSession: () => void;
}> = ({ data, onEndSession }) => {
  const sessionInfo = useConsultationSession(data.consultationId);
  const { accessToken } = useTokenStore();
  const { mutateAsync: endConsultationSession, error } =
    useEndConsultation(accessToken);
  const [notes, setNotes] = useState<ConsultationNote[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [consultation] = useState<ConsultationSession>({
    id: data.consultationId,
    patientName: data.patientName,
    patientAge: Number(data.patientData?.age || "30"),
    patientGender: data.patientData?.gender || "Male",
    chiefComplaint: data.reason,
    scheduledTime: data.startTime,
    duration: 30,
    patientHistory: [
      "Hypertension - diagnosed 2019",
      "Previous consultation - Dec 2025",
      "Current medications: Lisinopril 10mg",
    ],
    patientNotified: true,
  });

  useEffect(() => {
    // Start session after component mounts
    setSessionStarted(true);
  }, []);

  const handleAddNote = (note: ConsultationNote) => {
    setNotes([...notes, note]);
  };

  const handleAddPrescription = (prescription: PrescriptionItem) => {
    setPrescriptions([...prescriptions, prescription]);
  };

  const handleSessionEnd = async () => {
    if (sessionInfo.endSession) {
      await sessionInfo.endSession();
    }
    onEndSession();
    const result = await endConsultationSession({
      consultationId: consultation.id,
      date: new Date().toISOString().split("T")[0],
      shouldReschedule: false,
      summary: generateReport(),
      patientStatus: "stable",
    });
    if (!result) {
      toast.error(`Error ending session ${error?.message}`);
      return;
    }
    toast.success("Consultation ended successfully");
    window.location.href = "/"; // Redirect to Home after ending session
  };

  const generateReport = () => {
    return `
CONSULTATION REPORT
=====================
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

PATIENT INFORMATION
-------------------
Name: ${consultation.patientName}
Age: ${consultation.patientAge}
Gender: ${consultation.patientGender}
Chief Complaint: ${consultation.chiefComplaint}

MEDICAL HISTORY
---------------
${consultation.patientHistory.map((h) => `- ${h}`).join("\n")}

CLINICAL NOTES
--------------
${notes
  .map((note) => `[${note.timestamp}] (${note.category}): ${note.content}`)
  .join("\n\n")}

PRESCRIPTIONS
--------------
${prescriptions
  .map(
    (p) =>
      `${p.medicineName} - ${p.dosage}
   Frequency: ${p.frequency}
   Duration: ${p.duration}
   Notes: ${p.notes}`,
  )
  .join("\n\n")}

Generated by Recommendic Medical Platform
    `;
  };

  const handleDownloadReport = () => {
    const report = generateReport();

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(report),
    );
    element.setAttribute(
      "download",
      `consultation-report-${consultation.id}.txt`,
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="h-full w-full bg-gray-100">
      <div className="flex flex-col p-4 sm:p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Consultation Session
            </h1>
            <p className="text-gray-600 mt-1">
              Live consultation with {consultation.patientName}
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Download Report
          </button>
        </div>
        <div className=" flex-1 flex flex-col lg:grid grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(100%-80px)]">
          {/* Main Video Section - Larger */}
          <div className="col-span-1 lg:col-span-2 space-y-6 flex flex-col">
            {/* Video Call Area */}
            <div className="bg-gray-900 rounded-xl shadow-lg flex-1 overflow-hidden">
              {sessionStarted ? (
                <ConsultationVideoView
                  session={consultation}
                  onEndSession={handleSessionEnd}
                  sessionInfo={sessionInfo}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin mb-4">
                      <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-400">
                      Initializing video session...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section Below Video */}
            <div className="h-80">
              <NotesSection notes={notes} onAddNote={handleAddNote} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Patient Info */}
            <PatientInfoPanel session={consultation} />

            {/* Prescriptions */}
            <PrescriptionsSection
              prescriptions={prescriptions}
              onAddPrescription={handleAddPrescription}
            />

            {/* Session Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <FileText size={18} />
                View Medical Records
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Settings size={18} />
                Session Settings
              </button>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <RotateCcw size={18} />
                Request Screen Share
              </button>
              <button
                onClick={() => sessionInfo.setShowEndSessionConfirmation(true)}
                className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <PhoneHangup size={18} />
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {sessionInfo.showEndSessionConfirmation && (
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
                onClick={() => sessionInfo.setShowEndSessionConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSessionEnd}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantVideoSession;
