const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

const LIST_SELECT = {
  id: true,
  title: true,
  description: true,
  category: true,
  partyTag: true,
  width: true,
  height: true,
  thumbnailUrl: true,
};

router.get('/', async (req, res) => {
  const { category, partyTag, q } = req.query;

  const where = { isPublished: true };
  if (typeof category === 'string' && category.trim()) {
    where.category = category.trim();
  }
  if (typeof partyTag === 'string' && partyTag.trim()) {
    where.partyTag = partyTag.trim();
  }
  if (typeof q === 'string' && q.trim()) {
    const search = q.trim();
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const templates = await prisma.template.findMany({
    where,
    select: LIST_SELECT,
    orderBy: { createdAt: 'asc' },
  });

  res.json(templates);
});

router.get('/categories', async (_req, res) => {
  const rows = await prisma.template.findMany({
    where: { isPublished: true },
    select: { category: true, partyTag: true },
    distinct: ['category'],
  });

  const categories = [...new Set(rows.map((row) => row.category))];
  const partyRows = await prisma.template.findMany({
    where: { isPublished: true },
    select: { partyTag: true },
    distinct: ['partyTag'],
  });
  const partyTags = [...new Set(partyRows.map((row) => row.partyTag))];

  res.json({ categories, partyTags });
});

router.get('/:id', async (req, res) => {
  const template = await prisma.template.findFirst({
    where: { id: req.params.id, isPublished: true },
  });

  if (!template) {
    return res.status(404).json({ error: 'Template not found.' });
  }

  res.json(template);
});

module.exports = router;
