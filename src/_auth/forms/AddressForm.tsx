import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddressFormProps } from "@/types";
import { FormWrapper } from "./FormWrapper";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function AddressForm({ formData, handleFormDataChange }: AddressFormProps) {

    return (
        <>
            <FormWrapper title="Sign Up">

                <div>
                    <Label>Zip Code</Label>
                    <Input placeholder='20002' value={formData.zipCode} onChange={e => handleFormDataChange("zipCode", e.target.value)} />
                </div>


                <div>
                    <Label>City</Label>
                    <Input placeholder='Ibadan' value={formData.city} onChange={e => handleFormDataChange("city", e.target.value)} />
                </div>


                <div>
                    <Label>State</Label>
                    <Input placeholder='Oyo' value={formData.state} onChange={e => handleFormDataChange("state", e.target.value)} />
                </div>


                <div>
                    <Label>Country</Label>
                    <Input placeholder='Nigeria' value={formData.country} onChange={e => handleFormDataChange("country", e.target.value)} />
                </div>

            </FormWrapper>
        </>
    )
}