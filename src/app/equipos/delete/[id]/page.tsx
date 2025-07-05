import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DeleteEquipo from "@/components/Equipos/Baja/borrarEquipo";

export const metadata: Metadata = {
  title: "Borrar equipo",
  description: "Borrar equipo",
};

const borrarEquipo = () => {
  
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Borrar equipo" />
        <DeleteEquipo />
      </DefaultLayout>
    );
  }

export default borrarEquipo;