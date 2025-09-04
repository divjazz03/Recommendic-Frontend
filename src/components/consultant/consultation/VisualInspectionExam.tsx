
import { usePatientExamStore } from '@/stores/PatientExamStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';


export interface VisualInspectionResult {
    overallAppearance: string
    levelOfAlertness: string
    skinColor: string
    visibleLesions: string
    observations?: string
    breathingPattern: string
    useOfAccessoryMuscles: string
}

export const visualsValidation = z.object({
    overallAppearance: z.string(),
    levelOfAlertness: z.string(),
    skinColor: z.string(),
    visibleLesions: z.string(),
    observations: z.string().optional(),
    breathingPattern: z.string(),
    useOfAccessoryMuscles: z.string()
})

const VisualInspectionExam = () => {
    const { examResults,setPatientExamState} = usePatientExamStore(
        useShallow((s) => ({
            setPatientExamState: s.setPatientExamState,
            examResults: s.patientExamState.examResults
        }))
    );
    const form = useForm<z.infer<typeof visualsValidation>>({
        resolver: zodResolver(visualsValidation),
        mode: 'onSubmit'
    })

    const handleSubmit = (formData: z.infer<typeof visualsValidation>) => {
        console.log(formData)
        setPatientExamState({
            examResults: {
                ...examResults,
                "visual-inspection": {
                    breathingPattern: formData.breathingPattern,
                    levelOfAlertness: formData.levelOfAlertness,
                    overallAppearance: formData.overallAppearance,
                    skinColor: formData.skinColor,
                    useOfAccessoryMuscles: formData.useOfAccessoryMuscles,
                    visibleLesions: formData.visibleLesions,
                    observations: formData.observations
                }
            }
        })
    }
    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 space-y-4">
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
                                        <input {...form.register("overallAppearance")} type="radio" value={option} className="text-blue-600" />
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
                                        <input {...form.register('levelOfAlertness')} type="radio" value={option} className="text-blue-600" />
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
                            <select {...form.register("skinColor")} className="w-full px-2 py-2 border border-gray-300 rounded">
                                <option>Normal</option>
                                <option>Pale</option>
                                <option>Flushed</option>
                                <option>Cyanotic (blue)</option>
                                <option>Jaundiced (yellow)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2">Visible Lesions</label>
                            <select {...form.register("visibleLesions")} className="w-full px-2 py-2 border border-gray-300 rounded">
                                <option>None visible</option>
                                <option>Rash present</option>
                                <option>Lesions present</option>
                                <option>Bruising</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-600 mb-1">Observations</label>
                        <textarea {...form.register("observations")} className="w-full px-2 py-2 text-sm border border-gray-300 rounded resize-none h-16" placeholder="Describe any visible skin changes, lesions, or abnormalities..."></textarea>
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
                                        <input {...form.register('breathingPattern')} type="radio" value={option} className="text-blue-600" />
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
                                        <input {...form.register("useOfAccessoryMuscles")} type="radio" value={option} className="text-blue-600" />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type='submit'
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
                <CheckCircle className="w-5 h-5" />
                Complete Visual Inspection
            </button>
        </form>
    )
};

export default VisualInspectionExam