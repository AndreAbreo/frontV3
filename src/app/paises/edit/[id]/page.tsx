import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PaisEdit from "@/components/Pais/editarPais";

export const metadata: Metadata = {
    title: "Editar país",
};

const editarPais: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar ubicaciones" />
            <PaisEdit />
        </DefaultLayout>
    );
};

export default editarPais;