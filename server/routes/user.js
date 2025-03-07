const crypto = require('crypto');
const client = require("../database");

const hashPassword = (password) => {
   const hash = crypto.createHash('sha256');
   hash.update(password);
   return hash.digest('hex');
};

class Auth {
   async registration(req, res) {
      const { firstName, secondName, thirdName, login, password, role } = req.body;

      if (!firstName || !secondName || !thirdName || !login || !password || !role) {
         return res.status(400).json({
            message: "Неверно отправлены данные"
         });
      }

      try {
         const checkUniqueUser  = 'SELECT * FROM Users WHERE login = $1';
         const checkResult = await client.query(checkUniqueUser , [login]);

         if (checkResult.rows.length > 0) {
            return res.status(400).json({
               message: "Пользователь с таким логином уже существует"
            });
         }

         const hashedPassword = hashPassword(password);
         const createUserQuery = 'INSERT INTO Users (name, surname, thirdname, login, password, position) VALUES ($1, $2, $3, $4, $5, $6)';

         await client.query(createUserQuery, [firstName, secondName, thirdName, login, hashedPassword, role]);

         const userToken = login + hashedPassword;

         res.status(201).json({
            message: "Вход выполнен успешно",
            token: userToken,
            username: login,
            role: role,
         });

      } catch (error) {
         console.log(error);
         res.status(500).json({ message: "Ошибка при регистрации" });
      }
   }

   async login(req, res) {
      const { firstName, secondName, thirdName, login, password, role } = req.body;

      if (!login || !password) {
         return res.status(400).json({
            message: "Неверно отправлены данные"
         })
      }

      try {
         const checkQuery = 'SELECT * FROM Users WHERE login = $1';
         const checkQueryResponse = await client.query(checkQuery, [login]);
         if (checkQueryResponse.rows.length === 0) {
            return res.status(404).json({ message: 'Неверный логин' })
         }

         const queryToLogin  = 'SELECT password, login, position FROM Users WHERE login = $1';
         const checkResult = await client.query(queryToLogin, [login]);
         const hashedPasswordFromDB = checkResult.rows[0].password;

         const hashedPassword = hashPassword(password);

         if (hashedPasswordFromDB !== hashedPassword) {
            return res.status(400).json({
               message: "Неверный пароль"
            })
         }

         const userToken = login + hashedPassword;

         res.status(201).json({
            message: "Вход выполнен успешно",
            token: userToken,
            username: checkResult.rows[0].login,
            role: checkResult.rows[0].position,
         })

      } catch (error) {
         console.log(error);
         res.status(500).json({ message: "Ошибка при входе" });
      }
   }
}

class User {
   async getAllUsers(req, res) {
      try {
         const query = `
            SELECT id, name, surname, login, thirdname, login, position
            FROM Users
            WHERE position = 'Пользователь'
         `;
         const result = await client.query(query);

         if (result.rows.length > 0) {
            res.status(200).json(result.rows);
         } else {
            res.status(404).json({ message: 'Сотрудники не найдены' })
         }
      }
      catch (error) {
         console.log(error);
         res.status(500).json({ message: 'Ошибка сервера' })
      }
   }
}

module.exports = {
   auth: new Auth(),
   user: new User(),
}
