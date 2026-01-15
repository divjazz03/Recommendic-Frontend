import { useUserContext } from "@/context/AuthContext";
import { useGetMyDashboard } from "@/lib/actions/patientQueryAndMutations";
import { formatDate } from "@/lib/utils/utils";
import { NotificationContext } from "@/types";
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  HandHelpingIcon,
  MessageCircle,
  Microscope,
  Pill,
  PillBottle,
  User2,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface AppointmentView {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  channel: string;
  status: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
}
interface RecentActivity {
  id: string;
  title: string;
  context: NotificationContext;
  time: string;
}

interface DashboardData {
  appointments: AppointmentView[];
  medications: Medication[];
  recentActivity: RecentActivity[];
}

const getActivityIcon = (context: NotificationContext) => {
  switch (context) {
    case "ARTICLE":
      return <FileText className="w-4 h-4" />;
    case "APPOINTMENT":
      return <Calendar className="w-4 h-4" />;
    case "USER":
      return <User2 className="w-4 h-4" />;
    case "CHAT":
      return <MessageCircle className="w-4 h-4" />;
    case "CONSULTATION":
      return <HandHelpingIcon className="w-4 h-4" />;
    case "MEDICINE":
      return <PillBottle className="w-4 h-4" />;
    case "LAB":
      return <Microscope className="w-4 h-4" />;
    default:
      return null;
  }
};

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "normal":
//       return "text-green-600 bg-green-50 border-green-200";
//     case "warning":
//       return "text-yellow-600 bg-yellow-50 border-yellow-200";
//     case "critical":
//       return "text-red-600 bg-red-50 border-red-200";
//     default:
//       return "text-gray-600 bg-gray-50 border-gray-200";
//   }
// };

const PatientHome = () => {
  const navigate = useNavigate()
  const { profileData } = useUserContext();
  const { data: dashBoardResp } = useGetMyDashboard();

  const [dashBoard, setDashboard] = useState<DashboardData>({
    appointments: [],
    medications: [],
    recentActivity: [],
  });

  useEffect(() => {
    console.log(dashBoardResp)
    const appointments: AppointmentView[] =
      dashBoardResp?.data?.appointmentsToday?.map((apt) => ({
        channel: apt.channel.toLowerCase(),
        date: DateTime.fromISO(apt.dateTime, { zone: "utc" }).toFormat(
          "YYYY-LLL-dd"
        ),
        time: DateTime.fromISO(apt.dateTime, { zone: "utc" }).toFormat(
          "HH:mm:ss a"
        ),
        doctorName: apt.consultantFullName,
        id: apt.appointmentId,
        specialty: apt.specialty,
        status: 'confirmed'
      })) || [];
    const medications: Medication[] | undefined =
      dashBoardResp?.data?.medications?.map((med) => ({
        dosage: med.dosageQuantity,
        frequency: med.dosageFrequency,
        id: med.medicationId,
        name: med.name,
        nextDose: DateTime.fromISO(med.nextDoseDateTime, {
          zone: "utc",
        }).toFormat("hh:mm a"),
      })) || [];
    const recentActivities: RecentActivity[] | undefined =
      dashBoardResp?.data?.recentActivities?.map((act) => ({
        context: act.context,
        id: act.activityId,
        time: formatDate(act.dateTime),
        title: act.title,
      })) || [];

    setDashboard((prev) => ({
      ...prev,
      appointments: appointments,
      medications: medications,
      recentActivity: recentActivities,
    }));
  }, [dashBoardResp]);
  return (
    <main className="flex flex-col gap-4 h-full max-w-7xl mx-auto overflow-y-auto bg-white p-2">
      <header className="w-full bg-white rounded-t-lg">
        <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-3xl text-gray-800">
            Welcome back, {profileData?.userName.full_name}
          </h1>
          <p className="text-sm text-gray-500">
            {DateTime.now().toLocaleString({
              weekday: "long",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </header>

      <section className="flex-1 flex flex-col gap-6">
        {/* Alert Banner */}
        <section className="bg-blue-50 border-l-4 border-main-light p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                You have an appointment in 3 days
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Remember to bring your recent lab reports
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:p-0">
          {/* Left column - Main content */}
          <section className="lg:col-span-2 space-y-10">
            {/** Upcoming Appointments */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl  font-semibold text-gray-900">
                  Upcoming Appointments
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </button>
              </div>
              {!dashBoard.appointments || dashBoard.appointments.length < 1 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <Calendar />
                    </EmptyMedia>
                    <EmptyTitle>No appointments scheduled today</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-3">
                  {dashBoard.appointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => navigate("/consultation")}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {apt.doctorName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {apt.specialty}
                          </p>
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
                          {apt.channel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/** Recent Activity */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>

              {!dashBoard.recentActivity ||
              dashBoard.recentActivity.length < 1 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No recent activities</EmptyTitle>
                    <EmptyDescription>
                      You haven'&apos;t done anything yet
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-3">
                  {dashBoard.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                        {getActivityIcon(activity.context)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>

          {/** Right column */}
          <section className="space-y-6">
            {/* Medications */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Medications
                </h2>
              </div>
              {!dashBoard.medications || dashBoard.medications.length < 1 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <Pill />
                    </EmptyMedia>
                    <EmptyTitle>No medicine to take today</EmptyTitle>
                    <EmptyDescription>
                      You have no medicines prescribed to you for today
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button className="transition text-sm font-medium">
                      Manage Medications
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="space-y-3">
                  {dashBoard.medications.map((med) => (
                    <div
                      key={med.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {med.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {med.dosage} • {med.frequency}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                        <Clock className="w-3 h-3" />
                        Next dose: {med.nextDose}
                      </div>
                    </div>
                  ))}
                  <button className="mt-4 w-full py-2 bg-main-light text-white rounded-lg hover:bg-main transition text-sm font-medium">
                    Manage Medications
                  </button>
                </div>
              )}
            </section>

            {/** Quick Actions */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
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
  );
};

export default PatientHome;
