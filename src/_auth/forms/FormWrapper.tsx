import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormWrapperProps } from "@/types";

export function FormWrapper({children }: FormWrapperProps) {
    return (
        <>

            <Card className="border-none bg-light-4 backdrop:blur-sm flex flex-col p-10">
                <CardContent>{children}</CardContent>
            </Card>
        </>
    )
}