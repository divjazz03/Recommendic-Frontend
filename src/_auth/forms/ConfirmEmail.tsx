import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useResendEmailMutation } from "@/lib/actions/generalQueriesAndMutation";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import { toast } from "sonner";

const ConfirmEmail = () => {

    const location = useLocation();
    const [countDown, setCountDown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const email = location.state?.email
    const { isPending: isResending, mutateAsync:resendConfirmationEmail} = useResendEmailMutation();
    useEffect(() => {
        if (countDown > 0) {
            const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countDown])
    const onResendEmailHandler = async () => {
        setCanResend(false)
        setCountDown(60);
        const result = await resendConfirmationEmail(email);
        if (!result) {
            toast.error('couldn\\\'t resend email')
        }
    }

    return (
        <>
            <main className="flex flex-col justify-center p-32 h-full w-full shadow-md rounded-md">
                <header className="text-dark-5 font-bold text-2xl text-center py-2">Check your Email</header>
                <p className="text-dark-1 text-center py-2">To verify your identity, you'll receive an email shortly at {email} to activate your account.</p>
                <div className="flex flex-col items-center py-2 px-4">
                    <Button className="shad-button_primary" disabled={!canResend} onClick={onResendEmailHandler}>{isResending ? <Loader /> : canResend ? "Resend Email" : `Resend in ${countDown}`}</Button>
                </div>
                <footer className=" flex flex-col gap-2 items-center text-sm text-dark-1 text-center py-2">
                    <p className="px-1 py-2 rounded-sm text-xs bg-orange-50 text-orange-500">Nothing in sight? Check your spam folder or contact support</p>
                    <Link to={"/sign-in"}><Button className="shad-button_secondary">Sign In</Button></Link>
                </footer>
            </main>
        </>
    )
}

export default ConfirmEmail