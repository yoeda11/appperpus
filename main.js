// Do your work here...
// console.log('Hello, world!');



const incompleteBookList = [];
const FRESH_EVENT = 'render-todo';
const SIMPAN_EVENT = 'simpan-todo';
const KEY_SIMPAN = 'APP_PERPUS';

function buatId() {
return +new Date();
}

function buatTodoObject(id, task, task2, task3, /* timestamp ,*/ isComplete) {
    return {
        id,
        task,
        task2,
        task3,
        /* timestamp, */
        isComplete
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
    const {id, task, task2, task3, /* timestamp ,*/ isComplete} = todoObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = task;
    textTitle.dataset.testid = 'bookItemTitle';
    // textTitle.classList.add('bookItemTitle');

    // --------------

    const textTitle2 = document.createElement('p');
    textTitle2.innerText = task2;
    textTitle2.dataset.testid = 'bookItemAuthor';
    // textTitle2.classList.add('bookItemAuthor');


    const textTitle3 = document.createElement('p');
    textTitle3.innerText = task3;
    textTitle3.dataset.testid = 'bookItemYear';
    // textTitle3.classList.add('bookItemYear');

    // --------------

    /*
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = timestamp;
    */

    const textContainer = document.createElement('div');
    textContainer.dataset.testid = 'bookItem';
    // textContainer.classList.add('inner');
    textContainer.append(textTitle, textTitle2, textTitle3, /* textTimestamp */);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer); // yang diganti
    container.setAttribute('id', `todo-${id}`)

    if (isComplete) {

        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum selesai dibaca';
        
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(id);
        });

        // tambahan
        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.dataset.testid = 'bookItemDeleteButton';
        // trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Selesai dibaca';
        checkButton.dataset.testid = 'bookItemIsCompleteButton';
        // checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(id);
        });

        const trashButton1 = document.createElement('button');
        trashButton1.innerText = 'Hapus Buku';
        trashButton1.dataset.testid = 'bookItemDeleteButton';
        // trashButton1.classList.add('trash-button');
        trashButton1.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        container.append(checkButton, trashButton1);
    }

    return container;
}

function addTodo() {
    const textTodo = document.getElementById('bookFormTitle').value;
    const textTodoaut = document.getElementById('bookFormAuthor').value;
    const textTodoyear = document.getElementById('bookFormYear').value;
    const textTodoyearnum = Number(textTodoyear);
    // const timestamp = document.getElementById('date').value;

    const generatedID = buatId();
    const todoObject = buatTodoObject(generatedID, textTodo, textTodoaut, textTodoyearnum, /* timestamp, */ false );
    incompleteBookList.push(todoObject);

    document.dispatchEvent(new Event(FRESH_EVENT));
    saveData();
}

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isComplete = true;
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

    todoTarget.isComplete = false;
    document.dispatchEvent(new Event(FRESH_EVENT));

    //todoTarget.isCompleted(new Event(FRESH_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('bookForm');

    submitForm.addEventListener('submit', function (event) {
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
        if (todoItem.isComplete) {
            listCompleted.append(todoElement);
        } else {
            uncompletedTODOList.append(todoElement);
        }
    }
});




