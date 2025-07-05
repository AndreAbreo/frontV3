"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BajaEquipoModel } from '@/types';
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const BajaEquipoDetail = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [bajaEquipo, setBajaEquipo] = useState<BajaEquipoModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBajaEquipo = async () => {
        const res = await fetch(`${API_BASE_URL}/equipos/VerEquipoInactivo?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.user?.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setBajaEquipo(result);
        } else {
          console.error("Error al obtener el equipo");
        }
      };
      fetchBajaEquipo();
    }
  }, [id, session?.user?.accessToken]);
  
  if (!session) {signIn();return null;}
  if (!bajaEquipo) return <div>...loading</div>;

  return (
      <div className='w-full items-center text-center xl:w-2/4 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <h1 className='text-2xl font-bold mb-4 text-black dark:text-white'>Detalles del Equipo</h1>
        <div className='w-full p-4 sm:p-12.5 xl:p-7.5'>
          <p><strong>ID Equipo:</strong> {bajaEquipo.idEquipo.id}</p>
          <p><strong>Nombre:</strong> {bajaEquipo.idEquipo.idTipo.nombreTipo}</p>
          <p><strong>Fecha de Baja:</strong> {new Date(bajaEquipo.fecha).toLocaleDateString()}</p>
          <p><strong>Usuario:</strong> {bajaEquipo.idUsuario.email}</p>
          <p><strong>Razón:</strong> {bajaEquipo.razon}</p>
          <p><strong>Comentarios:</strong> {bajaEquipo.comentarios}</p>
          <p><strong>Estado:</strong> {bajaEquipo.estado}</p>
        </div>
        <button
          onClick={() => router.push('/equipos/baja')}
          className='m-2 bg-blue-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>  
  );
}

export default BajaEquipoDetail;