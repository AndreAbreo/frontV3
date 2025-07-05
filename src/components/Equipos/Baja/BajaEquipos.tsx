import React, {useState} from 'react';
import Link from 'next/link';
import { BajaEquipoModel } from '@/types';
import {useSession} from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;


interface BajaEquiposListProps extends BajaEquipoModel {
    fetcher: () => void;
}

const BajaEquiposList: React.FC<BajaEquiposListProps> = (params) => {
    const [showModal, setShowModal] = useState(false);
    const { data: session, status } = useSession();

    const handleActivar = async () => {
        try {
            const token = session?.user?.accessToken || '';

            const res = await fetch(
                `${API_BASE_URL}/equipos/Activar?idEquipo=${params.idEquipo.id}`,
                {
                method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
            });

            if (res.ok) {
                console.log('Equipo activado correctamente');
                params.fetcher(); // recargar la lista
            } else {
                console.error('Error al activar el equipo');
            }
        } catch (err) {
            console.error('Error de red:', err);
        } finally {
            setShowModal(false);
        }
    };

    return (
        <>
        <tr className="text-center border-b dark:border-neutral-500
                   even:bg-white odd:bg-blue-100 dark:even:bg-gray-800 dark:odd:bg-gray-700">

            <td className="px-2 py-2 font-medium text-black dark:text-white">{params.idEquipo.id}</td>
            <td className="px-2 py-2 font-medium text-black dark:text-white">{params.idEquipo.idTipo.nombreTipo}</td>
            <td className="px-2 py-2 font-medium text-black dark:text-white">{new Date(params.fecha).toLocaleDateString()}</td>
            <td className="px-2 py-2 font-medium text-black dark:text-white">{params.idUsuario.email}</td>

            <td className="px-2 py-2">
        <span className={`px-2 py-1 rounded-full text-sm font-semibold
                          ${params.estado === "INACTIVO" ? "bg-rose-200 text-red-600" : ""}`}>
          {params.estado}
        </span>
            </td>

            {/* Botón de acción */}
            <td className="px-2 py-2 font-medium text-black dark:text-white">
                <Link
                    href={`/equipos/baja/${params.id}`}
                    className="bg-blue-500 p-3 i py-1 nline-block ml-3 text-white text-xs rounded cursor-pointer"
                >
                    Detalle
                </Link>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-500 px-3 py-1 text-white text-xs rounded hover:bg-green-600"
                >
                    Activar
                </button>
            </td>
        </tr>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center w-80">
                        <p className="text-black mb-4">¿Estás seguro de que querés volver a activar este equipo?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleActivar}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BajaEquiposList;