import React, { useState, useEffect } from 'react';
import '../App.css';

const AddTaskModal = ({ showModal, setShowModal, setError, showMessage, usersArray, taskToEdit, setTaskToEdit }) => {
   const [formData, setFormData] = useState({
      title: '',
      endDate: '',
      priority: '',
      responsible: '',
   });

   useEffect(() => {
      if (taskToEdit) {
         setFormData({
            title: taskToEdit.title,
            endDate: taskToEdit.enddate,
            priority: taskToEdit.priority,
            responsible: taskToEdit.responsible,
         });
      } else {
         setFormData({
            title: '',
            endDate: '',
            priority: '',
            responsible: '',
         });
      }
   }, [taskToEdit]);

   const handleSubmitTask = async (e) => {
      e.preventDefault();
      const url = taskToEdit ? `http://localhost:8080/tasks/updateTask` : `http://localhost:8080/tasks/createTask`;
      const method = taskToEdit ? 'PUT' : 'POST';

      try {
         const response = await fetch(url, {
            method: method,
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               title: formData.title,
               endDate: formData.endDate,
               priority: formData.priority,
               responsible: formData.responsible,
               id: taskToEdit ? taskToEdit.id : undefined,
            }),
         });

         if (!response.ok) {
            showMessage('Ошибка при отправке формы', false);
         } else {
            window.location.reload();
            setShowModal(false);
            setTaskToEdit(null);
            setTimeout(() => {
               showMessage('Задача успешно обновлена', true);
            }, 10000);
         }
      } catch (error) {
         setError(error);
         showMessage('Ошибка при отправке формы', false);
      }
   };

   return (
      <div className={`add_task ${showModal ? 'active' : ''}`} onClick={() => setShowModal(false)}>
         <div className="add_task_container" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmitTask}>
               <h3>{taskToEdit ? 'Обновить задачу' : 'Создать задачу'}</h3>

               <div className='input_container'>
                  <legend className='input_title'>Название задачи</legend>
                  <input
                     className='auth_input'
                     type='text'
                     name='title'
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     required
                  />
               </div>

               {taskToEdit ? null : (
                  <div className='input_container'>
                     <legend className='input_title'>Дата окончания</legend>
                     <input
                        className='auth_input'
                        type='date'
                        name='endDate'
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                     />
                  </div>
               )}

               <div className='input_container'>
                  <legend className='input_title'>Приоритет</legend>
                  <select
                     name='priority'
                     className='auth_input'
                     value={formData.priority}
                     onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                     required
                  >
                     <option value="Низкий">Низкий</option>
                     <option value="Средний">Средний</option>
                     <option value="Высокий">Высокий</option>
                  </select>
               </div>

               <div className='input_container'>
                  <legend className='input_title'>{taskToEdit ? 'Ответственный' : 'ID ответственного'}</legend>
                  {taskToEdit ? (
                     <p className='auth_input disable_input'>{`${taskToEdit.surname} ${taskToEdit.name}`}</p>
                  ) : (
                     <select
                        className='auth_input'
                        value={formData.responsible}
                        onChange={(e) => setFormData({ ...formData, responsible: e.target.value })} // Устанавливаем ID ответственного
                        required
                     >
                        <option value="">Выберите ответственного</option>
                        {usersArray.map((user) => (
                           <option key={user.id} value={user.id}>{`${user.surname} ${user.name}`}</option>
                        ))}
                     </select>
                  )}
               </div>

               <button className={`yellow_button ${taskToEdit && taskToEdit.status === 'Завершена' ? 'disable' : ''}`} type='submit'>
                  {taskToEdit ? 'Обновить' : 'Создать'}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddTaskModal;