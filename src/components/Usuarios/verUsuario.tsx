"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams, redirect } from 'next/navigation';
import { UsuarioModel } from '@/types';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const UsuarioDetail = () => {
  const { data: session, status } = useSession();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!session) {signIn();}
  
  const router = useRouter();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUsuario = async () => {
        const res = await fetch(`${API_BASE_URL}/usuarios/BuscarUsuarioPorId?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + (session?.user?.accessToken || ''),
          },
        });
        if (res.ok) {
          const result = await res.json();
          setUsuario(result);
        } else {
          console.error("Error al obtener el usuario");
        }
      };
      fetchUsuario();
    }
  }, [id]);

  if (!usuario) return <div>...loading</div>;

  return (
      <div className="flex flex-wrap items-start">
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
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellido:</strong> {usuario.apellido}</p>
          <p><strong>Cédula:</strong> {usuario.cedula}</p>
          <p><strong>Fecha de Nacimiento:</strong> {new Date(usuario.fechaNacimiento).toLocaleDateString()}</p>
          <p><strong>Teléfonos:</strong> {usuario.usuariosTelefonos ? (usuario.usuariosTelefonos.map((telefono) => telefono.numero).join(', ')) : ''}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Nombre de Usuario:</strong> {usuario.nombreUsuario}</p>
          <p><strong>Tipo de Usuario:</strong> {usuario.idPerfil.nombrePerfil}</p>
          <p><strong>Estado:</strong> {usuario.estado}</p>
        </div>
        <button
          onClick={() => router.push('/usuarios')}
          className='mt-4 bg-blue-500 text-white p-2 rounded'
        >
          Volver
        </button>
      </div>
      </div>




  );
}

export default UsuarioDetail;
