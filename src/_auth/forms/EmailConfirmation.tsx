import EmailConfirmSuccessModal from "@/components/EmailConfirmSuccessModal";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useverifyEmailMutation } from "@/lib/react-query/queriiesAndMutation";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";


const EmailConfirmation = () => {
  const [isSuccessfulConfirmation, setSuccessfulConfirmation] = useState<boolean>(false);
  const { token } = useParams()
  const { isPending: isConfirmingEmail, mutateAsync: verifyEmail, } = useverifyEmailMutation();
  const onVerifyEmailHandler = () => {
    //const result = verifyEmail(token);
    setSuccessfulConfirmation(true)

  }
  return (
    <>
      <main>
        <header className="text-primary-600 h3-bold text-center py-2">Confirm Your Email</header>
        <p className="text-dark-1 text-center py-2">Tap the button below to confirm your email address</p>
        <div className="flex flex-col items-center py-2 px-4">
          <Button className="shad-button_primary w-full" onClick={onVerifyEmailHandler}>{isConfirmingEmail ? <Loader /> : "Confirm Email"}</Button>
        </div>
        <footer className=" flex flex-col gap-2 items-center text-sm text-slate-600 text-center py-2">

        </footer>
      </main>
      <EmailConfirmSuccessModal
        isOpen={isSuccessfulConfirmation}
      />
    </>
  )
}

export default EmailConfirmation