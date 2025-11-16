import { useUserContext } from "@/context/AuthContext";
import { ConsultantProfile } from "@/types";
import { Activity, AlertCircle, Calendar, CheckCircle, ChevronRight, Clock, FileText, MessageSquare, Stethoscope, TrendingUp, Users, Video } from "lucide-react";
import { DateTime } from "luxon";

interface Appointment {
    id: string;
    patientName: string;
    patientAge: number;
    time: string;
    type: 'in-person' | 'online' | 'Follow-up';
    status: 'upcoming' | 'in-progress' | 'completed';
    reason: string;
}

interface Patient {
    id: string;
    name: string;
    condition: string;
    status: 'critical' | 'stable' | 'monitoring';
    lastVisit: string;
}

const todayAppointments: Appointment[] = [
    {
        id: '1',
        patientName: 'Sarah Johnson',
        patientAge: 45,
        time: '09:00 AM',
        type: 'Follow-up',
        status: 'completed',
        reason: 'Hypertension checkup'
    },
    {
        id: '2',
        patientName: 'James Miller',
        patientAge: 62,
        time: '10:30 AM',
        type: 'in-person',
        status: 'in-progress',
        reason: 'Chest pain evaluation'
    },
    {
        id: '3',
        patientName: 'Emily Rodriguez',
        patientAge: 38,
        time: '11:45 AM',
        type: 'online',
        status: 'upcoming',
        reason: 'Medication review'
    },
    {
        id: '4',
        patientName: 'Robert Chen',
        patientAge: 55,
        time: '02:00 PM',
        type: 'in-person',
        status: 'upcoming',
        reason: 'Post-surgery follow-up'
    },
    {
        id: '5',
        patientName: 'Maria Garcia',
        patientAge: 71,
        time: '03:30 PM',
        type: 'Follow-up',
        status: 'upcoming',
        reason: 'Diabetes management'
    }
];

const criticalPatients: Patient[] = [
    {
        id: '1',
        name: 'John Davis',
        condition: 'Post-MI, elevated troponin',
        status: 'critical',
        lastVisit: '2 hours ago'
    },
    {
        id: '2',
        name: 'Patricia Wilson',
        condition: 'Unstable angina',
        status: 'monitoring',
        lastVisit: '5 hours ago'
    },
    {
        id: '3',
        name: 'Michael Brown',
        condition: 'Arrhythmia, monitoring',
        status: 'stable',
        lastVisit: '1 day ago'
    }
];

const pendingTasks: Task[] = [
    {
        id: '1',
        title: 'Review lab results for Sarah Johnson',
        priority: 'high',
        dueTime: '11:00 AM'
    },
    {
        id: '2',
        title: 'Sign discharge summary - Robert Chen',
        priority: 'high',
        dueTime: '12:00 PM'
    },
    {
        id: '3',
        title: 'Approve prescription refill requests (3)',
        priority: 'medium',
        dueTime: '2:00 PM'
    },
    {
        id: '4',
        title: 'Complete patient notes from yesterday',
        priority: 'medium',
        dueTime: '5:00 PM'
    }
];

const stats = {
    todayAppointments: 12,
    completed: 3,
    pending: 9,
    patients: 156
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'critical':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'monitoring':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'stable':
            return 'bg-green-100 text-green-700 border-green-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getAppointmentStatus = (status: string) => {
    switch (status) {
        case 'completed':
            return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600' };
        case 'in-progress':
            return { icon: <Activity className="w-4 h-4" />, color: 'text-blue-600' };
        case 'upcoming':
            return { icon: <Clock className="w-4 h-4" />, color: 'text-gray-400' };
        default:
            return { icon: <Clock className="w-4 h-4" />, color: 'text-gray-400' };
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'bg-red-50 border-red-300 text-red-700';
        case 'medium':
            return 'bg-yellow-50 border-yellow-300 text-yellow-700';
        case 'low':
            return 'bg-blue-50 border-blue-300 text-blue-700';
        default:
            return 'bg-gray-50 border-gray-300 text-gray-700';
    }
};


interface Task {
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    dueTime: string;
}

const ConsultantHome = () => {
    const { profileData } = useUserContext()
    const consultantProfile = profileData as ConsultantProfile
    return (
        <main className="flex flex-col gap-4 h-full max-w-7xl mx-auto overflow-y-auto bg-white px-2">
            <header className='w-full bg-white rounded-t-lg'>
                <div className='flex flex-col gap-3 p-3'>
                    <h1 className='font-semibold text-3xl text-gray-800'>
                        Welcome back,Dr. {consultantProfile?.userName.full_name}
                    </h1>
                    <p className='text-sm text-gray-500'>{DateTime.now().toLocaleString(
                        { weekday: 'long', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }
                    )} • {consultantProfile.specialization} Department</p>
                </div>
            </header>

            <section className="flex-1 flex flex-col gap-6">
                {/* Stats Overview */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Today's Appointments</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.todayAppointments}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                            <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                            <span className="text-green-600">+2</span>&nbsp;
                            <span>vs yesterday</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed Consultations</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            {stats.pending} remaining today
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Patients</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.patients}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                            8 new this week
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Tasks</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingTasks.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-red-600 font-medium">
                            2 high priority
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Appointments */}
                    <section className="lg:col-span-2 space-y-10">
                        {/** Today's Schedule */}
                        <section>
                            <header className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                    View Calendar
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </header>

                            <div className="space-y-3">
                                {todayAppointments.map((apt) => {
                                    const statusInfo = getAppointmentStatus(apt.status);
                                    return (
                                        <div
                                            key={apt.id}
                                            className={`p-4 border rounded-lg transition hover:shadow-md ${apt.status === 'in-progress'
                                                ? 'border-blue-300 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-200'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={statusInfo.color}>
                                                            {statusInfo.icon}
                                                        </span>
                                                        <h3 className="font-semibold text-gray-900">{apt.patientName}</h3>
                                                        <span className="text-sm text-gray-500">• {apt.patientAge}y</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{apt.reason}</p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {apt.time}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full ${apt.type === 'Telemedicine'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : apt.type === 'Follow-up'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {apt.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                {apt.status === 'upcoming' && (
                                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                                                        Start
                                                    </button>
                                                )}
                                                {apt.status === 'in-progress' && (
                                                    <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                                                        Complete
                                                    </button>
                                                )}
                                                {apt.status === 'completed' && (
                                                    <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition">
                                                        View Notes
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                        {/** Pending Tasks */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h2>
                            <div className="space-y-2">
                                {pendingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`p-4 border rounded-lg flex items-start gap-3 ${getPriorityColor(task.priority)}`}
                                    >
                                        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{task.title}</p>
                                            <p className="text-xs opacity-75 mt-1">Due: {task.dueTime}</p>
                                        </div>
                                        <span className="text-xs font-semibold uppercase px-2 py-1 bg-white rounded">
                                            {task.priority}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </section>
                    {/*Right column - Side bar*/}
                    <aside className="space-y-6">
                        {/* Critical Patients */}
                        <section>
                            <header className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Critical Patients</h2>
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </header>

                            <div className="space-y-3">
                                {criticalPatients.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 text-sm">{patient.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                                                {patient.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{patient.condition}</p>
                                        <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                                View All Critical Cases
                            </button>
                        </section>

                        {/* Quick Actions */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-left text-sm font-medium transition flex items-center gap-2">
                                    <Video className="w-4 h-4" />
                                    Start Telemedicine
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-900 transition flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" />
                                    Add Patient Notes
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-900 transition flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    View Lab Results
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-900 transition flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Patient Messages (5)
                                </button>
                            </div>
                        </section>

                        {/* Recent Updates */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="text-gray-900">New lab results available for 3 patients</p>
                                        <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="text-gray-900">Prescription approved: Sarah Johnson</p>
                                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                                    <div>
                                        <p className="text-gray-900">Schedule change requested by patient</p>
                                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </aside>
                </section>

            </section>
        </main>
    )
}

export default ConsultantHome