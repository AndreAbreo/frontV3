"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UbicacionRead from "@/components/Ubicaciones/listarUbicacion";
import {useEffect, useState} from "react";
import {signOut, useSession} from "next-auth/react";
import {useServerStatus} from "@/context/StatusContext";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const listarUbicaciones: React.FC = function () {
    const [ubicaciones, setUbicaciones] = useState([]);
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

    const fetchUbicaciones = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/ubicaciones/listarUbicaciones`, {
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
            //const filteredResult = result.filter((ubicacion) => ubicacion.estado !== "INACTIVO");
            setUbicaciones(result);
        } catch (error) {
            console.error("Error al obtener ubicaciones:", error);
        }
    };

    useEffect(() => {
        fetchUbicaciones();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Listado de ubicaciones" />
            <UbicacionRead fetcher={fetchUbicaciones} data={ubicaciones} />

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

export default listarUbicaciones;