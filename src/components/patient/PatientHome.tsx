import { useUserContext } from '@/context/AuthContext'
import { Activity, AlertCircle, Calendar, Clock, FileText, Heart, Pill, TrendingUp, User } from 'lucide-react'
import { DateTime } from 'luxon'
import React from 'react'

interface AppointmentView {
    id: string
    doctorName: string
    specialty: string
    date: string
    time: string
    type: string
}

interface Medication {
    id: string
    name: string
    dosage: string
    frequency: string
    nextDose: string
}

interface VitalSign {
    label: string
    value: string
    unit: string
    status: 'normal' | 'warning' | 'critical'
    icon: React.ReactNode
}

const upcomingAppointments: AppointmentView[] = [
    {
        id: '1',
        doctorName: 'Michael Chen',
        specialty: 'Cardiologist',
        date: '2025-11-18',
        time: '10:00 AM',
        type: 'online'
    },
    {
        id: '2',
        doctorName: 'Emily Rodriguez',
        specialty: 'General Physician',
        date: '2025-11-22',
        time: '2:30 PM',
        type: 'in-person'
    }
];

const medications: Medication[] = [
    {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        nextDose: '8:00 AM'
    },
    {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        nextDose: '1:00 PM'
    },
    {
        id: '3',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        nextDose: '9:00 PM'
    }
];


const recentActivity = [
    { id: '1', action: 'Lab results uploaded', time: '2 hours ago', icon: <FileText className="w-4 h-4" /> },
    { id: '2', action: 'Prescription refilled', time: '1 day ago', icon: <Pill className="w-4 h-4" /> },
    { id: '3', action: 'Appointment completed', time: '3 days ago', icon: <Calendar className="w-4 h-4" /> }
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'normal':
            return 'text-green-600 bg-green-50 border-green-200';
        case 'warning':
            return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'critical':
            return 'text-red-600 bg-red-50 border-red-200';
        default:
            return 'text-gray-600 bg-gray-50 border-gray-200';
    }
};

const PatientHome = () => {
    const { profileData } = useUserContext()
    return (
        <main className='flex flex-col gap-4 h-full max-w-7xl mx-auto overflow-y-auto bg-white px-2'>
            <header className='w-full bg-white rounded-t-lg'>
                <div className='flex flex-col gap-3 p-3'>
                    <h1 className='font-semibold text-3xl text-gray-800'>
                        Welcome back, {profileData?.userName.full_name}
                    </h1>
                    <p className='text-sm text-gray-500'>{DateTime.now().toLocaleString(
                        { weekday: 'long', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }
                    )}</p>
                </div>
            </header>

            <section className='flex-1 flex flex-col gap-6'>
                {/* Alert Banner */}
                <section className='bg-blue-50 border-l-4 border-main-light p-4 rounded-r-lg'>
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">You have an appointment in 3 days</p>
                            <p className="text-xs text-blue-700 mt-1">Remember to bring your recent lab reports</p>
                        </div>
                    </div>
                </section>

                <section className='grid grid-cols-1 lg:grid-cols-3 gap-8 p-2 lg:p-0'>
                    {/* Left column - Main content */}
                    <section className='lg:col-span-2 space-y-10'>

                        {/** Upcoming Appointments */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl  font-semibold text-gray-900">Upcoming Appointments</h2>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View all
                                </button>
                            </div>
                            <div className="space-y-3">
                                {upcomingAppointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{apt.doctorName}</h3>
                                                <p className="text-sm text-gray-600">{apt.specialty}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {apt.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {apt.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                                {apt.type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/** Recent Activity */}
                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                            {activity.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </section>

                    {/** Right column */}
                    <section className='space-y-6'>
                        {/* Medications */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Medications</h2>
                                <Pill className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="space-y-3">
                                {medications.map((med) => (
                                    <div key={med.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold text-gray-900 text-sm">{med.name}</h3>
                                        <p className="text-xs text-gray-600 mt-1">{med.dosage} • {med.frequency}</p>
                                        <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                                            <Clock className="w-3 h-3" />
                                            Next dose: {med.nextDose}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                Manage Medications
                            </button>
                        </section>

                        {/** Quick Actions */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-900 transition">
                                    📅 Book Appointment
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-900 transition">
                                    💬 Message Doctor
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-900 transition">
                                    📄 View Lab Results
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-900 transition">
                                    🔄 Request Prescription Refill
                                </button>
                            </div>
                        </section>
                    </section>
                </section>
            </section>
        </main>
    )
}

export default PatientHome