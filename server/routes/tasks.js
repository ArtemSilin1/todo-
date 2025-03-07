const client = require("../database");

class Task {
   async getAllTasksDefault(req, res) {
      try {
         const query = `
             SELECT
                 Tasks.Id,
                 Tasks.Title,
                 Tasks.Priority,
                 Tasks.EndDate,
                 Tasks.Status,
                 Tasks.UpdateDate,
                 Users.Name,
                 Users.Surname
             FROM Tasks
             JOIN Users ON Tasks.Responsible = Users.Id
             ORDER BY UpdateDate DESC;
         `;
         const result = await client.query(query);

         if (result.rows.length > 0) {
            res.status(200).json(result.rows);
         } else {
            res.status(404).json({ message: 'Задачи не найдены' });
         }
      } catch (error) {
         console.log(error);
         res.status(500).send({ message: 'Ошибка сервера' });
      }
   }

   async createTask(req, res) {
      const { title, endDate, priority, responsible, username } = req.body;

      try {
         const query = `
             SELECT id FROM Users
             WHERE id = $1
         `;
         const checkUser = await client.query(query, [responsible]);

         if (checkUser.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
         }

         const creatorId = checkUser.rows[0].id;

         const addTaskQuery = `
            INSERT INTO Tasks (Title, EndDate, CreatedAtDate, UpdateDate, Priority, Status, Creator, Responsible)
            VALUES ($1, $2, NOW(), NOW(), $3, 'Новая', $4, $5)
         `;

         const newTask = await client.query(addTaskQuery, [title, endDate, priority, creatorId, responsible]);

         res.status(201).json({ message: 'Успешно добавлено' });
      } catch (error) {
         console.log(error);
         res.status(500).json({ message: 'Ошибка сервера' });
      }
   }

   async getUserTasks(req, res) {
      const { username } = req.body;

      if (!username) {
         return res.status(400).json({ message: "Ошибка авторизации" })
      }

      try {
         const query = `
             SELECT Tasks.id, Tasks.title, Tasks.priority, Tasks.enddate, Tasks.responsible,
                    Tasks.status, Tasks.updatedate, Users.name, Users.surname
             FROM Tasks
             JOIN Users ON Tasks.responsible = Users.id
             WHERE Users.login = $1
             ORDER BY UpdateDate DESC;
         `
         const result = await client.query(query, [username]);

         if (result.rows.length === 0) {
            return res.status(404).json({ message: "Задач нет" })
         }

         res.status(200).json(result.rows);
      }
      catch (error) {
         console.log(error);
         res.status(500).json({ message: "Ошибка сервера" })
      }
   }

   async closeTask(req, res) {
      const { id, status } = req.body;

      try {
         const query = `
            UPDATE Tasks
            SET status = $2, updateDate = NOW()
            WHERE id = $1
         `

         await client.query(query, [id, status]);
         res.status(200).json({ message: "Данные обновлены" })
      }
      catch (error) {
         console.log(error);
         res.status(500).json({ message: "Ошибка сервера" })
      }
   }

   async deleteTask(req, res) {
      const { id } = req.body;

      try {
         const query = `
            DELETE FROM Tasks
            WHERE id = $1
         `

         await client.query(query, [id]);

         res.status(200).json({ message: "Данные удалены" });
      }
      catch (error) {
         console.log(error);
         res.status(500).json({ message: "Ошибка сервера" })
      }
   }

   async updateTask(req, res) {
      const { title, priority, id } = req.body;

      try {
         const checkQuery = `
            SELECT * FROM Tasks
            WHERE id = $1
         `
         const checkResult = await client.query(checkQuery, [id]);

         if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Такая задача не найдена" })
         }

         const query = `
            UPDATE Tasks
            SET title = $1, priority = $2, updatedate = NOW()
            WHERE id = $3
         `
         await client.query(query, [title, priority, id]);

         res.status(201).json({ message: 'Успешно добавлено' });
      } catch (error) {
         console.log(error);
         res.status(500).json({ message: 'Ошибка сервера' });
      }
   }

   async filterTasksWithData(req, res) {
      const { login, filterParam } = req.body;

      if (!filterParam) {
         return res.status(400).json({ message: "Неверно указан параметр фильтрации" });
      }

      try {
         let query = '';

         switch (parseInt(filterParam)) {
            case 1:
               query = `
                    SELECT Tasks.id, Tasks.title, Tasks.priority, Tasks.enddate, Tasks.responsible,
                           Tasks.status, Tasks.updatedate, Users.name, Users.surname
                    FROM Tasks
                             JOIN Users ON Tasks.responsible = Users.id
                    WHERE Users.login = $1 AND DATE(enddate) = CURRENT_DATE
                    ORDER BY updatedate DESC;
                `;
               break;
            case 2:
               query = `
                    SELECT Tasks.id, Tasks.title, Tasks.priority, Tasks.enddate, Tasks.responsible,
                           Tasks.status, Tasks.updatedate, Users.name, Users.surname
                    FROM Tasks
                             JOIN Users ON Tasks.responsible = Users.id
                    WHERE Users.login = $1 AND enddate >= CURRENT_DATE AND enddate < CURRENT_DATE + INTERVAL '1 week'
                    ORDER BY updatedate DESC;
                `;
               break;
            case 3:
               query = `
                   SELECT Tasks.id, Tasks.title, Tasks.priority, Tasks.enddate, Tasks.responsible,
                          Tasks.status, Tasks.updatedate, Users.name, Users.surname
                   FROM Tasks
                            JOIN Users ON Tasks.responsible = Users.id
                   WHERE Users.login = $1 AND enddate > CURRENT_DATE
                   ORDER BY updatedate DESC;
               `;
               break;
            default:
               return res.status(400).json({ message: "Неверный параметр фильтрации" });
         }

         const result = await client.query(query, [login]);

         if (result.rows.length === 0) {
            return res.status(404).json({ message: "Задач нет" })
         }

         res.status(200).json(result.rows);

      } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Ошибка при выполнении запроса" });
      }
   }
}

module.exports = new Task();