import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getAdministradores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM administrador");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener administradores");
  }
};

export const getAdministradorById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM administrador WHERE id_administrador = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Administrador no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener administrador por ID");
  }
};

export const createAdministrador = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      id_persona,
      usuario,
      contrasena,
      nivel_acceso,
      activo,
      foto
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO administrador (id_persona, usuario, contrasena, nivel_acceso, activo, foto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        id_persona,
        usuario,
        contrasena,
        nivel_acceso,
        activo,
        foto
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear administrador");
  }
};

export const updateAdministrador = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      id_persona,
      usuario,
      contrasena,
      nivel_acceso,
      activo,
      foto
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE administrador SET id_persona = $1, usuario = $2, contrasena = $3, nivel_acceso = $4, activo = $5, foto = $6 WHERE id_administrador = $7 RETURNING *",
      [
        id_persona,
        usuario,
        contrasena,
        nivel_acceso,
        activo,
        foto,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Administrador no encontrado");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar administrador");
  }
};

export const deleteAdministrador = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM administrador WHERE id_administrador = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Administrador no encontrado");
    }
    return res.status(200).send("Administrador eliminado correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar administrador");
  }
};