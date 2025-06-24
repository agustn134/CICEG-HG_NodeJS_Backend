"use strict";
// import { Request, Response } from 'express';
// import { QueryResult } from 'pg';
// import pool from '../../config/database';
// import { Request, Response } from 'express';
// import { QueryResult } from 'pg';
// import pool from '../../config/database';
// export const get = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const response: QueryResult = await pool.query("");
//     return res.status(200).json(response.rows);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al obtener estudios médicos");
//   }
// };
// export const getEstudioMedicoById = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const id = req.params.id;
//     const response: QueryResult = await pool.query("SELECT * FROM estudio_medico WHERE id_estudio = $1", [id]);
//     if (response.rows.length === 0) {
//       return res.status(404).send("Estudio médico no encontrado");
//     }
//     return res.status(200).json(response.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al obtener estudio médico por ID");
//   }
// };
// export const createEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo } = req.body;
//     const response: QueryResult = await pool.query(
//       "INSERT INTO estudio_medico (clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
//       [clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo]
//     );
//     return res.status(201).json(response.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al crear estudio médico");
//   }
// };
// export const updateEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const id = req.params.id;
//     const { clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo } = req.body;
//     const response: QueryResult = await pool.query(
//       "UPDATE estudio_medico SET clave = $1, nombre = $2, tipo = $3, descripcion = $4, requiere_ayuno = $5, tiempo_resultado = $6, activo = $7 WHERE id_estudio = $8 RETURNING *",
//       [clave, nombre, tipo, descripcion, requiere_ayuno, tiempo_resultado, activo, id]
//     );
//     if (response.rows.length === 0) {
//       return res.status(404).send("Estudio médico no encontrado");
//     }
//     return res.status(200).json(response.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al actualizar estudio médico");
//   }
// };
// export const deleteEstudioMedico = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const id = req.params.id;
//     const response: QueryResult = await pool.query("DELETE FROM estudio_medico WHERE id_estudio = $1", [id]);
//     if (response.rowCount === 0) {
//       return res.status(404).send("Estudio médico no encontrado");
//     }
//     return res.status(200).send("Estudio médico eliminado correctamente");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error al eliminar estudio médico");
//   }
// };
