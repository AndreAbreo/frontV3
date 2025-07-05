import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import PaisCreate from '@/components/Pais/crearPais';
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Agregar país",
    description: "Agregar un nuevo país",
};

const CrearPais = () => {

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar país" />
            <PaisCreate />
        </DefaultLayout>
    );
}

export default CrearPais;