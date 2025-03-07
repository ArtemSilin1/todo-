import React, { useState, useEffect, useCallback } from 'react';
import AddTaskModal from '../components/addTaskModal';

const TasksList = ({ showMessage, setError, setSuccessMessage, username }) => {
   const [tasksArray, setTasksArray] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [taskToEdit, setTaskToEdit] = useState(null);
   const userRole = localStorage.getItem("role");
   const userLogin = localStorage.getItem("login");
   const [usersArray, setUsersArray] = useState([]);
   const [userFilter, setUserFilter] = useState('');
   const [filterParam, setFilterParam] = useState('');

   const fetchUserTasks = useCallback(async (username) => {
      try {
         const response = await fetch(`http://localhost:8080/tasks/userTasks`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username })
         });

         if (response.ok) {
            const data = await response.json();
            setTasksArray(data);
         } else if (response.status === 404) {
            setTasksArray([]);
            showMessage('Задачи не найдены', true);
         } else {
            showMessage('Ошибка при отправке запроса', true);
         }
      }
      catch (error) {
         showMessage('Ошибка при отправке запроса', false)
      }
   }, [showMessage]);

   const fetchTasks = useCallback(async () => {
      try {
         const response = await fetch('http://localhost:8080/tasks/allTasks', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            },
         });

         if (response.ok) {
            const data = await response.json();
            setTasksArray(data);
         } else if (response.status === 404) {
            setTasksArray([]);
            showMessage('Задачи не найдены', true);
         } else {
            showMessage('Ошибка при отправке запроса', false);
         }
      }
      catch (error) {
         showMessage('Ошибка при отправке запроса', false);
      }
   }, [showMessage]);

   const fetchUsers = useCallback(async () => {
      try {
         const response = await fetch('http://localhost:8080/user/allUsers', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
         });

         if (response.ok) {
            const data = await response.json();
            setUsersArray(data);
         } else if (response.status === 404) {
            setUsersArray([]);
            showMessage('Пользователи не найдены', true);
         } else {
            showMessage('Ошибка при отправке запроса', false);
         }
      } catch (error) {
         showMessage('Ошибка при отправке запроса', false);
      }
   }, [showMessage]);

   useEffect(() => {
      if (userRole === 'Руководитель') {
         if (userFilter) {
            fetchUserTasks(userFilter);
         } else {
            fetchTasks();
         }
         fetchUsers();
      } else {
         fetchUserTasks(userLogin);
      }
   }, [fetchTasks, fetchUsers, fetchUserTasks, userFilter, userRole, userLogin]);

   const updateTaskStatus = async (userRole, id, status) => {
      const url = userRole === 'Руководитель' ? "http://localhost:8080/tasks/deleteTask" : "http://localhost:8080/tasks/closeTask";
      const method = userRole === 'Руководитель' ? 'DELETE' : 'PUT';

      try {
         const response = await fetch(url, {
            method: method,
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, status: status })
         });

         if (!response.ok) {
            showMessage('Ошибка при отправке формы', false);
         }
         window.location.reload();
      }
      catch (error) {
         showMessage('Ошибка при отправке формы', false);
         console.log(error);
      }
   }

   const getTitleColor = (task) => {
      const currentDate = new Date();
      const endDate = new Date(task.enddate);

      if (task.status === 'Завершена') return 'green';
      else if (endDate < currentDate) return 'red';
      else return 'grey';
   }

   const fetchFilteredTasks = useCallback(async () => {
      try {
         const response = await fetch('http://localhost:8080/tasks/filteredTasks', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: userLogin, filterParam: filterParam }),
         });

         if (response.ok) {
            const data = await response.json();
            setTasksArray(data);
         } else if (response.status === 404) {
            setTasksArray([]);
            showMessage('Задачи не найдены', true);
         } else {
            showMessage('Ошибка при отправке запроса', false);
         }
      }
      catch (error) {
         showMessage('Ошибка при отправке запроса', false);
      }
   })

   useEffect(() => {
      if (filterParam) {
         fetchFilteredTasks();
      }
   }, [filterParam, fetchFilteredTasks]);

   return (
      <div className="tasks_list_container">
         <div className='tasks_list_header'>
            <h2>{userFilter ? `Задачи пользователя ${userFilter}` : 'Все задачи'}</h2>
            {userRole === 'Руководитель' ? (
               <select
                  className='auth_input'
                  required
                  onChange={(e) => setUserFilter(e.target.value)}
               >
                  <option value="">Выбрать пользователя</option>
                  {usersArray.map((user) => (
                     <option key={user.id} value={user.login}>{`${user.surname} ${user.name}`}</option>
                  ))}
               </select>
            ) : (
               <select
                  className='auth_input'
                  required
                  onChange={(e) => setFilterParam(e.target.value)}
               >
                 <option value="">Фильтровать по дате</option>
                 <option value="1">Задачи на сегодня</option>
                 <option value="2">Задачи на неделю</option>
                 <option value="3">Задачи на будущее</option>
               </select>
            )}
         </div>

         {tasksArray.length === 0 ? (
            <p>Задач пока нет</p>
         ) : (
            <ul className='tasks_list'>
               {tasksArray.map((task) => (
                  <li key={task.id} className={`tasks_list_item ${userRole === 'Руководитель' ? 'can_edit' : ''}`} onClick={() => {
                     if (userRole === 'Руководитель') {
                        setTaskToEdit(task); setShowModal(true);
                     }
                  }}>
                     <h4 className={getTitleColor(task)}>{task.title}</h4>
                     <div className='tasks_list_item_container'>
                        <p className='tasks_item_param'><b>Приоритет: </b>{task.priority}</p>
                        <p className='tasks_item_param'><b>Дата окончания: </b>{new Date(task.enddate).toLocaleDateString()}</p>
                        <p className='tasks_item_param'><b>Ответственный: </b>{task.surname} {task.name}</p>
                        <p className='tasks_item_param'><b>Статус: </b>{task.status}</p>
                        <p className='tasks_item_param'><b>Последнее обновление: </b>{new Date(task.updatedate).toLocaleDateString()}</p>
                     </div>
                     <div className='tasks_buttons_container'>
                        {userRole !== 'Руководитель' && task.status !== 'Завершена' && task.status !== 'В работе' && (
                           <button
                              className='end_task_button'
                              onClick={() => updateTaskStatus(userRole, task.id, 'В работе')}
                           >
                              Взять в работу
                           </button>
                        )}

                        {task.status === 'Завершена' ? null : (
                           <button
                              className='end_task_button'
                              onClick={() => updateTaskStatus(userRole, task.id, 'Завершена')}
                           >
                              {userRole === 'Руководитель' ? 'Удалить задачу' : 'Завершить задачу'}
                           </button>
                        )}
                     </div>
                  </li>
               ))}
            </ul>
         )}

         {userRole === "Руководитель" && (
            <button className='new_task_button' onClick={() => { setTaskToEdit(null); setShowModal(true); }}>Новая задача</button>
         )}

         <AddTaskModal
            showModal={showModal}
            setShowModal={setShowModal}
            username={username}
            setError={setError}
            showMessage={showMessage}
            setSuccessMessage={setSuccessMessage}
            taskToEdit={taskToEdit}
            setTaskToEdit={setTaskToEdit}
            usersArray={usersArray}
         />
      </div>
   );
};

export default TasksList;