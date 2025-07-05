import "react-datepicker/dist/react-datepicker.css";
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Create from '@/components/Equipos/agregarEquipo';
import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Agregar equipo",
  description: "Agregar nuevo equipo",
};

const EquiposCreate = () => {
  
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Agregar equipo" />
        <Create />
      </DefaultLayout>
    );
  }

export default EquiposCreate;