import { CheckCircle, Clock, ExternalLink, Shield, Square, StopCircle } from 'lucide-react';
import React, { MutableRefObject, useRef, useState } from 'react'
import { ConsultationInfoProps, MedicalInfoProps } from '../ConsultantConsultation';
import ChatSection from './ChatSection';
import MedicalPanel from './MedicalPanel';



const DesktopView = (
    { message,
        setMessage,
        messages,
        setMessages,
        clinicalNotes,
        setClinicalNotes,
        diagnosis,
        setDiagnosis,
        prescription,
        setPrescription,
        newMedication,
        setNewMedication,
        showPrescriptionForm,
        setShowPrescriptionForm,
        addPrescription,
        videoStatus,
        consultationTime,
        patientData,
        sendMessage,
        removePrescription,
        scrollToBottom
    }: ConsultationInfoProps
) => {
    const [activeTab, setActiveTab] = useState('notes');
    const messagesEndRef = useRef<MutableRefObject<HTMLDivElement> | null>(null)

    const PatientInfo = () => (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-4">
                <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="John Smith"
                    className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{patientData.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {patientData.age}y, {patientData.gender}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">Last visit: {patientData.lastVisit} • {patientData.insurance}</p>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-red-600">⚠️ Allergies: {patientData.allergies.join(', ')}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">In Session</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{consultationTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const VideoCallSection = () => (
        <div className="border-b border-gray-200 p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3">
                        <CheckCircle className="w-6 h-6 text-main-light" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">Video Consultation Active</h4>
                        <p className="text-sm text-gray-600">Secure Zoom meeting in progress</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border text-xs border-main text-main rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1">
                        <ExternalLink className="w-5 h-5" />
                        Return to Video
                    </button>
                    <button className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1">
                        <Square className='w-5 h-5' />
                        End Session
                    </button>
                </div>
            </div>
        </div>
    );



    return (
        <div className="hidden lg:flex flex-col h-full max-w-7xl mx-auto bg-white rounded-lg">
            <PatientInfo />

            <div className="flex flex-row h-full overflow-y-auto">
                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full">
                    <VideoCallSection />
                    <div className='flex-1 overflow-auto'>
                        <ChatSection
                            message={message}
                            messages={messages}
                            messagesEndRef={messagesEndRef}
                            scrollToBottom={scrollToBottom}
                            sendMessage={sendMessage}
                            setMessage={setMessage}
                        />
                    </div>
                </div>

                {/* Medical Panel */}
                <MedicalPanel
                    activeTab={activeTab}
                    addPrescription={addPrescription}
                    clinicalNotes={clinicalNotes}
                    diagnosis={diagnosis}
                    newMedication={newMedication}
                    patientData={patientData}
                    prescription={prescription}
                    removePrescription={removePrescription}
                    setActiveTab={setActiveTab}
                    setClinicalNotes={setClinicalNotes}
                    setDiagnosis={setDiagnosis}
                    setNewMedication={setNewMedication}
                    setPrescription={setPrescription}
                    setShowPrescriptionForm={setShowPrescriptionForm}
                    showPrescriptionForm={showPrescriptionForm}
                />
            </div>

            {/* Bottom Status Bar */}
            <div className=" border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                    <span>Session ID: #CS-2024-0189</span>
                    <span>•</span>
                    <span>Patient ID: {patientData.name.replace(' ', '').toLowerCase()}001</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-main-light" />
                    <span>HIPAA Compliant</span>
                </div>
            </div>
        </div>
    )

}

export default DesktopView




