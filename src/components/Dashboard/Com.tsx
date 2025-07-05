"use client"
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from 'next/navigation';
import { Router, useRouter } from "next/router";
import LoginLayout from "@/components/Layouts/LoginLayout";

type Props = {
    callbackUrl?: string;
    error?: string;
};

const Com = ({ callbackUrl, error }: Props) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();


    useEffect(() => {
        // Lee el parámetro de error de la URL y establece el mensaje de error
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setErrorMessage(errorParam);
        }
        //TODO: Revisar linea siguiente, cuando la callback sea el mismo login no debe aaprecer error
        if (searchParams.get('callbackUrl') && "http%3A%2F%2Flocalhost%3A3000%2Fusuarios") {
            setErrorMessage("Debes iniciar sesión para acceder a esta página");
        }
    }, [searchParams]);



    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null); // Reset error message

        const usuario = e.currentTarget["usuario"].value;
        const password = e.currentTarget["password"].value;

        const res = await signIn("credentials", {
            usuario,
            password,
            redirect: false,
            callbackUrl: callbackUrl ?? "/",
        });
        if (res?.error) {
            console.error("Error:", res.error);
            setErrorMessage(res.error);
        } else {
            window.location.href = callbackUrl ?? "/";
        }
    };
    //si hay sesion redirige a la pagina principal
    if (session) {
        redirect("/");
    }

    return (
        <LoginLayout>
           PRESENTACION
        </LoginLayout>
    );
};

export default Com;


