const Router = require('express');
const router = Router();

const tasks = require('./tasks');

// Задачи
router.get('/allTasks', tasks.getAllTasksDefault);
router.post('/filteredTasks', tasks.filterTasksWithData);
router.post('/userTasks', tasks.getUserTasks);

router.post('/createTask', tasks.createTask);

router.put('/closeTask', tasks.closeTask);
router.put('/updateTask', tasks.updateTask);

router.delete('/deleteTask', tasks.deleteTask);

module.exports = router;