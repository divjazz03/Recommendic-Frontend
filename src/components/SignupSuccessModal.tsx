import React, { useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from './ui/alert-dialog'
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

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (isOpen) {
            timeoutId = setTimeout(() => {
                if (onRedirect) {
                    onRedirect();
                } else {
                    window.location.href = redirectUrl;
                }
            }, redirectDelay);
        }

        return () => {
            if (timeoutId){
                clearTimeout(timeoutId);
            }
        };
    }, [isOpen, redirectUrl, redirectDelay, onRedirect])


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