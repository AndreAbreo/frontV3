"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TableComponent from "@/components/Tables/TableComponent";
import { EquipoModel, ReferrerEnum } from "@/types";
import {signIn, signOut, useSession} from "next-auth/react";
import { PencilSquare, Trash, Eye } from "react-bootstrap-icons";
import {useServerStatus} from "@/context/StatusContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const EquiposRead = () => {
    const { data: session, status } = useSession();
    const [filteredEquipos, setFilteredEquipos] = useState<EquipoModel[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const { isServerUp, sessionExpired, setSessionExpired } = useServerStatus();

    useEffect(() => {
        if (session) {
            fetcher();
        } else {
            signIn();
        }
    }, [session]);

    useEffect(() => {
        if (!isServerUp) {
            setShowConfirmModal(true);
        } else {
            setShowConfirmModal(false);
        }
    }, [isServerUp]);

    const fetcher = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/equipos/ListarTodosLosEquipos`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + (session?.user?.accessToken || ""),
                },
            });

            if (res.status === 401) {
                setSessionExpired(true);
                return;
            }

            const result = await res.json();

            const filteredResult = result.filter((equipo: EquipoModel) => equipo.estado !== ReferrerEnum.INACTIVO);
            setFilteredEquipos(filteredResult);
        } catch (error) {
            console.error("Error al obtener equipos:", error);
            setShowConfirmModal(true);
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "idTipo", label: "Tipo", render: (row) => row.idTipo.nombreTipo },
        {
            key: "marca_modelo",
            label: "Marca / Modelo",
            render: (row) => `${row.idModelo.idMarca.nombre} - ${row.idModelo.nombre}`
        },
        { key: "nroSerie", label: "Número de Serie" },
        { key: "garantia", label: "Garantía" },
        { key: "idPais", label: "País", render: (row) => row.idPais.nombre },
        { key: "idProveedor", label: "Proveedor", render: (row) => row.idProveedor.nombre },
        {
            key: "fechaAdquisicion",
            label: "Fecha de Adquirido",
            render: (row) => new Date(row.fechaAdquisicion).toLocaleDateString()
        },
        { key: "idInterno", label: "ID Interno" },
        {
            key: "idUbicacion",
            label: "Ubicación",
            render: (row) => `${row.idUbicacion.nombre} / ${row.idUbicacion.sector}`
        },
        {
            key: "imagen",
            label: "Imagen",
            render: (row) => <img src={row.imagen} height={50} width={50} alt="Equipo" />
        },
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
                    <Link href={`/equipos/delete/${row.id}`} className="bg-rose-500 p-2 text-white text-xs rounded">
                        <Trash size={14} />
                    </Link>
                    <Link href={`/equipos/edit/${row.id}`} className="bg-yellow-500 p-2 text-white text-xs rounded">
                        <PencilSquare size={14} />
                    </Link>
                    <Link href={`/equipos/read/${row.id}`} className="bg-blue-500 p-2 text-white text-xs rounded">
                        <Eye size={14} />
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div>
            <h4 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Lista de Equipos
            </h4>

            <TableComponent columns={columns} data={filteredEquipos} />
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
        </div>
    );
};

export default EquiposRead;