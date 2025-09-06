import ChatInputArea from '@/components/ChatInputArea';
import { AlertCircle, Save } from 'lucide-react';
import React from 'react'
import { MedicalInfoProps } from '../ConsultantConsultation';
import NotesView from './NotesView';
import PatientView from './PatientView';
import PrescriptionView from './PrescriptionView';

interface DeskTopMedicalInfoProps extends MedicalInfoProps {
    setActiveTab: (value: React.SetStateAction<string>) => void
    activeTab: string
}

const MedicalPanel = ({
    setActiveTab,
    activeTab,
    clinicalNotes,
    setClinicalNotes,
    diagnosis,
    newMedication,
    prescription,
    setDiagnosis,
    setNewMedication,
    setShowPrescriptionForm,
    showPrescriptionForm,
    setPrescription,
    patientData,
    addPrescription,
    removePrescription

}: DeskTopMedicalInfoProps) => (
    <div className="w-[30rem] bg-white border-l h-full flex flex-col border-gray-200 p-4">
        {/* Tab Navigation */}
        <div className="flex border-b h-[3rem] border-gray-200 sticky">
            <button
                onClick={() => setActiveTab('patientInfo')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'patientInfo' ? 'border-main-light text-main-light' : 'border-transparent text-gray-500'
                    }`}
            >
                Patient Info
            </button>
            <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'notes' ? 'border-main-light text-main-light' : 'border-transparent text-gray-500'
                    }`}
            >
                Clinical Notes
            </button>
            <button
                onClick={() => setActiveTab('prescription')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'prescription' ? 'border-main-light text-main-light' : 'border-transparent text-gray-500'
                    }`}
            >
                Prescription
            </button>
            <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-main-light text-main-light' : 'border-transparent text-gray-500'
                    }`}
            >
                History
            </button>
        </div>
        <div className='flex-1 overflow-auto h-full scrollbar-hide'>
            {activeTab === 'notes' && (
                <NotesView
                    clinicalNotes={clinicalNotes}
                    diagnosis={diagnosis}
                    setClinicalNotes={setClinicalNotes}
                    setDiagnosis={setDiagnosis}
                />
            )}
            {activeTab === 'patientInfo' && (
                <PatientView patientData={patientData} />
            )
            }

            {activeTab === 'prescription' && (
                <PrescriptionView
                    addPrescription={addPrescription}
                    clinicalNotes={clinicalNotes}
                    diagnosis={diagnosis}
                    newMedication={newMedication}
                    patientData={patientData}
                    prescription={prescription}
                    removePrescription={removePrescription}
                    setClinicalNotes={setClinicalNotes}
                    setDiagnosis={setDiagnosis}
                    setNewMedication={setNewMedication}
                    setPrescription={setPrescription}
                    setShowPrescriptionForm={setShowPrescriptionForm}
                    showPrescriptionForm={showPrescriptionForm}
                />
            )}

            {activeTab === 'history' && (
                <div className="space-y-4">
                    {/* Medical Conditions */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-red-700 mb-2">Medical Conditions</h5>
                        <div className="space-y-1">
                            {patientData.conditions.map((condition, index) => (
                                <div key={index} className="text-sm text-red-600">• {condition}</div>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-orange-700 mb-2">Allergies</h5>
                        <div className="space-y-1">
                            {patientData.allergies.map((allergy, index) => (
                                <div key={index} className="text-sm text-orange-600">⚠️ {allergy}</div>
                            ))}
                        </div>
                    </div>

                    {/* Previous Consultations */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Consultations</h5>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="border-l-2 border-green-200 pl-3">
                                <p className="font-medium">6 months ago</p>
                                <p>Annual check-up • Dr. Williams</p>
                                <p className="text-xs">BP slightly elevated, advised lifestyle changes</p>
                            </div>
                            <div className="border-l-2 border-blue-200 pl-3">
                                <p className="font-medium">1 year ago</p>
                                <p>Diabetes follow-up • Dr. Chen</p>
                                <p className="text-xs">HbA1c: 7.2%, medication adjusted</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-main-light text-white rounded-lg hover:bg-main transition-colors">
                <Save className="w-4 h-4" />
                Save & Complete Session
            </button>
        </div>
    </div>
);

export default MedicalPanel

