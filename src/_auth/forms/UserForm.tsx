import { Input } from "@/components/ui/input";
import { UserFormProps } from "@/types";
import { CountrySelectorDropdown, PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


export function UserForm({ formData, handleFormDataChange, form }: UserFormProps) {


    return (
        <>
            <div className="flex flex-col gap-3 justify-center">
                <div>
                    <header className="h3-bold text-center">Personal Information</header>
                </div>

                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...form.register("firstName")} value={formData.firstName} onChange={e => handleFormDataChange("firstName", e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...form.register("lastName")} value={formData.lastName} onChange={e => handleFormDataChange("lastName", e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>

                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    {...form.register("phoneNumber")}
                                    defaultCountry={'ng'}
                                    value={formData.phoneNumber}
                                    onChange={e => handleFormDataChange("phoneNumber", e)}
                                    className="flex flex-row h-10 border border-slate-200 rounded-md p-0"
                                    inputClassName="border w-full "
                                    countrySelectorStyleProps={{
                                        className: "bg-white",
                                        dropdownStyleProps: {
                                            className: "rounded-md"
                                        }

                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>

                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                            <Select defaultValue="Male" onValueChange={value => value === 'Male' ? handleFormDataChange('gender', 'Male') : handleFormDataChange('gender', "Female")}>
                        <SelectTrigger>
                            <SelectValue placeholder='Select Your gender' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male" >Male</SelectItem>
                            <SelectItem value="Female" >Female</SelectItem>
                        </SelectContent>
                    </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>

            </div>
        </>
    )
}