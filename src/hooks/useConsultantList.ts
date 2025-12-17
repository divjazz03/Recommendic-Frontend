import { useGetSupportedMedicalCategories } from "@/lib/actions/generalQueriesAndMutation";
import { useGetRecommendedConsultants } from "@/lib/actions/patientQueryAndMutations";
import { ConsultantTypeMinimal } from "@/types";
import { useEffect, useMemo, useState } from "react";

const useConsultantList = () => {

  const {data:medicalCategoriesResponse} = useGetSupportedMedicalCategories();
  const specialties = medicalCategoriesResponse?.data || []
  const [showFilters, setShowFilter] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [consultants, setConsultants] = useState<ConsultantTypeMinimal[]>([]);
  const [page, setPage] = useState(0);
  const {
    data: recommendedConsultants,
    isPending,
    isError,
    error,
    isPlaceholderData,
  } = useGetRecommendedConsultants(page);
  const totalPages = recommendedConsultants?.data.totalPages;
  const isLast = recommendedConsultants?.data.last
  const pageNumber = recommendedConsultants?.data.pageNumber
  const empty = recommendedConsultants?.data.empty

  useEffect(() => {
    recommendedConsultants &&
      setConsultants(recommendedConsultants.data.content);
  }, [recommendedConsultants]);

  const filteredConsultants = useMemo(() => {
    return consultants.filter((consultant) => {
      const matchedSearch =
        consultant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        consultant.specialty.toLowerCase().includes(searchValue.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "all" ||
        consultant.specialty === selectedSpecialty;
      const matchesRating =
        selectedRating === "all" ||
        consultant.rating >= parseFloat(selectedRating);
      const matchesAvailability =
        selectedAvailability === "all" ||
        (selectedAvailability === "today" &&
          consultant.availability.includes("Today")) ||
        (selectedAvailability === "tomorrow" &&
          consultant.availability.includes("Tomorrow")) ||
        (selectedAvailability === "week" &&
          consultant.availability.includes("Week"));
      return (
        matchedSearch &&
        matchesAvailability &&
        matchesRating &&
        matchesSpecialty
      );
    });
  }, [
    searchValue,
    selectedSpecialty,
    selectedRating,
    selectedAvailability,
    consultants,
  ]);

  return {
    filteredConsultants,
    showFilters,
    setSearchValue,
    setSelectedAvailability,
    setSelectedRating,
    setSelectedSpecialty,
    isPending,
    page,
    setPage,
    totalPages,
    isLast,
    pageNumber,
    empty,
    specialties,
    setShowFilter
  };
};

export default useConsultantList;
