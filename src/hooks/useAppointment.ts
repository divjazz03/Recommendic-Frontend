import { ReactNode, useEffect, useState } from "react";
import { ConsultationChannel } from "./usePatientSchedules";
import { AlertCircle, CheckCircle, LucideProps, XCircle } from 'lucide-react'
import { DateTime, DateTimeFormatOptions } from "luxon";
import { useGetAppointments } from "@/lib/actions/generalQueriesAndMutation";
import { useConfirmAppointment } from "@/lib/actions/consultantQueryAndMutations";

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'resheduled'
export type AppointmentPriority = 'low' | 'medium' | 'high'

export interface PatientAppointmentType {
  id: string,
  consultantId:string,
  doctorName: string,
  specialty: string,
  date: string,
  time: string,
  duration: string,
  type: ConsultationChannel,
  location: string,
  phone: string,
  status: AppointmentStatus,
  reason: string,
  notes: string,
  preparation: string

}
const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusIcon = (status: AppointmentStatus): React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> => {
  switch (status) {
    case 'confirmed': return CheckCircle
    case 'pending': return AlertCircle;
    case 'completed': return CheckCircle;
    case 'cancelled': return XCircle;
    default: return AlertCircle;
  }
};

const getPriorityColor = (priority: AppointmentPriority) => {
  switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}
const samplePatientAppointments: PatientAppointmentType[] = [
  {
    id: "1",
    consultantId: "21",
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2025-11-08',
    time: '10:30 AM',
    duration: '30 min',
    type: 'in_person',
    location: 'City Medical Center, Room 304',
    phone: '+1 (555) 123-4567',
    status: 'confirmed',
    reason: 'Annual heart checkup',
    notes: 'Please bring previous test results',
    preparation: 'Fasting required - no food 8 hours before'
  },
  {
    id: "2",
    consultantId: "21",
    doctorName: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    date: '2025-11-12',
    time: '2:00 PM',
    duration: '45 min',
    type: 'online',
    location: 'Virtual Consultation',
    phone: '+1 (555) 234-5678',
    status: 'pending',
    reason: 'Skin condition follow-up',
    notes: 'online link will be sent 30 minutes before appointment',
    preparation: 'Have photos of affected area ready'
  },
  {
    id: "3",
    consultantId: "21",
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'General Practitioner',
    date: '2025-11-15',
    time: '9:00 AM',
    duration: '20 min',
    type: 'in_person',
    location: 'Wellness Clinic, Building A',
    phone: '+1 (555) 345-6789',
    status: 'confirmed',
    reason: 'Flu vaccination',
    notes: 'Walk-ins welcome if earlier slot available',
    preparation: 'No special preparation needed'
  },
  {
    id: "4",
    consultantId: "21",
    doctorName: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgeon',
    date: '2025-11-20',
    time: '11:15 AM',
    duration: '60 min',
    type: 'in_person',
    location: 'Orthopedic Center, Suite 201',
    phone: '+1 (555) 456-7890',
    status: 'confirmed',
    reason: 'Post-surgery follow-up',
    notes: 'X-rays will be taken during visit',
    preparation: 'Wear comfortable clothing'
  },
  {
    id: "5",
    consultantId: "21",
    doctorName: 'Dr. Lisa Anderson',
    specialty: 'Psychiatrist',
    date: '2025-10-28',
    time: '3:30 PM',
    duration: '50 min',
    type: 'online',
    location: 'Virtual Consultation',
    phone: '+1 (555) 567-8901',
    status: 'completed',
    reason: 'Mental health consultation',
    notes: 'Session completed successfully',
    preparation: 'Find a quiet, private space'
  },
  {
    id: "6",
    consultantId: "21",
    doctorName: 'Dr. Robert Martinez',
    specialty: 'Endocrinologist',
    date: '2025-11-05',
    time: '1:45 PM',
    duration: '40 min',
    type: 'in_person',
    location: 'Diabetes Care Center',
    phone: '+1 (555) 678-9012',
    status: 'cancelled',
    reason: 'Diabetes management',
    notes: 'Rescheduling required',
    preparation: 'Bring glucose monitor logs'
  }
];

const getDaysUntil = (dateStr: string) => {

  const appointmentDate = new Date(dateStr);
  appointmentDate.setHours(0, 0, 0, 0);
  const diffTime = DateTime.fromJSDate(appointmentDate).diffNow('days', {conversionAccuracy:'longterm'}).days

  const diffDays = Math.ceil(diffTime);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};


export const usePatientAppointment = () => {
  const {data: appointmentsResponse} = useGetAppointments()
  const [appointments, setAppointments] = useState<PatientAppointmentType[]>(samplePatientAppointments);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointmentType>();

  const filteredAppointments = appointments?.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) ?? [];

  const upcomingAppointments = filteredAppointments?.filter(apt =>
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
  );
  const upcomingAppointmentCount = appointments?.filter(apt => 
      new Date(apt.date) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
  ).length
  const confirmedAppointmentCount = appointments?.filter(apt => 
    apt.status === 'confirmed'
  ).length
  const pendingAppointmentCount = appointments?.filter(apt => 
    apt.status === 'pending'
  ).length

  const pastAppointments = filteredAppointments?.filter(apt => {
    console.log(Date.parse(`${apt.date}T${apt.time}`) > Date.now())
    return Date.parse(`${apt.date}T${apt.time}`) > Date.now() ||  apt.status === 'completed' || apt.status === 'cancelled'
  }
    
  );

  const appointmentCount = appointments?.length





  useEffect(() => {
    const localAppointments = appointmentsResponse?.data.content as PatientAppointmentType[]
    setAppointments(localAppointments)
  }, [appointmentsResponse])

  return {
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    rescheduleModalOpen,
    setRescheduleModalOpen,
    selectedAppointment,
    setSelectedAppointment,
    getStatusColor,
    getDaysUntil,
    getStatusIcon,
    pastAppointments,
    upcomingAppointments,
    filteredAppointments,
    upcomingAppointmentCount,
    confirmedAppointmentCount,
    pendingAppointmentCount,
    appointmentCount
  }
}



export interface ConsultantAppointmentType {
  id: string,
  patientName: string,
  patientAge: number,
  patientPhone: string,
  patientEmail: string,
  date: string,
  time: string,
  duration: string,
  type: ConsultationChannel,
  location: string,
  status: AppointmentStatus,
  reason: string,
  symptoms: string,
  medicalHistory: string,
  requestedDate: string,
  priority: 'high' | 'medium' | 'low',
  notes?: string,
  cancellationReason?: string
}

const sampleConsultantAppointments: ConsultantAppointmentType[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientAge: 45,
    patientPhone: '+1 (555) 111-2222',
    patientEmail: 'john.smith@email.com',
    date: '2025-11-08',
    time: '10:30 AM',
    duration: '30 min',
    type: 'in_person',
    location: 'City Medical Center, Room 304',
    status: 'pending',
    reason: 'Annual heart checkup',
    symptoms: 'Chest discomfort, shortness of breath during exercise',
    medicalHistory: 'Hypertension, high cholesterol',
    requestedDate: '2025-11-03',
    priority: 'medium',
    notes: 'Patient prefers morning appointments'
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    patientAge: 32,
    patientPhone: '+1 (555) 222-3333',
    patientEmail: 'sarah.j@email.com',
    date: '2025-11-08',
    time: '2:00 PM',
    duration: '45 min',
    type: 'online',
    location: 'Virtual Consultation',
    status: 'pending',
    reason: 'Skin rash consultation',
    symptoms: 'Red, itchy rash on arms and legs for 2 weeks',
    medicalHistory: 'Eczema, seasonal allergies',
    requestedDate: '2025-11-04',
    priority: 'high',
    notes: 'Has photos of affected areas ready'
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    patientAge: 58,
    patientPhone: '+1 (555) 333-4444',
    patientEmail: 'mbrown@email.com',
    date: '2025-11-09',
    time: '9:00 AM',
    duration: '30 min',
    type: 'in_person',
    location: 'Wellness Clinic, Building A',
    status: 'pending',
    reason: 'Follow-up blood test results',
    symptoms: 'No current symptoms',
    medicalHistory: 'Type 2 diabetes, previous heart attack',
    requestedDate: '2025-11-02',
    priority: 'high',
    notes: 'Urgent - abnormal lab results'
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    patientAge: 28,
    patientPhone: '+1 (555) 444-5555',
    patientEmail: 'emily.davis@email.com',
    date: '2025-11-12',
    time: '11:15 AM',
    duration: '20 min',
    type: 'online',
    location: 'Virtual Consultation',
    status: 'confirmed',
    reason: 'Prescription refill consultation',
    symptoms: 'None',
    medicalHistory: 'Asthma',
    requestedDate: '2025-10-30',
    priority: 'low',
    notes: 'Regular patient, routine check-in'
  },
  {
    id: '5',
    patientName: 'David Wilson',
    patientAge: 62,
    patientPhone: '+1 (555) 555-6666',
    patientEmail: 'dwilson@email.com',
    date: '2025-11-15',
    time: '3:30 PM',
    duration: '60 min',
    type: 'in_person',
    location: 'Orthopedic Center, Suite 201',
    status: 'confirmed',
    reason: 'Post-surgery follow-up',
    symptoms: 'Mild knee pain, improving',
    medicalHistory: 'Recent knee replacement surgery',
    requestedDate: '2025-10-28',
    priority: 'medium',
    notes: 'Bring X-rays from last week'
  },
  {
    id: '6',
    patientName: 'Lisa Anderson',
    patientAge: 41,
    patientPhone: '+1 (555) 666-7777',
    patientEmail: 'lisa.a@email.com',
    date: '2025-11-20',
    time: '1:00 PM',
    duration: '45 min',
    type: 'in_person',
    location: 'City Medical Center, Room 304',
    status: 'confirmed',
    reason: 'New patient consultation',
    symptoms: 'Chronic fatigue, joint pain',
    medicalHistory: 'No significant history',
    requestedDate: '2025-11-01',
    priority: 'medium',
    notes: 'First visit, comprehensive evaluation needed'
  },
  {
    id: '7',
    patientName: 'Robert Martinez',
    patientAge: 55,
    patientPhone: '+1 (555) 777-8888',
    patientEmail: 'rmartinez@email.com',
    date: '2025-10-28',
    time: '10:00 AM',
    duration: '30 min',
    type: 'in_person',
    location: 'Wellness Clinic, Building A',
    status: 'completed',
    reason: 'Diabetes management',
    symptoms: 'None reported',
    medicalHistory: 'Type 2 diabetes, hypertension',
    requestedDate: '2025-10-20',
    priority: 'medium',
    notes: 'Patient doing well, A1C improved'
  },
  {
    id: '8',
    patientName: 'Jennifer Lee',
    patientAge: 36,
    patientPhone: '+1 (555) 888-9999',
    patientEmail: 'jlee@email.com',
    date: '2025-11-10',
    time: '4:00 PM',
    duration: '30 min',
    type: 'online',
    location: 'Virtual Consultation',
    status: 'cancelled',
    reason: 'Migraine consultation',
    symptoms: 'Severe headaches, nausea',
    medicalHistory: 'Chronic migraines',
    requestedDate: '2025-11-01',
    priority: 'medium',
    notes: 'Patient cancelled - rescheduling needed',
    cancellationReason: 'Patient had conflict with work meeting'
  }
];

export interface ActionModalType {
  type: 'reschedule' | 'decline' | 'approve',
  appointment: ConsultantAppointmentType
}

export const useConsultantAppointment = () => {
  const {data: appointmentsResponse} = useGetAppointments()
  const [appointments, setAppointments] = useState<ConsultantAppointmentType[]>(sampleConsultantAppointments);
  const [filterStatus, setFilterStatus] = useState<'all' | AppointmentStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<ConsultantAppointmentType | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionModal, setActionModal] = useState<ActionModalType | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date());
  const [rescheduleTime, setRescheduleTime] = useState('');


  useEffect(() => {
    const localAppointments = appointmentsResponse?.data.content as ConsultantAppointmentType[] || []
    setAppointments([...localAppointments]);
  }, [appointmentsResponse])
  

  const filteredAppointments = appointments?.filter(apt => {
    const matchesTab =
      (activeTab === 'pending' && apt.status === 'pending') ||
      (activeTab === 'confirmed' && apt.status === 'confirmed') ||
      (activeTab === 'completed' && apt.status === 'completed') ||
      (activeTab === 'all');

    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  }) || [];
  const totalCount = appointments?.length;
  const pendingCount = appointments?.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments?.filter(a => a.status === 'confirmed').length;
  const todayCount = appointments?.filter(a =>
    a.date === new Date().toISOString().split('T')[0] &&
    (a.status === 'confirmed' || a.status === 'pending')
  ).length;

  

  return {
    pendingCount,
    todayCount,
    filteredAppointments,
    getDaysUntil,
    getStatusColor,
    getStatusIcon,
    selectedAppointment,
    setActionModal,
    setActionReason,
    setActiveTab,
    setSearchTerm,
    actionModal,
    setSelectedAppointment,
    appointments,
    getPriorityColor,
    activeTab,
    searchTerm,
    actionReason,
    rescheduleDate,
    rescheduleTime,
    setRescheduleDate,
    setRescheduleTime,
    setAppointments,
    confirmedCount,
    totalCount
  }


}