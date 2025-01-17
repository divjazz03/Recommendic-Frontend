import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormWrapperProps } from "@/types";

export function FormWrapper({ title, children }: FormWrapperProps) {
    return (
        <>

            <Card className="relative">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </>
    )
}