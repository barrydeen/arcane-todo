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

  let todos = load();

  function render() {
    list.innerHTML = '';
    todos.forEach(function (todo, i) {
      const li = document.createElement('li');
      if (todo.done) li.classList.add('done');

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
    countEl.textContent = active + ' task' + (active !== 1 ? 's' : '') + ' remaining';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    todos.push({ text: text, done: false });
    save(todos);
    input.value = '';
    render();
  });

  clearBtn.addEventListener('click', function () {
    todos = todos.filter(function (t) { return !t.done; });
    save(todos);
    render();
  });

  render();
})();
