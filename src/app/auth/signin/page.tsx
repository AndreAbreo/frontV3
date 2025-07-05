import React from "react";
import { Metadata } from "next";
import Ingresar from "@/components/Usuarios/Login/Ingresar";

export const metadata: Metadata = {
  title: "Ingreso al sistema",
  description: "Página de ingreso al sistema",
};


const SignIn: React.FC = function() {

  return (
      <Ingresar />
  );
};

export default SignIn;