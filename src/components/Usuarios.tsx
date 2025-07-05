import React, { useState } from 'react';
import Link from 'next/link';
import { UsuarioModel, ReferrerEnum } from '@/types';
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

interface UsuariosListProps extends UsuarioModel {
    usuariosTelefonos: any;
    fetcher: () => void;
}

const UsuariosList: React.FC<UsuariosListProps> = (params) => {
    const { data: session, status } = useSession();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [usuarioIdToDelete, setUsuarioIdToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number | null) => {
        setUsuarioIdToDelete(id);
        setShowConfirmModal(true);
    };

    const borrarUsuario = async () => {
        if (usuarioIdToDelete === null) return;

        try {
            const usuarioResponse = await fetch(`${API_BASE_URL}/usuarios/BuscarUsuarioPorId?id=${usuarioIdToDelete}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
            });

            if (!usuarioResponse.ok) {
                const errorData = await usuarioResponse.json();
                throw new Error(errorData.error || 'Error al obtener el usuario');
            }



            const usuario = await usuarioResponse.json();
            if (usuario.estado === ReferrerEnum.INACTIVO) {
                alert('El usuario ya se encuentra inactivo. No es necesario eliminarlo nuevamente.');
                return;
            }
            usuario.estado = ReferrerEnum.INACTIVO;

            const response = await fetch(`${API_BASE_URL}/usuarios/modificar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
                body: JSON.stringify(usuario),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el usuario');
            }

            if (!session) { signIn(); return null; }

            params.fetcher();
        } catch (error) {
            console.error('Error al borrar usuario:', error);
        } finally {
            setShowConfirmModal(false);
            setUsuarioIdToDelete(null);
        }
    };

    return (
        <>
            <tr className="border-b text-black bold dark:border-neutral-500 odd:bg-blue-200 dark:odd:bg-slate-700 dark:even:bg-slate-500 dark:odd:text-bodydark2">
                <td className='px-1 py-1'>{params.id}</td>
                <td className='px-1 py-1'>{params.nombre}</td>
                <td className='px-1 py-1'>{params.apellido}</td>
                <td className='px-1 py-1'>{params.cedula}</td>
                <td className='px-1 py-1'>{new Date(params.fechaNacimiento).toLocaleDateString()}</td>
                <td className="px-1 py-1">
                    {params.usuariosTelefonos ? (
                        params.usuariosTelefonos.map((telefono: { numero: any; }) => telefono.numero).join(', ')
                    ) : ''}
                </td>
                <td className='px-1 py-1'>{params.email}</td>
                <td className='px-1 py-1'>{params.nombreUsuario}</td>
                <td className="px-1 py-1">{params.idPerfil?.nombrePerfil}</td>
                <td className='px-1 py-1'>
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

                <td className='px-1 py-1'>
                    <div className="inline-flex">
                        {(() => {
                            const currentUserId = session?.user?.id;
                            const currentUserPerfilId = session?.user?.idPerfil;
                            const targetUserPerfilId = params.idPerfil?.id;

                            const puedeEliminar = (
                                params.id !== currentUserId &&
                                (
                                    currentUserPerfilId === 1 ||
                                    (currentUserPerfilId === 2 && targetUserPerfilId === 4)
                                )
                            );

                            const puedeEditar = params.id !== currentUserId;

                            return (
                                <>
                                    {/* Botón Eliminar */}
                                    <span
                                        className={`p-1 inline-block ml-1 text-xs rounded ${
                                            puedeEliminar ? 'bg-rose-500 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        onClick={() => puedeEliminar && handleDeleteClick(params.id)}
                                    >
                {/* Ícono de eliminar */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                     <path
                         d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                </svg>
            </span>

                                    {/* Botón Editar */}
                                    <span
                                        className={`p-1 inline-block ml-1 text-xs rounded ${
                                            puedeEditar ? 'bg-yellow-500 text-black cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                {puedeEditar ? (
                    <Link href={`/usuarios/edit/${params.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30">
                            <path
                                d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
                        </svg>
                    </Link>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30">
                        <path
                            d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
                    </svg>
                )}
            </span>

                                    {/* Botón Ver */}
                                    <span
                                        className='bg-blue-500 p-1 inline-block ml-1 text-black text-xs rounded cursor-pointer'>
                <Link href={`/usuarios/read/${params.id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path
                            d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z"></path>
                    </svg>
                </Link>
            </span>
                                </>
                            );
                        })()}


                    </div>
                </td>
            </tr>

            {showConfirmModal && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
                        <h2 className='text-xl mb-4'>Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                        <div className='mt-4'>
                            <button
                                onClick={borrarUsuario}
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
        </>
    );
}

export default UsuariosList;
