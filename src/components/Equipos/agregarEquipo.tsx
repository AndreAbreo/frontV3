"use client";

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {EquipoModel, PaisModel, UbicacionModel} from '@/types';
import { tipoEquipos, marcas, modelos, paises, proveedores, ubicaciones, ReferrerEnum } from '@/types/enums';
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_REST;

const EquiposCreate = () => {
    const router = useRouter();
    const [errors, setErrors] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [nombre, setNombre] = useState<string>("");
    const [tipos, setTipos] = useState<{ id: number, nombre: string }[]>([]);  const [selectedTipo, setSelectedTipo] = useState<number | null>(null);
    const [marcas, setMarca] = useState<{ id: number, nombre: string }[]>([]);  const [selectedMarca, setSelectedMarca] = useState<number | null>(null);
    const [modelos, setModelos] = useState<{ id: number, nombre: string }[]>([]); const [selectedModelo, setSelectedModelo] = useState<number | null>(null);
    const [nroSerie, setNroSerie] = useState<string>("");
    const [garantia, setGarantia] = useState<Date | null>(null);
    const [paises, setPaises] = useState<{ id: number, nombre: string }[]>([]); const [selectedPais, setSelectedPais] = useState<number | null>(null);
    const [proveedores, setProveedores] = useState<{ id: number, nombre: string }[]>([]);  const [selectedProveedor, setSelectedProveedor] = useState<number | null>(null);
    const [instituciones, setInstituciones] = useState<{ id: number, nombre: string }[]>([]);  const [selectedInstitucion, setSelectedInstitucion] = useState<number | null>(null);
    const [fechaAdquisicion, setFechaAdquisicion] = useState<Date | null>(null);
    const [idInterno, setIdInterno] = useState<string>("");
    const [ubicaciones, setUbicaciones] = useState<{ id: number, nombre: string }[]>([]); const [selectedUbicacion, setSelectedUbicacion] = useState<number | null>(null);
    const [imagen, setImagen] = useState<string>("");
    const { data: session, status } = useSession();

    const fetchUbicaciones = async (idInstitucion: number) => {
        if (!idInstitucion) return;

        try {
            const token = session?.user?.accessToken || '';

            const response = await fetch(
                `${API_BASE_URL}/ubicaciones/listarXInstitucion?idInstitucion=${idInstitucion}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Error al obtener las ubicaciones: ${response.status}`);

            const data = await response.json();
            const filteredResult = data.filter((ubi: UbicacionModel) => ubi.estado !== ReferrerEnum.INACTIVO);
            setUbicaciones(filteredResult);
        } catch (error) {
            console.error("Error al cargar las ubicaciones:", error);
        }
    };

    const fetchInstituciones = async () => {
        try {
            const token = session?.user?.accessToken || '';

            const response = await fetch(
                `${API_BASE_URL}/equipovinculaciones/listaInstituciones`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Error al obtener las instituciones: ${response.status}`);

            const data = await response.json();
            setInstituciones(data);
        } catch (error) {
            console.error("Error al cargar las instituciones:", error);
        }
    };

    const fetchPaises = async () => {
        try {
            const token = session?.user?.accessToken || '';

            const response = await fetch(
                `${API_BASE_URL}/paises/listarPaises`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Error al obtener los paises: ${response.status}`);

            const data = await response.json();
            const filteredResult = data.filter((paises: PaisModel) => paises.estado !== "INACTIVO");
            setPaises(filteredResult);
        } catch (error) {
            console.error("Error al cargar los paises:", error);
        }
    };

    const fetchModelos = async (idMarca: number) => {
        if (!idMarca) return;

        try {
            const token = session?.user?.accessToken || '';

            const response = await fetch(
                `${API_BASE_URL}/equipovinculaciones/listaModeloXMarca?idMarca=${idMarca}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Error al obtener modelos: ${response.status}`);

            const data = await response.json();
            setModelos(data);
        } catch (error) {
            console.error("Error al cargar modelos:", error);
        }
    };

    const fetchMarcas = async () => {
        try {
            const token = session?.user?.accessToken || '';

            const response = await fetch(
                `${API_BASE_URL}/equipovinculaciones/listaMarca`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Error al obtener las marcas: ${response.status}`);

            const data = await response.json();
            setMarca(data);
        } catch (error) {
            console.error("Error al cargar las marcas:", error);
        }
    };

    const fetchTipos = async () => {
        try {
            const token = session?.user?.accessToken || '';

            const response = await fetch(
                `${API_BASE_URL}/equipovinculaciones/listaTipoEquipo`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Error al obtener los tipos de equipos: ${response.status}`);

            const data = await response.json();
            setTipos(data);
        } catch (error) {
            console.error("Error al cargar los tipos:", error);
        }
    };

    const fetchProveedores = async () => {
        try {
            const token = session?.user?.accessToken || ''; // Obtiene el token de sesión

            const response = await fetch(
                `${API_BASE_URL}/equipovinculaciones/listaProveedores`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Error al obtener proveedores: ${response.status}`);

            const data = await response.json();
            setProveedores(data);
        } catch (error) {
            console.error("Error al cargar proveedores:", error);
        }
    };

    useEffect(() => {
        fetchProveedores();
        fetchTipos();
        fetchMarcas();
        fetchPaises();
        fetchInstituciones();
    }, []);

    useEffect(() => {
        if (selectedMarca) {
            fetchModelos(selectedMarca);
        }
    }, [selectedMarca]);

    useEffect(() => {
        if (selectedInstitucion) {
            fetchUbicaciones(selectedInstitucion);
        }
    }, [selectedInstitucion]);

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
            return Boolean(data);
        } catch (error) {
            console.error("Error al verificar el ID interno:", error);
            return false;
        }
    };

    const validateForm = async () => {
        setErrors([]);

        const newErrors: string[] = [];
        if (!nombre) newErrors.push("Nombre es obligatorio");
        if (!selectedTipo) newErrors.push("Tipo de equipo es obligatorio");
        if (!selectedMarca) newErrors.push("Marca es obligatoria");
        if (!selectedModelo) newErrors.push("Modelo es obligatorio");
        if (!nroSerie) newErrors.push("Número de serie es obligatorio");
        if (!garantia) newErrors.push("Garantía es obligatoria");
        if (!selectedPais) newErrors.push("País de origen es obligatorio");
        if (!selectedProveedor) newErrors.push("Proveedor es obligatorio");
        if (!fechaAdquisicion) newErrors.push("Fecha de adquisición es obligatoria");
        if (!idInterno) newErrors.push("Identificación interna es obligatoria");
        if (!selectedUbicacion) newErrors.push("Ubicación es obligatoria");
        //if (!imagen) newErrors.push("Imagen es obligatoria");
        if (!selectedInstitucion) newErrors.push("Institución es obligatoria");

        if (selectedModelo === 0) {
            newErrors.push("La marca seleccionada no cuenta con modelos disponibles.");
        }

        if (!imagen && errors.length === 0) {
            newErrors.push("Imagen es obligatoria");
        }

        if (idInterno) {
            const idExists = await checkIdInternoExists(idInterno);
            if (idExists) newErrors.push("El ID interno ya está en uso. Por favor, ingrese otro.");
        }

        // Validar si el Número de Serie ya existe en la base de datos
        if (nroSerie) {
            const nroSerieExists = await checkNroSerieExists(nroSerie);
            if (nroSerieExists) newErrors.push("El Número de Serie ya está en uso. Por favor, ingrese otro.");
        }

        /*if (errors.length > 0) {
            newErrors.push(...errors);
        }*/

        if (newErrors.length > 0) {
            console.warn("Errores detectados:", newErrors);
            setErrors([...newErrors]);
            return false;
        }

        return true;
    };

    const MAX_FILE_SIZE_MB = 2;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.error("No se seleccionó ningún archivo.");
            setErrors(["Debe seleccionar una imagen."]);
            return;
        }

        const file = e.target.files[0];
        const allowedExtensions = ["image/jpeg", "image/png",];

        if (!allowedExtensions.includes(file.type)) {
            console.error("Formato de imagen no permitido. Solo se aceptan JPG y PNG");
            setErrors(["Formato de imagen no permitido. Solo se aceptan JPG y PNG"]);
            setImagen("");
            return;
        }

        // Validar el tamaño del archivo
        if (file.size > MAX_FILE_SIZE_BYTES) {
            console.error(`El archivo es demasiado grande. Máximo permitido: ${MAX_FILE_SIZE_MB}MB.`);
            setErrors([`El archivo es demasiado grande. Máximo permitido: ${MAX_FILE_SIZE_MB}MB.`]);
            setImagen("");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(
                "https://api.imgbb.com/1/upload?key=7c25531eca2149d7618fe5241473b513",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
            }

            const result = await res.json();

            if (result.success) {
                setImagen(result.data.url);
                console.log("Imagen subida con éxito:", result.data.url);
                setErrors([]);
            } else {
                console.error(
                    "Error en la respuesta de imgbb:",
                    result.error?.message || "Error desconocido al subir la imagen"
                );
                setErrors(["Error al subir la imagen. Intente nuevamente."]);
                setImagen("");
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error("Error de red o CORS:", error.message);
                setErrors(["Error de conexión. Verifique su red e intente nuevamente."]);
                setImagen("");
            } else if (error instanceof Error) {
                console.error("Error al subir la imagen:", error.message);
                setErrors(["Error al subir la imagen. Intente nuevamente."]);
                setImagen("");
            } else {
                console.error("Error desconocido:", error);
                setErrors(["Error desconocido al procesar la imagen."]);
                setImagen("");
            }
        }
    };



    const addEquipo = async () => {

        const isValid = await validateForm();
        if (!isValid) {
            console.warn("Formulario inválido. Deteniendo proceso.");
            setShowModal(true);
            return;
        }

        const payload: EquipoModel = {
            id: null,
            idInterno,
            nroSerie,
            garantia: garantia ? garantia.toISOString().split('T')[0] : "",
            idTipo: { id: selectedTipo!, nombreTipo: tipoEquipos.find(tipo => tipo.id === selectedTipo)?.nombreTipo || "" },
            idProveedor: { id: selectedProveedor!, nombre: proveedores.find(proveedor => proveedor.id === selectedProveedor)?.nombre || "" },
            idPais: { id: selectedPais!, nombre: paises.find(pais => pais.id === selectedPais)?.nombre || "" },
            idModelo: {
                id: selectedModelo!,
                nombre: modelos.find(modelo => modelo.id === selectedModelo)?.nombre || "",
                idMarca: { id: selectedMarca!, nombre: marcas.find(marca => marca.id === selectedMarca)?.nombre || "" }
            },
            equiposUbicaciones: [],
            idUbicacion: { id: selectedUbicacion!, nombre: ubicaciones.find(ubicacion => ubicacion.id === selectedUbicacion)?.nombre || "" },
            nombre,
            imagen,
            fechaAdquisicion: fechaAdquisicion ? [
                fechaAdquisicion.getFullYear(),
                fechaAdquisicion.getMonth() + 1,
                fechaAdquisicion.getDate()
            ] : [],
            estado: ReferrerEnum.ACTIVO,
            marca: undefined
        };

        try {
            const response = await fetch(`${API_BASE_URL}/equipos/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + (session?.user?.accessToken || ''),
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            let data = null;
            if(response.status !== 204){
                const responseTXT = await response.text();
                data = responseTXT ? JSON.parse(responseTXT) : null;
            }
            console.log("Equipo creado con éxito:", data || "Sin contenido en la respuesta.");
            router.push('/equipos'); // Redirigir a la lista de equipos tras la creación
        } catch (error: any) {
            console.error("Error en la solicitud:", error);
            setErrors(["Error en la solicitud. Intente nuevamente."]);
            setShowModal(true);
        }
    };

    const handleConfirm = () => {

        setShowConfirmModal(false);
        addEquipo();
    };

    const handleBack = () => {
        router.push('/equipos');
    };

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
                        Bienvenido al ingreso al sistema de gestión de mantenimiento de equipos clínicos hospitalarios.
                    </p>
                </div>
            </div>
            <div className='w-full border-stroke dark:border-strokedark xl:w-3/4 xl:border-l-2'>
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                    <form onSubmit={(e) => e.preventDefault()}>

                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Nombre:</label>
                            <input
                                type='text'
                                name='nombre'
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Tipo de Equipo:</label>
                            <select
                                name='id'
                                value={selectedTipo || ""}
                                onChange={(e) => setSelectedTipo(parseInt(e.target.value, 10))}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value="">Seleccione un tipo</option>
                                {tipos.length > 0 ? (
                                    tipos.map(tipo => (
                                        <option key={tipo.id} value={tipo.id}>{tipo.nombreTipo}</option>
                                    ))
                                ) : (
                                    <option disabled>Cargando tipos...</option>
                                )}
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Marca:</label>
                            <select
                                name='id'
                                value={selectedMarca || ""}
                                onChange={(e) => setSelectedMarca(parseInt(e.target.value, 10))}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value="">Seleccione una Marca</option>
                                {marcas.length > 0 ? (
                                    marcas.map(marca => (
                                        <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                                    ))
                                ) : (
                                    <option disabled>Cargando marcas...</option>
                                )}
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Modelo:</label>
                            <select
                                name='id'
                                value={selectedModelo || ""}
                                onChange={(e) => setSelectedModelo(parseInt(e.target.value, 10))}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value="">Seleccione un modelo</option>
                                {modelos.length > 0 ? (
                                    modelos.map(modelo => (
                                        <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                                    ))
                                ) : (
                                    <option
                                        disabled>{modelos === undefined ? "Error cargando modelos" : "Cargando modelos..."}</option>
                                )}
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Número de Serie:</label>
                            <input
                                type='text'
                                name='nroSerie'
                                value={nroSerie}
                                onChange={(e) => setNroSerie(e.target.value)}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Garantía:</label>
                            <DatePicker
                                selected={garantia}
                                onChange={(date) => setGarantia(date)}
                                dateFormat="yyyy-MM-dd"
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>País:</label>
                            <select
                                name='id'
                                value={selectedPais || ""}
                                onChange={(e) => setSelectedPais(parseInt(e.target.value, 10))}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value="">Seleccione un país</option>
                                {paises.length > 0 ? (
                                    paises.map(pais => (
                                        <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                                    ))
                                ) : (
                                    <option disabled>Cargando paises...</option>
                                )}
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Proveedor:</label>
                            <select
                                name='id'
                                value={selectedProveedor || ""}
                                onChange={(e) => setSelectedProveedor(parseInt(e.target.value, 10))}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value="">Seleccione un proveedor</option>
                                {proveedores.length > 0 ? (
                                    proveedores.map(proveedor => (
                                        <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                                    ))
                                ) : (
                                    <option disabled>Cargando proveedores...</option>
                                )}
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Fecha de
                                Adquisición:</label>
                            <DatePicker
                                selected={fechaAdquisicion}
                                onChange={(date) => setFechaAdquisicion(date)}
                                dateFormat="yyyy-MM-dd"
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>ID Interno:</label>
                            <input
                                type='text'
                                name='idInterno'
                                value={idInterno}
                                onChange={(e) => setIdInterno(e.target.value)}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                        </div>

                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Institución:</label>
                            <select
                                name='id'
                                value={selectedInstitucion || ""}
                                onChange={(e) => setSelectedInstitucion(parseInt(e.target.value, 10))}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value="">Seleccione una institución</option>
                                {instituciones.length > 0 ? (
                                    instituciones.map(institucion => (
                                        <option key={institucion.id} value={institucion.id}>{institucion.nombre}</option>
                                    ))
                                ) : (
                                    <option disabled>Cargando instituciones...</option>
                                )}
                            </select>
                        </div>

                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Ubicación:</label>
                            <select
                                name='id'
                                value={selectedUbicacion || ""}
                                onChange={(e) => setSelectedUbicacion(parseInt(e.target.value, 10))}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            >
                                <option value="">Seleccione una ubicación</option>
                                {ubicaciones.length > 0 ? (
                                    ubicaciones.map(ubicacion => (
                                        <option key={ubicacion.id} value={ubicacion.id}>{ubicacion.nombre}</option>
                                    ))
                                ) : (
                                    <option
                                        disabled>{ubicaciones === undefined ? "Error cargando ubicaciones" : "Cargando ubicaciones..."}</option>
                                )}
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2.5 block font-medium text-sm text-black dark:text-white'>Imagen (jpeg o png):</label>
                            <input
                                type='file'
                                name='imagen'
                                onChange={handleFileChange}
                                className='w-full rounded border-[1.5px] border-stroke bg-gray py-3 px-6 font-medium text-sm placeholder-body focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                            />
                            {imagen && (
                                <div className='mt-2'>
                                    <img src={imagen} alt="Imagen del equipo" className='max-w-full h-auto'/>
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
                                <h2 className='text-xl mb-4'>Confirmar creación</h2>
                                <p>¿Estás seguro de que deseas guardar este equipo?</p>
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

export default EquiposCreate;
