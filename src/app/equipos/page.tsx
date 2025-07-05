import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EquiposRead from "@/components/Equipos/listarEquipos";

export const metadata: Metadata = {
    title: "Listado de equipos",
    description: "Página con equipos registrados en el sistema",
};

const listarEquipos: React.FC = function() {
  return (
    <DefaultLayout>
        <Breadcrumb pageName="Listado de equipos" />
        <EquiposRead />
    </DefaultLayout>
  );
};

export default listarEquipos;