import { Activity, AlertCircle, ArrowLeft, Brain, Calendar, CheckCircle, ChevronRight, Clock, Edit3, ExternalLink, Eye, FileText, Heart, LucideProps, MessageCircle, Paperclip, Pause, Pill, Play, Plus, Save, Send, Shield, Stethoscope, Target, Thermometer, Timer, User, Users, Video, X } from 'lucide-react';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import MobileView from './MobileView';
import DesktopView from './DesktopView';

const sampleMessages: Message[] = [
        {
            id: 1,
            sender: 'system',
            content: 'Patient John Smith has joined the session.',
            timestamp: '2:30 PM',
            type: 'system'
        },
        {
            id: 2,
            sender: 'other',
            content: 'Hello Doctor, I\'ve been experiencing chest pain for the past few days.',
            timestamp: '2:30 PM',
            type: 'message'
        },
        {
            id: 3,
            sender: 'me',
            content: 'Hello John! Can you describe the type of chest pain you\'re experiencing?',
            timestamp: '2:31 PM',
            type: 'message'
        },
        {
            id: 4,
            sender: 'other',
            content: 'It\'s a sharp pain that comes and goes, usually when I take deep breaths.',
            timestamp: '2:32 PM',
            type: 'message'
        }
    ]

const ConsultantConsultation = () => {
    const [message, setMessage] = useState<string>("");
    const [clinicalNotes, setClinicalNotes] = useState('Patient reports chest pain for 3 days. Pain described as sharp, intermittent...')
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState<Prescription[]>([]);
    const [newMedication, setNewMedication] = useState<Medication>({ name: '', dosage: '', frequency: '', duration: '' });
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
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
    const scrollToBottom = (messagesEndRef: MutableRefObject<HTMLDivElement|null>) => {
        messagesEndRef?.current?.scrollIntoView()
    };
    const sendMessage = () => {

        if (message && message.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: 'me',
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
export interface Message {
    id: number,
    sender: ChatMessageSender,
    content: string,
    timestamp: string,
    type: ChatMessageType
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
export interface PatientData {
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
export interface ConsultationInfoProps {
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
    scrollToBottom?: (ref: MutableRefObject<HTMLDivElement|null>) => void
}

export interface MedicalInfoProps {
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
export type ChatMessageType = "system" | "message"
export type ChatMessageSender = "system" | "me" | "other"

export interface ExamSection {
    id: string
    title: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    color: string
    status: string
}
export default ConsultantConsultation
