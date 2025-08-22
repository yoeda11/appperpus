// Do your work here...
// console.log('Hello, world!');


    
    const todos = [];
    const FRESH_EVENT = 'render-todo';
    const SIMPAN_EVENT = 'simpan-todo';
    const KEY_SIMPAN = 'APP_PERPUS';

    function buatId() {
        return +new Date();
    }

    function buatTodoObject(id, task, timestamp, isCompleted) {
        return {
            id,
            task,
            timestamp,
            isCompleted
        };
    }

    function findTodo(todoId) {
        for (const todoItem of todos) {
            if (todoItem.id === todoId) {
                return todoItem;
            }
        }
        return null;
    }

    function findTodoIndex(todoId) {
        for (const index in todos) {
            if (todos [index].id === todoId) {
                return index;
            }
        }
        return -1;
    }

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Browser tidak mendukung');
            return false;
        }
        return true;
    }

    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(todos);
            localStorage.setItem(KEY_SIMPAN, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(KEY_SIMPAN);
        let data = JSON.parse(serializedData);

        if (data !== null) {
            for (const todo of data) {
                todos.push(todo);
            }
        }
        document.dispatchEvent(new Event(FRESH_EVENT));
    }

    function makeTodo(todoObject) {
        const {id, task, timestamp,isCompleted} = todoObject;

        const textTitle = document.createElement('h2');
        textTitle.innerText = task;

        const textTimestamp = document.createElement('p');
        textTimestamp.innerText = timestamp;

        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp);

        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer); // yang diganti
        container.setAttribute('id', `todo-${id}`)

        if (isCompleted) {

            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');
            undoButton.addEventListener('click', function () {
                undoTaskFromCompleted(id);
            });

            // tambahan
            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');
            trashButton.addEventListener('click', function () {
                removeTaskFromCompleted(id);
            });

            container.append(undoButton, trashButton);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
            checkButton.addEventListener('click', function () {
                addTaskToCompleted(id);
            });

            container.append(checkButton);
        }

        return container;
    }

    function addTodo() {
        const textTodo = document.getElementById('bookFormTitle').value;
        const textTodoaut = document.getElementById('bookFormAuthor').value;
        const textTodoyear = document.getElementById('bookFormYear').value;
        const timestamp = document.getElementById('date').value;

        const generatedID = buatId();
        const todoObject = buatTodoObject(generatedID, textTodo, textTodoaut, textTodoyear, timestamp, false );
        todos.push(todoObject);

        document.dispatchEvent(new Event(FRESH_EVENT));
        saveData();
    }

    function addTaskToCompleted(todoId) {
        const todoTarget = findTodo(todoId);

        if (todoTarget == null) return;

        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(FRESH_EVENT));
        saveData();
    }

    function removeTaskFromCompleted(todoId) {
        const todoTarget = findTodoIndex(todoId);

        if (todoTarget === -1) return;

        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(FRESH_EVENT));
        saveData();
    }

    function undoTaskFromCompleted(todoId) {

        const todoTarget = findTodo(todoId);
        if (todoTarget == null) return;

        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(FRESH_EVENT));

        //todoTarget.isCompleted(new Event(FRESH_EVENT));
        saveData();
    }

    document.addEventListener('DOMContentLoaded', function () {

        const submitForm = document.getElementById('form');

        submitForm.addEventListener('bookFormSubmit', function (event) {
            event.preventDefault();
            addTodo();
        });

        if (isStorageExist()) {
            loadDataFromStorage();
        }
    });

    document.addEventListener(SAVED_EVENT, function () {
        console.log('Data berhasil disimpan');
    });

    document.addEventListener(FRESH_EVENT, function () {
        const uncompletedTODOList = document.getElementById('todos');
        const listCompleted = document.getElementById('completed-todos');

        uncompletedTODOList.innerHTML = '';
        listCompleted.innerHTML = '';

        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (todoItem.isCompleted) {
                listCompleted.append(todoElement);
            } else {
                uncompletedTODOList.append(todoElement);
            }
        }
    });
    



