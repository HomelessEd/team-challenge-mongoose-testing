const express = require('express');
const dotenv = require('dotenv');
const connectDataBase = require('./configuration/config');
const postsRoutes = require('./routes/posts'); 
const PORT =3000;

dotenv.config({ path: './env/.env' });

const app = express();


app.use(express.json());
app.use('/api/posts', postsRoutes);

connectDataBase();





app.listen(PORT, () => {
  console.log(`Server running on port https://localhost:${PORT}`);
});