const express = require('express');
const path = require('path');
const app = express();

// Port number
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT${PORT}`);
});
