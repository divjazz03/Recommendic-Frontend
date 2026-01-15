import {
  BellDot,
  BellOff,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Pill,
  Plus,
  Share2,
  Shield,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface Medication {
  id: string;
  name?: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  instructions?: string;
}

interface Prescription {
  id: string;
  diagnosis: string;
  medications: Medication[];
  prescribedBy: string;
  selfReported: boolean;
  date: string;
  status: "active" | "completed" | "cancelled";
  notes: string;
}
interface MedicalDetailProps {
  prescriptionMedication: PrescriptionMedication
}
interface MedicationCardProps {
  prescriptionMedication: PrescriptionMedication
  isPrescribed?: boolean;
}

const currentMedicationList: Medication[] = [
  {
    id: "1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once Daily",
    startDate: "2024-05-15",
    instructions: "Take with water, avoid potassium supplements",
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2024-04-20",
    instructions: "Take with breakfast and dinner",
  },
];

const mockPrescription: Prescription[] = [
  {
    id: "RX001",
    diagnosis: "Hypertension, Type 2 Diabetes",
    medications: currentMedicationList,
    prescribedBy: "Dr. Sarah Williams",
    date: "2024-12-28",
    status: "active",
    notes: "Monitor blood pressure weekly",
    selfReported: false,
  },
  {
    id: "RX002",
    diagnosis: "Acute Bronchitis",
    medications: [
      {
        id: "53",
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        startDate: "2024-06-01",
      },
      {
        id: "52",
        name: "Dextromethorphan",
        dosage: "10mg",
        frequency: "As needed",
        startDate: "2024-06-01",
      },
    ],
    prescribedBy: "Dr. Michael Chen",
    date: "2024-12-27",
    status: "active",
    notes: "Follow up if symptoms persist after 5 days",
    selfReported: false,
  },
  {
    id: "RX003",
    diagnosis: "Gastroesophageal Reflux Disease",
    medications: [
      {
        id: "53",
        name: "Omeprazole",
        dosage: "20mg",
        frequency: "Once daily",
        startDate: "2024-06-01",
      },
    ],
    prescribedBy: "Self Reported",
    date: "2024-12-20",
    status: "completed",
    notes: "Completed treatment successfully",
    selfReported: true,
  },
  {
    id: "RX004",
    diagnosis: "Migraine",
    medications: [
      {
        id: "53",
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed",
        startDate: "2024-06-01",
      },
    ],
    prescribedBy: "Dr. James Rodriguez",
    date: "2024-12-15",
    status: "cancelled",
    notes: "Patient switched to alternative treatment",
    selfReported: false,
  },
  {
    id: "RX005",
    diagnosis: "Hyperlipidemia",
    medications: [
      {
        id: "12",
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily at bedtime",
        startDate: "2024-06-01",
      },
    ],
    prescribedBy: "Dr. Sarah Williams",
    date: "2024-12-26",
    status: "active",
    notes: "Monitor liver function tests in 3 months",
    selfReported: false,
  },
];

interface MedicationFormType {
  medicationName: string;
  frequency: "Once Daily" | "Twice daily" | "Three Times Daily" | "As needed";
  timeToTake: "morning" | "evening" | "bed time" | "with meals" | "other";
  purpose: string;
  dosage: number;
  instructions?: string;
}

interface PrescriptionMedication {
  medication: Medication,
  prescription: Omit<Prescription, 'medications'>
}

const PatientMedication = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("current");
  const [selectedMedication, setSelectedMedication] =
    useState<PrescriptionMedication | null>();
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [prescriptions, setPrescriptions] =
    useState<Prescription[]>(mockPrescription);


  const MedicationCard: React.FC<MedicationCardProps> = ({
    prescriptionMedication,
    isPrescribed,
  }) => (
    <div className="bg-white rounde-2xl p-6 hover:shadow-sm transition-all duration-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
          w-12 h-12 rounded-xl flex items-center justify-center ${
            prescriptionMedication.prescription.status === "completed"
              ? "bg-green-100"
              : "bg-main-light"
          }
          `}
          >
            <Pill
              className={`w-6 h-6 ${
                prescriptionMedication.prescription.status === "completed"
                  ? "text-green-600"
                  : "text-light-3"
              }`}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-dark-3">
              {prescriptionMedication.medication.name}
            </h3>
            <p className="text-gray-600">
              {prescriptionMedication.medication.dosage} • {prescriptionMedication.medication.frequency}{" "}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {prescriptionMedication.prescription.status === "completed" && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Completed
            </span>
          )}
          <button
            onClick={() => setSelectedMedication(prescriptionMedication)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-100"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Prescribed by: {prescriptionMedication.prescription.prescribedBy}</span>
          {isPrescribed && <Shield className="w-4 h-4 text-main-light" />}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {prescriptionMedication.medication.startDate && (
            <span>
              Started: {new Date(prescriptionMedication.medication.startDate).toLocaleDateString()}
            </span>
          )}

          {prescriptionMedication.medication.endDate && (
            <span>
              • Ended: {new Date(prescriptionMedication.medication.endDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Take: {prescriptionMedication.medication.frequency}</span>
        </div>

        {prescriptionMedication.prescription.diagnosis && (
          <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
            For: {prescriptionMedication.prescription.diagnosis}
          </div>
        )}
      </div>
    </div>
  );

  const MedicationDetail = (prop: MedicalDetailProps) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            {prop.prescriptionMedication.medication?.name}
          </h3>
          <button
            onClick={() => setSelectedMedication(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
          >
            x
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Dosage</div>
              <div className="font-semibold text-gray-900">
                {prop.prescriptionMedication.medication?.dosage}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Frequency</div>
              <div className="font-semibold text-gray-900">
                {prop.prescriptionMedication.medication?.frequency}
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Prescribed by</div>
            <div className="font-semibold text-blue-900">
              {prop.prescriptionMedication.prescription.prescribedBy}
            </div>
            {prop.prescriptionMedication.prescription.date && (
              <div className="text-sm text-blue-600 mt-1">
                Consultation:{" "}
                {new Date(prop.prescriptionMedication.prescription.date).toLocaleDateString()}
              </div>
            )}
          </div>

          {prop.prescriptionMedication.prescription.diagnosis && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Condition</div>
              <div className="font-semibold text-green-900">
                {prop.prescriptionMedication.prescription.diagnosis}
              </div>
            </div>
          )}

          {prop.prescriptionMedication.medication?.instructions && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600 mb-1">
                Important Notes
              </div>
              <div className="text-yellow-900">
                {prop.prescriptionMedication.medication?.instructions}
              </div>
            </div>
          )}

          {prop.prescriptionMedication.prescription.id && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Prescription ID</div>
              <div className="font-mono text-sm text-gray-900">
                {prop.prescriptionMedication.prescription.id}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button className="flex-1 py-3 bg-main text-white rounded-lg hover:bg-main transition-colors duration-300 flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share with Doctor
            </button>
            {prop.prescriptionMedication.prescription.id && (
              <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white overflow-y-auto scroll-smooth from-blue-50 via-white to-green-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Medications
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Track your current medications and prescriptions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`p-2 rounded-xl transition-colors duration-300 ${
                reminderEnabled
                  ? "bg-blue-50 text-main-light"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {reminderEnabled ? (
                <BellDot className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </button>
            <Button onClick={() => navigate('new')}>
              <Plus className="w-5 h-5" />
              <p className="hidden sm:inline text-xs sm:text-sm">
                Add Medication
              </p>
            </Button>
          </div>
        </div>

        {/* Today's Reminders */}
        {reminderEnabled && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-main" />
              Today's Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {prescriptions
                ?.flatMap((prescription) => prescription.medications)
                .sort((a,b) => a.frequency?.localeCompare( b.frequency || '') || 0)
                .map((dose, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{dose.name}</p>
                        <p className="font-small text-gray-500">{dose.frequency}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-main-light tracking-tight">{dose.dosage}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 ">
            {[
              {
                id: "current",
                label: "Current Medications",
                count: prescriptions
                  .filter((prescription) => prescription.selfReported)
                  .map((prescription) => prescription.medications).length,
              },
              {
                id: "prescribed",
                label: "App Prescriptions",
                count: prescriptions
                  .filter((prescription) => !prescription.selfReported)
                  .map((prescription) => prescription.medications).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 sm:px-2 py-2 sm:py-3 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-main-light border-b-2 border-main-light bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-main-light"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-6">
            {activeTab === "current" && (
              <div>
                {prescriptions?.map((prescription) => prescription.medications)
                  .length > 0 ? (
                  <div className="grid gap-6">
                    {prescriptions
                      .filter((prescription) => prescription.selfReported)
                      .map((prescription) => {
                        return prescription.medications.map((medication) => (
                          <MedicationCard
                            key={medication.id}
                            prescriptionMedication={{prescription: prescription, medication: medication}}
                          />
                        ));
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No medications added
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add your current medications to share with doctors during
                      consultations
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-6 py-3 bg-main-light text-white rounded-xl hover:bg-main transition-colors duration-300"
                    >
                      Add Your First Medication
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "prescribed" && (
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-main-light mt-0.5" />
                    <div>
                      <h4 className="font-medium text-main mb-1">
                        App Prescriptions
                      </h4>
                      <p className="text-sm text-main-light">
                        These medications were prescribed by doctors through
                        consultations on this app. They are verified and include
                        detailed instructions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                    {prescriptions
                      .filter((prescription) => !prescription.selfReported)
                      .map((prescription) => {
                        return prescription.medications.map((medication) => (
                          <MedicationCard
                            key={medication.id}
                            prescriptionMedication={{prescription: prescription, medication: medication}}
                          />
                        ));
                      })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedMedication && (
        <MedicationDetail prescriptionMedication={selectedMedication} />
      )}
    </div>
  );
};

export default PatientMedication;
