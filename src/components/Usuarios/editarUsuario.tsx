"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UsuarioModel, ReferrerEnum } from '@/types';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const EditUsuario = () => {
  const router = useRouter();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!id || status !== "authenticated") return;

    const fetchUsuario = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/usuarios/BuscarUsuarioPorId?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + session?.user?.accessToken,
          },
        });

        if (!res.ok) throw new Error("Error al obtener el usuario");

        const result = await res.json();
        delete result.contrasenia;

        setUsuario({
          ...result,
          usuariosTelefonos: Array.isArray(result.usuariosTelefonos)
              ? result.usuariosTelefonos
              : Array.isArray(result.usuariosTelefono)
                  ? result.usuariosTelefono
                  : [],
        });
      } catch (err) {
        console.error("❌ Error al obtener el usuario:", err);
      }
    };

    fetchUsuario();
  }, [id, session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (usuario) {
      const { name, value } = e.target;
      if (name === 'idPerfil.id') {
        setUsuario({
          ...usuario,
          idPerfil: {
            ...usuario.idPerfil,
            id: parseInt(value, 10),
          },
        });
      } else {
        setUsuario({ ...usuario, [name]: value });
      }
    }
  };

  const handleTelefonoChange = (index: number, value: string) => {
    if (usuario && Array.isArray(usuario.usuariosTelefonos)) {
      const newTelefonos = [...usuario.usuariosTelefonos];
      newTelefonos[index].numero = value;
      setUsuario({ ...usuario, usuariosTelefonos: newTelefonos });
    }
  };

  const handleAddTelefono = () => {
    setUsuario(prev => {
      if (!prev) return prev;

      const telefonos = Array.isArray(prev.usuariosTelefonos)
          ? [...prev.usuariosTelefonos]
          : [];

      return {
        ...prev,
        usuariosTelefonos: [...telefonos, { id: 0, numero: '' }],
      };
    });
  };

  const handleRemoveTelefono = async (index: number, telefonoId: number) => {
    if (!usuario || !Array.isArray(usuario.usuariosTelefonos)) return;

    // Teléfono nuevo (aún no guardado en backend)
    if (telefonoId === 0) {
      const nuevos = [...usuario.usuariosTelefonos];
      nuevos.splice(index, 1);
      setUsuario({ ...usuario, usuariosTelefonos: nuevos });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/telefonos/eliminarTelefono/${telefonoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.user?.accessToken || ""),
        },
      });

      if (!res.ok) throw new Error("Error al eliminar teléfono");

      const actualizados = usuario.usuariosTelefonos.filter((t, i) => t.id !== telefonoId);
      setUsuario({ ...usuario, usuariosTelefonos: actualizados });
      console.log(`✅ Teléfono con id ${telefonoId} eliminado`);
    } catch (err) {
      console.error("❌ No se pudo eliminar el teléfono:", err);
      setErrors(prev => [...prev, "No se pudo eliminar uno de los teléfonos."]);
      setShowModal(true);
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!usuario?.nombre) newErrors.push("Nombre es obligatorio");
    if (!usuario?.apellido) newErrors.push("Apellido es obligatorio");
    if (!usuario?.cedula) newErrors.push("Cédula es obligatoria");
    if (!usuario?.fechaNacimiento) newErrors.push("Fecha de nacimiento es obligatoria");
    if (!usuario?.email) newErrors.push("Email es obligatorio");
    if (usuario?.email && !/\S+@\S+\.\S+/.test(usuario.email)) newErrors.push("Formato de email no válido");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (usuario && validateForm()) {
      // Clonar el objeto para no modificar el estado original
      const payload = JSON.parse(JSON.stringify(usuario)); // Clon profundo
      if (payload.hasOwnProperty('contrasenia')) {
        delete payload.contrasenia;
      }


      payload.fechaNacimiento = usuario.fechaNacimiento
          ? [
            new Date(usuario.fechaNacimiento).getFullYear(),
            new Date(usuario.fechaNacimiento).getMonth() + 1,
            new Date(usuario.fechaNacimiento).getDate()
          ]
          : null;


      const res = await fetch(`${API_BASE_URL}/usuarios/modificar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.user?.accessToken || ''),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/usuarios');
      } else {
        const result = await res.json();
        if (result.error && result.error.includes("Correo electrónico ya registrado")) {
          setErrors([result.error]);
          setShowModal(true);
        }
      }
    } else {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  const handleBack = () => {
    router.push('/usuarios');
  };

  if (!usuario) return <div>...loading</div>;
  if (!session) {signIn();return null;}

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
        <div className='w-full border-stroke dark:border-strokedark xl:w-3/4 xl:border-l-2'>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <form onSubmit={(e) => e.preventDefault()}>
              {errors.length > 0 && (
                <div className='bg-rose-200 p-2 mb-4'>
                  <ul>
                    {errors.map((error, index) => (
                      <li key={index} className='text-rose-700'>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Nombre:</label>
                <input
                  type='text'
                  name='nombre'
                  value={usuario.nombre}
                  onChange={handleChange}
                  className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Apellido:</label>
                <input
                  type='text'
                  name='apellido'
                  value={usuario.apellido}
                  onChange={handleChange}
                  className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Cédula:</label>
                <input
                  type='text'
                  name='cedula'
                  value={usuario.cedula}
                  onChange={handleChange}
                  className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Fecha de Nacimiento:</label>
                <input
                  type='date'
                  name='fechaNacimiento'
                  value={new Date(usuario.fechaNacimiento).toISOString().split('T')[0]}
                  onChange={handleChange}
                  className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Teléfonos:</label>
                {Array.isArray(usuario.usuariosTelefonos) && usuario.usuariosTelefonos.map((tel, index) => (
                  <div key={index} className='mb-2 flex items-center'>
                    <input
                      type='text'
                      name={`usuariosTelefonos_${index}`}
                      value={tel.numero}
                      onChange={(e) => handleTelefonoChange(index, e.target.value)}
                      className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveTelefono(index, tel.id)}
                      className='ml-2 text-red-600'
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={handleAddTelefono}
                  className='bg-blue-500 text-white py-2 px-4 rounded'
                >
                  Agregar Teléfono
                </button>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Email:</label>
                <input
                  type='email'
                  name='email'
                  value={usuario.email}
                  onChange={handleChange}
                  className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Tipo de Usuario:</label>
                <select
                  name='idPerfil.id'
                  value={usuario.idPerfil.id}
                  onChange={handleChange}
                  className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value="">Seleccione un tipo de usuario</option>
                  <option value={1}>Admin</option>
                  <option value={2}>Auxiliar Administrativo</option>
                  <option value={4}>Técnico</option>
                </select>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Estado:</label>
                <select
                  name='estado'
                  value={usuario.estado}
                  onChange={handleChange}
                  className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value={ReferrerEnum.ACTIVO}>Activo</option>
                  <option value={ReferrerEnum.INACTIVO}>Inactivo</option>
                  <option value={ReferrerEnum.SIN_VALIDAR}>Sin validar</option>
                </select>
              </div>
              <button
                type='button'
                onClick={() => setShowConfirmModal(true)}
                className='bg-green-500 text-white p-2 rounded'
              >
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
        </div>
        {showModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
              <h2 className='text-xl mb-4'>Errores en el formulario</h2>
              <ul className='list-disc list-inside'>
                {errors.map((error, index) => (
                  <li key={index} className='text-rose-600'>{error}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowModal(false)}
                className='mt-4 bg-violet-800 text-white p-2 rounded'
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
        {showConfirmModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
              <h2 className='text-xl mb-4'>Confirmar cambios</h2>
              <p>¿Estás seguro de que deseas guardar los cambios?</p>
              <div className='mt-4'>
                <button
                  onClick={handleConfirm}
                  className='bg-green-500 text-white p-2 rounded mr-4'
                >
                  Aceptar
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
}

export default EditUsuario;