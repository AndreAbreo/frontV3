export enum ReferrerEnum {
    ADMIN = "Admin",
    AUXILIAR_ADMINISTRATIVO = "Auxiliar Administrativo",
    INGENIERO_BIOMEDICO = "Ingeniero Biomédico",
    TECNOLOGO = "Tecnólogo",
    TECNICO = "Técnico",
    ACTIVO = "ACTIVO",
    INACTIVO = "INACTIVO",
    SIN_VALIDAR = "SIN_VALIDAR",
    INSTITUCION = "Código Creativo"
  }
//import { Tipo } from '@/types/emuns'
export const tipoEquipos = [
  { id: 1, nombreTipo: "Anestesiometro" },
  { id: 2, nombreTipo: "Desfribilador" },
  { id: 3, nombreTipo: "Electrocardiógrafo" },
  { id: 4, nombreTipo: "Electroquirurjico" },
  { id: 5, nombreTipo: "Monitor de signos" },
  { id: 6, nombreTipo: "Nebulizador" },
  { id: 7, nombreTipo: "Rayos x" },
];
export const marcas = [
  { id: 1,  nombre: "Welch Allyn" },
  { id: 2,  nombre: "Health o Meter" },
  { id: 3,  nombre: "Draguer" },
  { id: 4,  nombre: "Thomas" },
  { id: 5,  nombre: "Omron" },
  { id: 6,  nombre: "EDAN" },
  { id: 7,  nombre: "Mindray" },
];

export const modelos = [
  { id: 1, nombre: "Kaspery", idMarca: 1 },
  { id: 2, nombre: "Rowback", idMarca: 2 },
  { id: 3, nombre: "700G", idMarca: 3 },
  { id: 4, nombre: "007", idMarca: 4 },
  { id: 5, nombre: "NE-C801", idMarca: 5 },
  { id: 6, nombre: "M50", idMarca: 6 },
  { id: 7, nombre: "SE 301", idMarca: 6 },
  { id: 8, nombre: "BeneHeart D3", idMarca: 7 },
  { id: 9, nombre: "Wato EX 65", idMarca: 7 },
];

export const paises = [
  { id: 1, nombre: "Uruguay" },
  { id: 2, nombre: "Argentina" },
  { id: 3, nombre: "Brasil" },
  { id: 4, nombre: "Chile" },
];

export const proveedores = [
  { id: 1, nombre: "MedicTube" },
  { id: 2, nombre: "MoniVita" },
  { id: 3, nombre: "Desfribilados" },
  { id: 4, nombre: "Anestesic" },
];

export const ubicaciones = [
  { id: 1, nombre: "Odontologia" },
  { id: 2, nombre: "Obstreta" },
  { id: 3, nombre: "Box Rapido" },
  { id: 4, nombre: "Cirugia" },
  { id: 5, nombre: "Limpieza" },
  { id: 6, nombre: "Sala de espera" },
  { id: 7, nombre: "Cuidados intermedios" },
  { id: 8, nombre: "Cuarentena" },
];