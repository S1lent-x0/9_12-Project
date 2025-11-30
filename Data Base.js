/*
  БАЗА ДАННЫХ РАБОЧАЯ, НО МЫ НЕ УСПЕЛИ УСТАНОВИТЬ КНОПКИ ЧТОБ ОНА РАБОТАЛА, ЭТОТ ПРОЕКТ МОЖНО БУДЕТ РАЗВИТЬ В БУДУЩЕМ ЭТОЙ БАЗОЙ ДАННЫХ
/*





/* db.js — простой слой "базы данных" поверх localStorage.
   Сохраняет:
     - список пользователей (ключ: fin_users_simple_v1)
     - next id (ключ: fin_next_id_simple_v1)
     - данные каждого пользователя (ключ: fin_userdata_simple_v1_<id>)
   В DEMO-версии пароли хранятся в plain text (по требованию).
*/

const DB = (function() {
  const USERS_KEY = 'fin_users_simple_v1';
  const NEXT_ID_KEY = 'fin_next_id_simple_v1';
  const DATA_PREFIX = 'fin_userdata_simple_v1_';

  function _loadUsers() {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  function _saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function _getNextId() {
    let n = parseInt(localStorage.getItem(NEXT_ID_KEY) || '1', 10);
    localStorage.setItem(NEXT_ID_KEY, String(n + 1));
    return n;
  }
  function _getDataKey(id) {
    return DATA_PREFIX + id;
  }

  return {
    // Список пользователей
    getUsers() {
      return _loadUsers();
    },

    // Регистрация: сохраняем пароль в открытом виде (demo)
    registerUser(login, password) {
      login = String(login || '').trim();
      if (!login || !password) return { success:false, message:'Логин и пароль обязательны' };

      const users = _loadUsers();
      if (users.some(u => u.login.toLowerCase() === login.toLowerCase())) {
        return { success:false, message:'Логин уже занят' };
      }

      const id = _getNextId();
      const user = { id, login, password, createdAt: Date.now() };
      users.push(user);
      _saveUsers(users);

      // создаём пустые данные пользователя
      const empty = { incomes: [], expenses: [] };
      localStorage.setItem(_getDataKey(id), JSON.stringify(empty));

      return { success:true, user };
    },

    // Аутентификация: простой equals по паролю
    authenticate(login, password) {
      const users = _loadUsers();
      const user = users.find(u => u.login.toLowerCase() === String(login).toLowerCase());
      if (!user) return { success:false, message:'Пользователь не найден' };
      if (user.password !== password) return { success:false, message:'Неверный пароль' };
      return { success:true, user };
    },

    // Сохранение и загрузка данных пользователя
    saveUserData(userId, data) {
      if (!userId) return;
      try {
        localStorage.setItem(_getDataKey(userId), JSON.stringify({
          incomes: data.incomes || [],
          expenses: data.expenses || []
        }));
      } catch (e) { console.error('DB save error', e); }
    },

    loadUserData(userId) {
      if (!userId) return { incomes: [], expenses: [] };
      const raw = localStorage.getItem(_getDataKey(userId));
      if (!raw) return { incomes: [], expenses: [] };
      try {
        const parsed = JSON.parse(raw);
        return { incomes: parsed.incomes || [], expenses: parsed.expenses || [] };
      } catch (e) {
        console.error('DB load error', e);
        return { incomes: [], expenses: [] };
      }
    },

    // текущий userId (сессия)
    setCurrentUserId(userId) {
      if (userId == null) localStorage.removeItem('fin_current_user_simple_v1');
      else localStorage.setItem('fin_current_user_simple_v1', String(userId));
    },
    getCurrentUserId() {
      const v = localStorage.getItem('fin_current_user_simple_v1');
      return v ? parseInt(v, 10) : null;
    }
  };
})();
