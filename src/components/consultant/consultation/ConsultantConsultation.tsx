import { LucideProps } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import MobileView from './MobileView';
import DesktopView from './DesktopView';
import { useStartConsultation } from '@/lib/actions/generalQueriesAndMutation';
import { useLocation } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';

const ConsultantConsultation = () => {
    const location = useLocation()
    const userType = useUserContext().userContext.userType;
    const appointmentId = location.state?.appointmentId ?? 'dksdlnksdnokisjidbkusdkuj';
    const [, setConsultationId] = useState<string>('')    
    const [clinicalNotes, setClinicalNotes] = useState('Patient reports chest pain for 3 days. Pain described as sharp, intermittent...')
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState<Prescription[]>([]);
    const [newMedication, setNewMedication] = useState<Medication>({ name: '', dosage: '', frequency: '', duration: '' });
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    
    const [videoStatus,] = useState('connected');
    const [consultationTime] = useState('12:45');
    const [patientData, setPatientData] = useState<PatientData | undefined>({
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
    });
    const {mutateAsync:startConsultation} = useStartConsultation()

    useEffect(() => {
        startConsultation(appointmentId)
        .then(response => {
            if(userType && userType === 'CONSULTANT') {
                const patientData = response.data.patientData;
                if(patientData) {
                    setPatientData(patientData)
                }
            }
            setConsultationId(response.data.consultationId)
        });
    } ,[])

    
    
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
                videoStatus={videoStatus}
            />
            <DesktopView
                addPrescription={addPrescription}
                clinicalNotes={clinicalNotes}
                consultationTime={consultationTime}
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
                videoStatus={videoStatus}
            />

        </main>
    )
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
    patientData?: PatientData
    addPrescription: () => void
    removePrescription: (id: number) => void
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


export interface ExamSection {
    id: string
    title: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    color: string
    status: string
}
export default ConsultantConsultation
