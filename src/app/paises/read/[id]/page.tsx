import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PaisDetail from "@/components/Pais/verPais";

export const metadata: Metadata = {
    title: "Detalle del país",
    description: "Página con el detalle del país seleccionado",
};

const verPais: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalle de la ubicación seleccionada" />
            <PaisDetail />
        </DefaultLayout>
    );
};

export default verPais;