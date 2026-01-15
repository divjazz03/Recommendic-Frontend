import {
  ActionModalType,
  ConsultantAppointmentType,
  useConsultantAppointment,
} from "@/hooks/useAppointment";
import { formatDate } from "@/lib/utils/utils";
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  ClipboardList,
  Clock,
  Edit,
  FileText,
  LucideProps,
  MapPin,
  Phone,
  Search,
  User,
  Users,
  Video,
  X,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import CustomCalender from "../shared/CustomCalender";
import { useConsultantAction } from "@/hooks/useReschedule";
import ConsultantTimeSlots from "../shared/ConsultantTimeSlots";
import { DateTime } from "luxon";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

const ConsultantAppointment = () => {
  const {
    actionModal,
    filteredAppointments,
    getDaysUntil,
    getStatusColor,
    getStatusIcon,
    pendingCount,
    selectedAppointment,
    setActionModal,
    setSearchTerm,
    setSelectedAppointment,
    todayCount,
    getPriorityColor,
    searchTerm,
    setAppointments,
    upcomingCount,
    setFilterStatus,
    filterStatus,
  } = useConsultantAppointment();
  return (
    <main className="h-full mx-auto overflow-y-auto max-w-7xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          Appointment Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Review and manage patient appointment requests
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border-2 border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <Bell className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Schedule</p>
              <p className="text-3xl font-bold text-blue-600">{todayCount}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-3xl font-bold text-green-600">
                {upcomingCount}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Patients</p>
              <p className="text-3xl font-bold text-purple-600">{todayCount}</p>
            </div>
            <Users className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </section>

      {/* Tabs and Search */}
      <section className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide scrollbar-hide:-webkit-scrollbar">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === "all"
                  ? "bg-main-light text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                filterStatus === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Bell className="w-4 h-4" />
              Pending
              {pendingCount > 0 && (
                <span className="bg-white text-yellow-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterStatus("upcoming")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                filterStatus === "upcoming"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Upcoming
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                filterStatus === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Completed
            </button>
            <button
              onClick={() => setFilterStatus("missed")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                filterStatus === "missed"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <XCircle className="w-4 h-4" />
              Missed
            </button>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient name, reason, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Appointments List */}
      {filteredAppointments?.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <ConsultantAppointmentCard
              key={appointment.id}
              appointment={appointment}
              daysUntil={getDaysUntil(appointment.date)}
              formatDate={formatDate}
              priorityColor={getPriorityColor(appointment.priority)}
              setActionModal={setActionModal}
              setSelectedAppointment={setSelectedAppointment}
              statusColor={getStatusColor(appointment.status)}
              StatusIcon={getStatusIcon(appointment.status)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <Calendar />
              </EmptyMedia>
              <EmptyTitle>No Appointments found</EmptyTitle>
              <EmptyDescription>
                <p className="text-gray-600">
                  {filterStatus === "pending" &&
                    "No pending requests at the moment"}
                  {filterStatus === "upcoming" && "No upcoming appointments"}
                  {filterStatus === "completed" && "No completed appointments"}
                  {filterStatus === "missed" && "No missed appointments"}
                  {filterStatus === "all" && "Try adjusting your search terms"}
                </p>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}

      {/* Modals */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          StatusIcon={getStatusIcon(selectedAppointment.status)}
          daysUntil={getDaysUntil(selectedAppointment.date)}
          priorityColor={getPriorityColor(selectedAppointment.priority)}
          setActionModal={setActionModal}
          statusColor={getStatusColor(selectedAppointment.status)}
        />
      )}

      <ActionModal
        actionModal={actionModal}
        setActionModal={setActionModal}
        setAppointments={setAppointments}
      />
    </main>
  );
};

export default ConsultantAppointment;

interface ConsultantAppointmentCardProps {
  appointment: ConsultantAppointmentType;
  setSelectedAppointment: (
    value: React.SetStateAction<ConsultantAppointmentType | null>
  ) => void;
  daysUntil: string;
  formatDate: (value: string) => string;
  setActionModal: (value: React.SetStateAction<ActionModalType | null>) => void;
  priorityColor: string;
  StatusIcon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">> &
    React.RefAttributes<SVGSVGElement>;
  statusColor: string;
}

const ConsultantAppointmentCard = ({
  appointment,
  daysUntil,
  setActionModal,
  setSelectedAppointment,
  priorityColor,
  StatusIcon,
  statusColor
}: ConsultantAppointmentCardProps) => (
  <main
    className="bg-white rounded-lg border-2 border-gray-200 p-5 hover-shadow-lg transition-all cursor-pointer"
    onClick={() => setSelectedAppointment(appointment)}
  >
    <header className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {appointment.patientName}
            </h3>
            <p className="text-sm text-gray-600">
              {appointment.patientAge} years old
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${priorityColor}`}
        >
          <AlertCircle className="w-3 h-3" />
          <span className="capitalize">{appointment.priority}</span>
        </div>
        {appointment.status === "confirmed" &&
          new Date(`${appointment.date}T${appointment.time}`) < new Date() ? (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-pink-800 bg-pink-100 border-pink-300`}
            >
              <XCircle className="h-4 w-4" />
              <span className="font-semibold text-xs capitalize">
                {'missed'}
              </span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColor}`}
            >
              <StatusIcon className="h-4 w-4" />
              <span className="font-semibold text-xs capitalize">
                {appointment.status}
              </span>
            </div>
          )}
      </div>
    </header>

    <section className="grid md:grid-cols-2 gap-4 mb-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm sm:text-base">
            {DateTime.fromISO(appointment.date + "T" + appointment.time, {
              zone: "utc",
            })
              .setZone("local")
              .toFormat("HH:mm a")}
          </span>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-semibold">
            {daysUntil}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm sm:text-base">
            {appointment.time} ({appointment.duration})
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          {appointment.type === "online" ? (
            <Video className="w-4 h-4 text-gray-500" />
          ) : (
            <MapPin className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm">{appointment.location}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">
              {appointment.reason}
            </p>
            <p className="text-sm text-gray-600">{appointment.symptoms}</p>
          </div>
        </div>
      </div>
    </section>

    {appointment.status === "pending" && (
      <div
        className="flex gap-2 pt-3 border-t"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setActionModal({ type: "approve", appointment })}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => setActionModal({ type: "reschedule", appointment })}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Reschedule
        </button>
        <button
          onClick={() => setActionModal({ type: "decline", appointment })}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Decline
        </button>
      </div>
    )}

    {appointment.notes && (
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
        <span className="font-semibold">Note: </span>
        {appointment.notes}
      </div>
    )}
  </main>
);

interface ActionModalProps {
  actionModal: ActionModalType | null;
  setActionModal: (value: React.SetStateAction<ActionModalType | null>) => void;
  setAppointments: (
    value: React.SetStateAction<ConsultantAppointmentType[]>
  ) => void;
}

const ActionModal = ({
  actionModal,
  setActionModal,
  setAppointments,
}: ActionModalProps) => {
  if (!actionModal) return null;
  const { type, appointment } = actionModal;
  const {
    handleCancel,
    handleDecline,
    handleReschedule,
    rescheduleDate,
    rescheduleTime,
    setRescheduleDate,
    setRescheduleTime,
    actionReason,
    setActionReason,
    timeSlotsMem,
    setSelectedScheduleId,
    handleApprove,
    notes,
    setNotes,
  } = useConsultantAction(actionModal, setAppointments, setActionModal);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  return (
    <main className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {type === "decline"
            ? "Decline Appointment"
            : type === "reschedule"
            ? "Reschedule Appointment"
            : "Approve Appointment"}
        </h3>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-900">
            {appointment.patientName}
          </p>
          <p className="text-sm text-gray-600">{appointment.reason}</p>
          <p className="text-sm text-gray-600">
            {formatDate(appointment.date)} at {appointment.time}
          </p>
        </div>

        {type === "reschedule" && (
          <div className="space-y-4 mb-4 overflow-y-auto h-96">
            <div>
              <CustomCalender
                currentMonth={currentMonth}
                selectedDate={rescheduleDate}
                setSelectedDate={setRescheduleDate}
                toNextMonth={nextMonth}
                toPreviousMonth={previousMonth}
              />
            </div>
            {/* Time slots */}
            {rescheduleDate && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                <h2 className="text-xl font-semibold text-dark-3 mb-2">
                  Available Times
                </h2>
                <p className="text-dark-2 mb-6">{formatDate(rescheduleDate)}</p>

                {timeSlotsMem && setRescheduleTime && (
                  <ConsultantTimeSlots
                    selectedTime={rescheduleTime ?? ""}
                    setSelectedScheduleId={setSelectedScheduleId}
                    setSelectedTime={setRescheduleTime}
                    timeSlots={timeSlotsMem}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {type !== "approve" && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {type === "decline"
                ? "Reason for Declining (Required)"
                : "Reason for Rescheduling (Optional)"}
            </label>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder={
                type === "decline"
                  ? "e.g., No availability, outside specialty, duplicate booking..."
                  : "e.g., Schedule conflict, emergency case priority..."
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-main focus:outline-none h-24 resize-none"
            />
          </div>
        )}
        {type === "approve" && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 nb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information or instruction for the patient before the time"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-main focus:outline-none h-24 resize-none"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              type === "decline"
                ? handleDecline(appointment.id)
                : type === "reschedule"
                ? handleReschedule(appointment.id)
                : handleApprove(appointment.id)
            }
            disabled={
              type === "approve"
                ? false
                : type === "decline"
                ? !actionReason.trim()
                : false
            }
            className={`flex-1 py-2 rounded-lg font-semibold transition disabled:bg-gray-500 ${
              type === "decline"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {type === "decline"
              ? "Confirm Decline"
              : type === "reschedule"
              ? "Confirm Reschedule"
              : "Approve"}
          </button>
        </div>
      </div>
    </main>
  );
};

interface AppointmentModalProps {
  appointment: ConsultantAppointmentType;
  onClose: () => void;
  StatusIcon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">> &
    React.RefAttributes<SVGSVGElement>;
  statusColor: string;
  daysUntil: string;
  setActionModal: (value: React.SetStateAction<ActionModalType | null>) => void;
  priorityColor: string;
}

const AppointmentModal = ({
  appointment,
  onClose,
  StatusIcon,
  daysUntil,
  setActionModal,
  priorityColor,
  statusColor,
}: AppointmentModalProps) => (
  <main className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {appointment.patientName}
          </h2>
          <p className="text-gray-600">
            {appointment.patientAge} years old • {appointment.reason}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${priorityColor}`}
          >
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold capitalize">
              {appointment.priority} Priority
            </span>
          </div>

          {appointment.status === "confirmed" &&
          new Date(`${appointment.date}T${appointment.time}`) < new Date() ? (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-pink-800 bg-pink-100 border-pink-300`}
            >
              <XCircle className="h-4 w-4" />
              <span className="font-semibold text-xs capitalize">
                {'missed'}
              </span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColor}`}
            >
              <StatusIcon className="h-4 w-4" />
              <span className="font-semibold text-xs capitalize">
                {appointment.status}
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Appointment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date</p>
                    <p className="">
                      {formatDate(appointment.date + "T" + appointment.time)}
                    </p>
                    <p className="text-sm text-blue-600">{daysUntil}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Time</p>
                    <p className="">
                      {DateTime.fromISO(
                        appointment.date + "T" + appointment.time,
                        { zone: "utc" }
                      )
                        .setZone("local")
                        .toFormat("HH:mm a")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {appointment.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {appointment.type === "online" ? (
                    <Video className="w-5 h-5 text-blue-600 mt-1" />
                  ) : (
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Location
                    </p>
                    <p className="">{appointment.location}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {appointment.type.replace("_", "-").toLowerCase()} visit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Patient Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Phone</p>
                    <p className="">{appointment.patientPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Email</p>
                    <p className="">{appointment.patientEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Request Date
                    </p>
                    <p className="">{formatDate(appointment.requestedDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Clinical Information
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Reason for Visit
              </p>
              <p className="text-gray-900">{appointment.reason}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Symptoms
              </p>
              <p className="text-gray-900">{appointment.symptoms}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Medical History
              </p>
              <p className="text-gray-900">{appointment.medicalHistory}</p>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Additional Notes</p>
            <p className="text-blue-900">{appointment.notes}</p>
          </div>
        )}

        {appointment.cancellationReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-900 mb-2">
              Cancellation Reason
            </p>
            <p className="text-red-900">{appointment.cancellationReason}</p>
          </div>
        )}

        {appointment.status === "pending" && (
          <div className="flex justify-between gap-3 pt-4 border-t">
            <button
              onClick={() => setActionModal({ type: "approve", appointment })}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg  min-w-32 text-xs sm:text-base font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Approve
            </button>
            <button
              onClick={() =>
                setActionModal({ type: "reschedule", appointment })
              }
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg  min-w-32 text-xs sm:text-base font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Reschedule
            </button>
            <button
              onClick={() => setActionModal({ type: "decline", appointment })}
              className="px-6 bg-red-600 text-white py-3 rounded-lg min-w-32 max-w-32 text-xs sm:text-base font-semibold  hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  </main>
);
