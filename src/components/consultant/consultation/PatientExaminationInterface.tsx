import React, { useEffect } from 'react'
import Header from './Header';
import { ArrowLeft, Save } from 'lucide-react';
import VitalSignsExam from './VitalSignsExam';
import VisualInspectionExam from './VisualInspectionExam';
import MovementAssessment from './MovementAssessment';
import ExamOverview from './ExamOverview';
import { usePatientExamStore } from '@/stores/PatientExamStore';
import { useShallow } from 'zustand/react/shallow';

const PatientExaminationInterface = () => {

    const {currentSection, setPatientExamState} = usePatientExamStore(
        useShallow((s) => ({
            currentSection: s.patientExamState.currentSection,
            examResults: s.patientExamState.examResults,
            setPatientExamState: s.setPatientExamState

        }))
    )

    

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
                return <ExamOverview
                />

        }
    }

    return (
        <main className='h-full'>
            <Header />
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
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium">
                    <Save className="w-5 h-5" />
                    Save Examination
                </button>
            </div>
        </main>);
};

export default PatientExaminationInterface