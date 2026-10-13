// LOGIC THUẦN của Task Tracker — KHÔNG đụng DOM, không external deps.
// Export theo ESM để test trực tiếp bằng node:test.

/** Kiểm tra tính hợp lệ của tiêu đề task. */
export function validateTask(rawTitle) {
  const title = String(rawTitle ?? '').trim();
  if (!title) return { ok: false, error: 'Tiêu đề không được trống' };
  if (title.length > 200) return { ok: false, error: 'Tiêu đề tối đa 200 ký tự' };
  return { ok: true, title };
}

/** Tạo id tăng dần dựa trên id lớn nhất hiện có (>= 1). */
export function nextId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

/** Thêm task mới (immutable — trả về MẢNG MỚI). */
export function addTask(tasks, rawTitle) {
  const v = validateTask(rawTitle);
  if (!v.ok) throw new Error(`Tiêu đề trống`);
  return [...tasks, { id: nextId(tasks), title: v.title, done: false }];
}

/** Đảo trạng thái hoàn thành của task có id (immutable). */
export function toggleDone(tasks, id) {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

/** Xoá task theo id (immutable). */
export function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

/** Lọc theo trạng thái: 'all' | 'active' | 'done'. */
export function filterBy(tasks, status = 'all') {
  switch (status) {
    case 'active':
      return tasks.filter((t) => !t.done);
    case 'done':
      return tasks.filter((t) => t.done);
    default:
      return tasks;
  }
}

/** Thống kê nhanh cho header/footer. */
export function summary(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  return { total, done, active: total - done };
}
