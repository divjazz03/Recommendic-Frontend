import {create} from 'zustand'
import { VitalSignResult } from '@/components/consultant/consultation/note/examination/VitalSignsExam'
import React from 'react'
import { VisualInspectionResult } from '@/components/consultant/consultation/note/examination/VisualInspectionExam'
import { MovementAssessmentResult } from '@/components/consultant/consultation/note/examination/MovementAssessment'

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
    setPatientExamState: (partial : Partial<PatientExamState>) => void
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
    resetExam: () => set({
        patientExamState:{...patientExamInitialState}
    })
}))

