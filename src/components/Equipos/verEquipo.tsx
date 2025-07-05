"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EquipoModel } from '@/types';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const EquipoDetail = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [equipo, setEquipo] = useState<EquipoModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEquipo = async () => {
        const res = await fetch(`${API_BASE_URL}/equipos/BuscarEquipo?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.user?.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setEquipo(result);
        } else {
          console.error("Error al obtener el equipo");
        }
      };
      fetchEquipo();
    }
  }, [id]);
  if (!session) { signIn(); return null; }

  if (!equipo) return <div>...loading</div>;

  return (
    <div className='flex flex-wrap items-start'>
        <div className="hidden w-full xl:block xl:w-1/4">
            <div className="px-6 py-7.5 text-center">
                <Link className="mb-5.5 inline-block" href="/">
                    <Image
                        className="hidden dark:block"
                        src={"/images/logo/LogoCodigo.jpg"}
                        alt="Logo"
                        width={176}
                        height={32}
                    />
                    <Image
                        className="dark:hidden"
                        src={"/images/logo/LogoCodigo.jpg"}
                        alt="Logo"
                        width={176}
                        height={32}
                    />
                </Link>
                <p className="2xl:px-20">
                    Bienvenido al ingreso al sistema de gestion de mantenimiento de equipos clínicos hospitalarios.
                </p>
            </div>
        </div>
        <div className='w-full items-center text-center xl:w-2/4 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
        <div className='w-full p-4 sm:p-12.5 xl:p-7.5'>
          <p><strong>ID:</strong> {equipo.id}</p>
          <p><strong>Nombre:</strong> {equipo.nombre}</p>
          <div className="flex justify-center mb-4">
            <img src={equipo.imagen} alt={equipo.nombre} className="max-w-xs" />
          </div>
            <p><strong>Marca:</strong> {equipo.idModelo.idMarca.nombre}</p>
            <p><strong>Modelo:</strong> {equipo.idModelo.nombre}</p>
            <p><strong>Número de Serie:</strong> {equipo.nroSerie}</p>
            <p><strong>Garantía:</strong> {equipo.garantia}</p>
            <p><strong>País:</strong> {equipo.idPais.nombre}</p>
            <p><strong>Proveedor:</strong> {equipo.idProveedor.nombre}</p>
            <p><strong>Fecha de Adquirido:</strong> {new Date(equipo.fechaAdquisicion).toLocaleDateString()}</p>
            <p><strong>ID Interno:</strong> {equipo.idInterno}</p>
            <p><strong>Ubicación:</strong> {equipo.idUbicacion.nombre} / {equipo.idUbicacion.sector}</p>
            <p><strong>Tipo de Equipo:</strong> {equipo.idTipo.nombreTipo}</p>
            <p><strong>Estado:</strong> {equipo.estado}</p>
        </div>
            <button
                onClick={() => router.push('/equipos')}
                className='mt-4 bg-blue-500 text-white p-2 rounded'>Volver </button>
        </div>
    </div>
    );
}

export default EquipoDetail;