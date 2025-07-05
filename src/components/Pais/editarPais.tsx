"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReferrerEnum } from "@/types";
import {paises} from "@/types/enums";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const ModificarPais = () => {
    const router = useRouter();
    const { id } = useParams();
    const { data: session } = useSession();

    const [nombre, setNombre] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    useEffect(() => {
        if (!id) {
            setError("País no encontrado.");
            setLoading(false);
            return;
        }

        const fetchPais = async () => {
            try {

                const token = session?.user?.accessToken || "";
                if (!token) {
                    setError("No se pudo autenticar al usuario.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${API_BASE_URL}/paises/buscar?id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error al obtener el país: ${response.status}`);
                }

                const data = await response.json();

                if (!data || Object.keys(data).length === 0) {
                    throw new Error("No se encontró el país en la base de datos.");
                }

                setNombre(data.nombre || "");
                setEstado(data.estado || "");
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPais();
    }, [id, session]);

    const handleBack = () => {
        router.push('/paises');
    };

    const modificarPais = async () => {
        try {
            const token = session?.user?.accessToken || "";
            if (!token) {
                setError("No se pudo autenticar al usuario.");
                return;
            }

            const payload = {
                id: id,
                nombre,
                estado: ReferrerEnum.ACTIVO,
            };

            const response = await fetch(
                `${API_BASE_URL}/paises/modificar`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(`Error al modificar el país: ${response.status}`);
            }

            router.push("/paises");
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (loading) return <div>⏳ Cargando datos...</div>;

    if (error) return <div className="text-red-600">⚠ Error: {error}</div>;

    return (
        <div className="flex flex-wrap items-start">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                        <label className="mb-2.5 block">Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded border p-2"
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
                        <select
                            name='estado'
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                        >
                            <option value={ReferrerEnum.ACTIVO}>Activo</option>
                            <option value={ReferrerEnum.INACTIVO}>Inactivo</option>
                        </select>
                    </div>

                    <button type="button" onClick={() => setShowConfirmModal(true)}
                            className="bg-green-500 text-white p-2 rounded">
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
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl mb-4">Confirmar modificación</h2>
                        <p className="mb-6">¿Estás seguro de que deseas modificar este país?</p>
                        <div className="flex justify-between">
                            <button
                                onClick={modificarPais}
                                className="bg-green-500 text-white py-2 px-4 rounded w-24 text-center">
                                Sí
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-blue-500 text-white py-2 px-4 rounded w-24 text-center">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModificarPais;
