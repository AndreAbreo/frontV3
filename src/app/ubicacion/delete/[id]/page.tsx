import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UbicacionesList from "@/components/Ubicaciones/bajaUbicaciones";

export const metadata: Metadata = {
    title: "Borrar ubicación",
    description: "Borrar ubicación",
};

const borrarUbicacion = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Borrar ubicación" />
            <UbicacionesList />
        </DefaultLayout>
    );
}

export default borrarUbicacion;