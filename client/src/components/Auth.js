import React, { useState } from 'react';
import '../App.css';

const Auth = ({ setToken, setUsername, setRole }) => {
   const [isLogin, setIsLogin] = useState(false);
   const [formData, setFormData] = useState({
      firstName: "",
      secondName: "",
      thirdName: "",
      login: "",
      password: "",
      role: "Пользователь"
   });

   const validateForm = () => {
      const { firstName, secondName, thirdName, login, password, role } = formData;

      if (!isLogin) {
         if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(firstName)) {
            return 'Имя должно содержать только буквы.';
         }
         if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(secondName)) {
            return 'Фамилия должна содержать только буквы.';
         }
         if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(thirdName)) {
            return 'Отчество должно содержать только буквы.';
         }
         if (password.length < 6) {
            return 'Пароль должен содержать более 6 символов.';
         }
      } else {
         if (password.length < 6) {
            return 'Пароль должен содержать более 6 символов.';
         }
      }
      return '';
   };

   const [error, setError] = useState('');
   const [successMessage, setSuccessMessage] = useState('');

   const toggleForm = () => {
      setIsLogin(!isLogin);
      setError('');
      setSuccessMessage('');
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const showMessage = (message, isSuccess) => {
      if (isSuccess) {
         setSuccessMessage(message);
      } else {
         setError(message);
      }
      setTimeout(() => {
         if (isSuccess) {
            setSuccessMessage('');
         } else {
            setError('');
         }
      }, 10000);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');
      const  validationError = validateForm();

      if (validationError) {
         setError('');
         showMessage(validationError, false);
      } else {
         const url = isLogin ? 'http://localhost:8080/user/login' : 'http://localhost:8080/user/register';

         try {
            const response = await fetch(url, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(formData)
            });

            const data = await response.json();
            setToken(data.token);
            setUsername(data.username);
            setRole(data.role);

            if (response.ok) {
               showMessage(data.message, true);
               localStorage.setItem("token", data.token);
               localStorage.setItem("login", data.username);
               localStorage.setItem("role", data.role);
            } else {
               showMessage(data.message, false);
            }
         } catch (error) {
            showMessage('Ошибка при отправке данных', false);
         }
      }
   };

   return (
      <div className='auth'>
         <div className='auth_container'>
            <div className='form_container'>
               <form className='auth_form' onSubmit={handleSubmit}>
                  <div className='form_inputs_container'>
                     <h2 className='form_title'>{isLogin ? 'Вход' : 'Регистрация'}</h2>

                     {isLogin ? (
                        <>
                           <div className='input_container'>
                              <legend className='input_title'>Логин</legend>
                              <input
                                 className='auth_input'
                                 type='text'
                                 name='login'
                                 value={formData.login}
                                 onChange={handleChange}
                                 required
                              />
                           </div>
                        </>
                     ) : (
                        <>
                           <div className='input_container'>
                              <legend className='input_title'>Имя</legend>
                              <input
                                 className='auth_input'
                                 type='text'
                                 name='firstName'
                                 value={formData.firstName}
                                 onChange={handleChange}
                                 required
                              />
                           </div>

                           <div className='input_container'>
                              <legend className='input_title'>Фамилия</legend>
                              <input
                                 className='auth_input'
                                 type='text'
                                 name='secondName'
                                 value={formData.secondName}
                                 onChange={handleChange}
                                 required
                              />
                           </div>

                           <div className='input_container'>
                              <legend className='input_title'>Отчество</legend>
                              <input
                                 className='auth_input'
                                 type='text'
                                 name='thirdName'
                                 value={formData.thirdName}
                                 onChange={handleChange}
                                 required
                              />
                           </div>

                           <div className='input_container'>
                              <legend className='input_title'>Логин</legend>
                              <input
                                 className='auth_input'
                                 type='text'
                                 name='login'
                                 value={formData.login}
                                 onChange={handleChange}
                                 required
                              />
                           </div>
                        </>
                     )}

                     <div className='input_container'>
                        <legend className='input_title'>Пароль</legend>
                        <input
                           className='auth_input'
                           type='password'
                           name='password'
                           value={formData.password}
                           onChange={handleChange}
                           required
                        />
                     </div>

                     {!isLogin && (
                        <div className='input_container'>
                           <legend className='input_title'>Роль</legend>
                           <select
                              name='role'
                              value={formData.role}
                              onChange={handleChange}
                              className='auth_input'
                           >
                              <option value="Пользователь">Пользователь</option>
                              <option value="Руководитель">Руководитель</option>
                           </select>
                        </div>
                     )}
                  </div>

                  <div className='buttons_container'>
                     <button className='yellow_button' type='submit'>
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                     </button>

                     <p className='toggle_form' onClick={toggleForm}>
                        {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                     </p>
                  </div>

               </form>
            </div>
         </div>

         {error && <p className='error_message message'>{error}</p>}
         {successMessage && <p className='success_message message'>{successMessage}</p>}

      </div>
   );
};

export default Auth;