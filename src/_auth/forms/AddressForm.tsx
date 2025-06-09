import { Input } from "@/components/ui/input";
import { AddressFormProps } from "@/types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function AddressForm({ formData, handleFormDataChange, form }: AddressFormProps) {

    return (
        <>
            <div className="flex gap-3 flex-col">
                <div>
                    <header className="h3-bold text-center"> Address Information</header>
                </div>

                {/* <div>
                    <Label>City</Label>
                    <Input placeholder='Ibadan' value={formData.city} onChange={e => handleFormDataChange("city", e.target.value)} />
                </div> */}
                <FormField
                    control={form.control}
                    name="city"
                    render={() => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input {...form.register("city")} placeholder='Ibadan' value={formData.city} onChange={e => handleFormDataChange("city", e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>


                {/* <div>
                    <Label>State</Label>
                    <Input placeholder='Oyo' value={formData.state} onChange={e => handleFormDataChange("state", e.target.value)} />
                </div> */}
                <FormField
                    control={form.control}
                    name="state"
                    render={() => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input {...form.register("state")} placeholder='Oyo' value={formData.state} onChange={e => handleFormDataChange("state", e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>


                {/* <div>
                    <Label>Country</Label>
                    <Input placeholder='Nigeria' value={formData.country} onChange={e => handleFormDataChange("country", e.target.value)} />
                </div> */}
                <FormField
                    control={form.control}
                    name="country"
                    render={() => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                            <Input {...form.register("country")} placeholder='Nigeria' value={formData.country} onChange={e => handleFormDataChange("country", e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                </FormField>

            </div>
        </>
    )
}