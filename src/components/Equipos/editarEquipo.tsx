"use client"; // Asegúrate de incluir esto
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {EquipoModel, ReferrerEnum} from '@/types';
import { tipoEquipos, marcas, modelos, paises, proveedores, ubicaciones } from '@/types/enums';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const EditEquipo = () => {
  const router = useRouter();
  const { id } = useParams();
  const [originalEquipo, setOriginalEquipo] = useState<EquipoModel | null>(null);
  const [equipo, setEquipo] = useState<EquipoModel | null>(null);
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const { data: session, status } = useSession();

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
          setOriginalEquipo(result);
          setSelectedMarca(result.idModelo?.idMarca?.id || null);
        } else {
          console.error("Error al obtener el equipo");
        }
      };
      fetchEquipo();
    }
  }, [id]);
  if (!session) { signIn(); return null; }

  const checkNroSerieExists = async (nroSerie: string): Promise<boolean> => {
    try {
      const token = session?.user?.accessToken || '';
      const response = await fetch(`${API_BASE_URL}/equipos/existeNroSerie?nroSerie=${nroSerie}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error al verificar Número de Serie: ${response.status}`);

      const data = await response.json();
      return Boolean(data); // Suponiendo que la API devuelve { exists: true } si ya está en uso
    } catch (error) {
      console.error("Error al verificar el Número de Serie:", error);
      return false;
    }
  };

  const checkIdInternoExists = async (idInterno: string): Promise<boolean> => {
    try {
      const token = session?.user?.accessToken || '';
      const response = await fetch(`${API_BASE_URL}/equipos/existeIdInterno?idInterno=${idInterno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error al verificar ID interno: ${response.status}`);

      const data = await response.json();
      return Boolean(data); // Suponiendo que la API devuelve { exists: true } si el ID ya está en uso
    } catch (error) {
      console.error("Error al verificar el ID interno:", error);
      return false;
    }
  };

  const validateForm = async () => {
    const newErrors: string[] = [];

    if (!equipo?.nombre) newErrors.push("Nombre es obligatorio");
    if (!equipo?.idTipo?.id) newErrors.push("Tipo de equipo es obligatorio");
    if (!selectedMarca) newErrors.push("Marca es obligatoria");
    if (!equipo?.idModelo?.id) newErrors.push("Modelo es obligatorio");
    if (!equipo?.nroSerie) newErrors.push("Número de serie es obligatorio");
    if (!equipo?.idPais?.id) newErrors.push("País de origen es obligatorio");
    if (!equipo?.idProveedor?.id) newErrors.push("Proveedor es obligatorio");
    if (!equipo?.fechaAdquisicion) newErrors.push("Fecha de adquisición es obligatoria");
    if (!equipo?.garantia) newErrors.push("Garantía es obligatoria");
    if (!equipo?.idInterno) newErrors.push("Identificación interna es obligatoria");
    if (!equipo?.idUbicacion?.id) newErrors.push("Ubicación es obligatoria");

    // Validación de imagen
    if (!equipo?.imagen || equipo.imagen.trim() === "") {
      newErrors.push("Debe seleccionar una imagen.");
    } else {
      const formatoImg = ["jpg", "jpeg", "png"];
      const extension = equipo.imagen.split('.').pop()?.toLowerCase();
      if (!formatoImg.includes(extension || "")) {
        newErrors.push("Formato de imagen no permitido. Solo se aceptan JPG y PNG.");
      }
    }

    // Validaciones asincrónicas
    if (equipo?.idInterno && equipo.idInterno !== originalEquipo?.idInterno) {
      const exists = await checkIdInternoExists(equipo.idInterno);
      if (exists) newErrors.push("El ID interno ya está en uso.");
    }

    if (equipo?.nroSerie && equipo.nroSerie !== originalEquipo?.nroSerie) {
      const exists = await checkNroSerieExists(equipo.nroSerie);
      if (exists) newErrors.push("El número de serie ya está en uso.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setShowModal(true); // ✅ mostrar modal si hay errores
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (equipo) {
      const { name, value } = e.target;
      setEquipo({ ...equipo, [name]: value });
    }
  };

   const handleNestedChange = (e: React.ChangeEvent<HTMLSelectElement>, category: string) => {
    if (equipo) {
      const { name, value } = e.target;
      setEquipo({
        ...equipo,
        [category]: {
          ...equipo[category],
          id: parseInt(value, 10),
        },
      });
    }
  };

  const handleMarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedMarca(parseInt(value, 10));
    if (equipo) {
      setEquipo({
        ...equipo,
        idModelo: { ...equipo.idModelo, idMarca: { ...equipo.idModelo.idMarca, id: parseInt(value, 10) }, id: 0 },
      });
    }
  };

  const MAX_FILE_SIZE_MB = 2; // Tamaño máximo en MB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convertimos a bytes


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      const allowedExtensions = ["image/jpeg", "image/png",];

      if (!allowedExtensions.includes(file.type)) {
        console.error("Formato de imagen no permitido. Solo se aceptan JPG y PNG");
        setErrors(prevErrors => [...prevErrors, "Formato de imagen no permitido. Solo se aceptan JPG y PNG"]);
        setEquipo(prevEquipo => ({ ...prevEquipo, imagen: "" }));
        return;
      }

      // Validar el tamaño del archivo
      if (file.size > MAX_FILE_SIZE_BYTES) {
        console.error(`El archivo es demasiado grande. Máximo permitido: ${MAX_FILE_SIZE_MB}MB.`);
        setErrors(prevErrors => [...prevErrors, `El archivo es demasiado grande. Máximo permitido: ${MAX_FILE_SIZE_MB}MB.`]);
        setEquipo(prevEquipo => ({ ...prevEquipo, imagen: "" }));
        return;
      }

      formData.append('image', file);

      try {
        const res = await fetch('https://api.imgbb.com/1/upload?key=7c25531eca2149d7618fe5241473b513', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();
        if (result.success) {
          setEquipo(prevEquipo => ({ ...prevEquipo, imagen: result.data.url }));
          setErrors([]);
        } else {
          console.error(
              "Error en la respuesta de imgbb:",
              result.error?.message || "Error desconocido al subir la imagen"
          );
          setErrors(prevErrors => [...prevErrors, "Error al subir la imagen. Intente nuevamente."]);
          setEquipo(prevEquipo => ({ ...prevEquipo, imagen: "" }));
        }
      } catch (error) {
        if (error instanceof TypeError) {
          console.error("Error de red o CORS:", error.message);
          setErrors(prevErrors => [...prevErrors, "Error de conexión. Verifique su red e intente nuevamente."]);
          setEquipo(prevEquipo => ({ ...prevEquipo, imagen: "" }));

        } else if (error instanceof Error) {
          console.error("Error al subir la imagen:", error.message);
          setErrors(prevErrors => [...prevErrors, "Error al subir la imagen. Intente nuevamente."]);
          setEquipo(prevEquipo => ({ ...prevEquipo, imagen: "" }));
        } else {
          console.error("Error desconocido:", error);
          setErrors(prevErrors => [...prevErrors, "Error desconocido al procesar la imagen."]);
          setEquipo(prevEquipo => ({ ...prevEquipo, imagen: "" }));
        }
      }
    }
  };

  const handleSubmit = async () => {
    setErrors([]);

    const isValid = await validateForm();
    if(!isValid){
      console.warn("Errores detectados en el formulario")
      return;
    }

      const payload = {
        ...equipo,
        fechaAdquisicion: equipo.fechaAdquisicion ? [
          new Date(equipo.fechaAdquisicion).getFullYear(),
          new Date(equipo.fechaAdquisicion).getMonth() + 1,
          new Date(equipo.fechaAdquisicion).getDate()
        ] : null,
        garantia: equipo.garantia ? new Date(equipo.garantia).toISOString().split('T')[0] : null,
      };

    try {
      const res = await fetch(`${API_BASE_URL}/equipos/modificar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + (session?.user?.accessToken || ''),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push('/equipos');
      } else {
        console.error("Error al actualizar el equipo");
      }
    }catch (error){
      console.error("Error en la solicitud:", error);
      setErrors(["Error de conexión con el servidor."]);
      setShowModal(true);
    }

  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    handleSubmit();
  };

  const handleBack = () => {
    router.push('/equipos');
  };

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
        <div className='w-full border-stroke dark:border-strokedark xl:w-3/4 xl:border-l-2'>
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h1 className='mb-1.5 block text-2xl font-extrabold'>Editar Equipo</h1>
            <form onSubmit={(e) => e.preventDefault()}>

              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Nombre:</label>
                <input
                    type='text'
                    name='nombre'
                    value={equipo.nombre}
                    onChange={handleChange}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Tipo de Equipo:</label>
                <select
                    name='id'
                    value={equipo.idTipo.id}
                    onChange={(e) => handleNestedChange(e, 'idTipo')}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value="">Seleccione un tipo de equipo</option>
                  {tipoEquipos.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombreTipo}</option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Marca:</label>
                <select
                    name='id'
                    value={selectedMarca || ""}
                    onChange={handleMarcaChange}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value="">Seleccione una marca</option>
                  {marcas.map(marca => (
                      <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Modelo:</label>
                <select
                    name='id'
                    value={equipo.idModelo.id}
                    onChange={(e) => handleNestedChange(e, 'idModelo')}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value="">Seleccione un modelo</option>
                  {modelos.filter(modelo => modelo.idMarca === selectedMarca).map(modelo => (
                      <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Número de Serie:</label>
                <input
                    type='text'
                    name='nroSerie'
                    value={equipo.nroSerie}
                    onChange={handleChange}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Garantía:</label>
                <input
                    type='date'
                    name='garantia'
                    value={equipo.garantia ? new Date(equipo.garantia).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>País:</label>
                <select
                    name='id'
                    value={equipo.idPais.id}
                    onChange={(e) => handleNestedChange(e, 'idPais')}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value="">Seleccione un país</option>
                  {paises.map(pais => (
                      <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Proveedor:</label>
                <select
                    name='id'
                    value={equipo.idProveedor.id}
                    onChange={(e) => handleNestedChange(e, 'idProveedor')}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map(proveedor => (
                      <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Fecha de
                  Adquisición:</label>
                <input
                    type='date'
                    name='fechaAdquisicion'
                    value={new Date(equipo.fechaAdquisicion).toISOString().split('T')[0]}
                    onChange={handleChange}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>ID Interno:</label>
                <input
                    type='text'
                    name='idInterno'
                    value={equipo.idInterno}
                    onChange={handleChange}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Ubicación:</label>
                <select
                    name='id'
                    value={equipo.idUbicacion.id}
                    onChange={(e) => handleNestedChange(e, 'idUbicacion')}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                >
                  <option value="">Seleccione una ubicación</option>
                  {ubicaciones.map(ubicacion => (
                      <option key={ubicacion.id} value={ubicacion.id}>{ubicacion.nombre}</option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Imagen:</label>
                <input
                    type='file'
                    name='imagen'
                    onChange={handleFileChange}
                    className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                />
                {equipo.imagen && (
                    <div className='mt-2'>
                      <img src={equipo.imagen} alt="Imagen del equipo" className='max-w-full h-auto'/>
                    </div>
                )}
              </div>

              {errors.length > 0 && (
                  <div className='bg-rose-200 p-2 mb-4'>
                    <ul>
                      {errors.map((error, index) => (
                          <li key={index} className='text-rose-700'>{error}</li>
                      ))}
                    </ul>
                  </div>
              )}
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

            {showModal && errors.length > 0 && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
                  <div
                      className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-5'>
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
        </div>
      </div>
  );
}

export default EditEquipo;
