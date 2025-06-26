export interface SignosVitales {
  id_signos_vitales: number;
  fecha_toma: Date;
  temperatura: number | null;
  presion_arterial_sistolica: number | null;
  presion_arterial_diastolica: number | null;
  frecuencia_cardiaca: number | null;
  frecuencia_respiratoria: number | null;
  saturacion_oxigeno: number | null;
  glucosa: number | null;
  peso: number | null;
  talla: number | null;
  imc: number | null;
  observaciones: string | null;
  id_documento: number;
  id_expediente: number;
  id_internamiento: number | null;
  registrado_por: string;
  especialidad_medico: string;
  temperatura_anormal: boolean;
  presion_anormal: boolean;
  fc_anormal: boolean;
  saturacion_anormal: boolean;
}

// src/types/interfaces/SignosVitales.interface.ts
export interface GraficoSignosVitales {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  borderDash?: number[];
}


