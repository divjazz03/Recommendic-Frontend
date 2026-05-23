import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Navigation = ({
  step,
  isOnboarding,
}: {
  isOnboarding: boolean;
  step: number;
}) => (
  <main className="flex justify-between p-6 border-t border-gray-200">
    {step < 4 ? (
      <Button
        type="submit"
        className="px-6 py-2 bg-main-light text-white rounded-lg font-medium hover:bg-main transition-all flex items-center gap-2"
      >
        Next
        <ChevronRight size={20} />
      </Button>
    ) : (
      <Button
        disabled={isOnboarding}
        type="submit"
        className="px-6 py-2 bg-green-600 disabled:cursor-not-allowed text-white rounded-lg font-medium hover:bg-green-700 transition-all"
      >
        {isOnboarding ? "Please wait " : "Submit for Review"}{" "}
        {isOnboarding && <Loader />}
      </Button>
    )}
  </main>
);

export default Navigation;
