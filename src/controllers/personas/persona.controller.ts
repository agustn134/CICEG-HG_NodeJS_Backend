// src/controllers/personas/persona.controller.ts
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import pool from '../../config/database';

export const getPersonas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response: QueryResult = await pool.query("SELECT * FROM persona");
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener personas");
  }
};

export const getPersonaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("SELECT * FROM persona WHERE id_persona = $1", [id]);
    if (response.rows.length === 0) {
      return res.status(404).send("Persona no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener persona por ID");
  }
};

export const createPersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      tipo_sangre_id,
      estado_civil,
      religion,
      telefono,
      correo_electronico,
      domicilio
    } = req.body;
    const response: QueryResult = await pool.query(
      "INSERT INTO persona (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, tipo_sangre_id, estado_civil, religion, telefono, correo_electronico, domicilio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo,
        curp,
        tipo_sangre_id,
        estado_civil,
        religion,
        telefono,
        correo_electronico,
        domicilio
      ]
    );
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear persona");
  }
};

export const updatePersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      tipo_sangre_id,
      estado_civil,
      religion,
      telefono,
      correo_electronico,
      domicilio
    } = req.body;
    const response: QueryResult = await pool.query(
      "UPDATE persona SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, fecha_nacimiento = $4, sexo = $5, curp = $6, tipo_sangre_id = $7, estado_civil = $8, religion = $9, telefono = $10, correo_electronico = $11, domicilio = $12 WHERE id_persona = $13 RETURNING *",
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo,
        curp,
        tipo_sangre_id,
        estado_civil,
        religion,
        telefono,
        correo_electronico,
        domicilio,
        id
      ]
    );
    if (response.rows.length === 0) {
      return res.status(404).send("Persona no encontrada");
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al actualizar persona");
  }
};

export const deletePersona = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const response: QueryResult = await pool.query("DELETE FROM persona WHERE id_persona = $1", [id]);
    if (response.rowCount === 0) {
      return res.status(404).send("Persona no encontrada");
    }
    return res.status(200).send("Persona eliminada correctamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar persona");
  }
};