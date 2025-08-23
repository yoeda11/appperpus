// Do your work here...
// console.log('Hello, world!');


    
    const incompleteBookList = [];
    const FRESH_EVENT = 'render-todo';
    const SIMPAN_EVENT = 'simpan-todo';
    const KEY_SIMPAN = 'APP_PERPUS';

    function buatId() {
        return +new Date();
    }

    function buatTodoObject(id, task, task2, task3, timestamp, isCompleted) {
        return {
            id,
            task,
            task2,
            task3,
            timestamp,
            isCompleted
        };
    }

    function findTodo(todoId) {
        for (const todoItem of incompleteBookList) {
            if (todoItem.id === todoId) {
                return todoItem;
            }
        }
        return null;
    }

    function findTodoIndex(todoId) {
        for (const index in incompleteBookList) {
            if (incompleteBookList [index].id === todoId) {
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
            const parsed = JSON.stringify(incompleteBookList);
            localStorage.setItem(KEY_SIMPAN, parsed);
            document.dispatchEvent(new Event(SIMPAN_EVENT));
        }
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(KEY_SIMPAN);
        let data = JSON.parse(serializedData);

        if (data !== null) {
            for (const todo of data) {
                incompleteBookList.push(todo);
            }
        }
        document.dispatchEvent(new Event(FRESH_EVENT));
    }

    function makeTodo(todoObject) {
        const {id, task, task2, task3, timestamp, isCompleted} = todoObject;

        const textTitle = document.createElement('h2');
        textTitle.innerText = task;

        // --------------

        const textTitle2 = document.createElement('h2');
        textTitle.innerText = task2;

        const textTitle3 = document.createElement('h2');
        textTitle.innerText = task3;

        // --------------

        const textTimestamp = document.createElement('p');
        textTimestamp.innerText = timestamp;

        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTitle2, textTitle3, textTimestamp);

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
        incompleteBookList.push(todoObject);

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

        incompleteBookList.splice(todoTarget, 1);
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

        const submitForm = document.getElementById('bookForm');

        submitForm.addEventListener('bookFormSubmit', function (event) {
            event.preventDefault();
            addTodo();
        });

        if (isStorageExist()) {
            loadDataFromStorage();
        }
    });

    document.addEventListener(SIMPAN_EVENT, function () {
        console.log('Data berhasil disimpan');
    });

    document.addEventListener(FRESH_EVENT, function () {
        const uncompletedTODOList = document.getElementById('incompleteBookList');
        const listCompleted = document.getElementById('completeBookList');

        uncompletedTODOList.innerHTML = '';
        listCompleted.innerHTML = '';

        for (const todoItem of incompleteBookList) {
            const todoElement = makeTodo(todoItem);
            if (todoItem.isCompleted) {
                listCompleted.append(todoElement);
            } else {
                uncompletedTODOList.append(todoElement);
            }
        }
    });
    



