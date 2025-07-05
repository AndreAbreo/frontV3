import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import UbicacionCreate from '@/components/Ubicaciones/crearUbicacion';
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Agregar ubicación",
    description: "Agregar una nueva ubicación",
};

const CrearUbicacion = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar ubicación" />
            <UbicacionCreate />
        </DefaultLayout>
    );
}

export default CrearUbicacion;