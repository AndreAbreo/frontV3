/*"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import { UbicacionModel, ReferrerEnum } from "@/types";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface UbicacionesListProps extends UbicacionModel {
    fetcher: () => void;
}

//const { id } = useParams(); // Extrae el ID de la URL
const UbicacionesList: React.FC<UbicacionesListProps> = (params) => {
    const router = useRouter();
    const { id } = router.query; // ✅ Obtiene el ID de la URL correctamente en Next.js
    const { data: session } = useSession();
    const [ubicacionIdToDelete, setUbicacionIdToDelete] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            setUbicacionIdToDelete(id as string);
        }
    }, [id]);

interface UbicacionesListProps extends UbicacionModel {
    fetcher: () => void;
}

const UbicacionesList: React.FC<UbicacionesListProps> = (params) => {
    const { data: session } = useSession();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const handleDeleteClick = (id: number | null) => {
        setUbicacionIdToDelete(id);
        setShowConfirmModal(true);
    };

    const borrarUbicacion = async () => {
        if (!ubicacionIdToDelete) {
            console.error("ID de ubicación no válido.");
            return;
        }

        try {
            console.log("Intentando obtener la ubicación con ID:", ubicacionIdToDelete);

            const response = await fetch(
                `http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/ubicaciones/buscar?id=${ubicacionIdToDelete}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Bearer " + (session?.user?.accessToken || ""),
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener la ubicación");
            }

            const ubicacion = await response.json();
            ubicacion.estado = ReferrerEnum.INACTIVO;

            console.log("Ubicación obtenida, procediendo a inactivar...");

            const updateResponse = await fetch(
                "http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/ubicaciones/inactivar",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Bearer " + (session?.user?.accessToken || ""),
                    },
                    body: JSON.stringify(ubicacion),
                }
            );

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.error || "Error al inactivar la ubicación");
            }

            console.log("Ubicación inactivada con éxito.");

            params.fetcher();
        } catch (error) {
            console.error("Error al inactivar la ubicación:", error);
        } finally {
            setShowConfirmModal(false);
            setUbicacionIdToDelete(null);
        }
    };


    return (
        <>
            <tr className="border-b text-black bold dark:border-neutral-500 odd:bg-blue-200 dark:odd:bg-slate-700 dark:even:bg-slate-500 dark:odd:text-bodydark2">
                <td className="px-1 py-1">{params.id}</td>
                <td className="px-1 py-1">{params.nombre}</td>
                <td className="px-1 py-1">{params.sector}</td>
                <td className="px-1 py-1">{params.numero}</td>
                <td className="px-1 py-1">{params.piso}</td>
                <td className="px-1 py-1">{params.cama}</td>
                <td className="px-1 py-1">
                    <p className={`inline-flex rounded-full bg-opacity-10 px-1 py-1 text-sm ${
                        params.estado === "ACTIVO"
                            ? "bg-success text-success dark:text-green-400 dark:bg-green-900"
                            : params.estado === "SIN_VALIDAR"
                                ? "bg-danger text-danger"
                                : "bg-warning text-yellow-700 dark:text-yellow-400 dark:bg-yellow-900"
                    }`}>
                        {params.estado === "SIN_VALIDAR"
                            ? "Sin Validar"
                            : params.estado === "INACTIVO"
                                ? "Inactivo"
                                : "Activo"
                        }
                    </p>
                </td>
                <td className="px-1 py-1">
                    <div className="inline-flex">
                        <span
                            className="bg-rose-500 p-1 inline-block ml-1 text-white text-xs rounded cursor-pointer"
                            onClick={() => handleDeleteClick(params.id)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                                <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                            </svg>
                        </span>
                    </div>
                </td>
            </tr>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5">
                        <h2 className="text-xl mb-4">Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar esta ubicación?</p>
                        <div className="mt-4">
                            <button
                                onClick={borrarUbicacion}
                                className="bg-green-500 text-white p-2 rounded mr-4"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-violet-800 text-white p-2 rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UbicacionesList;*/
