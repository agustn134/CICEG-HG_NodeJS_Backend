"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schemas = {
    PersonalMedico: {
        type: 'object',
        properties: {
            id_personal_medico: {
                type: 'integer',
                description: 'ID único del personal médico'
            },
            id_persona: {
                type: 'integer',
                description: 'ID de la persona asociada'
            },
            numero_cedula: {
                type: 'string',
                description: 'Número de cédula del personal médico'
            },
            especialidad: {
                type: 'string',
                description: 'Especialidad del personal médico'
            },
            cargo: {
                type: 'string',
                description: 'Cargo del personal médico'
            },
            departamento: {
                type: 'string',
                description: 'Departamento donde trabaja el personal médico'
            },
            activo: {
                type: 'boolean',
                description: 'Indica si el personal médico está activo'
            },
            foto: {
                type: 'string',
                nullable: true,
                description: 'URL o ruta de la foto del personal médico'
            }
        }
    },
    Paciente: {
        type: 'object',
        properties: {
            id_paciente: {
                type: 'integer',
                description: 'ID único del paciente'
            },
            id_persona: {
                type: 'integer',
                description: 'ID de la persona asociada'
            },
            alergias: {
                type: 'string',
                description: 'Alergias del paciente'
            },
            transfusiones: {
                type: 'string',
                description: 'Información sobre transfusiones del paciente'
            },
            detalles_transfusiones: {
                type: 'string',
                description: 'Detalles de las transfusiones del paciente'
            },
            familiar_responsable: {
                type: 'string',
                description: 'Nombre del familiar responsable del paciente'
            },
            parentesco_familiar: {
                type: 'string',
                description: 'Parentesco del familiar responsable con el paciente'
            },
            telefono_familiar: {
                type: 'string',
                description: 'Teléfono del familiar responsable del paciente'
            },
            ocupacion: {
                type: 'string',
                description: 'Ocupación del paciente'
            },
            escolaridad: {
                type: 'string',
                description: 'Escolaridad del paciente'
            },
            lugar_nacimiento: {
                type: 'string',
                description: 'Lugar de nacimiento del paciente'
            }
        }
    },
    Persona: {
        type: 'object',
        properties: {
            id_persona: {
                type: 'integer',
                description: 'ID único de la persona'
            },
            nombre: {
                type: 'string',
                description: 'Nombre de la persona'
            },
            apellido_paterno: {
                type: 'string',
                description: 'Apellido paterno de la persona'
            },
            apellido_materno: {
                type: 'string',
                description: 'Apellido materno de la persona'
            },
            fecha_nacimiento: {
                type: 'string',
                format: 'date',
                description: 'Fecha de nacimiento de la persona'
            },
            sexo: {
                type: 'string',
                enum: ['M', 'F', 'O'],
                description: 'Sexo de la persona (M: Masculino, F: Femenino, O: Otro)'
            },
            curp: {
                type: 'string',
                description: 'CURP de la persona'
            },
            tipo_sangre_id: {
                type: 'integer',
                description: 'ID del tipo de sangre de la persona'
            },
            estado_civil: {
                type: 'string',
                enum: ['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Unión libre', 'Otro'],
                description: 'Estado civil de la persona'
            },
            religion: {
                type: 'string',
                description: 'Religión de la persona'
            },
            telefono: {
                type: 'string',
                description: 'Teléfono de la persona'
            },
            correo_electronico: {
                type: 'string',
                format: 'email',
                description: 'Correo electrónico de la persona'
            },
            domicilio: {
                type: 'string',
                description: 'Domicilio de la persona'
            }
        }
    },
    Administrador: {
        type: 'object',
        properties: {
            id_administrador: {
                type: 'integer',
                description: 'ID único del administrador'
            },
            id_persona: {
                type: 'integer',
                description: 'ID de la persona asociada'
            },
            usuario: {
                type: 'string',
                description: 'Usuario del administrador'
            },
            contrasena: {
                type: 'string',
                description: 'Contraseña del administrador (almacenada como hash)'
            },
            nivel_acceso: {
                type: 'integer',
                description: 'Nivel de acceso del administrador'
            },
            activo: {
                type: 'boolean',
                description: 'Indica si el administrador está activo'
            },
            foto: {
                type: 'string',
                nullable: true,
                description: 'URL o ruta de la foto del administrador'
            }
        }
    },
    Expediente: {
        type: 'object',
        properties: {
            id_expediente: {
                type: 'integer',
                description: 'ID único del expediente'
            },
            id_paciente: {
                type: 'integer',
                description: 'ID del paciente asociado'
            },
            numero_expediente: {
                type: 'string',
                description: 'Número único del expediente'
            },
            fecha_apertura: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de apertura del expediente'
            },
            estado: {
                type: 'string',
                description: 'Estado del expediente'
            },
            notas_administrativas: {
                type: 'string',
                description: 'Notas administrativas del expediente'
            }
        }
    },
    Cama: {
        type: 'object',
        properties: {
            id_cama: {
                type: 'integer',
                description: 'ID único de la cama'
            },
            numero: {
                type: 'string',
                description: 'Número de la cama'
            },
            id_servicio: {
                type: 'integer',
                description: 'ID del servicio asociado'
            },
            estado: {
                type: 'string',
                enum: ['Disponible', 'Ocupada', 'Mantenimiento', 'Reservada', 'Contaminada'],
                description: 'Estado de la cama'
            },
            descripcion: {
                type: 'string',
                description: 'Descripción de la cama'
            },
            area: {
                type: 'string',
                description: 'Área de la cama'
            },
            subarea: {
                type: 'string',
                description: 'Subárea de la cama'
            }
        }
    },
    Internamiento: {
        type: 'object',
        properties: {
            id_internamiento: {
                type: 'integer',
                description: 'ID único del internamiento'
            },
            id_expediente: {
                type: 'integer',
                description: 'ID del expediente asociado'
            },
            id_cama: {
                type: 'integer',
                description: 'ID de la cama asociada'
            },
            id_servicio: {
                type: 'integer',
                description: 'ID del servicio asociado'
            },
            fecha_ingreso: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de ingreso del paciente'
            },
            fecha_egreso: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de egreso del paciente'
            },
            motivo_ingreso: {
                type: 'string',
                description: 'Motivo de ingreso del paciente'
            },
            diagnostico_ingreso: {
                type: 'string',
                description: 'Diagnóstico de ingreso del paciente'
            },
            diagnostico_egreso: {
                type: 'string',
                description: 'Diagnóstico de egreso del paciente'
            },
            id_medico_responsable: {
                type: 'integer',
                description: 'ID del médico responsable del internamiento'
            },
            tipo_egreso: {
                type: 'string',
                enum: ['Alta voluntaria', 'Mejoría', 'Referencia', 'Defunción', 'Máximo beneficio'],
                description: 'Tipo de egreso del paciente'
            },
            observaciones: {
                type: 'string',
                description: 'Observaciones del internamiento'
            }
        }
    },
    SignosVitales: {
        type: 'object',
        properties: {
            id_signos_vitales: {
                type: 'integer',
                description: 'ID único de los signos vitales'
            },
            id_documento: {
                type: 'integer',
                description: 'ID del documento asociado'
            },
            fecha_toma: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de toma de los signos vitales'
            },
            temperatura: {
                type: 'number',
                format: 'decimal',
                description: 'Temperatura en °C'
            },
            presion_arterial_sistolica: {
                type: 'integer',
                description: 'Presión arterial sistólica'
            },
            presion_arterial_diastolica: {
                type: 'integer',
                description: 'Presión arterial diastólica'
            },
            frecuencia_cardiaca: {
                type: 'integer',
                description: 'Frecuencia cardíaca'
            },
            frecuencia_respiratoria: {
                type: 'integer',
                description: 'Frecuencia respiratoria'
            },
            saturacion_oxigeno: {
                type: 'integer',
                description: 'Saturación de oxígeno'
            },
            glucosa: {
                type: 'integer',
                description: 'Niveles de glucosa'
            },
            peso: {
                type: 'number',
                format: 'decimal',
                description: 'Peso en kg'
            },
            talla: {
                type: 'number',
                format: 'decimal',
                description: 'Talla en cm'
            },
            imc: {
                type: 'number',
                format: 'decimal',
                description: 'Índice de Masa Corporal'
            },
            observaciones: {
                type: 'string',
                description: 'Observaciones sobre los signos vitales'
            }
        }
    },
    DocumentoClinico: {
        type: 'object',
        properties: {
            id_documento: {
                type: 'integer',
                description: 'ID único del documento clínico'
            },
            id_expediente: {
                type: 'integer',
                description: 'ID del expediente asociado'
            },
            id_internamiento: {
                type: 'integer',
                description: 'ID del internamiento asociado'
            },
            id_tipo_documento: {
                type: 'integer',
                description: 'ID del tipo de documento'
            },
            fecha_elaboracion: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de elaboración del documento clínico'
            },
            id_personal_creador: {
                type: 'integer',
                description: 'ID del personal que creó el documento'
            },
            estado: {
                type: 'string',
                enum: ['Activo', 'Cancelado', 'Anulado', 'Borrador'],
                description: 'Estado del documento clínico'
            }
        }
    },
    HistoriaClinica: {
        type: 'object',
        properties: {
            id_historia_clinica: {
                type: 'integer',
                description: 'ID único de la historia clínica'
            },
            id_documento: {
                type: 'integer',
                description: 'ID del documento asociado'
            },
            antecedentes_heredo_familiares: {
                type: 'string',
                description: 'Antecedentes heredo familiares del paciente'
            },
            habitos_higienicos: {
                type: 'string',
                description: 'Hábitos higiénicos del paciente'
            },
            habitos_alimenticios: {
                type: 'string',
                description: 'Hábitos alimenticios del paciente'
            },
            actividad_fisica: {
                type: 'string',
                description: 'Actividad física del paciente'
            },
            ocupacion: {
                type: 'string',
                description: 'Ocupación del paciente'
            },
            vivienda: {
                type: 'string',
                description: 'Vivienda del paciente'
            },
            toxicomanias: {
                type: 'string',
                description: 'Toxicomanías del paciente'
            },
            menarca: {
                type: 'string',
                description: 'Menarca del paciente'
            },
            ritmo_menstrual: {
                type: 'string',
                description: 'Ritmo menstrual del paciente'
            },
            inicio_vida_sexual: {
                type: 'string',
                description: 'Inicio de vida sexual del paciente'
            },
            fecha_ultima_regla: {
                type: 'string',
                format: 'date',
                description: 'Fecha de la última regla del paciente'
            },
            fecha_ultimo_parto: {
                type: 'string',
                format: 'date',
                description: 'Fecha del último parto del paciente'
            },
            gestas: {
                type: 'integer',
                description: 'Número de gestas del paciente'
            },
            partos: {
                type: 'integer',
                description: 'Número de partos del paciente'
            },
            cesareas: {
                type: 'integer',
                description: 'Número de cesáreas del paciente'
            },
            abortos: {
                type: 'integer',
                description: 'Número de abortos del paciente'
            },
            hijos_vivos: {
                type: 'integer',
                description: 'Número de hijos vivos del paciente'
            },
            metodo_planificacion: {
                type: 'string',
                description: 'Método de planificación del paciente'
            },
            enfermedades_infancia: {
                type: 'string',
                description: 'Enfermedades de infancia del paciente'
            },
            enfermedades_adulto: {
                type: 'string',
                description: 'Enfermedades de adulto del paciente'
            },
            cirugias_previas: {
                type: 'string',
                description: 'Cirugías previas del paciente'
            },
            traumatismos: {
                type: 'string',
                description: 'Traumatismos del paciente'
            },
            alergias: {
                type: 'string',
                description: 'Alergias del paciente'
            },
            padecimiento_actual: {
                type: 'string',
                description: 'Padecimiento actual del paciente'
            },
            sintomas_generales: {
                type: 'string',
                description: 'Síntomas generales del paciente'
            },
            aparatos_sistemas: {
                type: 'string',
                description: 'Aparatos y sistemas del paciente'
            },
            exploracion_general: {
                type: 'string',
                description: 'Exploración general del paciente'
            },
            exploracion_cabeza: {
                type: 'string',
                description: 'Exploración de cabeza del paciente'
            },
            exploracion_cuello: {
                type: 'string',
                description: 'Exploración de cuello del paciente'
            },
            exploracion_torax: {
                type: 'string',
                description: 'Exploración de torax del paciente'
            },
            exploracion_abdomen: {
                type: 'string',
                description: 'Exploración de abdomen del paciente'
            },
            exploracion_columna: {
                type: 'string',
                description: 'Exploración de columna del paciente'
            },
            exploracion_extremidades: {
                type: 'string',
                description: 'Exploración de extremidades del paciente'
            },
            exploracion_genitales: {
                type: 'string',
                description: 'Exploración de genitales del paciente'
            },
            impresion_diagnostica: {
                type: 'string',
                description: 'Impresión diagnóstica del paciente'
            },
            id_guia_diagnostico: {
                type: 'integer',
                description: 'ID de la guía diagnóstica'
            },
            plan_diagnostico: {
                type: 'string',
                description: 'Plan diagnóstico del paciente'
            },
            plan_terapeutico: {
                type: 'string',
                description: 'Plan terapéutico del paciente'
            },
            pronostico: {
                type: 'string',
                description: 'Pronóstico del paciente'
            }
        }
    },
    NotaUrgencias: {
        type: 'object',
        properties: {
            id_nota_urgencias: {
                type: 'integer',
                description: 'ID único de la nota de urgencias'
            },
            id_documento: {
                type: 'integer',
                description: 'ID del documento asociado'
            },
            motivo_atencion: {
                type: 'string',
                description: 'Motivo de atención en urgencias'
            },
            estado_conciencia: {
                type: 'string',
                description: 'Estado de conciencia del paciente'
            },
            resumen_interrogatorio: {
                type: 'string',
                description: 'Resumen del interrogatorio del paciente'
            },
            exploracion_fisica: {
                type: 'string',
                description: 'Exploración física del paciente'
            },
            resultados_estudios: {
                type: 'string',
                description: 'Resultados de estudios del paciente'
            },
            estado_mental: {
                type: 'string',
                description: 'Estado mental del paciente'
            },
            diagnostico: {
                type: 'string',
                description: 'Diagnóstico del paciente'
            },
            id_guia_diagnostico: {
                type: 'integer',
                description: 'ID de la guía diagnóstica'
            },
            plan_tratamiento: {
                type: 'string',
                description: 'Plan de tratamiento del paciente'
            },
            pronostico: {
                type: 'string',
                description: 'Pronóstico del paciente'
            },
            area_interconsulta: {
                type: 'integer',
                description: 'ID del área de interconsulta'
            }
        }
    },
    NotaEvolucion: {
        type: 'object',
        properties: {
            id_nota_evolucion: {
                type: 'integer',
                description: 'ID único de la nota de evolución'
            },
            id_documento: {
                type: 'integer',
                description: 'ID del documento asociado'
            },
            subjetivo: {
                type: 'string',
                description: 'Lo que reporta el paciente'
            },
            objetivo: {
                type: 'string',
                description: 'Hallazgos de la exploración física'
            },
            analisis: {
                type: 'string',
                description: 'Interpretación'
            },
            plan: {
                type: 'string',
                description: 'Plan de tratamiento'
            }
        }
    },
    NotaInterconsulta: {
        type: 'object',
        properties: {
            id_nota_interconsulta: {
                type: 'integer',
                description: 'ID único de la nota de interconsulta'
            },
            id_documento: {
                type: 'integer',
                description: 'ID del documento asociado'
            },
            area_interconsulta: {
                type: 'integer',
                description: 'ID del área de interconsulta'
            },
            motivo_interconsulta: {
                type: 'string',
                description: 'Motivo de la interconsulta'
            },
            diagnostico_presuntivo: {
                type: 'string',
                description: 'Diagnóstico presuntivo del paciente'
            },
            examenes_laboratorio: {
                type: 'boolean',
                description: 'Indica si se requieren exámenes laboratorios'
            },
            examenes_gabinete: {
                type: 'boolean',
                description: 'Indica si se requieren exámenes de gabinete'
            },
            hallazgos: {
                type: 'string',
                description: 'Hallazgos de la interconsulta'
            },
            impresion_diagnostica: {
                type: 'string',
                description: 'Impresión diagnóstica de la interconsulta'
            },
            recomendaciones: {
                type: 'string',
                description: 'Recomendaciones de la interconsulta'
            },
            id_medico_solicitante: {
                type: 'integer',
                description: 'ID del médico solicitante de la interconsulta'
            },
            id_medico_interconsulta: {
                type: 'integer',
                description: 'ID del médico que realiza la interconsulta'
            }
        }
    },
    NotaPreoperatoria: {
        type: 'object',
        properties: {
            id_nota_preoperatoria: {
                type: 'integer',
                description: 'ID único de la nota preoperatoria'
            },
            id_documento: {
                type: 'integer',
                description: 'ID del documento asociado'
            },
            fecha_cirugia: {
                type: 'string',
                format: 'date',
                description: 'Fecha de la cirugía'
            },
            resumen_interrogatorio: {
                type: 'string',
                description: 'Resumen del interrogatorio del paciente'
            },
            exploracion_fisica: {
                type: 'string',
                description: 'Exploración física del paciente'
            },
            resultados_estudios: {
                type: 'string',
                description: 'Resultados de estudios del paciente'
            },
            diagnostico_preoperatorio: {
                type: 'string',
                description: 'Diagnóstico preoperatorio del paciente'
            },
            id_guia_diagnostico: {
                type: 'integer',
                description: 'ID de la guía diagnóstica'
            },
            plan_quirurgico: {
                type: 'string',
                description: 'Plan quirúrgico del paciente'
            },
            plan_terapeutico_preoperatorio: {
                type: 'string',
                description: 'Plan terapéutico preoperatorio del paciente'
            }
        }
    }
};
