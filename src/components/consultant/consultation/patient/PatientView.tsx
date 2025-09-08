import React from 'react'
import { PatientData } from '../ConsultantConsultation';
import { AlertCircle, Heart, Activity, Thermometer, User } from 'lucide-react';

interface PatientViewProps {
    patientData: PatientData
}

const PatientView = ({ patientData }: PatientViewProps) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg lg:min-w-[60em]">
        {/* Allergies Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Allergies</h4>
            </div>
            <div className="space-y-1">
                {patientData.allergies.map((allergy, index) => (
                    <div key={index} className="text-sm text-red-700">⚠️ {allergy}</div>
                ))}
            </div>
        </div>

        {/* Patient Reported Symptoms*/}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">Current Symptoms (Patient-Reported)</h4>
            <div className="space-y-3">
                <div>
                    <p className="text-sm text-orange-700 font-medium">Pain Level:</p>
                    <p className="text-lg font-bold text-orange-800">{patientData.patientReported.painLevel}</p>
                </div>
                <div>
                    <p className="text-sm text-orange-700 font-medium">Symptoms:</p>
                    {patientData.patientReported.symptoms.map((symptom, index) => (
                        <p key={index} className="text-sm text-orange-800">• {symptom}</p>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-orange-700 font-medium">Duration:</p>
                        <p className="text-sm text-orange-800">{patientData.patientReported.duration}</p>
                    </div>
                    <div>
                        <p className="text-sm text-orange-700 font-medium">Triggers:</p>
                        <p className="text-sm text-orange-800">{patientData.patientReported.triggers}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Connected Devices Data */}
        {patientData.connectedDevices.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Connected Device Data</h4>
                <div className="space-y-3">
                    {patientData.connectedDevices.map((device, index) => (
                        <div key={index} className="bg-white rounded p-3 border border-blue-100">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-blue-900">{device.type}</span>
                                <span className="text-xs text-blue-600">{device.lastSync}</span>
                            </div>
                            <p className="text-sm text-blue-800">{device.heartRate || device.reading}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Last Recorded Vitals */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Last Recorded Vitals</h4>
                <span className="text-xs text-gray-500">{patientData.lastRecordedVitals.recordedDate}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Recorded by {patientData.lastRecordedVitals.recordedBy}</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">Heart Rate</p>
                        <p className="font-semibold text-gray-700">{patientData.lastRecordedVitals.heartRate}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="font-semibold text-gray-700">{patientData.lastRecordedVitals.bloodPressure}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Thermometer className="w-6 h-6 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-semibold text-gray-700">{patientData.lastRecordedVitals.temperature}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-gray-400" />
                    <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="font-semibold text-gray-700">{patientData.lastRecordedVitals.weight}</p>
                    </div>
                </div>
            </div>
            <div className="mt-3 p-2 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600">💡 Recommend in-person visit for current vitals if needed</p>
            </div>
        </div>

        {/* Medical Conditions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Medical Conditions</h4>
            <div className="space-y-2">
                {patientData.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-orange-800">{condition}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{patientData.gender}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="font-medium">{patientData.lastVisit}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Insurance:</span>
                    <span className="font-medium">{patientData.insurance}</span>
                </div>
            </div>
        </div>
    </div>
);

export default PatientView