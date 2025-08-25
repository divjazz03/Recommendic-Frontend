import { Activity, AlertCircle, ArrowLeft, Brain, Calendar, CheckCircle, ChevronRight, Clock, Edit3, ExternalLink, Eye, FileText, Heart, LucideProps, MessageCircle, Paperclip, Pause, Pill, Play, Plus, Save, Send, Shield, Stethoscope, Target, Thermometer, Timer, User, Users, Video, X } from 'lucide-react';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import ChatInputArea from '../ChatInputArea';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ConsultantConsultation = () => {
    const [message, setMessage] = useState<string>();
    const [clinicalNotes, setClinicalNotes] = useState('Patient reports chest pain for 3 days. Pain described as sharp, intermittent...')
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState<Prescription[]>([]);
    const [newMedication, setNewMedication] = useState<Medication>({ name: '', dosage: '', frequency: '', duration: '' });
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'system',
            content: 'Patient John Smith has joined the consultation.',
            timestamp: '2:30 PM',
            type: 'system'
        },
        {
            id: 2,
            sender: 'patient',
            content: 'Hello Doctor, I\'ve been experiencing chest pain for the past few days.',
            timestamp: '2:30 PM',
            type: 'message'
        },
        {
            id: 3,
            sender: 'doctor',
            content: 'Hello John! Can you describe the type of chest pain you\'re experiencing?',
            timestamp: '2:31 PM',
            type: 'message'
        },
        {
            id: 4,
            sender: 'patient',
            content: 'It\'s a sharp pain that comes and goes, usually when I take deep breaths.',
            timestamp: '2:32 PM',
            type: 'message'
        }
    ]);
    const [videoStatus, setVideoStatus] = useState('connected');
    const [consultationTime, setConsultationTime] = useState('12:45');
    const patientData: PatientData = {
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        allergies: ['Penicillin', 'Shellfish'],
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        lastVisit: '6 months ago',
        insurance: 'Blue Cross Blue Shield',
        lastRecordedVitals: {
            bloodPressure: '140/90',
            heartRate: '78 bpm',
            temperature: '98.6°F',
            weight: '185 lbs',
            recordedDate: '6 months ago',
            recordedBy: 'Dr. Williams'
        },
        connectedDevices: [
            { type: 'Apple Watch', lastSync: '2 hours ago', heartRate: '72-85 bpm (today)' },
            { type: 'Home BP Monitor', lastSync: '3 days ago', reading: '138/88 mmHg' }
        ],
        patientReported: {
            painLevel: '6/10',
            symptoms: ['Sharp chest pain when breathing', 'Occasional shortness of breath'],
            duration: '3 days',
            triggers: 'Deep breathing, movement'
        }
    };
    const scrollToBottom = (messagesEndRef: MutableRefObject<HTMLDivElement>) => {
        messagesEndRef.current?.scrollIntoView()
    };
    const sendMessage = () => {

        if (message && message.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: 'doctor',
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'message'
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };
    const addPrescription = () => {
        if (newMedication.name && newMedication.dosage) {
            setPrescription([...prescription, { ...newMedication, id: prescription.length + 1 }])
            setNewMedication({ name: '', dosage: '', frequency: '', duration: '' });
            setShowPrescriptionForm(false);
        }
    };
    const removePrescription = (id: number) => {
        setPrescription(prescription.filter(med => med.id !== id));
    };







    return (
        <main className='h-full'>

            <MobileView
                addPrescription={addPrescription}
                clinicalNotes={clinicalNotes}
                consultationTime={consultationTime}
                diagnosis={diagnosis}
                message={message ?? ''}
                messages={messages}
                newMedication={newMedication}
                patientData={patientData}
                prescription={prescription}
                removePrescription={removePrescription}
                sendMessage={sendMessage}
                setClinicalNotes={setClinicalNotes}
                setDiagnosis={setDiagnosis}
                setMessage={setMessage}
                setMessages={setMessages}
                setNewMedication={setNewMedication}
                setPrescription={setPrescription}
                setShowPrescriptionForm={setShowPrescriptionForm}
                showPrescriptionForm={showPrescriptionForm}
                videoStatus={videoStatus}
                scrollToBottom={scrollToBottom}
            />
            <DesktopView
                addPrescription={addPrescription}
                clinicalNotes={clinicalNotes}
                consultationTime={consultationTime}
                diagnosis={diagnosis}
                message={message ?? ''}
                messages={messages}
                newMedication={newMedication}
                patientData={patientData}
                prescription={prescription}
                removePrescription={removePrescription}
                sendMessage={sendMessage}
                setClinicalNotes={setClinicalNotes}
                setDiagnosis={setDiagnosis}
                setMessage={setMessage}
                setMessages={setMessages}
                setNewMedication={setNewMedication}
                setPrescription={setPrescription}
                setShowPrescriptionForm={setShowPrescriptionForm}
                showPrescriptionForm={showPrescriptionForm}
                videoStatus={videoStatus}
                scrollToBottom={scrollToBottom}
            />

        </main>
    )
}
interface Message {
    id: number,
    sender: string,
    content: string,
    timestamp: string,
    type: 'system' | 'message'
}
interface Medication {
    name: string,
    dosage: string,
    frequency: string,
    duration: string
}
interface Prescription extends Medication {
    id: number,
}
interface ConnectedDevice {
    type: string, lastSync: string, heartRate?: string, reading?: string
}
interface PatientData {
    name: string
    age: number
    gender: string
    allergies: string[]
    conditions: string[]
    lastVisit: string
    insurance: string
    lastRecordedVitals: {
        bloodPressure: string,
        heartRate: string,
        temperature: string,
        weight: string,
        recordedDate: string,
        recordedBy: string
    },
    connectedDevices: ConnectedDevice[],
    patientReported: {
        painLevel: string,
        symptoms: string[],
        duration: string,
        triggers: string
    }

}
interface ConsultationInfoProps {
    message: string,
    setMessage: (value: React.SetStateAction<string>) => void
    messages: Message[]
    setMessages: (values: React.SetStateAction<Message[]>) => void
    clinicalNotes: string
    setClinicalNotes: (value: React.SetStateAction<string>) => void
    diagnosis: string
    setDiagnosis: (value: React.SetStateAction<string>) => void
    prescription: Prescription[]
    setPrescription: (value: React.SetStateAction<Prescription[]>) => void
    newMedication: { name: string, dosage: string, frequency: string, duration: string }
    setNewMedication: (value: React.SetStateAction<Medication>) => void
    showPrescriptionForm: boolean
    setShowPrescriptionForm: (value: React.SetStateAction<boolean>) => void
    videoStatus: string
    consultationTime: string
    patientData: PatientData
    sendMessage: () => void
    addPrescription: () => void
    removePrescription: (id: number) => void
    scrollToBottom: (ref: MutableRefObject<HTMLDivElement>) => void
}
interface DeskTopMedicalInfoProps extends MedicalInfoProps {
    setActiveTab: (value: React.SetStateAction<string>) => void
    activeTab: string
}
interface MedicalInfoProps {
    clinicalNotes: string,
    setClinicalNotes: (value: React.SetStateAction<string>) => void
    diagnosis: string
    setDiagnosis: (value: React.SetStateAction<string>) => void
    prescription: Prescription[]
    setPrescription: (value: React.SetStateAction<Prescription[]>) => void
    newMedication: { name: string, dosage: string, frequency: string, duration: string }
    setNewMedication: (value: React.SetStateAction<Medication>) => void
    showPrescriptionForm: boolean
    setShowPrescriptionForm: (value: React.SetStateAction<boolean>) => void
    patientData: PatientData
    addPrescription: () => void
    removePrescription: (id: number) => void
}
interface ChatViewProps {
    message: string,
    setMessage: (value: React.SetStateAction<string>) => void
    messages: Message[]
    sendMessage: () => void
    scrollToBottom: (ref: MutableRefObject<HTMLDivElement>) => void
    messagesEndRef: MutableRefObject<HTMLDivElement | null>
}
interface NoteViewProps {
    clinicalNotes: string,
    setClinicalNotes: (value: React.SetStateAction<string>) => void
    diagnosis: string
    setDiagnosis: (value: React.SetStateAction<string>) => void
}
interface PatientViewProps {
    patientData: PatientData
}
interface ExamResults {
    'vital-signs'?: string
    'visual-inspection'?: string
    'movement-assessment'?: string
    'respiratory-exam'?: string
    'neurological'?: string
    'pain-assessment'?: string

}
interface ExamSection {
    id: string
    title: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    color: string
    status: string
}

interface PatientExamInterfaceHeaderProps extends PatientExamProps {
    setExaminationIsOpen?: (value: React.SetStateAction<boolean>) => void
}


interface PatientExamInterfaceOverviewProps extends PatientExamProps {
    examSections: ExamSection[]
}

interface PatientExamProps {
    examState: PatientExamState
    setPatientExamState: (value: React.SetStateAction<PatientExamState>) => void
    setExaminationIsOpen?: (value: React.SetStateAction<boolean>) => void
}


interface PatientExaminationInterfaceVitalSignsProps extends PatientExamProps {


}
interface PatientExaminationInterfaceVisualInspectionProps extends PatientExamProps {

}
interface PatientExaminationInterfaceVisualInspectionProps extends PatientExamProps {
}
interface PatientExaminationInterfaceMovementAssessmentProps extends PatientExamProps {
}

interface PatientExamState {
    currentSection: string
    examResults: ExamResults
    activeExam: {}
    timerRunning: boolean
    timer: number
    examNotes: string
}


const MovementAssessment = ({
    examState, setPatientExamState
}: PatientExamProps) => (
    <div className="p-4 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Movement & Mobility Assessment</h3>
            <p className="text-sm text-green-700">
                Guide the patient through basic movement tests while observing via video.
            </p>
        </div>

        <div className="space-y-4">
            {/* Range of Motion */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Range of Motion Tests</h4>
                <div className="text-sm text-gray-700 space-y-3 mb-4">
                    <div>
                        <p><strong>Neck Movement:</strong></p>
                        <p>Ask patient to: "Slowly turn your head left, then right. Now look up, then down."</p>
                    </div>
                    <div>
                        <p><strong>Shoulder Movement:</strong></p>
                        <p>Ask patient to: "Raise both arms above your head, then lower them."</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="block text-gray-600 mb-1">Neck ROM</label>
                        <select className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                            <option>Full range, no pain</option>
                            <option>Limited ROM, no pain</option>
                            <option>Full range, with pain</option>
                            <option>Limited ROM, with pain</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Shoulder ROM</label>
                        <select className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                            <option>Full range, no pain</option>
                            <option>Limited ROM, no pain</option>
                            <option>Full range, with pain</option>
                            <option>Limited ROM, with pain</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Coordination Test */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Basic Coordination</h4>
                <div className="text-sm text-gray-700 space-y-2 mb-4">
                    <p><strong>Finger-to-Nose Test:</strong></p>
                    <p>Ask patient to: "Touch your nose with your index finger, then extend your arm. Repeat 5 times with each hand."</p>
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">Coordination Assessment</label>
                    <select className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                        <option>Normal coordination</option>
                        <option>Mild incoordination</option>
                        <option>Significant incoordination</option>
                        <option>Unable to perform</option>
                    </select>
                </div>
            </div>

            {/* Balance Assessment */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Static Balance (if safe)</h4>
                <div className="text-sm text-gray-700 space-y-2 mb-4">
                    <p><strong>Safety First:</strong> Only if patient feels stable and has support nearby</p>
                    <p>Ask patient to: "Stand with feet together for 10 seconds. Hold onto a chair if needed."</p>
                </div>
                <div>
                    <label className="block text-gray-600 mb-1">Balance Assessment</label>
                    <select className="w-full px-2 py-2 border border-gray-300 rounded text-sm">
                        <option>Stable balance</option>
                        <option>Mild unsteadiness</option>
                        <option>Significant balance issues</option>
                        <option>Not attempted (safety)</option>
                    </select>
                </div>
            </div>
        </div>

        <button
            onClick={() => setPatientExamState({ ...examState, examResults: { ...examState.examResults, 'movement-assessment': 'completed' } })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium"
        >
            <CheckCircle className="w-5 h-5" />
            Complete Movement Assessment
        </button>
    </div>
);

const VisualInspectionExam = ({
    examState,
    setPatientExamState
}: PatientExaminationInterfaceVisualInspectionProps) => (
    <div className="p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Visual Inspection via Video</h3>
            <p className="text-sm text-blue-700">
                Observe the patient through video and document your findings.
            </p>
        </div>

        <div className="space-y-4">
            {/* General Appearance */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">General Appearance</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <label className="block text-gray-600 mb-2">Overall Appearance</label>
                        <div className="space-y-2">
                            {['Well-appearing', 'Appears unwell', 'In distress', 'Comfortable'].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="appearance" value={option} className="text-blue-600" />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-2">Level of Alertness</label>
                        <div className="space-y-2">
                            {['Alert and oriented', 'Drowsy', 'Confused', 'Agitated'].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="alertness" value={option} className="text-blue-600" />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Skin and Color */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Skin Color & Condition</h4>
                <div className="text-sm text-gray-700 mb-3">
                    <p><strong>Ask patient to:</strong> Show hands and face clearly to camera</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <label className="block text-gray-600 mb-2">Skin Color</label>
                        <select className="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>Normal</option>
                            <option>Pale</option>
                            <option>Flushed</option>
                            <option>Cyanotic (blue)</option>
                            <option>Jaundiced (yellow)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-2">Visible Lesions</label>
                        <select className="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>None visible</option>
                            <option>Rash present</option>
                            <option>Lesions present</option>
                            <option>Bruising</option>
                        </select>
                    </div>
                </div>
                <div className="mt-3">
                    <label className="block text-gray-600 mb-1">Observations</label>
                    <textarea className="w-full px-2 py-2 text-sm border border-gray-300 rounded resize-none h-16" placeholder="Describe any visible skin changes, lesions, or abnormalities..."></textarea>
                </div>
            </div>

            {/* Breathing Pattern */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Breathing Pattern Observation</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <label className="block text-gray-600 mb-2">Breathing Pattern</label>
                        <div className="space-y-2">
                            {['Regular, unlabored', 'Rapid (tachypnea)', 'Slow (bradypnea)', 'Labored', 'Irregular'].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="breathing" value={option} className="text-blue-600" />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-2">Use of Accessory Muscles</label>
                        <div className="space-y-2">
                            {['None observed', 'Mild use', 'Significant use', 'Unable to assess'].map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input type="radio" name="accessory" value={option} className="text-blue-600" />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button
            onClick={() => setPatientExamState({ ...examState, examResults: { ...examState.examResults, 'visual-inspection': 'completed' } })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium"
        >
            <CheckCircle className="w-5 h-5" />
            Complete Visual Inspection
        </button>
    </div>
);

const VitalSignsExam = ({ setPatientExamState, examState }: PatientExaminationInterfaceVitalSignsProps) => (
    <div className="p-4 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Patient Instructions: Self-Check Vitals</h3>
            <p className="text-sm text-red-700">
                Guide the patient through these self-assessments while you observe via video.
            </p>
        </div>

        <div className="space-y-4">
            {/* Pulse Check */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h4 className="font-medium text-gray-900">Pulse Check</h4>
                </div>
                <div className="text-sm text-gray-700 space-y-2 mb-4">
                    <p><strong>Instructions for patient:</strong></p>
                    <p>1. Place two fingers on your wrist below your palm</p>
                    <p>2. Count heartbeats for 15 seconds</p>
                    <p>3. Multiply by 4 for beats per minute</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Patient Count (15s)</label>
                        <input type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="e.g., 18" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">BPM (x4)</label>
                        <input type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="72" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Rhythm</label>
                        <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                            <option>Regular</option>
                            <option>Irregular</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Breathing Assessment */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <h4 className="font-medium text-gray-900">Breathing Rate</h4>
                </div>
                <div className="text-sm text-gray-700 space-y-2 mb-4">
                    <p><strong>Instructions for patient:</strong></p>
                    <p>1. Sit comfortably and breathe normally</p>
                    <p>2. Count each breath (in and out = 1) for 30 seconds</p>
                    <p>3. Tell me the count</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Count (30s)</label>
                        <input type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="e.g., 9" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Per Minute (x2)</label>
                        <input type="number" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="18" />
                    </div>
                </div>
            </div>

            {/* Temperature */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900">Temperature (if available)</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Temperature</label>
                        <input type="number" step="0.1" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="98.6" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Method</label>
                        <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                            <option>Oral</option>
                            <option>Forehead</option>
                            <option>Ear</option>
                            <option>Not available</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <button
            onClick={() => setPatientExamState({ ...examState, examResults: { ...examState.examResults, 'vital-signs': 'completed' } })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium"
        >
            <CheckCircle className="w-5 h-5" />
            Complete Vital Signs Assessment
        </button>
    </div>
);


const ExamOverview = ({
    examState,
    setPatientExamState,
    examSections
}: PatientExamInterfaceOverviewProps) => (
    <div className="p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Remote Examination Guide</h3>
            </div>
            <p className="text-sm text-blue-700">
                Guide the patient through self-examinations and visual assessments via video call.
                Each section provides step-by-step instructions for the patient.
            </p>
        </div>

        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Examination Sections</h3>
            <button
                onClick={() => { setPatientExamState({ ...examState, timer: 0, timerRunning: true }) }}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
                <Play className="w-4 h-4" />
                Start Exam
            </button>
        </div>

        <div className="space-y-3">
            {examSections.map((section) => {
                const IconComponent = section.icon;
                return (
                    <button
                        key={section.id}
                        // onClick={() => { setCurrentSection(section.id); setActiveExam(section.id); }}
                        onClick={() => { setPatientExamState({ ...examState, currentSection: section.id, activeExam: section.id }) }}
                        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${section.color}-100`}>
                                <IconComponent className={`w-5 h-5 text-${section.color}-600`} />
                            </div>
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900">{section.title}</h4>
                                <p className="text-sm text-gray-500">
                                    {section.status === 'completed' ? 'Completed' : 'Not started'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {section.status === 'completed' && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Quick Notes */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">General Examination Notes</h4>
            <textarea
                value={examState.examNotes}
                onChange={(e) => setPatientExamState({ ...examState, examNotes: e.target.value })}
                placeholder="Overall patient presentation, cooperation level, general observations..."
                className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>
);

const Header = ({
    examState,
    setPatientExamState,
    setExaminationIsOpen
    
}: PatientExamInterfaceHeaderProps) =>{ 

    useEffect(() => {
    let interval = null;
    if (examState.timerRunning) {
      interval = setInterval(() => {
        console.log("timer increment")
        console.log(examState.timer)
        setPatientExamState({...examState, timer: examState.timer ++});
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [examState.timerRunning]);
    
    return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-0">
        <div className="flex items-center gap-3">
            <button
                onClick={() => setExaminationIsOpen ? setExaminationIsOpen(false) : ''}
                className="p-2 hover:bg-gray-100 rounded-lg"
            >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
                <h2 className="font-semibold text-gray-900">Remote Patient Examination</h2>
                <p className="text-sm text-gray-600">John Smith • Guided Assessment</p>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">Video Active</span>
            </div>
        </div>

        {examState.timerRunning && (
            <div className="mt-3 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-2">
                <Timer className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-mono text-blue-800">Exam Timer: {formatTime(examState.timer)}</span>
                <button
                    onClick={() => setPatientExamState({ ...examState, timerRunning: false })}
                    className="ml-3 text-blue-600 hover:text-blue-800"
                >
                    <Pause className="w-4 h-4" />
                </button>
            </div>
        )}
    </div>
)};

const PatientExaminationInterface: React.FC<PatientExamProps> = ({
    examState,
    setPatientExamState,
    setExaminationIsOpen
}) => {

    const examSections = [
        {
            id: 'vital-signs',
            title: 'Vital Signs Self-Check',
            icon: Heart,
            color: 'red',
            status: examState.examResults['vital-signs'] ? 'completed' : 'pending'
        },
        {
            id: 'visual-inspection',
            title: 'Visual Inspection',
            icon: Eye,
            color: 'blue',
            status: examState.examResults['visual-inspection'] ? 'completed' : 'pending'
        },
        {
            id: 'movement-assessment',
            title: 'Movement Assessment',
            icon: Activity,
            color: 'green',
            status: examState.examResults['movement-assessment'] ? 'completed' : 'pending'
        },
        {
            id: 'respiratory-exam',
            title: 'Breathing Assessment',
            icon: Users,
            color: 'purple',
            status: examState.examResults['respiratory-exam'] ? 'completed' : 'pending'
        },
        {
            id: 'neurological',
            title: 'Basic Neurological',
            icon: Brain,
            color: 'indigo',
            status: examState.examResults['neurological'] ? 'completed' : 'pending'
        },
        {
            id: 'pain-assessment',
            title: 'Pain Assessment',
            icon: Target,
            color: 'orange',
            status: examState.examResults['pain-assessment'] ? 'completed' : 'pending'
        }
    ]

    const renderCurrentSection = () => {
        switch (examState.currentSection) {
            case 'vital-signs':
                return <VitalSignsExam
                    examState={examState}
                    setPatientExamState={setPatientExamState}
                />;
            case 'visual-inspection':
                return <VisualInspectionExam
                    examState={examState}
                    setPatientExamState={setPatientExamState}
                />;
            case 'movement-assessment':
                return <MovementAssessment
                    examState={examState}
                    setPatientExamState={setPatientExamState}
                />;
            default:
                return <ExamOverview
                    examState={examState}
                    setPatientExamState={setPatientExamState}
                    examSections={examSections}
                />

        }
    }

    return (
        <main className='h-full'>
            <Header setExaminationIsOpen={setExaminationIsOpen} examState={examState} setPatientExamState={setPatientExamState} />
            <div className='flex-1 overflow-y-auto'>
                {renderCurrentSection()}
            </div>
            {/* Bottom Action Bar */}
            <div className="bg-white border-t border-gray-200 p-4 flex gap-3">
                {examState.currentSection !== 'overview' && (
                    <button
                        onClick={() => setPatientExamState({...examState, currentSection: 'overview'})}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" /> Overview
                    </button>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium">
                    <Save className="w-5 h-5" />
                    Save Examination
                </button>
            </div>
        </main>);
};

const PatientView = ({ patientData }: PatientViewProps) => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg">
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


const ChatView = ({
    message,
    messages,
    setMessage,
    sendMessage,
    scrollToBottom,
    messagesEndRef
}: ChatViewProps) => (
    <div className="flex flex-col overflow-y-auto border-2 h-full">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
            {messages && messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'system' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs text-center">
                            <div className="flex items-center justify-center gap-2 text-main-light">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm ">{msg.content}</span>
                            </div>
                            <span className="text-xs  mt-1 block">{msg.timestamp}</span>
                        </div>
                    ) : (
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'doctor'
                            ? 'bg-main text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                            {msg.content.split('\n').map((message) => (<p className="text-sm text-wrap">{message}</p>))}
                            <span className={`text-xs mt-1 block ${msg.sender === 'doctor' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                {msg.timestamp}
                            </span>
                        </div>
                    )}
                </div>

            ))}

            <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 bg-white p-4 border over">
            <ChatInputArea
                messagesEndRef={messagesEndRef}
                scrollToBottom={scrollToBottom}
                sendMessage={sendMessage}
                setMessage={setMessage}
                message={message}
            />
        </div>
    </div>
);

const PrescriptionView = ({
    addPrescription,
    newMedication,
    prescription,
    removePrescription,
    setNewMedication,
    setShowPrescriptionForm,
    showPrescriptionForm
}: MedicalInfoProps) => (
    <div className="flex-1 p-4 space-y-4 h-full">
        <div className="flex items-center justify-between">
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
const NotesView: React.FC<NoteViewProps> = ({
    diagnosis,
    setClinicalNotes,
    setDiagnosis,
    clinicalNotes
}) => {

    const [examinationIsOpen, setExaminationIsOpen] = useState(false);
    const [templateIsOpen, setTemplateIsOpen] = useState(false);
    const [labOrdersIsOpen, setLabOrdersIsOpen] = useState(false);
    const [followUpIsOpen, setFollowUpIsOpen] = useState(false);

    const [patientExamInterfaceState, setPatientExamInterfaceState] = useState<PatientExamState>({
        activeExam: false,
        currentSection: '',
        examNotes: '',
        examResults: {},
        timerRunning: false,
        timer: 0
    })
    


    if (examinationIsOpen) {
        return <PatientExaminationInterface
            examState={patientExamInterfaceState}
            setPatientExamState={setPatientExamInterfaceState}
            setExaminationIsOpen = {setExaminationIsOpen}
        />
    }


    return (
        <div className="flex-1 p-4 space-y-4 w-full">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setExaminationIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium">Examination</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Templates</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Lab Orders</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">Follow-up</span>
                </button>
            </div>

            {/* Clinical Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Clinical Notes</h4>
                    <button className="p-1 text-gray-400">
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>
                <textarea
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded resize-none "
                    placeholder="Enter clinical observations..."
                />
            </div>

            {/* Diagnosis */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Provisional Diagnosis</h4>
                <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded resize-none"
                    placeholder="Enter diagnosis..."
                />
            </div>
        </div>
    )
};



const MobileView = (
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

    const [currentView, setCurrentView] = useState('chat');
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const NavigationBar = () => (
        <div className="bg-white border-y border-gray-200 px-2 pt-2 ">
            <div className="flex justify-around">
                <button
                    onClick={() => setCurrentView('chat')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'chat' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs mt-1">Chat</span>
                </button>
                <button
                    onClick={() => setCurrentView('patient')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'patient' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-xs mt-1">Patient</span>
                </button>
                <button
                    onClick={() => setCurrentView('notes')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'notes' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    <span className="text-xs mt-1">Notes</span>
                </button>
                <button
                    onClick={() => setCurrentView('prescription')}
                    className={`flex flex-col items-center px-5 py-2 ${currentView === 'prescription' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <Pill className="w-5 h-5" />
                    <span className="text-xs mt-1">Rx</span>
                </button>
                <button
                    onClick={() => setCurrentView('history')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'history' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <Clock className="w-5 h-5" />
                    <span className="text-xs mt-1">History</span>
                </button>
            </div>
        </div>
    );
    const Header = () => (
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 ">
            <div className="flex items-center gap-3">
                <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="John Smith"
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{patientData.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full shrink-0">
                            {patientData.age}y
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="truncate">{consultationTime} • In Session</span>
                    </div>
                </div>
                {/* <button className="p-2 bg-main-light text-white rounded-lg">
                    <Video className="w-5 h-5" />
                </button> */}
            </div>

            {/* Video Status Banner */}
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-main-light" />
                    <span className="text-sm text-main">Video call active</span>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 border border-main-light bg-white text-main text-xs rounded">
                    <ExternalLink className="w-3 h-3" />
                    Join
                </button>
            </div>
        </div>
    );

    const HistoryView = () => (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Previous Consultations */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Consultations</h4>
                <div className="space-y-4">
                    <div className="border-l-4 border-green-200 pl-4">
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900">6 months ago</p>
                            <span className="text-xs text-gray-500">Dr. Williams</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Annual check-up</p>
                        <p className="text-xs text-gray-500">BP slightly elevated, advised lifestyle changes</p>
                    </div>
                    <div className="border-l-4 border-blue-200 pl-4">
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900">1 year ago</p>
                            <span className="text-xs text-gray-500">Dr. Chen</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Diabetes follow-up</p>
                        <p className="text-xs text-gray-500">HbA1c: 7.2%, medication adjusted</p>
                    </div>
                </div>
            </div>

            {/* Lab Results */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Lab Results</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Cholesterol</span>
                        <span className="text-sm text-green-700">Normal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">HbA1c</span>
                        <span className="text-sm text-yellow-700">7.2% (High)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Blood Count</span>
                        <span className="text-sm text-green-700">Normal</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentView = () => {
        switch (currentView) {
            case 'chat':
                return <ChatView
                    message={message}
                    messagesEndRef={messagesEndRef}
                    messages={messages}
                    sendMessage={sendMessage}
                    setMessage={setMessage}
                    scrollToBottom={scrollToBottom}
                />;
            case 'patient':
                return <PatientView
                    patientData={patientData}
                />;
            case 'notes':
                return <NotesView
                    clinicalNotes={clinicalNotes}
                    diagnosis={diagnosis}
                    setClinicalNotes={setClinicalNotes}
                    setDiagnosis={setDiagnosis}
                />;
            case 'prescription':
                return <PrescriptionView
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
                />;
            case 'history':
                return <HistoryView />;
            default:
                return <ChatView
                    message={message}
                    messagesEndRef={messagesEndRef}
                    messages={messages}
                    sendMessage={sendMessage}
                    scrollToBottom={scrollToBottom}
                    setMessage={setMessage} />;
        }
    };



    return (
        <div className='lg:hidden h-full'>
            <NavigationBar />
            <Header />
            <div className='overflow-auto h-full'>
                {renderCurrentView()}

            </div>
            {currentView !== 'chat' && (
                <div className="p-4 bg-white border-t border-gray-200">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-main-light hover:bg-main text-white rounded-lg font-medium">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            )}

        </div>
    )

}
const ChatSection = (
    {
        message,
        messages,
        setMessage,
        messagesEndRef,
        sendMessage,
        scrollToBottom
    }: ChatViewProps
) => (
    <div className="flex-1 flex flex-col overflow-y-auto h-full">
        <div className="flex-1 overflow-y-auto p-4 border space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : msg.sender === 'patient' ? 'justify-start' : 'justify-center'}`}>
                    {msg.type === 'system' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md text-center">
                            <div className="flex items-center justify-center gap-2 text-main">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">{msg.content}</span>
                            </div>
                            <span className="text-xs mt-1 block">{msg.timestamp}</span>
                        </div>
                    ) : (
                        <div key={msg.id} className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'doctor'
                            ? 'bg-main text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                            {msg.content.split('\n').map((value) => (<p className="text-sm">{value}</p>))}
                            <span className={`text-xs mt-1 block ${msg.sender === 'doctor' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                {msg.timestamp}
                            </span>
                            <div className={`absolute w-2 h-5 -bottom-[6px]  ${msg.sender === 'doctor'? 'right-0 rounded-l-full bg-main' : '-left-[1px] rounded-r-full bg-white border-l border-b'}`}></div>
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="border border-gray-200  p-2 h-fit ">
            <ChatInputArea
                message={message}
                messagesEndRef={messagesEndRef}
                scrollToBottom={scrollToBottom}
                sendMessage={sendMessage}
                setMessage={setMessage}
            />
        </div>
    </div>
);
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
    <div className="w-[27rem] bg-white border-l h-full flex flex-col border-gray-200 p-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4 sticky">
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
const QuickActions = () => (
    <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h5>
        <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <Heart className="w-4 h-4 text-red-500" />
                Vital Signs
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <FileText className="w-4 h-4 text-blue-500" />
                Templates
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <Activity className="w-4 h-4 text-green-500" />
                Lab Orders
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <Calendar className="w-4 h-4 text-purple-500" />
                Follow-up
            </button>
        </div>
    </div>
);
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
                    <div className="bg-white ring-1 ring-gray-500 rounded-lg p-3">
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
                    <button className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
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

export default ConsultantConsultation
