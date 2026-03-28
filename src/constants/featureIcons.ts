import type { IconType } from "react-icons";
import {
  TbHome,
  TbBuildingSkyscraper,
  TbPool,
  TbGardenCart,
  TbDoor,
  TbStairs,
  TbBath,
  TbToolsKitchen2,
  TbParking,
  TbFence,
  TbSofa,
  TbBed,
  TbWifi,
  TbAirConditioning,
  TbFlame,
  TbBolt,
  TbDroplet,
  TbSun,
  TbShieldCheck,
  TbCamera,
  TbMapPin,
  TbTree,
  TbMountain,
  TbBeach,
  TbTruck,
  TbPackage,
  TbCertificate,
  TbStar,
  TbClock,
  TbRuler,
  TbWeight,
  TbPalette,
  TbWheelchair,
  TbElevator,
  TbDog,
} from "react-icons/tb";

export type FeatureIconEntry = {
  id: string;
  label: string;
  icon: IconType;
};

export const FEATURE_ICONS: FeatureIconEntry[] = [
  // ── Vivienda ──
  { id: "TbHome",               label: "Casa",                icon: TbHome },
  { id: "TbBuildingSkyscraper", label: "Edificio",            icon: TbBuildingSkyscraper },
  { id: "TbPool",               label: "Piscina",             icon: TbPool },
  { id: "TbGardenCart",         label: "Jardín",              icon: TbGardenCart },
  { id: "TbDoor",               label: "Puerta",              icon: TbDoor },
  { id: "TbStairs",             label: "Escaleras",           icon: TbStairs },
  { id: "TbBath",               label: "Baño",                icon: TbBath },
  { id: "TbToolsKitchen2",     label: "Cocina",              icon: TbToolsKitchen2 },
  { id: "TbParking",            label: "Estacionamiento",     icon: TbParking },
  { id: "TbFence",              label: "Cerco",               icon: TbFence },
  { id: "TbSofa",               label: "Living",              icon: TbSofa },
  { id: "TbBed",                label: "Dormitorio",          icon: TbBed },

  // ── Servicios / Utilidades ──
  { id: "TbWifi",               label: "WiFi",                icon: TbWifi },
  { id: "TbAirConditioning",    label: "Aire acondicionado",  icon: TbAirConditioning },
  { id: "TbFlame",              label: "Calefacción",         icon: TbFlame },
  { id: "TbBolt",               label: "Electricidad",        icon: TbBolt },
  { id: "TbDroplet",            label: "Agua",                icon: TbDroplet },
  { id: "TbSun",                label: "Luz natural",         icon: TbSun },
  { id: "TbShieldCheck",        label: "Seguridad",           icon: TbShieldCheck },
  { id: "TbCamera",             label: "Cámaras",             icon: TbCamera },

  // ── Ubicación / Entorno ──
  { id: "TbMapPin",             label: "Ubicación",           icon: TbMapPin },
  { id: "TbTree",               label: "Arboleda",            icon: TbTree },
  { id: "TbMountain",           label: "Montaña",             icon: TbMountain },
  { id: "TbBeach",              label: "Playa",               icon: TbBeach },

  // ── Producto / Comercio ──
  { id: "TbTruck",              label: "Envío",               icon: TbTruck },
  { id: "TbPackage",            label: "Empaque",             icon: TbPackage },
  { id: "TbCertificate",        label: "Certificado",         icon: TbCertificate },
  { id: "TbStar",               label: "Destacado",           icon: TbStar },
  { id: "TbClock",              label: "Tiempo",              icon: TbClock },
  { id: "TbRuler",              label: "Dimensiones",         icon: TbRuler },
  { id: "TbWeight",             label: "Peso",                icon: TbWeight },
  { id: "TbPalette",            label: "Colores",             icon: TbPalette },

  // ── Accesibilidad ──
  { id: "TbWheelchair",         label: "Accesibilidad",       icon: TbWheelchair },
  { id: "TbElevator",           label: "Ascensor",            icon: TbElevator },
  { id: "TbDog",                label: "Mascotas",            icon: TbDog },
];

/** Lookup rápido por ID */
const ICON_MAP = new Map(FEATURE_ICONS.map((e) => [e.id, e]));

export function getFeatureIcon(id: string): FeatureIconEntry | undefined {
  return ICON_MAP.get(id);
}
