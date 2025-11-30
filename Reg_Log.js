/*
  БАЗА ДАННЫХ РАБОЧАЯ, НО МЫ НЕ УСПЕЛИ УСТАНОВИТЬ КНОПКИ ЧТОБ ОНА РАБОТАЛА, ЭТОТ ПРОЕКТ МОЖНО БУДЕТ РАЗВИТЬ В БУДУЩЕМ ЭТОЙ БАЗОЙ ДАННЫХ
/*



/* auth.js — управление регистрацией/входом и интеграция с вашим трекером (New Project.js)
   - использует DB (db.js)
   - при входе загружает данные и записывает в window.incomes / window.expenses
   - оборачивает функции addIncome/addExpense/deleteIncome/deleteExpense, чтобы автоматически сохранять
*/

const UI = (function(){
  const overlay = () => document.getElementById('authOverlay');
  const registerBox = () => document.getElementById('registerBox');
  const loginBox = () => document.getElementById('loginBox');
  const authMessage = () => document.getElementById('authMessage');

  return {
    showRegister() {
      overlay().style.display = 'flex';
      registerBox().style.display = 'block';
      loginBox().style.display = 'none';
      authMessage().textContent = '';
    },
    showLogin() {
      overlay().style.display = 'flex';
      loginBox().style.display = 'block';
      registerBox().style.display = 'none';
      authMessage().textContent = '';
    },
    hideAuth() {
      overlay().style.display = 'none';
      authMessage().textContent = '';
    },
    setMessage(msg, color = '#c00') {
      const el = authMessage();
      el.textContent = msg;
      el.style.color = color;
    }
  };
})();

const Auth = (function(){
  const regLogin = () => document.getElementById('regLogin');
  const regPassword = () => document.getElementById('regPassword');
  const regPassword2 = () => document.getElementById('regPassword2');
  const loginLogin = () => document.getElementById('loginLogin');
  const loginPassword = () => document.getElementById('loginPassword');

  const btnLogin = () => document.getElementById('btn-login');
  const btnRegister = () => document.getElementById('btn-register');
  const btnLogout = () => document.getElementById('btn-logout');

  const profileBox = () => document.getElementById('profileBox');
  const profileLabel = () => document.getElementById('profileLabel');

  // регистрация
  function handleRegister() {
    const login = (regLogin().value || '').trim();
    const pw = regPassword().value || '';
    const pw2 = regPassword2().value || '';

    if (!login || !pw || !pw2) { UI.setMessage('Заполните все поля'); return; }
    if (pw !== pw2) { UI.setMessage('Пароли не совпадают'); return; }

    const res = DB.registerUser(login, pw);
    if (!res.success) { UI.setMessage(res.message); return; }

    UI.setMessage('Регистрация успешна. Войдите.', 'green');
    setTimeout(() => { UI.showLogin(); regLogin().value=''; regPassword().value=''; regPassword2().value=''; }, 700);
  }

  // вход
  function handleLogin() {
    const login = (loginLogin().value || '').trim();
    const pw = loginPassword().value || '';
    if (!login || !pw) { UI.setMessage('Введите логин и пароль'); return; }

    const res = DB.authenticate(login, pw);
    if (!res.success) { UI.setMessage(res.message); return; }

    const user = res.user;
    DB.setCurrentUserId(user.id);

    const data = DB.loadUserData(user.id);

    // записываем в глобальные массивы сайта (ваш трекер использует incomes/expenses)
    window.incomes = Array.isArray(data.incomes) ? data.incomes : [];
    window.expenses = Array.isArray(data.expenses) ? data.expenses : [];

    // вызов функций рендеринга из New Project.js
    if (typeof renderIncomes === 'function') renderIncomes();
    if (typeof renderExpenses === 'function') renderExpenses();
    if (typeof updateBalance === 'function') updateBalance();

    // UI
    profileBox().style.display = 'block';
    profileLabel().textContent = `Пользователь: ${user.login} (ID: ${user.id})`;
    btnLogin().style.display = 'none';
    btnRegister().style.display = 'none';
    btnLogout().style.display = 'inline-block';

    UI.setMessage('Вход выполнен', 'green');
    setTimeout(() => UI.hideAuth(), 700);
  }

  // выход
  function logout() {
    const currentId = DB.getCurrentUserId();
    if (currentId) {
      DB.saveUserData(currentId, { incomes: window.incomes || [], expenses: window.expenses || [] });
    }
    DB.setCurrentUserId(null);
    window.incomes = [];
    window.expenses = [];

    if (typeof renderIncomes === 'function') renderIncomes();
    if (typeof renderExpenses === 'function') renderExpenses();
    if (typeof updateBalance === 'function') updateBalance();

    profileBox().style.display = 'none';
    profileLabel().textContent = '';
    document.getElementById('btn-login').style.display = 'inline-block';
    document.getElementById('btn-register').style.display = 'inline-block';
    document.getElementById('btn-logout').style.display = 'none';

    alert('Вы вышли. Данные сохранены локально.');
  }

  // сохраняем текущие данные пользователя
  function saveCurrentUserData() {
    const currentId = DB.getCurrentUserId();
    if (!currentId) return;
    DB.saveUserData(currentId, { incomes: window.incomes || [], expenses: window.expenses || [] });
  }

  // обёртки функций трекера — чтобы после изменения автоматически сохранять данные и обновлять график
  function wrapTrackerFunctions() {
    if (typeof addIncome === 'function') {
      const origAddIncome = addIncome;
      window.addIncome = function() {
        origAddIncome();
        // добавляем createdAt для последней транзакции, чтобы график имел время
        try {
          const last = window.incomes && window.incomes[window.incomes.length - 1];
          if (last && !last.createdAt) last.createdAt = Date.now();
        } catch(e){}
        saveCurrentUserData();
        if (window.BalanceChart && typeof window.BalanceChart.update === 'function') window.BalanceChart.update();
      };
    }
    if (typeof addExpense === 'function') {
      const origAddExpense = addExpense;
      window.addExpense = function() {
        origAddExpense();
        try {
          const last = window.expenses && window.expenses[window.expenses.length - 1];
          if (last && !last.createdAt) last.createdAt = Date.now();
        } catch(e){}
        saveCurrentUserData();
        if (window.BalanceChart && typeof window.BalanceChart.update === 'function') window.BalanceChart.update();
      };
    }
    if (typeof deleteIncome === 'function') {
      const origDeleteIncome = deleteIncome;
      window.deleteIncome = function(i) {
        origDeleteIncome(i);
        saveCurrentUserData();
        if (window.BalanceChart && typeof window.BalanceChart.update === 'function') window.BalanceChart.update();
      };
    }
    if (typeof deleteExpense === 'function') {
      const origDeleteExpense = deleteExpense;
      window.deleteExpense = function(i) {
        origDeleteExpense(i);
        saveCurrentUserData();
        if (window.BalanceChart && typeof window.BalanceChart.update === 'function') window.BalanceChart.update();
      };
    }

    // autosave перед закрытием вкладки
    window.addEventListener('beforeunload', () => saveCurrentUserData());
  }

  function tryRestoreSession() {
    const currentId = DB.getCurrentUserId();
    if (currentId) {
      const users = DB.getUsers();
      const u = users.find(x => x.id === currentId);
      if (u) {
        const data = DB.loadUserData(currentId);
        window.incomes = Array.isArray(data.incomes) ? data.incomes : [];
        window.expenses = Array.isArray(data.expenses) ? data.expenses : [];

        if (typeof renderIncomes === 'function') renderIncomes();
        if (typeof renderExpenses === 'function') renderExpenses();
        if (typeof updateBalance === 'function') updateBalance();

        document.getElementById('profileBox').style.display = 'block';
        document.getElementById('profileLabel').textContent = `Пользователь: ${u.login} (ID: ${u.id})`;
        document.getElementById('btn-login').style.display = 'none';
        document.getElementById('btn-register').style.display = 'none';
        document.getElementById('btn-logout').style.display = 'inline-block';
      } else {
        DB.setCurrentUserId(null);
      }
    }
  }

  function init() {
    wrapTrackerFunctions();
    tryRestoreSession();
  }

  return { init, handleRegister, handleLogin, logout, saveCurrentUserData };
})();

// expose for HTML buttons
window.Auth = {
  handleRegister: Auth.handleRegister,
  handleLogin: Auth.handleLogin,
  logout: Auth.logout,
  init: Auth.init
};

// инициализация при загрузке
window.addEventListener('load', () => {
  Auth.init && Auth.init();
});

