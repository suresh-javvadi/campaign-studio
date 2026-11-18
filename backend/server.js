require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const templatesRouter = require('./routes/templates');
const projectsRouter = require('./routes/projects');
const uploadsRouter = require('./routes/uploads');
const { UPLOADS_DIR } = require('./storage');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Campaign Studio backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/auth', authRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/projects', projectsRouter);

// eslint-disable-next-line no-unused-vars -- Express requires the 4-arg signature to detect error middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Campaign Studio backend listening on http://localhost:${PORT}`);
});
