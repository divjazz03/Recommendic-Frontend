import { Card, CardContent} from "@/components/ui/card";
import { FormWrapperProps } from "@/types";

export function FormWrapper({children }: FormWrapperProps) {
    return (
        <div className="w-full h-full rounded-3xl shadow-lg border border-1 flex overflow-hidden">
            {children}
        </div>
    )
}