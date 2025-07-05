"use client";

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {PaisModel, ReferrerEnum, UbicacionModel} from '@/types';

import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;


const CrearPais = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const [nombre, setNombre] = useState<string>("");
    const { data: session, status } = useSession();

    const validateForm = async () => {
        const newErrors: string[] = [];
        if (!nombre) newErrors.push("Nombre es obligatorio");

        const normalizedNombre = nombre.trim();
        const existePais = await checkPais(normalizedNombre);
        if (existePais) newErrors.push("El país ingresado ya existe.");

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const checkPais = async (nombre: string): Promise<boolean> => {
        try {
            const token = session?.user?.accessToken || '';
            const response = await fetch(`${API_BASE_URL}/paises/existePais?nombre=${encodeURIComponent(nombre.trim())}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`Error al verificar el país: ${response.status}`);

            const data = await response.json();
            return Boolean(data);
        } catch (error) {
            return false;
        }
    };


    const addPais = async () => {
        const isValid = await validateForm();
        if (isValid) {
            const payload: PaisModel = {
               id:null,
               nombre,
               estado: ReferrerEnum.ACTIVO,
            };

            const add = await fetch(`${API_BASE_URL}/paises/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
                body: JSON.stringify(payload),
            });

            if (add.ok) {
                router.push("/paises");
            } else {
                const result = await add.json();
                console.error('Error al crear el país:', result);
            }
        } else {
            setShowModal(true);
        }
    };

    const handleConfirm = () => {
        setShowConfirmModal(false);
        addPais();
    };

    const handleBack = () => {
        router.push('/paises');
    };

    if (!session) {signIn();return null;}

    return (
        <div className='flex flex-wrap items-start'>
            <div className="hidden w-full xl:block xl:w-1/4">
                <div className="px-6 py-7.5 text-center">
                    <Link className="mb-5.5 inline-block" href="/">
                        <Image
                            className="hidden dark:block"
                            src={"/images/logo/LogoCodigo.jpg"}
                            alt="Logo"
                            width={176}
                            height={32}
                        />
                        <Image
                            className="dark:hidden"
                            src={"/images/logo/LogoCodigo.jpg"}
                            alt="Logo"
                            width={176}
                            height={32}
                        />
                    </Link>
                    <p className="2xl:px-20">
                        Bienvenido al ingreso al sistema de gestión de mantenimiento de equipos clínicos hospitalarios.
                    </p>
                </div>
            </div>
            <div className='w-full border-stroke dark:border-strokedark xl:w-3/4 xl:border-l-2'>
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                    <form onSubmit={(e) => e.preventDefault()}>

                        <div className='mb-4'>
                            <label
                                className='mb-2.5 block font-medium text-sm text-black dark:text-white'>País:</label>
                            <input
                                type='text'
                                name='nombre'
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>

                        {errors.length > 0 && (
                            <div className='bg-rose-200 p-2 mb-4'>
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index} className='text-rose-700'>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            type='button'
                            onClick={() => setShowConfirmModal(true)}
                            className='bg-green-500 text-white p-2 rounded'
                        >
                            Guardar
                        </button>
                        <button
                            type='button'
                            onClick={handleBack}
                            className='mt-4 ml-4 bg-gray-500 text-white bg-violet-800 p-2 rounded'
                        >
                            Volver
                        </button>
                    </form>

                    {showModal && (
                        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                            <div
                                className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                                <h2 className='text-xl mb-4'>Errores en el formulario</h2>
                                <ul className='list-disc list-inside'>
                                    {errors.map((error, index) => (
                                        <li key={index} className='text-rose-600'>{error}</li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className='mt-4 bg-violet-800 text-white p-2 rounded'
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}

                    {showConfirmModal && (
                        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                                <h2 className='text-xl mb-4'>Confirmar creación</h2>
                                <p>¿Estás seguro de que deseas guardar este país?</p>
                                <div className='mt-4'>
                                    <button
                                        onClick={handleConfirm}
                                        className='bg-green-500 text-white p-2 rounded mr-4'
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className='bg-violet-800 text-white p-2 rounded'
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CrearPais;