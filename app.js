"use sctrict";


//Selectors 
    const addItem = document.querySelector(".todo-add"),
            valueItem = document.querySelector(".todo-input"),
            listItems = document.querySelector(".todo-list"),
            infoText = document.querySelector(".item-info");

    let dataItems = [];

//Event
document.addEventListener('DOMContentLoaded', function(){
    if ( localStorage.getItem("todo") ) {
        dataItems = JSON.parse( localStorage.getItem("todo") );



        renderListItem();
    } else {
        infoText.innerHTML = "Задач нет";
    }
});

addItem.addEventListener("click", e => {


    if ( valueItem.value != "") {

        listItems.innerHTML = "";
        addItemToLocalStorage();
        dataItems = JSON.parse( localStorage.getItem("todo") );
        renderListItem();
        valueItem.value = "";

    }

    
});

listItems.addEventListener("click", e => {
    const target = e.target;
    const items = document.querySelectorAll(".todo-item");



    


    if ( target.parentElement.classList.contains("delete") ) {


        let idItemSelector = target.parentElement.parentElement.parentElement.id;
        idItemSelector = idItemSelector.replace(/item_/, "");


        removeItem( { id:idItemSelector, item: target.parentElement.parentElement.parentElement  } );
    }


    if ( target.parentElement.classList.contains("completed") ) {
        const item = target.parentElement.parentElement.parentElement;
        changeStatus( {item} );
    }


});

//Functions
function addItemToLocalStorage() {
    const itemValue = valueItem.value;
    if ( valueItem.value === "") { return; }

    const dataItem = {
        value: itemValue,
        status: false
    };
    dataItems.push(dataItem);
    localStorage.setItem("todo", JSON.stringify(dataItems));
}
function renderListItem() {
    let localItems = JSON.parse( localStorage.getItem("todo") );
    localItems.forEach( (item, i) => {
        let completedClass = "", completedIcon = "fas fa-check";
        if( item.status === "true" ) {
            completedClass = " todo--completed";
            completedIcon = "fas fa-undo-alt";
        }
        let innerTodoList = `<div class="todo-item${completedClass}" id="item_${ i }" data-completed="${item.status}">
                    <div class="item-num">${ i + 1 }.</div>
                    <div class="item-text">${item.value}</div>
                    <div class="item-action">
                        <button class="completed"><i class="${completedIcon}"></i></button>
                        <button class="delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
        listItems.innerHTML += innerTodoList;
    });
    infoText.innerHTML = `Вы имеете ${localItems.length} задач`;
}
function removeItem( {id, item} ) {
    dataItems = JSON.parse( localStorage.getItem("todo") );
    dataItems.splice(id, 1);
    localStorage.setItem("todo", JSON.stringify(dataItems));
    item.remove();
    if ( !dataItems ) {
        infoText.innerHTML = "Задач нет";
    }
    infoText.innerHTML = `Вы имеете ${dataItems.length} задач`;
}
function changeStatus( {item} ) {
    let itemId = item.id;
    itemId = itemId.replace(/item_/, "");
    dataItems = JSON.parse( localStorage.getItem("todo") );
    if ( item.classList.contains("todo--completed") ) {
        item.classList.remove("todo--completed");
        item.dataset.completed = "false";
        document.querySelectorAll(".completed")[itemId].innerHTML = `<i class="fas fa-check"></i>`;
        dataItems[itemId].status = "false";
        localStorage.setItem("todo", JSON.stringify(dataItems));
    } else {
        item.classList.add("todo--completed");
        item.dataset.completed = "true";
        document.querySelectorAll(".completed")[itemId].innerHTML = `<i class="fas fa-undo-alt"></i>`;
        dataItems[itemId].status = "true";
        localStorage.setItem("todo", JSON.stringify(dataItems));
    }
}


