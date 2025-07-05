import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UbicacionDetail from "@/components/Ubicaciones/verUbicacion";

export const metadata: Metadata = {
    title: "Detalle de la ubicación",
    description: "Página con el detalle de la ubicación seleccionada",
};

const verUbicacion: React.FC = function() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Detalle de la ubicación seleccionada" />
            <UbicacionDetail />
        </DefaultLayout>
    );
};

export default verUbicacion;