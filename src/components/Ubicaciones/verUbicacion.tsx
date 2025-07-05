"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UbicacionModel } from '@/types';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const UbicacionDetail = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = useParams();
    const [ubicacion, setUbicacion] = useState<UbicacionModel | null>(null);

    useEffect(() => {
        if (id) {
            const fetchUbicacion = async () => {
                const res = await fetch(`${API_BASE_URL}/ubicaciones/buscar?id=${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Bearer " + (session?.user?.accessToken || ''),
                    },
                });
                if (res.ok) {
                    const result = await res.json();
                    setUbicacion(result);
                } else {
                    console.error("Error al obtener la ubicacion");
                }
            };
            fetchUbicacion();
        }
    }, [id]);
    if (!session) { signIn(); return null; }

    if (!ubicacion) return <div>...loading</div>;

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
                        Bienvenido al ingreso al sistema de gestion de mantenimiento de equipos clínicos hospitalarios.
                    </p>
                </div>
            </div>
            <div className='w-full items-center text-center xl:w-2/4 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
                <div className='w-full p-4 sm:p-12.5 xl:p-7.5'>
                    <p><strong>ID:</strong> {ubicacion.id}</p>
                    <p><strong>Nombre:</strong> {ubicacion.nombre}</p>
                    <p><strong>Institución:</strong> {ubicacion.idInstitucion.nombre}</p>
                    <p><strong>Sector:</strong> {ubicacion.sector}</p>
                    <p><strong>Número:</strong> {ubicacion.numero}</p>
                    <p><strong>Piso:</strong> {ubicacion.piso}</p>
                    <p><strong>Cama:</strong> {ubicacion.cama}</p>
                    <p><strong>Estado:</strong> {ubicacion.estado}</p>
                </div>
                <button
                    onClick={() => router.push('/ubicacion')}
                    className='mt-4 bg-blue-500 text-white p-2 rounded'>Volver </button>
            </div>
        </div>
    );
}

export default UbicacionDetail;