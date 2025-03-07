import React, { useState, useEffect, useCallback } from 'react';

const UsersList = ({ showMessage, setSuccessMessage, setError }) => {
   const [usersArray, setUsersArray] = useState([]);

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
            showMessage('Пользователи не найдены', true)
         } else {
            showMessage('Ошибка при отправке запроса', false)
         }
      }
      catch (error) {
         showMessage('Ошибка при отправке запроса', false);
      }
   }, [showMessage])

   useEffect(() => {
      fetchUsers();
   }, [fetchUsers]);

   return (
      <div className="tasks_list_container">
         <h2>Все пользователи</h2>

         {usersArray.length === 0 ? (
            <p>Пользователей пока нет</p>
         ) : (
            <ul className='tasks_list'>
               {usersArray.map((user) => (
                  <li key={user.id} className='tasks_list_item users_list_item'>
                     <div className='tasks_list_item_container'>
                        <p>ID: {user.id}</p>
                        <p>ФИО: {user.surname} {user.name} {user.thirdname}</p>
                        <p>Должность: {user.position}</p>
                     </div>

                  </li>
               ))}
            </ul>
         )}

      </div>
   );
};

export default UsersList;