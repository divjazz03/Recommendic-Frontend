import EmailConfirmSuccessModal from "@/components/EmailConfirmSuccessModal";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useVerifyTokenMutation } from "@/lib/react-query/generalQueriesAndMutation";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";


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
          const err = error as AxiosError;
          return toast({title: `Couldn't confirm email: ${err.message}`});
        }
    }
  }
  return (
    <>
      <main className="shadow p-10 rounded-sm">
        <header>
          <h1 className="text-dark-3 text-xl font-semibold text-center py-2">Confirm Your Email</h1>
        </header>
        <p className="text-dark-1 text-sm text-center py-2">Tap the button below to confirm your email address</p>
        <div className="flex flex-col items-center py-2 px-4">
          <Button className="shad-button_primary w-full" onClick={onVerifyEmailHandler}>{isConfirmingEmail ? <Loader /> : "Confirm Email"}</Button>
        </div>
      </main>
      <EmailConfirmSuccessModal
        isOpen={isSuccessfulConfirmation} redirectUrl="/sign-in"/>
    </>
  )
}

export default EmailConfirmation