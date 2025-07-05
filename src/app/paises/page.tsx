"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, {useEffect, useState} from "react";
import {signOut, useSession} from "next-auth/react";
import {useServerStatus} from "@/context/StatusContext";
import PaisesRead from '@/components/Pais/listarPais';
import {PaisModel} from "@/types";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const listarPaises: React.FC = function () {
    const [paises, setPaises] = useState([]);
    const { data: session } = useSession();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const { isServerUp, sessionExpired, setSessionExpired } = useServerStatus();


    useEffect(() => {
        if (!isServerUp) {
            setShowConfirmModal(true);
        } else {
            setShowConfirmModal(false);
        }
    }, [isServerUp]);

    const fetchPaises = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/paises/listarPaises`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
            });

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }

            if (res.status === 401) {
                setSessionExpired(true);
                return;
            }

            const result = await res.json();
            //const filteredResult = result.filter((paises: PaisModel) => paises.estado !== "INACTIVO");
            setPaises(result);
        } catch (error) {
            console.error("Error al obtener los paises:", error);
        }
    };

    useEffect(() => {
        fetchPaises();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Listado de paises" />
            <PaisesRead fetcher={fetchPaises} data={paises} />

            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="rounded-md border border-gray-300 bg-white p-5 shadow-lg">
                        <h2 className="text-lg font-bold text-red-600">⚠ Problema de Conexión </h2>
                        <p className="mt-2 text-sm">
                            No podemos acceder a la información en este momento.<br/>
                            Puedes intentar recargar la página o volver más tarde.<br/><br/>
                            Si el problema persiste, contacta con el soporte técnico.
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {sessionExpired && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="rounded-md border border-gray-300 bg-white p-5 shadow-lg">
                        <h2 className="text-lg font-bold text-red-600">⚠ Sesión expirada</h2>
                        <p className="mt-2 text-sm">Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={() => {
                                    sessionStorage.clear();
                                    localStorage.removeItem("token");
                                    setSessionExpired(false);
                                    signOut({ callbackUrl: "/auth/signin" });
                                }}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default listarPaises;