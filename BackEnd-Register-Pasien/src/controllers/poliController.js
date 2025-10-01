// ===== CONTROLLER: poliController.js =====
import * as poliService from '../services/poliService.js';

export const getAllPolis = async (req, res) => {
  const polis = await poliService.getAllPolis();
  res.json(polis);
};

export const getPoliById = async (req, res) => {
  const poli = await poliService.getPoliById(+req.params.id);
  if (!poli) return res.status(404).json({ message: 'Poli not found' });
  res.json(poli);
};

export const createPoli = async (req, res) => {
  const newPoli = await poliService.createPoli(req.body);
  res.status(201).json(newPoli);
};

export const updatePoli = async (req, res) => {
  const updated = await poliService.updatePoli(+req.params.id, req.body);
  res.json(updated);
};

export const deletePoli = async (req, res) => {
  await poliService.deletePoli(+req.params.id);
  res.json({ message: 'Poli deleted' });
};