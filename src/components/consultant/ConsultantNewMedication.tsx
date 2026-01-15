import {
  X,
  Save,
  Printer,
  User,
  Search,
  FileText,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { useParams } from "react-router-dom";
import { useCreatePrescription, useGetPatientMedicalData } from "@/lib/actions/consultantQueryAndMutations";
import { Button } from "../ui/button";
import Loader from "../shared/Loader";
import { ApiError } from "@/lib/axios";
import { toast } from "sonner";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: number | undefined;
  durationType: string;
  instructions: string;
}

interface Patient {
  id: string;
  consultationId?: string
  name: string;
  age: string;
  gender: string;
  mrn: string;
}

interface Prescription {
  patientInfo: Patient | null;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  date: string;
}

// Mock patient data
const mockPatients: Patient[] = [
  { consultationId: 'CST-dmskdsd-s9-s-fsfsk-9fsfsf', id: "1", name: "John Smith", age: "45", gender: "Male", mrn: "MRN001234" },
  {
    consultationId: 'CST-dmskdsd-s9-s-fsfsk-9fsfs3',
    id: "2",
    name: "Sarah Johnson",
    age: "32",
    gender: "Female",
    mrn: "MRN001235",
  },
  {
    consultationId: 'CST-dmskdsd-s9-s-fsfsk-9fsf4e',
    id: "3",
    name: "Michael Brown",
    age: "58",
    gender: "Male",
    mrn: "MRN001236",
  },
  {
    consultationId: 'CST-dmskdsd-s9-s-fsfsk-9fdada',
    id: "4",
    name: "Emily Davis",
    age: "27",
    gender: "Female",
    mrn: "MRN001237",
  },
];

const ConsultantNewMedication = () => {
  const params = useParams();
  const patientId = params.patientId;
  const {data: patientMedicalDataResponse, isLoading: isGettingPatient} = useGetPatientMedicalData(patientId);
  const {mutateAsync: createPrescription} = useCreatePrescription();
  const [prescription, setPrescription] = useState<Prescription>({
    patientInfo: null,
    medications: [],
    diagnosis: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addMedication = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      duration: undefined,
      instructions: "",
      durationType: ""
    };
    setPrescription((prev) => ({
      ...prev,
      medications: [...prev.medications, newMed],
    }));
  };

  const updateMedication = (
    id: string,
    field: keyof Medication,
    value: string | number
  ) => {
    setPrescription((prev) => ({
      ...prev,
      medications: prev.medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      ),
    }));
  };

  const removeMedication = (id: string) => {
    setPrescription((prev) => ({
      ...prev,
      medications: prev.medications.filter((med) => med.id !== id),
    }));
  };

  const selectPatient = (patient: Patient) => {
    setPrescription((prev) => ({ ...prev, patientInfo: patient }));
    setShowPatientSearch(false);
    setSearchQuery("");
  };

  const handleSave = async () => {
    if(!prescription.patientInfo?.consultationId) {
      toast.error("No consultationId for this patient");
      return;
    }
    try {
      const response = await createPrescription({
          consultationId: prescription.patientInfo?.consultationId,
          diagnosis: prescription.diagnosis,
          prescribedTo: prescription.patientInfo.id,
          notes: prescription.notes,
          medications: prescription.medications.map(medication => ({
            dosage: medication.dosage,
            durationType: medication.durationType,
            durationValue: medication.duration,
            instructions: medication.instructions,
            medicationFrequency: medication.frequency,
            name: medication.name
          }))
    
        });

        console.log("Saved prescription:", response.data.id);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`${error.message}`)
      }
    }
    
    
  };

  const handlePrint = () => {
    alert("Printing prescription...");
    console.log("Print prescription:", prescription);
  };

  const resetForm = () => {
    if (confirm("Are you sure you want to clear this prescription?")) {
      setPrescription({
        patientInfo: null,
        medications: [],
        diagnosis: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  useEffect(() => {
    if (patientId && patientMedicalDataResponse?.data) {
      const data = patientMedicalDataResponse.data;
      selectPatient({
        age: data.age,
        gender: data.gender,
        consultationId: data.consultationId,
        id: data.id,
        mrn: data.mrn,
        name: data.name,
      });
    }
  }, [patientId,patientMedicalDataResponse]);

  return (
    <div className="h-full">
      <div className="h-full flex flex-col gap-4 px-2 py-4 sm:px-4 overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Prescription Creation
              </h1>
              <p className="text-gray-600">
                Consultant Portal - Create and manage patient prescriptions
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
              >
                <X size={18} />
                <p className="hidden sm:inline-flex">Clear</p>
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Save size={18} />
                <p className="hidden sm:inline-flex">Save</p>
              </Button>
              <Button
                onClick={handlePrint}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 gap-2"
              >
                <Printer size={18} />
                <p className="hidden sm:inline-flex">Print</p>
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="text-blue-600" size={24} />
              Patient Information
            </h2>
            <Button
              onClick={() => setShowPatientSearch(true)}
            >
              <Search size={18} />
              Search Patient
            </Button>
          </div>

          {
          isGettingPatient ?
          (<div>
            <Loader />
          </div>) :
          prescription.patientInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Patient Name
                </label>
                <p className="text-gray-800 font-semibold">
                  {prescription.patientInfo.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">MRN</label>
                <p className="text-gray-800 font-semibold">
                  {prescription.patientInfo.mrn}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Age / Gender
                </label>
                <p className="text-gray-800 font-semibold">
                  {prescription.patientInfo.age} /{" "}
                  {prescription.patientInfo.gender}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Date
                </label>
                <p className="text-gray-800 font-semibold">
                  {prescription.date}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 rounded-lg">
              
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <User size={48} className="opacity-50" />
                  </EmptyMedia>
                  <EmptyTitle>No Patient selected</EmptyTitle>
                  <EmptyDescription>
                    Click "Search Patient" to begin.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FileText className="text-blue-600" size={24} />
            Diagnosis
          </h2>
          <textarea
            value={prescription.diagnosis}
            onChange={(e) =>
              setPrescription((prev) => ({
                ...prev,
                diagnosis: e.target.value,
              }))
            }
            placeholder="Enter diagnosis..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Medications */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="text-blue-600" size={24} />
              Medications
            </h2>
            <Button
              onClick={addMedication}
            >
              <Plus size={18} />
              Add Medication
            </Button>
          </div>

          {prescription.medications.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <FileText size={48} className="opacity-50" />
                </EmptyMedia>
                <EmptyTitle className="text-gray-500">
                  No medications added
                </EmptyTitle>
                <EmptyDescription>
                  Click "Add Medication" to begin.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              {prescription.medications.map((med, index) => (
                <div
                  key={med.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-700">
                      Medication {index + 1}
                    </h3>
                    <Button
                      onClick={() => removeMedication(med.id)}
                      className="text-white"
                      variant={'destructive'}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Medication Name"
                      value={med.name}
                      onChange={(e) =>
                        updateMedication(med.id, "name", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) =>
                        updateMedication(med.id, "dosage", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., BID)"
                      value={med.frequency}
                      onChange={(e) =>
                        updateMedication(med.id, "frequency", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Duration (e.g., 7)"
                      value={med.duration}
                      onChange={(e) =>
                        updateMedication(med.id, "duration", Number(e.target.value))
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <select 
                    value={med.durationType}
                    onChange={ (e) => updateMedication(med.id, "durationType", e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent" >
                      <option value={""} disabled selected>Select type of Duration</option>
                      <option value={'day'}>Day</option>
                      <option value={"week"}>Week</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Instructions"
                      value={med.instructions}
                      onChange={(e) =>
                        updateMedication(med.id, "instructions", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Notes
          </h2>
          <textarea
            value={prescription.notes}
            onChange={(e) =>
              setPrescription((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Enter any additional notes or instructions..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-transparent resize-none"
            rows={4}
          />
        </div>
      </div>

      {/* Patient Search Modal */}
      {showPatientSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Search Patient
                </h3>
                <Button
                  onClick={() => {
                    setShowPatientSearch(false);
                    setSearchQuery("");
                  }}
                  variant={'ghost'}
                >
                  <X size={24} />
                </Button>
              </div>
              <input
                type="text"
                placeholder="Search by name or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-96 p-6">
              {filteredPatients.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No patients found
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredPatients.filter((patient) => prescription.patientInfo?.id !== patient.id).map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => selectPatient(patient)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            MRN: {patient.mrn}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {patient.age} years
                          </p>
                          <p className="text-sm text-gray-600">
                            {patient.gender}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantNewMedication;
