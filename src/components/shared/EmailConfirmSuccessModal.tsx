import { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from '../ui/alert-dialog'
import { CheckCircle2 } from 'lucide-react';

interface EmailConfirmSuccessProps {
    isOpen: boolean;
    redirectUrl?: string;
    redirectDelay?: number;
    onRedirect?: () => void;
};

const EmailConfirmSuccessModal = ({
    isOpen,
    redirectDelay = 3000,
    redirectUrl = '/overview',
    onRedirect
}: EmailConfirmSuccessProps) => {
    const [redirectCount, setRedirectCount] = useState(Math.ceil(redirectDelay / 1000));
    useEffect(() => {
        if (isOpen) {
            console.log(redirectCount)
            if (redirectCount > 0) {
                const timer = setTimeout(() => setRedirectCount(count => count - 1), 1000);
                console.log(redirectCount);
                return () => clearTimeout(timer);
            } else {
                if (onRedirect) {
                    onRedirect();
                } else {
                    window.location.href = redirectUrl;
                }
            }
        }
    }, [isOpen,redirectCount,redirectUrl])


    return (
        <AlertDialog open={isOpen} >
            <AlertDialogContent className='max-w-md'>
                <AlertDialogHeader>
                    <div className='flex items-center justify-center mb-4'>
                        <CheckCircle2 className='h-12 w-12 text-green-500' />
                    </div>
                    <AlertDialogTitle className='text-center text-xl'>Email Confirmation Successful</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className='text-center'>
                    Your email has been confirmed.
                </AlertDialogDescription>
                <AlertDialogDescription className='text-center'>
                    You will be redirected in {redirectCount} seconds...
                </AlertDialogDescription>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EmailConfirmSuccessModal