import React, { useCallback, useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from '../ui/alert-dialog'
import { CheckCircle2 } from 'lucide-react';

interface SignupSuccessModalProps {
    isOpen: boolean;
    redirectUrl?: string;
    redirectDelay?: number;
    onRedirect?: () => void;
};

const SignupSuccessModal: React.FC<SignupSuccessModalProps> = ({
    isOpen,
    redirectUrl = '/sign-in',
    redirectDelay = 10000,
    onRedirect
}) => {
    const [redirectCount, setRedirectCount] = useState(Math.ceil(redirectDelay/1000));
    const callbackOnredirect = useCallback(() => onRedirect, []);
    useEffect(() => {
        if (isOpen) {
            if(redirectCount > 0){
                const timeout = setTimeout(() => setRedirectCount(count => count - 1), 1000);
                return () => clearTimeout(timeout);
            } else {
                if (onRedirect) {
                    callbackOnredirect();
                } else {
                    window.location.href = redirectUrl;
                }
            }
        }

    }, [isOpen,redirectCount,callbackOnredirect])


    return (
        <AlertDialog open={isOpen} >
            <AlertDialogContent className='max-w-md'>
                <AlertDialogHeader>
                    <div className='flex items-center justify-center mb-4'>
                        <CheckCircle2 className='h-12 w-12 text-green-500'/>
                    </div>
                    <AlertDialogTitle className='text-center text-xl'>Signup Successful</AlertDialogTitle>
                    <AlertDialogDescription className='text-center'>
                        <p className='mt-2'>Your account has been created successfully.</p>
                        <p className='mt-2'>You have been sent a confirmation email</p>
                        <p className='mt-4 text-sm text-dark-5'>
                            You will be redirected in {Math.ceil(redirectDelay/1000)} seconds...
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SignupSuccessModal