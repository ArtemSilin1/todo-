require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/userRouter');
const tasksRouter = require('./routes/tasksRouter');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', authRouter);
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => {
   res.status(200).json({ message: "Проверка" });
});

const startServer = async () => {
   try {
      app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
   } catch (error) {
      console.log(error);
   }
};

startServer();