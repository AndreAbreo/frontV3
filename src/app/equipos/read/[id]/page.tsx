import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UbicacionDetail from "@/components/Equipos/verEquipo";

export const metadata: Metadata = {
    title: "Detalle del de equipo",
    description: "Página con el detalle del equipo en el sistema",
};

const verEquipo: React.FC = function() {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="Detalle del equipo" />
        <UbicacionDetail />
    </DefaultLayout>
  );
};

export default verEquipo;