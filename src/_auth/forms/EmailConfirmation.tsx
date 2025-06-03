import EmailConfirmSuccessModal from "@/components/EmailConfirmSuccessModal";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useVerifyTokenMutation } from "@/lib/react-query/queriiesAndMutation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";


const EmailConfirmation = () => {
  const [isSuccessfulConfirmation, setSuccessfulConfirmation] = useState<boolean>(false);
  const { token } = useParams()
  const {isPending: isConfirmingEmail, mutateAsync:confirmEmail} = useVerifyTokenMutation();
  const onVerifyEmailHandler = async () => {
    try {
        const result = await confirmEmail(token);
        if (result) {
        setSuccessfulConfirmation(true);
    }
    } catch (error) {
        if (axios.isAxiosError(error)) {
          error as AxiosError;
          return toast({title: `Couldn't confirm email: ${error.message}`});
        }
    }
  }
  return (
    <>
      <main className="shadow p-10 rounded-sm">
        <header className="text-dark-5 h3-bold text-center py-2">Confirm Your Email</header>
        <p className="text-dark-1 text-center py-2">Tap the button below to confirm your email address</p>
        <div className="flex flex-col items-center py-2 px-4">
          <Button className="shad-button_primary w-full" onClick={onVerifyEmailHandler}>{isConfirmingEmail ? <Loader /> : "Confirm Email"}</Button>
        </div>
        <footer className=" flex flex-col gap-2 items-center text-sm text-slate-600 text-center py-2">

        </footer>
      </main>
      <EmailConfirmSuccessModal
        isOpen={isSuccessfulConfirmation} redirectUrl="/sign-in"/>
    </>
  )
}

export default EmailConfirmation