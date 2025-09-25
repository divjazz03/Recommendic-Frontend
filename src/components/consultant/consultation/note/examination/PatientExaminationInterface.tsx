import React, { useEffect, useState } from 'react'
import Header from './Header';
import { ArrowLeft, Check, Save } from 'lucide-react';
import VitalSignsExam from './VitalSignsExam';
import VisualInspectionExam from './VisualInspectionExam';
import MovementAssessment from './MovementAssessment';
import ExamOverview from './ExamOverview';
import { usePatientExamStore } from '@/stores/PatientExamStore';
import { useShallow } from 'zustand/react/shallow';

export interface PatientExaminationInterfaceProps {
    backToHome: () => void
}

const PatientExaminationInterface : React.FC<PatientExaminationInterfaceProps> = (
    {
        backToHome
    }
) => {

    const [examCompleted, setExamCompleted] = useState(false);

    const { currentSection, setPatientExamState,examResults } = usePatientExamStore(
        useShallow((s) => ({
            currentSection: s.patientExamState.currentSection,
            examResults: s.patientExamState.examResults,
            setPatientExamState: s.setPatientExamState

        }))
    )

    const handleSaveExamination = () => {
        console.log(examResults)
        setExamCompleted(true);
        setPatientExamState({
            activeExam: undefined,
            currentSection: undefined,
            examNotes: '',
            examResults: {},
            timer: 0,
            timerRunning: false
        })
    }



    const renderCurrentSection = () => {
        switch (currentSection) {
            case 'vital-signs':
                return <VitalSignsExam
                />;
            case 'visual-inspection':
                return <VisualInspectionExam
                />;
            case 'movement-assessment':
                return <MovementAssessment
                />;
            default:
                return <ExamOverview/>

        }
    }

    return (
        <main className='h-full lg:min-w-[60em] lg:max-w-[60em]'>
            <Header backToHome={backToHome}/>
            <div className='flex-1 overflow-y-auto'>
                {renderCurrentSection()}
            </div>
            {/* Bottom Action Bar */}
            <div className="bg-white border-t border-gray-200 p-4 flex gap-3">
                {currentSection !== undefined && (
                    <button
                        onClick={() => setPatientExamState({ currentSection: undefined })}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" /> Overview
                    </button>
                )}
                {examCompleted ?
                    <button className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium'>
                        <Check className='w-5 h-5' />
                        Completed
                    </button> :
                    <button
                        onClick={() => handleSaveExamination()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium">
                        <Save className="w-5 h-5" />
                        Save Examination
                    </button>}
            </div>
        </main>);
};

export default PatientExaminationInterface