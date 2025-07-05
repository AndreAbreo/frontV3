"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginLayout from "@/components/Layouts/LoginLayout";

// Función para generar el hash SHA-256
const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

export default function Registrar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        cedula: '',
        fechaNacimiento: '',
        nombre: '',
        apellido: '',
        nombreUsuario: '',
        email: searchParams.get('email') || '',
        contrasenia: '',
        confirmPassword: '',
        idPerfil: 1
    });

    const [errors, setErrors] = useState({});

    const perfilOptions = [
        { type: Number, value: 1, label: 'Administrador' },
        { type: Number, value: 2, label: 'Aux administrativo' },
        { type: Number, value: 3, label: 'Ingeniero biomédico' },
        { type: Number, value: 4, label: 'Tecnico' }
    ];

    useEffect(() => {
        const emailParam = searchParams.get('email') || '';
        const nombreParam = searchParams.get('nombre') || '';
        const apellidoParam = searchParams.get('apellido') || '';

        setFormData(prevState => ({
            ...prevState,
            email: emailParam,
            nombre: nombreParam,
            apellido: apellidoParam
        }));
    }, [searchParams]);

    useEffect(() => {
        if (formData.nombre && formData.apellido) {
            setFormData(prevState => ({
                ...prevState,
                nombreUsuario: `${formData.nombre.toLowerCase()}.${formData.apellido.toLowerCase()}`
            }));
        }
    }, [formData.nombre, formData.apellido]);

    const validate = () => {
        let tempErrors = {
            cedula: '',
            fechaNacimiento: '',
            nombre: '',
            apellido: '',
            nombreUsuario: '',
            email: '',
            contrasenia: '',
            confirmPassword: '',
            idPerfil: ''
        };

        // Validar cédula uruguaya
        function validarCedulaUruguaya(cedula: string): boolean {
            cedula = cedula.replace(/\D/g, '');
            if (cedula.length !== 8) return false;

            const coeficientes = [2, 9, 8, 7, 6, 3, 4];
            let suma = 0;

            for (let i = 0; i < 7; i++) {
                suma += parseInt(cedula[i]) * coeficientes[i];
            }

            const digitoVerificador = (10 - (suma % 10)) % 10;
            return digitoVerificador === parseInt(cedula[7]);
        }

        if (!validarCedulaUruguaya(formData.cedula)) {
            tempErrors.cedula = "Cédula inválida. Verificá que tenga 8 dígitos y sea correcta.";
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Email inválido.";
        }

        // Validar contraseña
        if (formData.contrasenia.length < 8) {
            tempErrors.contrasenia = "La contraseña debe tener al menos 8 caracteres.";
        }

        // Validar confirmación de contraseña
        if (formData.contrasenia !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Las contraseñas no coinciden.";
        }

        // Validar fecha de nacimiento
        if (!formData.fechaNacimiento) {
            tempErrors.fechaNacimiento = "La fecha de nacimiento es requerida.";
        } else {
            const today = new Date();
            const eighteenYearsAgo = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );
            const birthDate = new Date(formData.fechaNacimiento);
            if (birthDate > eighteenYearsAgo) {
                tempErrors.fechaNacimiento = "Debes tener al menos 18 años.";
            }
        }

        setErrors(tempErrors);
        // Comprueba si hay algún error
        return Object.values(tempErrors).every(error => error === '');
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        const newValue = name === 'idPerfil' ? parseInt(value, 10) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        // Hashear la contraseña antes de enviarla
        const hashedPassword = await hashPassword(formData.contrasenia);

        const usuarioDto = {
            ...formData,
            contrasenia: hashedPassword,
            idPerfil: { id: formData.idPerfil },
            idInstitucion: { id: 1 },
        };

        try {
            const res = await fetch('http://localhost:8080/ServidorApp-1.0-SNAPSHOT/api/usuarios/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioDto),
            });

            if (res.ok) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                router.push('/auth/signin');
            } else {
                const errorData = await res.json();
                console.error(errorData);
                alert('Error al registrar usuario.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
        }
    };

    // Calcular la fecha máxima permitida para ser mayor de 18 años
    const today = new Date();
    const maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    ).toISOString().split('T')[0];

    return (
        <LoginLayout>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-center">
                <div className="hidden w-full xl:block xl:w-1/2">
                    <div className="px-26 py-17.5 text-center">
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
                        <span className="mt-15 inline-block">
                            <svg
                                width="350"
                                height="350"
                                viewBox="0 0 350 350"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* SVG content */}
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="w-full xl:w-1/2">
                    <div className="px-12.5 py-17.5 sm:px-25 sm:py-30">
                        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white">
                            Registrarse
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="cedula" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Cédula
                                </label>
                                <input
                                    type="text"
                                    name="cedula"
                                    id="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.cedula ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.cedula && <p className="bg-rose-500 text-neutral-300">{errors.cedula}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="fechaNacimiento" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    name="fechaNacimiento"
                                    id="fechaNacimiento"
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    max={maxDate}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.fechaNacimiento ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.fechaNacimiento && <p className="bg-rose-500 text-neutral-300">{errors.fechaNacimiento}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.nombre ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.nombre && <p className="bg-rose-500 text-neutral-300">{errors.nombre}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellido" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    id="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.apellido ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.apellido && <p className="bg-rose-500 text-neutral-300">{errors.apellido}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="nombreUsuario" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    id="nombreUsuario"
                                    value={formData.nombreUsuario}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.nombreUsuario ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.nombreUsuario && <p className="bg-rose-500 text-neutral-300">{errors.nombreUsuario}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.email ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.email && <p className="bg-rose-500 text-neutral-300">{errors.email}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="contrasenia" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="contrasenia"
                                    id="contrasenia"
                                    value={formData.contrasenia}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.contrasenia ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.contrasenia && <p className="bg-rose-500 text-neutral-300">{errors.contrasenia}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.confirmPassword ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                />
                                {errors.confirmPassword && <p className="bg-rose-500 text-neutral-300">{errors.confirmPassword}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="idPerfil" className="mb-2.5 block font-medium text-black dark:text-white">
                                    Perfil
                                </label>
                                <select
                                    name="idPerfil"
                                    id="idPerfil"
                                    value={formData.idPerfil}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                                        errors.idPerfil ? 'border-rose-500 dark:border-rose-500' : ''
                                    }`}
                                >
                                    {perfilOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.idPerfil && <p className="bg-rose-500 text-neutral-300">{errors.idPerfil}</p>}
                            </div>
                            <div className="mb-5.5">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary p-4 text-white transition hover:bg-opacity-90"
                                >
                                    Registrarse
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-base font-medium text-body-color">
                            ¿Ya tienes una cuenta?
                            <Link href="/auth/signin" className="text-primary hover:underline">
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </LoginLayout>
    );
}
