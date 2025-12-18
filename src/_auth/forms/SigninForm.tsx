import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInValidation } from "../validations/SignInValidation";
import { useSignInUserMutation } from "@/lib/actions/generalQueriesAndMutation";
import { z } from "zod";
import { Lock, MailIcon } from "lucide-react";
import { toast } from "sonner";
import InputWithIcon from "@/components/shared/InputWithIcon";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/lib/axios";
import Loader from "@/components/shared/Loader";

const SigninForm = () => {
  const navigate = useNavigate();
  const { isPending: isSigningIn, mutateAsync: signInUser } =
    useSignInUserMutation();

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof signInValidation>) => {
    console.log("entered");
    try {
      const { data } = await signInUser({
        email: formData.email,
        password: formData.password,
      });
      if (data && data.userStage === "ONBOARDING") {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        toast.error("You do not have an account please sign up");
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full h-full p-8 flex overflow-auto flex-col justify-center items-center"
    >
      <Form {...form}>
        <div className="flex flex-col justify-center gap-5">
          <header className="mb-5">
            <p className="font-bold text-3xl text-balance text-center">
              Welcome Back
            </p>
            <p className="text-sm text-center text-gray-600 pt-2">
              Lets get you logged in
            </p>
          </header>
          <FormField
            control={form.control}
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <InputWithIcon
                    register={form.register("email")}
                    className="focus:outline-none w-full"
                    icon={<MailIcon className="text-gray-400  h-4 w-4" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="password"
            render={() => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <InputWithIcon
                    register={form.register("password")}
                    type="password"
                    className="focus:outline-none w-full"
                    icon={<Lock className="text-gray-400 h-4 w-4" />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit" className="shad-button_primary">
            {isSigningIn ? <Loader /> : "Sign In"}
          </Button>
        </div>
        <p className="text-sm font-semibold mt-4">
          New to Recommendic?{" "}
          <span className="font-normal">
            <Link
              to={"/sign-up"}
              className="text-dark-1 underline hover:no-underline hover:font-semibold transition-all"
            >
              Create new account
            </Link>
          </span>
        </p>
      </Form>
    </form>
  );
};

export default SigninForm;
