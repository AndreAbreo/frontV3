"use client";
import { useEffect, useState } from 'react';
import { BajaEquipoModel, ReferrerEnum } from '@/types';
import BajaEquiposList from '@/components/Equipos/Baja/BajaEquipos';
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const EquiposBaja = () => {
  const [bajaEquipos, setBajaEquipos] = useState<BajaEquipoModel[]>([]);
  const { data: session, status } = useSession();
  
  const fetcher = async () => {
    const res = await fetch(`${API_BASE_URL}/equipos/ListarBajaEquipos`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + (session?.user?.accessToken || ''),
      },
    });
    const result = await res.json();
    setBajaEquipos(result.filter((bajaEquipo: BajaEquipoModel) => bajaEquipo.estado));
  };

  useEffect(() => {
    fetcher().then(() => console.log("Obteniendo equipos de baja"));
  }, []);
  if (!session) {signIn();return null;}
  
  return (
      <div className='rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-center text-sm">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr className='bg-gray-2 text-center dark:bg-meta-4'>
                      <td className="px-2 py-2">ID Equipo</td>
                      <td className='px-2 py-2'>Nombre</td>
                      <td className='px-2 py-2'>Fecha de Baja</td>
                      <td className='px-2 py-2'>Usuario</td>
                      <td className='px-2 py-2'>Razón</td>
                      <td className='px-2 py-2'>Comentarios</td>
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
  );
}

export default EquiposBaja;