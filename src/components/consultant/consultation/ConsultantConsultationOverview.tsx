import { DatePicker } from "@/components/shared/DatePicker";
import InitialsOrAvartar from "@/components/shared/InitialsOrAvartar";
import PaginationWrapper from "@/components/shared/PaginationWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetConsultations } from "@/lib/actions/generalQueriesAndMutation";
import { cn } from "@/lib/utils/utils";
import { useTokenStore } from "@/store/TokenStore";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { SelectContent } from "@radix-ui/react-select";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  MoreHorizontalIcon,
  TimerIcon,
  UserIcon,
  VideoIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";

const consultationStatuses = [
  { value: "COMPLETED", label: "Completed" },
  { value: "NO_SHOW", label: "No show" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "CHECKED_IN", label: "Checked in" },
  { value: "READY", label: "Ready" },
  { value: "ENDED", label: "Ended" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "SCHEDULED", label: "Scheduled" },
];
const consultationTypes = [
  { value: "IN_PERSON", label: "In-person" },
  { value: "VIDEO", label: "Video" },
  { value: "ALL", label: "All" },
];

type ConsultationDetail = {
  patientDetail: Partial<{
    fullName: string;
    profilePictureUrl: string;
    userId: string;
    age: string;
    gender: string;
  }>;
  consultantDetail: Partial<{
    fullName: string;
    profilePictureUrl: string;
    userId: string;
    gender: string;
  }>;
  consultationChannel: string;
  time: string;
  date: string;
  status: string;
  reasonForVisit: string;
  consultationId: string;
};

const ConsultantConsultationOverview = () => {
  const { accessToken } = useTokenStore();
  const [date, setDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [consultationTypeFilter, setConsultationTypeFilter] =
    useState<string>("ALL");
  const navigation = useNavigate();
  const [consultationDetails, setConsultationDetails] = useState<
    ConsultationDetail[] | null
  >(null);
  const {
    data: consultationResponse,
    isError,
    error,
    isPending,
  } = useGetConsultations(accessToken);

  useEffect(() => {
    const consultationData = consultationResponse;
    const mappedConsultationDetails: ConsultationDetail[] =
      consultationData?.content.map((crdm) => ({
        status: crdm.status,
        consultationId: crdm.consultationId,
        date: crdm.date,
        reasonForVisit: crdm.reason,
        time: crdm.startTime,
        consultationChannel: crdm.channel,
        patientDetail: {
          age: crdm.patientData?.age,
          fullName: crdm.patientData?.name || "N/A",
          gender: crdm.patientData?.gender,
          profilePictureUrl: crdm.patientData?.profileUrl,
          userId: crdm.patientData?.id,
        },
        consultantDetail: {
          fullName: crdm.consultantData?.name,
          userId: crdm.consultantData?.id,
          gender: crdm.consultantData?.gender,
          profilePictureUrl: crdm.consultantData?.image,
        },
      })) || [];
    setConsultationDetails(mappedConsultationDetails);
  }, [consultationResponse]);

  if (!consultationDetails || consultationDetails.length < 1) {
    return;
  }

  return (
    <main className="relative mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          Consultations
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Review and manage your consultations
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-light-3 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today</p>
              <p className="text-3xl font-bold text-yellow-600">{1}</p>
            </div>
            <CalendarIcon className="hidden lg:block w-10 h-10 text-yellow-600 p-2 bg-yellow-100 rounded-sm" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-light-3 shadow-sm  p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Video</p>
              <p className="text-3xl font-bold text-blue-600">{1}</p>
            </div>
            <VideoIcon className="hidden lg:block w-10 h-10 text-blue-600 p-2 bg-blue-100 rounded-sm" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-light-3 shadow-sm  p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In-person</p>
              <p className="text-3xl font-bold text-green-600">{2}</p>
            </div>
            <UserIcon className="hidden lg:block w-10 h-10 text-green-600 p-2 bg-green-100 rounded-sm" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-light-3 shadow-sm  p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-purple-600">{1}</p>
            </div>
            <TimerIcon className="hidden lg:block w-10 h-10 text-purple-600 p-2 bg-purple-100 rounded-sm" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-light-3 shadow-sm  p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Today</p>
              <p className="text-3xl font-bold text-purple-600">{1}</p>
            </div>
            <CheckCircleIcon className="hidden lg:block w-10 h-10 text-purple-600 p-2 bg-purple-100 rounded-sm" />
          </div>
        </div>
      </section>
      <div className="flex flex-col lg:grid grid-cols-5 gap-2">
        <div className="col-span-4">
          {/** Consultations list section */}
          <section className="border border-b-0 p-2 rounded-t-md">
            {/**Filter section */}
            {/**Consultation status filter */}
            <div className="flex mb-2 gap-2">
              <Select onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-fit focus-visible:border-none focus:ring-0 ring-offset-transparent focus:ring-transparent">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="border border-1 z-50 rounded-sm shadow-md bg-white"
                >
                  {consultationStatuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/**Date Picker */}
              <DatePicker currentDate={date} setDate={setDate} />
              {/**Consultation status filter */}
              <Select
                value={consultationTypeFilter}
                onValueChange={(value) => setConsultationTypeFilter(value)}
              >
                <SelectTrigger className="w-fit focus-visible:border-none focus:ring-0 ring-offset-transparent focus:ring-transparent">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="border border-1 z-50 rounded-sm shadow-md bg-white"
                >
                  {consultationTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/** Consultation list table */}
            <section>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>ConsultationType</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Reason for Visit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultationDetails.map((constn) =>
                    mapConsultationDetailToTableRow(constn, navigation),
                  )}
                </TableBody>
              </Table>
            </section>
          </section>
          {/**Pagination Section */}
          <section className="w-full flex justify-end p-2 border rounded-b-md">
            <PaginationWrapper
              currentPage={0}
              handleNext={() => {}}
              handlePage={(pageNumber) => {}}
              handlePrevious={() => {}}
              isFirstPage
              isLastPage={false}
              totalPages={consultationDetails.length}
            />
          </section>
        </div>
        <div className="flex flex-row lg:flex-col">
          <section className="p-2 border rounded-md min-w-80">
            <header className="flex items-center mb-4 justify-between">
              <p>Today's Schedule</p>
              <Link className="text-sm text-blue-600" to={""}>
                View calendar
              </Link>
            </header>

            {consultationDetails
              .slice(0, 4)
              .map((constn, i, array) =>
                TimelineItem(constn, i === array.length - 1),
              )}

            <div className="flex gap-2 text-sm text-main cursor-pointer w-fit group">
              <p className="text-xs group-hover:text-main-light">
                View full day schedule
              </p>
              <ArrowRightIcon className="h-4 w-4 group-hover:text-main-light" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

function TimelineItem(consultation: ConsultationDetail, isLast: boolean) {
  const patientFullName = `${consultation.patientDetail.fullName}`;
  const dotColor = `bg-${getConsultationStatusAndColorCode(consultation.status).color}-500`;
  return (
    <div key={consultation.consultationId} className="flex gap-3">
      {/* Time */}
      <div className="w-[72px] shrink-0 pt-0.5 text-right text-sm text-slate-500">
        {consultation.date &&
          DateTime.fromISO(consultation.date).toLocaleString({
            timeStyle: "short",
            hour12: true,
          })}
      </div>

      {/* Timeline dot */}
      <div className="flex w-4 shrink-0 flex-col items-center">
        <span
          className={cn(`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full`, dotColor)}
        />
        {!isLast && <span className="mt-1 w-0.5 grow bg-slate-200" />}
      </div>

      {/* Content */}
      <div className="pb-5 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{patientFullName}</span>

          <Badge
            className={cn(
              "rounded-sm",
              `${
                consultation.consultationChannel === "Video"
                  ? "bg-green-100 text-green-500 hover:bg-green-100"
                  : "bg-purple-100 text-purple-500 hover:bg-purple-100"
              }`,
            )}
          >
            {consultation.consultationChannel}
          </Badge>
        </div>
        <p className="text-xs font-medium capitalize text-slate-500">
          {consultation.status.toLowerCase()}
        </p>
      </div>
    </div>
  );
}

function handleViewConsultationDetails(
  consultation: ConsultationDetail,
  navigate: NavigateFunction,
) {
  navigate(`${consultation.consultationId}`);
}

function isLate(date: Date) {
  const now = new Date();
  return now > date;
}
function getDropdownForConsultation(consultation: ConsultationDetail) {
  switch (consultation.status) {
    case "COMPLETED": {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="size-10">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Consultation</DropdownMenuItem>
              <DropdownMenuItem>View Clinical Note</DropdownMenuItem>
              <DropdownMenuItem>View Patient Profile</DropdownMenuItem>
              <DropdownMenuItem>View Documents</DropdownMenuItem>
              <DropdownMenuItem>Print / Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-amber-500">
                Request Amendment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
    case "NO_SHOW": {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="size-10">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>View Patient Profile</DropdownMenuItem>
              <DropdownMenuItem>Reschedule</DropdownMenuItem>
              <DropdownMenuItem>Book New</DropdownMenuItem>
              <DropdownMenuItem>Contact Patient</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
    case "ENDED": {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="size-10">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Continue Documentation</DropdownMenuItem>
              <DropdownMenuItem>View Patient Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Cancel / Void Encounter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
    case "IN_PROGRESS": {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="size-10">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Continue Consultation</DropdownMenuItem>
              <DropdownMenuItem>View Patient Profile</DropdownMenuItem>
              <DropdownMenuItem>View Appointment Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                End Consultation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
    case "SCHEDULED": {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="size-10">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Start Consultation</DropdownMenuItem>
              <DropdownMenuItem>Reschedule</DropdownMenuItem>
              {consultation.date && isLate(new Date(consultation.time)) && (
                <DropdownMenuItem className="text-orange-500">
                  Mark as No-Show
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
    case "CHECKED_IN": {
      return (
        <>
          <div className="flex items-center gap-1">
            <Button className="w-10 bg-main hover:bg-main-light">Start</Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="size-10">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Message Patient</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  Cancel Consultation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      );
    }
    case "READY": {
      return (
        <>
          <div className="flex items-center gap-1">
            <Button className="w-10 bg-main hover:bg-main-light">Start</Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="size-10">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Message Patient</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  Cancel Consultation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      );
    }
    case "CANCELLED": {
      return (
        <>
          <div className="flex items-center gap-1">
            <Button className="w-10 bg-main hover:bg-main-light">Start</Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="size-10">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem>Book New</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      );
    }
    default: {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="size-10">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
  }
}
function mapConsultationDetailToTableRow(
  consultation: ConsultationDetail,
  navigate: NavigateFunction,
) {
  const patientDetail = consultation.patientDetail;
  const patientFullName = `${patientDetail.fullName}`;
  const statusAndColor = getConsultationStatusAndColorCode(consultation.status);
  console.log(statusAndColor);
  return (
    <TableRow
      key={consultation.consultationId}
      onClick={() => handleViewConsultationDetails(consultation, navigate)}
    >
      <TableCell>
        <div className="flex gap-1 items-center">
          <InitialsOrAvartar
            userName={patientFullName}
            avatarUrl={patientDetail.profilePictureUrl}
          />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-xs">{patientFullName}</p>
            <p className="font-extralight text-xs">
              {patientDetail.userId} • {patientDetail.age} yr,{" "}
              {patientDetail.gender && patientDetail.gender.charAt(0)}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          {consultation.consultationChannel === "In-Person" ? (
            <UserIcon className="h-7 w-7 p-1 stroke-1 rounded-sm text-purple-500 bg-purple-100" />
          ) : (
            <VideoIcon className="h-7 w-7 p-1 stroke-1 rounded-sm text-green-500 bg-green-100" />
          )}
          <p>{consultation.consultationChannel}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={`p-1 w-fit hover:bg-${statusAndColor.color}-100 rounded-sm bg-${statusAndColor.color}-100 text-${statusAndColor.color}-500`}
        >
          {statusAndColor.value}
        </Badge>
      </TableCell>
      <TableCell>
        {consultation.date &&
          DateTime.fromISO(consultation.date).toLocaleString({
            timeStyle: "short",
            hour12: true,
          })}
      </TableCell>
      <TableCell>{consultation.reasonForVisit}</TableCell>
      <TableCell>{getDropdownForConsultation(consultation)}</TableCell>
    </TableRow>
  );
}

function getConsultationStatusAndColorCode(status: string) {
  const value = consultationStatuses.find((st) => st.value === status);
  switch (status) {
    case "COMPLETED": {
      return { value: value?.label, color: "green" };
    }
    case "NO_SHOW": {
      return { value: value?.label, color: "red" };
    }
    case "IN_PROGRESS": {
      return { value: value?.label, color: "blue" };
    }
    case "SCHEDULED": {
      return { value: value?.label, color: "orange" };
    }
    case "CHECKED_IN": {
      return { value: value?.label, color: "gray" };
    }
    case "ENDED": {
      return { value: value?.label, color: "amber" };
    }
    case "READY": {
      return { value: value?.label, color: "gray" };
    }
    case "CANCELLED": {
      return { value: value?.label, color: "cyan" };
    }
    default: {
      return { value: value?.label, color: "slate" };
    }
  }
}

export default ConsultantConsultationOverview;
