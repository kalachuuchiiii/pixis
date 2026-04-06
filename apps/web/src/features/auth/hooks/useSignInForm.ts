import { signInFormSchema, type SignInForm } from "@pixis/schemas"
import { useMemo, useState, type FormEvent } from "react"
import { useAuth } from "./useAuth"


export const useSignInForm = () => {
    const [form, setForm] = useState<SignInForm>({
        username: '',
        password: ''
    })
    const { signIn, isSigningIn } = useAuth();

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signIn(form);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


    const formError = useMemo(( ) => signInFormSchema.safeParse(form).error, [form]);
    const isValid = useMemo(() => !formError, [formError]);

    return {
        handleSubmit,
        handleChange,
        formError,
        isValid,
        form,
        isSigningIn
    }

}