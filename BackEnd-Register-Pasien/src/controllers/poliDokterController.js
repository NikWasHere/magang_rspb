// ===== CONTROLLER: poliDokterController.js =====
import * as poliDokterService from '../services/poliDokterService.js';

export const getAllPoliDokter = async (req, res) => {
  const data = await poliDokterService.getAllPoliDokter();
  res.json(data);
};

export const getPoliDokterById = async (req, res) => {
  const data = await poliDokterService.getPoliDokterById(+req.params.id);
  if (!data) return res.status(404).json({ message: 'Data not found' });
  res.json(data);
};

export const createPoliDokter = async (req, res) => {
  const newData = await poliDokterService.createPoliDokter(req.body);
  res.status(201).json(newData);
};

export const updatePoliDokter = async (req, res) => {
  const updated = await poliDokterService.updatePoliDokter(+req.params.id, req.body);
  res.json(updated);
};

export const deletePoliDokter = async (req, res) => {
  await poliDokterService.deletePoliDokter(+req.params.id);
  res.json({ message: 'PoliDokter deleted' });
};