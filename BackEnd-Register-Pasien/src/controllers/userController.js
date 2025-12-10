import * as userService from '../services/userService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        address: true,
        image: true,
        role: true,
        created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, username } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    
    // Check if username is being changed and if it's already taken
    if (username !== undefined) {
      const existingUser = await prisma.users.findUnique({
        where: { username }
      });
      
      // If username exists and it's not the current user
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }
      
      updateData.username = username;
    }

    const user = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        address: true,
        image: true,
        role: true
      }
    });

    res.status(200).json({ message: 'Profile berhasil diupdate', user });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username atau phone sudah digunakan' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Upload profile photo (file upload)
export const uploadPhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    // Generate URL untuk file
    const imageUrl = `/uploads/users/${req.file.filename}`;

    const user = await prisma.users.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        address: true,
        image: true,
        role: true
      }
    });

    res.status(200).json({ 
      message: 'Foto profile berhasil diupload', 
      user,
      imageUrl 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile photo
export const updatePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'URL foto harus disediakan' });
    }

    const user = await prisma.users.update({
      where: { id: userId },
      data: { image },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        address: true,
        image: true,
        role: true
      }
    });

    res.status(200).json({ message: 'Foto profile berhasil diupdate', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan baru harus diisi' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });
    
    // Simple password comparison (no hashing for learning purposes)
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Password lama salah' });
    }

    await prisma.users.update({
      where: { id: userId },
      data: { password: newPassword }
    });

    res.status(200).json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
