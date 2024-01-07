import { _getUsers, _getQuestions } from './_DATA.js';

const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = '/login.html';
}

const username = document.getElementById('username');
const avatar = document.getElementById('avatar');
const logout = document.getElementById('logout');
const answered = document.getElementById('answered');
const not_answered = document.getElementById('not-answered');
const not_answered_text = document.getElementById('not-answered-text');
const answered_text = document.getElementById('answered-text');
const polls = document.getElementById('polls');

let notAnsweredHtml = '';
let answeredHtml = '';
let notAnsweredCount = 0;
let answeredCount = 0;

_getUsers().then(async users => {
    const user = Object.values(users).find(user => user.name === currentUser);

    if (!user) {
        window.location.href = '/login.html';
    } else {
        username.innerHTML = user.name;
        avatar.setAttribute('src', user.avatarURL);

        const questions = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : await _getQuestions();

        for (const question of Object.values(questions)) {
            if (question.optionOne.votes.includes(user.id) || question.optionTwo.votes.includes(user.id)) continue;

            const author = Object.values(users).find(user => user.id === question.author);
            notAnsweredCount++;
            notAnsweredHtml += `<section class="min-h-[200px] p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <section class="max-w-64">
                    <h2 class="font-semibold text-base">${author.name} demande</h2>
                    <span class="text-xs">Est-ce que tu préfères ${question.optionOne.text} ou ${question.optionTwo.text}</span>
                </section>
                <img class="h-20" src="${author?.avatarURL}" alt="avatar">
            </header>
            <footer class="w-full text-sm mt-auto py-2 border-solid border-2 rounded border-[#9f9f9f]">
                <button class="w-full mt-auto" onclick="window.location.href = '/questions.html?id=${question.id}'">Voir le sondage</button>
            </footer>
        </section>`;
        }

        not_answered_text.innerHTML = notAnsweredCount;
        if (notAnsweredHtml) polls.innerHTML = notAnsweredHtml;

        const answeredQuestions = getAnsweredQuestions(user.id, questions);

        for (const answer of answeredQuestions) {
            const question = Object.values(questions).find(question => question.id === answer);
            const author = Object.values(users).find(user => user.id === question.author);

            answeredCount++;
            answeredHtml += `<section class="min-h-[200px] p-4 flex flex-col border-solid border rounded-md min-w-96">
            <header class="flex justify-between">
                <section class="max-w-64">
                    <h2 class="font-semibold text-base">${author.name} demande</h2>
                    <span class="text-xs">Est-ce que tu préfères ${question.optionOne.text} ou ${question.optionTwo.text}</span>
                </section>
                <img class="h-20" src="${author?.avatarURL}" alt="avatar">
            </header>
            <footer class="w-full text-sm mt-auto py-2 border-solid border-2 rounded border-[#9f9f9f]">
                <button class="w-full mt-auto" onclick="window.location.href = '/questions.html?id=${question.id}'">Voir le sondage</button>
            </footer>
        </section>`;
        }

        answered_text.innerHTML = answeredCount;
    }
})

function getAnsweredQuestions(userId, questions) {
    const answeredQuestions = [];

    for (const question of Object.values(questions)) {
        if (question.optionOne.votes.includes(userId) || question.optionTwo.votes.includes(userId)) {
            answeredQuestions.push(question.id);
        }
    }

    return answeredQuestions;
}

answered.onclick = () => {
    if (answered.classList.contains('answered')) return;
    else {
        if (answeredHtml) polls.innerHTML = answeredHtml;
        else polls.innerHTML = '<h2>Pas de question</h2>';
        not_answered.classList.add('border-white');
        not_answered.classList.remove('not-answered');
        answered.classList.remove('border-white');
        answered.classList.add('border-solid', 'border-x', 'border-t', 'answered');
    }
}

logout.onclick = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}