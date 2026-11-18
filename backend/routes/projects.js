const express = require('express');
const prisma = require('../prismaClient');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

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
      userId: req.userId,
    },
  });

  res.status(201).json(project);
});

router.post('/from-template/:templateId', async (req, res) => {
  const template = await prisma.template.findFirst({
    where: { id: req.params.templateId, isPublished: true },
  });

  if (!template) {
    return res.status(404).json({ error: 'Template not found.' });
  }

  const { name } = req.body || {};

  const project = await prisma.project.create({
    data: {
      name: typeof name === 'string' && name.trim() ? name.trim() : template.title,
      width: template.width,
      height: template.height,
      canvasData: template.canvasData,
      thumbnailUrl: template.thumbnailUrl,
      userId: req.userId,
      templateId: template.id,
    },
  });

  res.status(201).json(project);
});

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      width: true,
      height: true,
      thumbnailUrl: true,
      templateId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  res.json(project);
});

router.put('/:id', async (req, res) => {
  const { name, width, height, canvasData, thumbnailUrl } = req.body;
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
  if (thumbnailUrl !== undefined) {
    if (typeof thumbnailUrl !== 'string') {
      return res.status(400).json({ error: 'thumbnailUrl must be a string.' });
    }
    data.thumbnailUrl = thumbnailUrl;
  }

  const existing = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.userId },
    select: { id: true },
  });
  if (!existing) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const project = await prisma.project.update({ where: { id: existing.id }, data });
  res.json(project);
});

router.delete('/:id', async (req, res) => {
  const existing = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.userId },
    select: { id: true },
  });
  if (!existing) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  await prisma.project.delete({ where: { id: existing.id } });
  res.status(204).end();
});

module.exports = router;
