"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from 'next/navigation';
import LoginLayout from "@/components/Layouts/LoginLayout";

interface Props {
  callbackUrl?: string;
  error?: string;
}

const Ingresar = ({ callbackUrl, error }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [usarLdap, setUsarLdap] = useState(true);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setErrorMessage(errorParam);
    }
    if (searchParams.get('callbackUrl') === "http://localhost:3000/usuarios/create") {
      setErrorMessage(null);
    } else if (searchParams.get('callbackUrl')) {
      setErrorMessage("Debes iniciar sesión para acceder a esta página");
    }
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoginSuccess(null);

    const usuario = e.currentTarget["usuario"].value;
    const password = e.currentTarget["password"].value;
    const res = await signIn("credentials", {
      usuario,
      password,
      usarLdap: usarLdap.toString(),
      redirect: false,
      callbackUrl: callbackUrl ?? "/",
    });

    if (res?.error) {
      console.error("Error:", res.error);
      setErrorMessage(res.error);
    } else {
      setLoginSuccess(usarLdap ? "Validado por Active Directory" : "Validado por Base de Datos");
      setTimeout(() => {
        window.location.href = callbackUrl ?? "/";
      }, 1000);
    }
  };

  if (session) {
    redirect("/equipos");
  }

  return (
    <LoginLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {errorMessage && (
          <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114L7.64539 6.50351L12.2589 1.91221C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418L6.49234 5.34931L1.89459 0.740581C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z" fill="#ffffff" stroke="#ffffff" />
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 font-semibold text-[#B45454]">Oops! Ocurrió un problema</h5>
              <ul>
                <li className="leading-relaxed text-[#CD5D5D]">{errorMessage}</li>
              </ul>
            </div>
          </div>
        )}
         {loginSuccess && (
          <div className="w-full bg-green-100 border-l-6 border-green-500 text-green-800 p-5 mb-5">
            ✅ {loginSuccess}
          </div>
        )}
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" href="/">
                <Image className="hidden dark:block" src="/images/logo/LogoCodigo.jpg" alt="Logo" width={176} height={32} />
                <Image className="dark:hidden" src="/images/logo/LogoCodigo.jpg" alt="Logo" width={176} height={32} />
              </Link>
              <p className="2xl:px-20">Bienvenido al ingreso al sistema de gestión de mantenimiento de equipos clínicos hospitalarios.</p>
            </div>
          </div>
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block text-title-xxl">Inicio de sesión</span>
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
                  <div className="relative">
                    <input type="email" name="usuario" placeholder="correo@dominio.com" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-sm text-black dark:text-white">Contraseña</label>
                  <div className="relative">
                    <input type="password" name="password" placeholder="Ingresa tu contraseña" className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <label>
                    <input type="checkbox" checked={usarLdap} onChange={() => setUsarLdap(!usarLdap)} name="usarLdap" /> Usar Active Directory
                  </label>
                </div>
                <div className="mb-5">
                  <input type="submit" value="Ingresar" className="w-full cursor-pointer rounded border border-primary bg-primary p-3 font-medium text-white transition hover:bg-opacity-90" />
                </div>
              </form>
              <button onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/" })} className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                <span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0)">
                      <path d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217" fill="#4285F4" />
                      <path d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999" fill="#34A853" />
                      <path d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z" fill="#FBBC05" />
                      <path d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z" fill="#EB4335" />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Ingresar con Google
              </button>
              <div className="relative mb-5.5 flex items-center justify-center text-center">
                <span className="dark:bg-boxdark bg-white px-4 text-base text-body dark:text-bodydark">O</span>
                <span className="dark:border-strokedark absolute left-0 top-1/2 block h-[1px] w-full -translate-y-1/2 transform bg-stroke"></span>
              </div>
              <p className="text-center text-sm text-black dark:text-white">
                No tienes cuenta? {" "}
                <Link href="/auth/signup" className="text-primary">
                  Registrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default Ingresar;


