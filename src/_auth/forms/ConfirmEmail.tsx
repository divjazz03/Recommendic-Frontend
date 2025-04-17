import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useResendEmailMutation } from "@/lib/react-query/queriiesAndMutation";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"

const ConfirmEmail = () => {

    const { toast } = useToast();
    const location = useLocation();
    const [countDown, setCountDown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const email = location.state?.email
    const { isPending: isResending, mutateAsync: resendEmail, } = useResendEmailMutation();
    useEffect(() => {
        if (countDown > 0) {
            const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countDown])
    const onResendEmailHandler = () => {
        setCanResend(false)
        setCountDown(60);

        const result = resendEmail(email);
        if (!result) {
            return toast({ title: "Failed to resend email, try again", variant: "destructive" })
        }
    }

    return (
        <>
            <main className=" p-8 min-w-96 max-w-[480px] shadow-md rounded-md">
                <header className="text-dark-5 font-bold text-xl text-center py-2">Check your Email</header>
                <p className="text-dark-1 text-center py-2">To verify your identity, you'll receive an email shortly at {email} to activate your account.</p>
                <div className="flex flex-col items-center py-2 px-4">
                    <Button className="shad-button_primary" disabled={!canResend} onClick={onResendEmailHandler}>{isResending ? <Loader /> : canResend ? "Resend Email" : `Resend in ${countDown}`}</Button>
                </div>
                <footer className=" flex flex-col gap-2 items-center text-sm text-dark-1 text-center py-2">
                    <p>Nothing in Sight? Check your spam folder or contact support</p>
                    <Link to={"/sign-in"}><Button className="shad-button_secondary">Sign In</Button></Link>
                </footer>
            </main>
        </>
    )
}

export default ConfirmEmail