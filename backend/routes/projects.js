const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

router.post('/', async (req, res) => {
  const { name, width, height, canvasData } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required.' });
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    return res.status(400).json({ error: 'width and height must be positive integers.' });
  }
  if (canvasData !== undefined && !isPlainObject(canvasData)) {
    return res.status(400).json({ error: 'canvasData must be a JSON object.' });
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      width,
      height,
      canvasData: canvasData ?? {},
    },
  });

  res.status(201).json(project);
});

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      width: true,
      height: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });

  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  res.json(project);
});

router.put('/:id', async (req, res) => {
  const { name, width, height, canvasData } = req.body;
  const data = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name must be a non-empty string.' });
    }
    data.name = name.trim();
  }
  if (width !== undefined) {
    if (!Number.isInteger(width) || width <= 0) {
      return res.status(400).json({ error: 'width must be a positive integer.' });
    }
    data.width = width;
  }
  if (height !== undefined) {
    if (!Number.isInteger(height) || height <= 0) {
      return res.status(400).json({ error: 'height must be a positive integer.' });
    }
    data.height = height;
  }
  if (canvasData !== undefined) {
    if (!isPlainObject(canvasData)) {
      return res.status(400).json({ error: 'canvasData must be a JSON object.' });
    }
    data.canvasData = canvasData;
  }

  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });
    res.json(project);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found.' });
    }
    throw error;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found.' });
    }
    throw error;
  }
});

module.exports = router;
