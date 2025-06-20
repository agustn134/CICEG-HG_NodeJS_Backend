import { Request, Response } from "express";
import pool from "../../config/database"; 

export const getServicios = async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM servicio");
  res.json(result.rows);
};

export const getServicioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM servicio WHERE id_servicio = $1", [id]);
  res.json(result.rows[0]);
};

export const createServicio = async (req: Request, res: Response) => {
  const { nombre, descripcion } = req.body;
  await pool.query("INSERT INTO servicio (nombre, descripcion) VALUES ($1, $2)", [nombre, descripcion]);
  res.status(201).json({ message: "Servicio creado" });
};

export const updateServicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  await pool.query("UPDATE servicio SET nombre = $1, descripcion = $2 WHERE id_servicio = $3", [nombre, descripcion, id]);
  res.json({ message: "Servicio actualizado" });
};

export const deleteServicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query("DELETE FROM servicio WHERE id_servicio = $1", [id]);
  res.json({ message: "Servicio eliminado" });
};
