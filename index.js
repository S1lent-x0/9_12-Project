let expenses = [];
        let incomes = [];
        let currentQuestion = 0;
        const quizData = [
            {
                question: "Вам звонят из 'банка' и просят назвать код из SMS для 'проверки безопасности'. Что делать?",
                options: [
                    "Назвать код, ведь это банк",
                    "Спросить имя сотрудника",
                    "Повесить трубку и позвонить в банк сам",
                    "Попросить перезвонить позже"
                ],
                correct: 2,
                explanation: "Банки НИКОГДА не просят SMS-коды. Это мошенники! Повесьте трубку и сами позвоните в банк по номеру с карты."
            },
            {
                question: "В соцсетях предлагают инвестировать 100₼ и через месяц получить 500₼. Что это?",
                options: [
                    "Отличная возможность заработать",
                    "Финансовая пирамида - мошенничество",
                    "Законная инвестиция",
                    "Нужно проверить отзывы"
                ],
                correct: 1,
                explanation: "Это классическая финансовая пирамида. Никто не даст вам 400% прибыли за месяц легально."
            },
            {
                question: "Вы выиграли приз! Для получения нужно оплатить доставку 50₼. Ваши действия?",
                options: [
                    "Оплатить, ведь приз дороже",
                    "Попросить прислать приз наложенным платежом",
                    "Узнать подробности у организаторов",
                    "Игнорировать - это мошенничество"
                ],
                correct: 3,
                explanation: "Настоящие призы не требуют предоплаты. Это популярная схема мошенничества."
            },
            {
                question: "Email от 'банка' с ссылкой на обновление данных. Что делать?",
                options: [
                    "Перейти и ввести данные",
                    "Удалить email и проверить на официальном сайте",
                    "Ответить на email",
                    "Поделиться с друзьями"
                ],
                correct: 1,
                explanation: "Это фишинг. Банки не отправляют такие ссылки. Проверьте на официальном сайте самостоятельно."
            },
            {
                question: "Друг просит срочно перевести деньги через WhatsApp. Что проверить?",
                options: [
                    "Позвонить другу для подтверждения",
                    "Ничего, перевести сразу",
                    "Спросить детали в чате",
                    "Подождать до завтра"
                ],
                correct: 0,
                explanation: "Аккаунты могут быть взломаны. Всегда подтверждайте по телефону или лично."
            },
            {
                question: "Сайт предлагает купить товар по суперцене, но оплата только картой. Риск?",
                options: [
                    "Нет риска, купить",
                    "Купить малую сумму",
                    "Использовать виртуальную карту",
                    "Подозрительно, проверить сайт"
                ],
                correct: 3,
                explanation: "Подозрительные сайты крадут данные карт. Проверьте отзывы, сертификаты и используйте защиту."
            }
        ];
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const toggle = document.querySelector('.theme-toggle');
            toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        }
        function addIncome() {
            const name = document.getElementById('incomeName').value;
            const amount = parseFloat(document.getElementById('incomeAmount').value);
            const category = document.getElementById('incomeCategory').value;
            if (!name || !amount || amount <= 0) {
                alert('Пожалуйста, заполните все поля корректно');
                return;
            }
            incomes.push({ name, amount, category });
            document.getElementById('incomeName').value = '';
            document.getElementById('incomeAmount').value = '';
            renderIncomes();
            updateBalance();
        }
        function addExpense() {
            const name = document.getElementById('expenseName').value;
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const category = document.getElementById('expenseCategory').value;
            if (!name || !amount || amount <= 0) {
                alert('Пожалуйста, заполните все поля корректно');
                return;
            }
            expenses.push({ name, amount, category });
            document.getElementById('expenseName').value = '';
            document.getElementById('expenseAmount').value = '';
            renderExpenses();
            updateBalance();
        }
        function deleteIncome(index) {
            incomes.splice(index, 1);
            renderIncomes();
            updateBalance();
        }
        function deleteExpense(index) {
            expenses.splice(index, 1);
            renderExpenses();
            updateBalance();
        }
        function renderIncomes() {
            const list = document.getElementById('incomeList');
            const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);
            list.innerHTML = incomes.map((inc, i) => `
                <div class="income-item">
                    <div class="income-item-info">
                        <div class="income-item-category">${inc.category}</div>
                        <div class="income-item-name">${inc.name}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div class="income-item-amount">+${inc.amount} ₼</div>
                        <button class="income-item-delete" onclick="deleteIncome(${i})">Удалить</button>
                    </div>
                </div>
            `).join('');
            document.getElementById('totalIncome').textContent = `Итого доходы: ${total.toFixed(2)} ₼`;
        }
        function renderExpenses() {
            const list = document.getElementById('expenseList');
            const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            list.innerHTML = expenses.map((exp, i) => `
                <div class="expense-item">
                    <div class="expense-item-info">
                        <div class="expense-item-category">${exp.category}</div>
                        <div class="expense-item-name">${exp.name}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div class="expense-item-amount">-${exp.amount} ₼</div>
                        <button class="expense-item-delete" onclick="deleteExpense(${i})">Удалить</button>
                    </div>
                </div>
            `).join('');
            document.getElementById('totalExpense').textContent = `Итого расходы: ${total.toFixed(2)} ₼`;
        }
        function updateBalance() {
            const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
            const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const balanceAmount = totalIncome - totalExpense;
            const balanceDiv = document.getElementById('balance');
            balanceDiv.textContent = `Баланс: ${balanceAmount.toFixed(2)} ₼`;
            if (balanceAmount >= 0) {
                balanceDiv.classList.add('positive');
                balanceDiv.classList.remove('negative');
            } else {
                balanceDiv.classList.add('negative');
                balanceDiv.classList.remove('positive');
            }
        }
        function calculateSavings() {
            const income = parseFloat(document.getElementById('income').value) || 0;
            const goal = parseFloat(document.getElementById('goal').value) || 0;
            if (income <= 0 || goal <= 0) {
                document.getElementById('savingsResult').innerHTML = '';
                return;
            }
            const savingsAmount = income * 0.2; // 20% от дохода
            const monthsNeeded = Math.ceil(goal / savingsAmount);
            const percentage = Math.min((savingsAmount / goal * 100), 100);
            document.getElementById('savingsResult').innerHTML = `
                <div class="savings-result">
                    <h4>Ваш План Накоплений</h4>
                    <p><strong>Откладывайте ежемесячно:</strong> ${savingsAmount.toFixed(2)} ₼ (20% от дохода)</p>
                    <p><strong>Время до цели:</strong> ${monthsNeeded} месяцев</p>
                    <p><strong>Необходимые расходы (50%):</strong> ${(income * 0.5).toFixed(2)} ₼</p>
                    <p><strong>Желаемые расходы (30%):</strong> ${(income * 0.3).toFixed(2)} ₼</p>
                    <div class="savings-progress">
                        <div class="savings-progress-bar" style="width: ${percentage}%">
                            ${percentage.toFixed(1)}%
                        </div>
                    </div>
                </div>
            `;
        }
        function calculateLoan() {
            const amount = parseFloat(document.getElementById('loanAmount').value);
            const rate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
            const term = parseFloat(document.getElementById('loanTerm').value);
            if (!amount || !rate || !term) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
            const totalPayment = monthlyPayment * term;
            const totalInterest = totalPayment - amount;
            const overpaymentPercent = (totalInterest / amount * 100).toFixed(1);
            document.getElementById('loanResult').innerHTML = `
                <div class="loan-result-card">
                    <h4>⚠️ Результаты расчета кредита</h4>
                    <p><strong>Ежемесячный платеж:</strong> ${monthlyPayment.toFixed(2)} ₼</p>
                    <p><strong>Общая сумма выплат:</strong> ${totalPayment.toFixed(2)} ₼</p>
                    <p><strong>Переплата:</strong> ${totalInterest.toFixed(2)} ₼ (${overpaymentPercent}%)</p>
                    <p style="margin-top: 15px; color: #dc2626;"><strong>Вы заплатите на ${overpaymentPercent}% больше!</strong></p>
                </div>
                <div class="savings-result">
                    <h4>💡 Совет</h4>
                    <p>Вместо кредита попробуйте:</p>
                    <p>• Накопить за ${Math.ceil(amount / (monthlyPayment * 0.7))} месяцев</p>
                    <p>• Купить более дешевый вариант</p>
                    <p>• Использовать рассрочку без процентов</p>
                </div>
            `;
        }
        function startQuiz() {
            currentQuestion = 0;
            showQuestion();
        }
        function showQuestion() {
            const quiz = quizData[currentQuestion];
            const progress = ((currentQuestion + 1) / quizData.length * 100);
            document.getElementById('quizProgress').style.width = progress + '%';
            document.getElementById('quizContainer').innerHTML = `
                <div class="quiz-question">${currentQuestion + 1}. ${quiz.question}</div>
                <div class="quiz-options">
                    ${quiz.options.map((option, index) => `
                        <div class="quiz-option" onclick="checkAnswer(${index})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <div id="quizFeedback"></div>
            `;
        }
        function checkAnswer(selected) {
            const quiz = quizData[currentQuestion];
            const feedback = document.getElementById('quizFeedback');
            if (selected === quiz.correct) {
                feedback.innerHTML = `
                    <div class="quiz-result correct">
                        ✅ Правильно! ${quiz.explanation}
                    </div>
                `;
            } else {
                feedback.innerHTML = `
                    <div class="quiz-result incorrect">
                        ❌ Неверно. ${quiz.explanation}
                    </div>
                `;
            }
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < quizData.length) {
                    showQuestion();
                } else {
                    document.getElementById('quizContainer').innerHTML = `
                        <div class="quiz-result correct">
                            <h3>🎉 Квиз завершен!</h3>
                            <p style="margin-top: 15px;">Теперь вы знаете основные признаки мошенничества!</p>
                            <button class="cta-button" onclick="startQuiz()" style="margin-top: 20px;">
                                Пройти еще раз
                            </button>
                        </div>
                    `;
                    document.getElementById('quizProgress').style.width = '100%';
                }
            }, 3000);
        }
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.padding = '0.7rem 0';
            } else {
                header.style.padding = '1rem 0';
            }
        });
        // Запуск квиза при загрузке
        window.addEventListener('load', () => {
            startQuiz();
        });