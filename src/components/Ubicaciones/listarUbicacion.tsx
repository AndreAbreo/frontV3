"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TableComponent from "@/components/Tables/TableComponent";
import {ReferrerEnum, UbicacionModel, UsuarioModel} from "@/types";
import {signIn, signOut, useSession} from "next-auth/react";
import { PencilSquare, Trash, Eye } from "react-bootstrap-icons";
import {useServerStatus} from "@/context/StatusContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

interface UbicacionListProps extends UbicacionModel {
  fetcher: () => void;
  data: UbicacionModel[];
}

const UbicacionRead: React.FC<UbicacionListProps> = ({ fetcher, data }) => {
    const { data: session, status } = useSession();
    const [filteredUbicaciones, setFilteredUbicaciones] = useState<UbicacionModel[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [ubicacionIdToDelete, setUbicacionIdToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number | null) => {
        if (id) {
            setUbicacionIdToDelete(id);
            setShowConfirmModal(true);
        }
    };

    const borrarUbicacion = async () => {
        if (!ubicacionIdToDelete) return;

        try {
            const ubicacionResponse = await fetch(`${API_BASE_URL}/ubicaciones/buscar?id=${ubicacionIdToDelete}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
            });

            if (!ubicacionResponse.ok) {
                throw new Error(`Error HTTP: ${ubicacionResponse.status}`);
            }


            const ubicacion = await ubicacionResponse.json();
            ubicacion.estado = ReferrerEnum.INACTIVO;

            const response = await fetch(`${API_BASE_URL}/ubicaciones/modificar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
                body: JSON.stringify(ubicacion),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            fetcher(); // Usa la prop correctamente
        } catch (error) {
            console.error('Error al inactivar la ubicación:', error);
        } finally {
            setShowConfirmModal(false);
            setUbicacionIdToDelete(null);
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "sector", label: "Sector" },
        { key: "piso", label: "Piso" },
        { key: "numero", label: "Número" },
        { key: "cama", label: "Cama" },
        { key: "institucion", label: "Institución", render: (row) => row.idInstitucion.nombre },
        {
            key: "estado",
            label: "Estado",
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-sm font-semibold
                    ${row.estado === "ACTIVO" ? "bg-green-100 text-green-600" : ""}
                    ${row.estado === "SIN_VALIDAR" ? "bg-red-100 text-red-600" : ""}
                    ${row.estado === "INACTIVO" ? "bg-gray-100 text-gray-600" : ""}`}>
                    {row.estado}
                </span>
            )
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (row) => (
                <div className="flex justify-center gap-1">
                    <span
                        className='bg-rose-500 p-1 inline-block ml-1 text-white text-xs rounded cursor-pointer'
                        onClick={() => handleDeleteClick(row.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                <path
                    d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
              </svg>
            </span>
                    <Link href={`/ubicacion/edit/${row.id}`} className="bg-yellow-500 p-2 text-white text-xs rounded">
                        <PencilSquare size={14}/>
                    </Link>
                    <Link href={`/ubicacion/readd/${row.id}`} className="bg-blue-500 p-2 text-white text-xs rounded">
                        <Eye size={14}/>
                    </Link>
                </div>
            )
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Listado de Ubicaciones</h2>
            <TableComponent columns={columns} data={data}/>

            {showConfirmModal && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                        <h2 className='text-xl mb-4'>Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar esta ubicación?</p>
                        <div className='mt-4'>
                            <button
                                onClick={borrarUbicacion}
                                className='bg-green-500 text-white p-2 rounded mr-4'
                            >
                                Eliminar
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
    );
};

export default UbicacionRead;