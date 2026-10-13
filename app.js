// Wiring DOM → MỌI logic nghiệp vụ nằm trong lib/tasks.js (qua HTTP-less ESM import)

import { addTask, toggleDone, removeTask, filterBy, summary } from './lib/tasks.js';

const STORAGE_KEY = 'tasktracker.tasks.v1';
let tasks = [];            // state chính
let currentFilter = 'all'; // 'all' | 'active' | 'done'

const $ = (sel) => document.querySelector(sel);

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function restore() {
  try {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    tasks = [];
  }
}

function render() {
  const visible = filterBy(tasks, currentFilter);
  const list = $('#task-list');

  list.innerHTML = '';
  for (const task of visible) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      tasks = toggleDone(tasks, task.id);
      persist();
      render();
    });

    const span = document.createElement('span');
    span.textContent = task.title;

    const del = document.createElement('button');
    del.textContent = '✕';
    del.addEventListener('click', () => {
      tasks = removeTask(tasks, task.id);
      persist();
      render();
    });

    li.append(checkbox, span, del);
    list.appendChild(li);
  }

  const s = summary(tasks);
  $('#stats').textContent = `Tổng: ${s.total} · Đang làm: ${s.active} · Xong: ${s.done}`;
  $('#footer').textContent =
    s.total === 0 ? '' : `${s.active} việc còn lại — giữ tinh thần nhé! 💪`;
}

$('#add-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#task-input');
  const errEl = $('#error');
  errEl.hidden = true;
  try {
    tasks = addTask(tasks, input.value);
    input.value = '';
    persist();
    render();
  } catch (msg) {
    errEl.textContent = msg;
    errEl.hidden = false;
  }
  input.focus();
});

document.querySelectorAll('.filters button').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filters button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

restore();
render();
