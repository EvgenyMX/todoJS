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
    listItems.innerHTML = "";
    addItemToLocalStorage();
    dataItems = JSON.parse( localStorage.getItem("todo") );
    renderListItem();
    valueItem.value = "";
});

listItems.addEventListener("click", e => {
    const target = e.target;

    const items = document.querySelectorAll(".todo-item");

    if ( target.parentNode.classList.contains('delete') ) {
        const idItem = target.parentNode.dataset.id;

        removeItem( { id: idItem, item: target.parentNode.parentNode.parentNode  } )
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
        let innerTodoList = `<div class="todo-item" id="item_${ i }" data-completed="${item.status}">
                    <div class="item-num">${ i + 1 }.</div>
                    <div class="item-text">${item.value}</div>
                    <div class="item-action">
                        <button class="completed" data-id="${ i }"><i class="fas fa-check"></i></button>
                        <button class="delete" data-id="${ i }"><i class="fas fa-trash"></i></button>
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

    // const item = document.querySelectorAll(".todo-item");

    
    item.remove();





    if ( !dataItems ) {
        infoText.innerHTML = "Задач нет";
    }
    infoText.innerHTML = `Вы имеете ${dataItems.length} задач`;
}


