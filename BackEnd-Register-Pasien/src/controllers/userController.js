import * as userService from '../services/userService.js';

export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await userService.getUserById(+req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const createUser = async (req, res) => {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

export const updateUser = async (req, res) => {
  const updated = await userService.updateUser(+req.params.id, req.body);
  res.json(updated);
};

export const deleteUser = async (req, res) => {
  await userService.deleteUser(+req.params.id);
  res.json({ message: 'User deleted' });
};
