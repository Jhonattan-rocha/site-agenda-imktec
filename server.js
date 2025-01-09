import express from 'express';
import https from 'https';
import fs from 'fs'
import path from 'path'

const app = express();

const options = {
  key: fs.readFileSync(path.join(".", "cert", 'key.pem')),
  cert: fs.readFileSync(path.join(".", "cert", 'cert.pem')),
};

app.use(express.static(path.join(".", 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(path.join(".", "dist", "index.html")));
});

const httpsServer = https.createServer(options, app);

const PORT = process.env.PORT || 5173;

httpsServer.listen(PORT, () => {
  console.log(`Servidor HTTPS ouvindo na porta ${PORT}`);
});