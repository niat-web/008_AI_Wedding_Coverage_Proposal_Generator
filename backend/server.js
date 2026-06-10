const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const { initializeDatabase, isMySQLEnabled } = require('./config/db');
const proposalRoutes = require('./routes/proposalRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'thereelshoot backend is running',
    port: PORT,
    aiProvider: 'Groq',
    mysqlEnabled: isMySQLEnabled()
  });
});

app.use('/api', proposalRoutes);
app.use('/api', analyticsRoutes);

initializeDatabase();

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});