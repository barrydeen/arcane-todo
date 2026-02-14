(function () {
  'use strict';

  const STORAGE_KEY = 'arcane-todos';
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const countEl = document.getElementById('count');
  const clearBtn = document.getElementById('clear-done');

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  let todos = load();

  // Migrate old todos without IDs
  todos.forEach(function (todo) {
    if (!todo.id) todo.id = generateId();
  });
  save(todos);

  function render() {
    list.innerHTML = '';
    todos.forEach(function (todo, i) {
      const li = document.createElement('li');
      if (todo.done) li.classList.add('done');
      li.setAttribute('data-id', todo.id);

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = todo.done;
      cb.addEventListener('change', function () {
        todos[i].done = cb.checked;
        save(todos);
        render();
      });

      const span = document.createElement('span');
      span.classList.add('text');
      span.textContent = todo.text;

      const del = document.createElement('button');
      del.classList.add('delete');
      del.textContent = '×';
      del.setAttribute('aria-label', 'Delete task');
      del.addEventListener('click', function () {
        todos.splice(i, 1);
        save(todos);
        render();
      });

      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });

    const active = todos.filter(function (t) { return !t.done; }).length;
    const total = todos.length;
    countEl.textContent = active + ' of ' + total + ' task' + (total !== 1 ? 's' : '') + ' remaining';

    clearBtn.style.display = todos.some(function (t) { return t.done; }) ? '' : 'none';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    todos.push({ id: generateId(), text: text, done: false, createdAt: Date.now() });
    save(todos);
    input.value = '';
    render();
  });

  clearBtn.addEventListener('click', function () {
    todos = todos.filter(function (t) { return !t.done; });
    save(todos);
    render();
  });

  // Keyboard shortcut: Escape clears input
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      input.value = '';
      input.blur();
    }
  });

  render();
})();
