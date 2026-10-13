// Test LOGIC THUẦN của task tracker — node:test, không DOM, không mock.
// TDD RED: chạy trước khi lib/tasks.js tồn tại → phải FAIL.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTask,
  addTask,
  toggleDone,
  removeTask,
  filterBy,
  summary,
} from '../lib/tasks.js';

test('validateTask: từ chối tiêu đề trống', () => {
  assert.equal(validateTask('   ').ok, false);
});

test('validateTask: từ chối tiêu đề > 200 ký tự', () => {
  assert.equal(validateTask('x'.repeat(201)).ok, false);
});

test('validateTask: cắt khoảng trắng thừa', () => {
  assert.deepEqual(validateTask('  Học thuật toán  '), { ok: true, title: 'Học thuật toán' });
});

test('addTask: thêm vào cuối, done=false, id tăng, KHÔNG đổi mảng gốc', () => {
  const before = [];
  const after = addTask(before, 'Việc 1');
  assert.equal(after.length, 1);
  assert.equal(after[0].title, 'Việc 1');
  assert.equal(after[0].done, false);
  assert.equal(after[0].id, 1);
  assert.deepEqual(before, []);
});

test('addTask: id tự tăng dần', () => {
  let tasks = addTask([], 'A');
  tasks = addTask(tasks, 'Việc 2');
  assert.deepEqual(tasks.map((t) => t.id), [1, 2]);
});

test('addTask: ném lỗi với tiêu đề rỗng', () => {
  assert.throws(() => addTask([], '   '), /trống/);
});

test('toggleDone: đảo trạng thái đúng phần tử', () => {
  let tasks = addTask(addTask([], 'A'), 'B');
  tasks = toggleDone(tasks, 1);
  assert.equal(tasks.find((t) => t.id === 1).done, true);
  assert.equal(tasks.find((t) => t.id === 2).done, false);
  tasks = toggleDone(tasks, 1);
  assert.equal(tasks.find((t) => t.id === 1).done, false);
});

test('removeTask: xoá đúng id', () => {
  let tasks = addTask(addTask([], 'A'), 'B');
  tasks = removeTask(tasks, 1);
  assert.deepEqual(tasks.map((t) => t.title), ['B']);
});

test('filterBy: all / active / done', () => {
  let tasks = addTask(addTask([], 'A'), 'B');
  tasks = toggleDone(tasks, 1);
  assert.equal(filterBy(tasks, 'all').length, 2);
  assert.deepEqual(filterBy(tasks, 'active').map((t) => t.title), ['B']);
  assert.deepEqual(filterBy(tasks, 'done').map((t) => t.title), ['A']);
});

test('summary: đếm tổng / còn lại / hoàn thành', () => {
  let tasks = addTask(addTask(addTask([], 'A'), 'B'), 'C');
  tasks = toggleDone(tasks, 2);
  assert.deepEqual(summary(tasks), { total: 3, done: 1, active: 2 });
  assert.deepEqual(summary([]), { total: 0, done: 0, active: 0 });
});
