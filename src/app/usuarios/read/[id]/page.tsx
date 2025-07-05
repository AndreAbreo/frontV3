import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UsuarioDetail from "@/components/Usuarios/verUsuario";

export const metadata: Metadata = {
  title: "Detalles del usuario",
  description: "usuario con datos completos",
};


const detalleUsuario: React.FC = function() {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Detalles del usuario" />
      <UsuarioDetail />
    </DefaultLayout>
  );
};

export default detalleUsuario;