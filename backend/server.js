const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/chat', (req, res) => {
  const userMessage = req.body.message;
  console.log("User:", userMessage);
  
  // Dummy response logic
  const reply = `You said: "${userMessage}"`;
  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
