import { FormWrapperProps } from "@/types";

export function FormWrapper({children }: FormWrapperProps) {
    return (
        <div className="w-full h-full sm:rounded-3xl shadow-lg bg-white flex overflow-hidden">
            {children}
        </div>
    )
}