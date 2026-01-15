import { ApiError } from "@/lib/axios";
import {
  X,
  Save,
  Printer,
  FileText,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { toast } from "sonner";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "../ui/empty";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: number | undefined;
  durationType: string;
  instructions: string;
}
interface Prescription {
  medications: Medication[];
  diagnosis: string;
  notes: string;
  date: string;
}

const PatientNewMedication = () => {
  const [prescription, setPrescription] = useState<Prescription>({
    medications: [],
    diagnosis: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const addMedication = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      duration: undefined,
      instructions: "",
      durationType: "",
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

  const handleSave = async () => {
    try {
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`${error.message}`);
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
        medications: [],
        diagnosis: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <div className="h-full">
      <div className="h-full flex flex-col gap-4 px-2 py-4 sm:px-4 overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Report Prescription
              </h1>
              <p className="text-gray-600">
                Create and report prescriptions
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

        {/* Diagnosis */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FileText className="text-main-light" size={24} />
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
              <Calendar className="text-main-light" size={24} />
              Medications
            </h2>
            <Button onClick={addMedication}>
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
                      variant={"destructive"}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <Input
                      type="text"
                      placeholder="Medication Name"
                      value={med.name}
                      onChange={(e) =>
                        updateMedication(med.id, "name", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <Input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) =>
                        updateMedication(med.id, "dosage", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <Input
                      type="text"
                      placeholder="Frequency (e.g., BID)"
                      value={med.frequency}
                      onChange={(e) =>
                        updateMedication(med.id, "frequency", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <Input
                      type="number"
                      placeholder="Duration (e.g., 7)"
                      value={med.duration}
                      onChange={(e) =>
                        updateMedication(
                          med.id,
                          "duration",
                          Number(e.target.value)
                        )
                      }
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-main-light focus:border-transparent"
                    />
                    <Select
                      value={med.durationType}
                      onValueChange={(e) =>
                        updateMedication(med.id, "durationType", e)
                      }
                      
                    >
                      <SelectTrigger className="p-2 border border-gray-300 text-gray-500 rounded focus:ring-2 focus:ring-main-light focus:border-transparent" >Select Duration Type</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
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
                  variant={"ghost"}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientNewMedication;
