import { useState } from 'react'

interface MultiSelectProps<T> {
    elements: T[],
    selectedElements: T[],
    disabled: boolean,
    handleElementsChange: (elements: T[]) => void,
    labelSelector?: (el: T) => string
    placeholder?: string
}

function MultiSelect<T>({ 
    elements,
    selectedElements,
    disabled,
    handleElementsChange,
    labelSelector = (x) => String(x),
    placeholder
}: MultiSelectProps<T>) {
    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)
    console.log(selectedElements)
    const toggleSelect = (element: T) => {
        if (!selectedElements) return;
        if (selectedElements.includes(element)) {
            handleElementsChange(selectedElements.filter(item => item !== element))
        } else {
            handleElementsChange([...selectedElements, element])
        }
    };

    const filtered = elements ? elements.filter((cat) =>
        labelSelector(cat).includes(search.toLowerCase())
    ): [];

    return (
        <div className="w-full mx-auto">
            {/* Selected preview */}
            <div className="flex flex-wrap gap-2 mb-2">
                { selectedElements.map((cat) => (
                    <span
                        key={labelSelector(cat)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                        {labelSelector(cat)}
                        <button
                            onClick={() => toggleSelect(cat)}
                            className="text-blue-500 hover:text-blue-700 disabled:cursor-not-allowed"
                            disabled={disabled}
                        >
                            ✕
                        </button>
                    </span>
                ))}
            </div>

            {/* Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    disabled={disabled}
                    className="w-full min-h-10 border rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {selectedElements?.length > 0
                        ? `${selectedElements?.length} selected`
                        : placeholder}
                </button>

                {open && !disabled && (
                    <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                        {/* Search bar */}
                        <div className="p-2 border-b">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        {/* Category list */}
                        <ul className="max-h-60 overflow-y-auto">
                            {filtered?.length > 0 ? (
                                filtered?.map((cat) => (
                                    <li
                                        key={labelSelector(cat)}
                                        onClick={() => toggleSelect(cat)}
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedElements?.some((c) => c === cat)
                                                ? "bg-blue-100"
                                                : ""
                                            }`}
                                    >
                                        <div className="font-medium">{labelSelector(cat)}</div>
                                    </li>
                                ))
                            ) : (
                                <li className="p-4 text-gray-500 text-sm">No results found</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MultiSelect