import {create} from 'zustand'
import { VitalSignResult } from '@/components/consultant/consultation/VitalSignsExam'
import React from 'react'
import { VisualInspectionResult } from '@/components/consultant/consultation/VisualInspectionExam'
import { MovementAssessmentResult } from '@/components/consultant/consultation/MovementAssessment'

export interface ExamResults {
    'vital-signs'?: VitalSignResult
    'visual-inspection'?: VisualInspectionResult
    'movement-assessment'?: MovementAssessmentResult
    // 'respiratory-exam'?: any
    // 'neurological'?: any
    // 'pain-assessment'?: any

}

export interface PatientExamState {
    currentSection: 'vital-signs' | 'visual-inspection' | 'movement-assessment' | undefined
    // 'respiratory-exam' |
    // 'neurological' |
    // 'pain-assessment' 
    examResults: ExamResults
    activeExam: 
    'vital-signs' | 'visual-inspection' | 'movement-assessment' | undefined,
    //  'respiratory-exam' |
    // 'neurological' |
    // 'pain-assessment'
    timerRunning: boolean
    timer: number
    examNotes: string
}

export interface PatientExamContext {
    patientExamState: PatientExamState
    examinationIsOpen: boolean
    setPatientExamState: (partial : Partial<PatientExamState>) => void
    setExaminationIsOpen: (isOpen: boolean) => void
    resetExam: () => void
}

const patientExamInitialState: PatientExamState = {
    currentSection: undefined,
    examResults: {},
    activeExam: undefined,
    timerRunning: false,
    timer: 0,
    examNotes: '',
}
const patientExamContextIntialState : Omit<PatientExamContext,
'setPatientExamState'| 'setExaminationIsOpen'| 'resetExam'>  = {
    examinationIsOpen: false,
    patientExamState: patientExamInitialState
}


export const usePatientExamStore = create<PatientExamContext>((set) => ({
    ...patientExamContextIntialState,
    setPatientExamState: (partial) => set((state) => ({
        patientExamState: {
            ...state.patientExamState,
            ...partial
        }
    })),
    setExaminationIsOpen: (isOpen) => set({examinationIsOpen: isOpen}),
    resetExam: () => set({
        examinationIsOpen: false,
        patientExamState:{...patientExamInitialState}
    })
}))

