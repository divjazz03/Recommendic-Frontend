import React, {
  HtmlHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LocalSearch from "../shared/LocalSearch";
import { ChevronDown, Filter, Stethoscope } from "lucide-react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ConsultantThumbnail from "../shared/ConsultantThumbnail";
import useConsultantList from "@/hooks/useConsultantList";
import useScrollDirection from "@/hooks/useScrollDirection";
import useInView from "@/hooks/useInView";
import Loader from "../shared/Loader";
import PaginationWrapper from "../shared/PaginationWrapper";

const ConsultantList = () => {
  const thisRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const {
    filteredConsultants,
    setSearchValue,
    setSelectedAvailability,
    setSelectedRating,
    setSelectedSpecialty,
    isPending,
    showFilters,
    empty,
    isLast,
    page,
    pageNumber,
    setPage,
    totalPages,
    specialties,
    setShowFilter,
  } = useConsultantList();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection(scrollRef.current); 
  const paginationRef = useRef<HTMLDivElement>(null);
  const { inView } = useInView(paginationRef, scrollRef);
  const showFloatingPagination = scrollDirection === "up"  &&
   inView === false &&
   scrollRef.current &&
   scrollRef.current.scrollTop > 20
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    setReady(true);
  }, [])
  if (!ready) return null;
  return (
    <div
      ref={thisRef}
      className="max-w-7xl h-full mx-auto p-4 md:p-8 gap-2 lg:p-6 overflow-y-auto flex flex-col"
    >
      <header className="px-2 mb-2">
        <h1 className="font-bold text-2xl sm:text-3xl antialiased">
          Find Medical Consultants
        </h1>
        <p className="text-gray-600 text-sm sm:text-lg">
          Connect with qualified healthcare professionals
        </p>
      </header>
      <LocalSearch
        placeholder="Search by name or specialty"
        setSearchValue={setSearchValue}
      />
      <section className="px-2">
        <button
          onClick={() => setShowFilter(() => !showFilters)}
          className="flex items-center gap-2 px-4 py-2 mb-4 rounded-sm border border-light-3 hover:bg-light-1 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-light-3 mb-4 grid grid-cols-1 md-grid-cols-3 gap-4">
            <div>
              <Label className="block text-dark-1 font-semibold mb-2">
                Specialty
              </Label>
              <Select onValueChange={(value) => setSelectedSpecialty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Specialties</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-dark-1 font-semibold mb-2">
                Minimum Rating
              </Label>
              <Select onValueChange={(value) => setSelectedRating(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select minimum rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rating</SelectLabel>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-dark-1 font-semibold mb-2">
                Availability
              </Label>
              <Select onValueChange={(value) => setSelectedAvailability(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Availability</SelectLabel>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="today">Available Today</SelectItem>
                    <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                    <SelectItem value="week">Available this week</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </section>

      <div className="px-2">
        <p className="text-dark-2">{filteredConsultants?.length} results</p>
      </div>

    
        <section
          ref={scrollRef}
          className="relative space-y-4 overflow-y-auto h-full p-2 scrollbar-hide flex-1"
        >
          {isPending ? (
            <Loader />
          ): (
            <>
              <div className="flex flex-col gap-6">
              {filteredConsultants?.map((consultant) => (
                <ConsultantThumbnail
                  experience={consultant.experience}
                  fee={consultant.fee.in_person + ""}
                  id={consultant.id}
                  location={consultant.location}
                  name={consultant.name}
                  availability={consultant.availability}
                  qualifications={consultant.qualifications}
                  rating={consultant.rating}
                  reviewCount={consultant.reviews}
                  specialty={consultant.specialty}
                  avatarUrl={consultant.image}
                  key={consultant.id}
                  nextSlot={consultant.nextSlot}
                />
              ))}
            </div>
            {filteredConsultants?.length > 0 && (
              <div ref={paginationRef}>
                <PaginationWrapper
                  currentPage={page}
                  isFirstPage={pageNumber === 0}
                  isLastPage={isLast || false}
                  totalPages={totalPages}
                  handleNext={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  handlePage={(pageNumber) => setPage(pageNumber - 1)}
                  handlePrevious={() => setPage((prev) => Math.max(prev - 1, 0))}
                />
              </div>
            )}
            {filteredConsultants?.length > 0 && showFloatingPagination && (
              <PaginationWrapper
                totalPages={totalPages}
                currentPage={page}
                isFirstPage={pageNumber === 0}
                isLastPage={isLast || false}
                handleNext={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                handlePage={(pageNumber) => setPage(pageNumber)}
                handlePrevious={() => setPage((prev) => Math.max(prev - 1, 0))}
                className={`w-fit fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[50]${
                  showFloatingPagination
                    ? "opacity-100 animate-in slide-in-from-bottom-4 fade-in"
                    : "opacity-0 pointer-events-none translate-y-4 "
                }`}
              />
            )}
            {filteredConsultants?.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p>No consultants found matching your criteria.</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            )}
            </>
          )}
          
        </section>
    </div>
  );
};

export default ConsultantList;

