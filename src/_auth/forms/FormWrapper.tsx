import { Card, CardContent} from "@/components/ui/card";
import { FormWrapperProps } from "@/types";

export function FormWrapper({children }: FormWrapperProps) {
    return (
        <>

            <Card className="border-none bg-light-5 shadow-md flex flex-col max-w-96 min-w-96 p-10">
                <CardContent>{children}</CardContent>
            </Card>
        </>
    )
}