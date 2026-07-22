import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Kakkoi Nihongo Backend API',
    status: 'healthy',
    features: ['User progress', 'Quizzes', 'Listening practice (planned)']
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// TODO: Add your routes here
// Example:
// app.post('/api/progress', ...)
// app.get('/api/kanji', ...)

app.listen(PORT, () => {
  console.log(`🚀 Kakkoi Nihongo Backend running on http://localhost:${PORT}`);
});
