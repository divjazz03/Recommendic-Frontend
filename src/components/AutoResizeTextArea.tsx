import React, { MutableRefObject, useEffect, useRef } from 'react'
import { Textarea } from './ui/textarea'

interface AutoResizeTextAreaProps {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void,
    minHeight?: number,
    maxHeight?: number,
    placeholder?: string,
}

const AutoResizeTextArea: React.FC<AutoResizeTextAreaProps> = ({
    value, onChange, minHeight = 50, maxHeight = 300, placeholder, onKeyDown
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto': 'hidden';

    }, [value, maxHeight])
    
    return (
            <Textarea
                ref={textareaRef}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                value={value}
                style={{
                    width: '320px',
                    minHeight: `${minHeight}px`,
                    maxHeight: `${maxHeight}px`,
                    resize: 'none',
                    overflowY: 'hidden',
                    fontSize: '14px',
                    letterSpacing: '0.025em'
                }}
                className=' pt-4 bg-main text-light-5 rounded-3xl focus-visible:ring-0 focus-visible:ring-offset-0'
            />
    )
}

export default AutoResizeTextArea