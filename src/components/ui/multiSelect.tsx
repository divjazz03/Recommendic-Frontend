"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "./label"

interface MultiSelectProp {
    label: string,
    value: string
}
interface MultiSelectProps{
    props: MultiSelectProp[] 
}

export function MultiSelect({props}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string[]>([])

    const handleSetValue = (val: string) => {
        if (value.includes(val)) {
            value.splice(value.indexOf(val), 1);
            setValue(value.filter(item => item != val));
        } else {
            setValue(prevValue => [...prevValue, val]);
        }
    }

    return (
        <div className="flex flex-col gap-1 mt-1">
        <Label>Choose Area of Interest</Label>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-auto justify-between">
                    <div className="flex gap-2 justify-start">
                        {
                            value?.length ? value.map((val, i) => (
                                <div key={i} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">
                                    {props?.find((prop) => prop.value === val)?.label}
                                </div>
                            )) : "Select categories of interest"
                        }
                    </div>

                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No such Category</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {
                                props?.map((prop, i) => (
                                    <CommandItem
                                        key={i}
                                        value={prop.value}
                                        onSelect={() => handleSetValue(prop.value)}>
                                        <Check className={cn("mr-2 h-4 w-4",
                                            value.includes(prop.value) ? "opacity-100" : "opacity-0")} />
                                        {prop.label}

                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        </div>
    )
}