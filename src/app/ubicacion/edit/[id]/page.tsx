import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UbicacionesEdit from "@/components/Ubicaciones/editarUbicacion";

export const metadata: Metadata = {
    title: "Editar ubicaciones",
    description: "Editar ubicaciones",
};

const editarUbicaciones: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar ubicaciones" />
            <UbicacionesEdit />
        </DefaultLayout>
    );
};

export default editarUbicaciones;