import { MedicalInfoProps } from '../ConsultantConsultation';
import { Pill, Plus, X } from 'lucide-react';

const PrescriptionView = ({
    addPrescription,
    newMedication,
    prescription,
    removePrescription,
    setNewMedication,
    setShowPrescriptionForm,
    showPrescriptionForm
}: MedicalInfoProps) => (
    <div className="flex-1 p-4 space-y-4 lg:min-w-[60em] border rounded-lg h-full">
        <div className="flex items-center justify-between r">
            <h4 className="font-semibold text-gray-900">Medications</h4>
            <button
                onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                className="flex items-center gap-2 px-3 py-2 bg-main-light text-white text-sm rounded-lg"
            >
                <Plus className="w-4 h-4" />
                Add Med
            </button>
        </div>

        {showPrescriptionForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <h5 className="font-medium text-main">Add Medication</h5>
                <input
                    type="text"
                    placeholder="Medication name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg "
                />
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Dosage"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                        className="px-3 py-3 border border-gray-300 rounded-lg  "
                    />
                    <input
                        type="text"
                        placeholder="Frequency"
                        value={newMedication.frequency}
                        onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                        className="px-3 py-3 border border-gray-300 rounded-lg  "
                    />
                </div>
                <input
                    type="text"
                    placeholder="Duration (e.g., 7 days)"
                    value={newMedication.duration}
                    onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg  "
                />
                <div className="flex gap-3">
                    <button
                        onClick={addPrescription}
                        className="flex-1 px-4 py-3 bg-main-light hover:bg-main text-white rounded-lg font-medium"
                    >
                        Add Medication
                    </button>
                    <button
                        onClick={() => setShowPrescriptionForm(false)}
                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}

        <div className="space-y-3">
            {prescription.map((med) => (
                <div key={med.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Pill className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">{med.name}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{med.dosage} • {med.frequency}</p>
                            <p className="text-sm text-gray-500">Duration: {med.duration}</p>
                        </div>
                        <button
                            onClick={() => removePrescription(med.id)}
                            className="p-2 text-red-400 hover:text-red-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}

            {prescription.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No medications prescribed yet</p>
                    <p className="text-sm">Tap "Add Med" to prescribe medication</p>
                </div>
            )}
        </div>
    </div>
);

export default PrescriptionView