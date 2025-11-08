import {  PatientAppointmentType, usePatientAppointment } from '@/hooks/useAppointment'
import { AlertCircle, Calendar, CheckCircle, Clock, FileText, LucideProps, MapPin, Phone, Plus, Search, User, Video, XCircle } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';



const PatientAppointment = () => {

  const navigate = useNavigate();

  const {
    appointments,
    filterStatus,
    searchTerm,
    selectedAppointment,
    setFilterStatus,
    setSearchTerm,
    setSelectedAppointment,
    setViewMode,
    viewMode,
    formatDate,
    getDaysUntil,
    getStatusColor,
    getStatusIcon,
    pastAppointments,
    upcomingAppointments,
    filteredAppointments
  } = usePatientAppointment();

  return (
    <main className='h-full max-w-7xl mx-auto p-4 md:p-8'>
      <header className='mb-8'>
        <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-2'>MyAppointments</h1>
        <p className='text-gray-600'>Manage your medical appointments and consultation</p>
      </header>

       {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-main-light">{upcomingAppointments.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-main-light" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border-2 border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-yellow-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {appointments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-3xl font-bold text-purple-600">{appointments.length}</p>
              </div>
              <FileText className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by doctor, specialty, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-main-light focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'all' 
                    ? 'bg-main-light text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'confirmed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'pending' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
            </div>

            <button 
              onClick={() => navigate('/consultants')}
              className="bg-main-light text-white px-6 py-2 rounded-lg font-semibold hover:bg-main transition flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Appointment
            </button>
          </div>
        </section>

         {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
            <div className="grid gap-4">
              {upcomingAppointments.map(appointment => (
                <PatientAppointmentCard 
                key={appointment.id} 
                appointment={appointment}
                StatusIcon={getStatusIcon(appointment.status)}
                date={appointment.date}
                daysUntil={getDaysUntil(appointment.date)}
                setSelectedAppointment={setSelectedAppointment}
                statusColor={getStatusColor(appointment.status)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Appointments</h2>
            <div className="grid gap-4">
              {pastAppointments.map(appointment => (
                <PatientAppointmentCard 
                key={appointment.id} 
                appointment={appointment}
                StatusIcon={getStatusIcon(appointment.status)}
                date={appointment.date}
                daysUntil={getDaysUntil(appointment.date)}
                setSelectedAppointment={setSelectedAppointment}
                statusColor={getStatusColor(appointment.status)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredAppointments.length === 0 && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <AppointmentModal 
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(undefined)}
          statusColor={getStatusColor(selectedAppointment.status)} StatusIcon={getStatusIcon(selectedAppointment.status)}
          date={selectedAppointment.date}
          daysUntil={selectedAppointment.date}/>
        )}


    </main>

    
  )
}

export default PatientAppointment




export interface PatientAppointmentCardProps {
  appointment : PatientAppointmentType,
  setSelectedAppointment: (value: React.SetStateAction<PatientAppointmentType|undefined>)=> void,
  statusColor: string,
  StatusIcon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
  date: string,
  daysUntil: string
}
const PatientAppointmentCard = ({
  appointment, 
  setSelectedAppointment,
  statusColor,
  StatusIcon,
  date,
  daysUntil
}: PatientAppointmentCardProps ) => (
  <main className='bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer'
  onClick={() => setSelectedAppointment(appointment)}
  >
    <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">{appointment.doctorName}</h3>
          </div>
          <p className="text-gray-600 ml-7">{appointment.specialty}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${statusColor}`}>
          <StatusIcon className='h-6 w-6' />
          <span className="text-sm font-medium capitalize">{appointment.status}</span>
        </div>
      </div>

       <div className="space-y-3 ml-7">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{date}</span>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-semibold">
            {daysUntil}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{appointment.time} ({appointment.duration})</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          {appointment.type === 'online' ? (
            <Video className="w-4 h-4 text-gray-500" />
          ) : (
            <MapPin className="w-4 h-4 text-gray-500" />
          )}
          <span>{appointment.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Reason:</span>
          <span>{appointment.reason}</span>
        </div>

        {appointment.preparation && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Preparation: </span>
              {appointment.preparation}
            </p>
          </div>
        )}
      </div>
    
  </main>
)

interface AppointmentModalProps {
  appointment: PatientAppointmentType,
  onClose: () => void,
  statusColor: string,
  StatusIcon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
  date: string,
  daysUntil: string
}

const AppointmentModal = ({ 
  appointment,
  onClose,
  StatusIcon,
  date,
  daysUntil,
  statusColor,
}: AppointmentModalProps) => (
    <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{appointment.doctorName}</h2>
            <p className="text-gray-600">{appointment.specialty}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColor}`}>
            <StatusIcon className='h-6 w-6'/>
            <span className="font-semibold capitalize">{appointment.status}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-main-light mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{date}</p>
                  <p className="text-sm text-main-light">{daysUntil}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-main-light mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold">{appointment.time}</p>
                  <p className="text-sm text-gray-600">Duration: {appointment.duration}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {appointment.type === 'online' ? (
                  <Video className="w-5 h-5 text-main-light mt-1" />
                ) : (
                  <MapPin className="w-5 h-5 text-main-light mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{appointment.location}</p>
                  <p className="text-sm text-gray-600 capitalize">{appointment.type} visit</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-main-light mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold">{appointment.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-main-light mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Reason for Visit</p>
                <p className="font-semibold text-gray-900">{appointment.reason}</p>
              </div>
            </div>
          </div>

          {appointment.preparation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="font-semibold text-amber-900 mb-2">Preparation Required</p>
              <p className="text-amber-900">{appointment.preparation}</p>
            </div>
          )}

          {appointment.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">Additional Notes</p>
              <p className="text-blue-900">{appointment.notes}</p>
            </div>
          )}

          {appointment.status === 'confirmed' && new Date(appointment.date) >= new Date() && (
            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-main-light text-white py-3 rounded-lg font-semibold hover:bg-main transition">
                Add to Calendar
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                Reschedule
              </button>
              <button 
              onClick={() => onClose()}
              className="px-6 bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );