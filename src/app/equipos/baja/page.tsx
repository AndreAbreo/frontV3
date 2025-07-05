"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BajaEquipoModel, ReferrerEnum } from '@/types';
import BajaEquiposList from "@/components/Equipos/Baja/BajaEquipos";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Tipo, Marca, Modelo, Pais, Proveedor, Ubicacion } from '@/types/enums';
import {signIn, signOut, useSession} from 'next-auth/react';
import {useServerStatus} from "@/context/StatusContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const EquiposBaja = () => {
  const [bajaEquipos, setBajaEquipos] = useState<BajaEquipoModel[]>([]);
  const { data: session, status } = useSession();
  const { isServerUp, sessionExpired, setSessionExpired } = useServerStatus();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);


  useEffect(() => {
    if (!isServerUp) {
      setShowConfirmModal(true);
    } else {
      setShowConfirmModal(false);
    }
  }, [isServerUp]);

  const fetcher = async () => {

    const res = await fetch(`${API_BASE_URL}/equipos/ListarBajaEquipos`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + (session?.user?.accessToken || ''),
      },
    });

    if (res.status === 401) {
      setSessionExpired(true);
      return;
    }

    const result = await res.json();
    setBajaEquipos(result.filter((bajaEquipo: BajaEquipoModel) => bajaEquipo.estado));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo equipos de baja"));
  }, []);
  if (!session) {signIn();return null;}
  
  return (
    <DefaultLayout>
      <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
      <h4 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Equipos Inactivos
      </h4>
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-center text-sm">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr className='bg-gray-2 text-center dark:bg-meta-4'>
                      <td className="px-2 py-2">ID</td>
                      <td className='px-2 py-2'>Nombre</td>
                      <td className='px-2 py-2'>Fecha de Baja</td>
                      <td className='px-2 py-2'>Usuario</td>
                      <td className='px-2 py-2'>Estado</td>
                      <td className='px-4 py-4 font-medium text-black dark:text-white'>Acciones</td>
                    </tr>
                  </thead>
                  <tbody className='bg-white items-center text-xs'>
                    {bajaEquipos.map((item: BajaEquipoModel) => (
                      <BajaEquiposList 
                        key={item.id}
                        {...item}
                        fetcher={fetcher} // Pasar la función fetcher para recargar los equipos
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
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
}

export default EquiposBaja;