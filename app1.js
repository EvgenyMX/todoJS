'use strict';
document.addEventListener('DOMContentLoaded', function(){

    //Selectors
    const todoAdd = document.querySelector('.todo-add'),
        innerList = document.querySelector('.todo-list'),
        deleteAll = document.querySelector('.delete-all'),
        todoInput = document.querySelector('.todo-input');

    let todoDataArr = [];
    

   //Event Listeners
    todoAdd.addEventListener("click", e => {

        if ( todoInput.value === "") {
            todoInput.style.border = "1px solid red";
            return;
        }
        todoInput.style.border = "1px solid #000";
        postToDataItem();
        renderItems();

    });


    innerList.addEventListener("click", e => {
        const todoItem =  document.querySelectorAll(".todo-item");
        const target = e.target;

        

        if ( target.parentNode.classList.contains("completed") ) {
            const idItem = target.parentNode.dataset.id;
            
            itemCompleted(idItem);
        }
        if ( target.parentNode.classList.contains("delete") ) {


            const idItem = target.parentNode.dataset.id;


            removeItem(idItem, todoItem);
        }
    });



    //LocalStorage
    if ( localStorage.getItem("todo") ) {
        todoDataArr = JSON.parse(localStorage.getItem("todo"));
        renderItems();
        todoDataArr.forEach( (item, i) => {
                const todoItem =  document.querySelectorAll(".todo-item");
                const btnCom = todoItem[i].querySelector(".completed");

            if ( item.status === "true" ) {

                todoItem[i].classList.add("todo--completed");
                btnCom.innerHTML = `<i class="fas fa-undo-alt"></i>`;

            }
        });
    }

    //Function
    function postToDataItem() {
        let dataToDoList = {
            text: todoInput.value,
            status: "false"
        };
        todoDataArr.push(dataToDoList);
        localStorage.setItem( "todo", JSON.stringify(todoDataArr) );
    }

    // if ( item.status === "true") {
    //     activCllass = "todo--completed" ;
    //     btnCompleted = "fa-undo-alt" "fa-check";
    // }
    function renderItems() {
        let todoItemTemplated = "";
        todoDataArr.forEach( ( item, i ) => {
            todoItemTemplated += `<div class="todo-item" id="item_${ i }" data-completed="${item.status}">
                <div class="item-num">${ i + 1 }.</div>
                <div class="item-text">${item.text}</div>
                <div class="item-action">
                    <button class="completed" data-id="${ i }"><i class="fas fa-check"></i></button>
                    <button class="delete" data-id="${ i }"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
            innerList.innerHTML = todoItemTemplated;
        });
    }


    function revomeAllItems() {}


    function removeItem(idItem, todoItem) { 
        
        


        todoItem[idItem].remove();

        todoDataArr.splice(idItem, 1);
        localStorage.setItem( "todo", JSON.stringify(todoDataArr) );

    }
    function itemCompleted(idItem) { 


        const todoItem =  document.querySelectorAll(".todo-item");
        const btnCom = todoItem[idItem].querySelector(".completed");

        
        if ( todoDataArr[idItem].status === "true" ) {
            btnCom.innerHTML = "";
            todoItem[idItem].classList.remove("todo--completed");
            btnCom.innerHTML = `<i class="fas fa-check"></i>`;
            todoDataArr[idItem].status = "false";
            localStorage.setItem( "todo", JSON.stringify(todoDataArr) );
        } else {
            btnCom.innerHTML = "";
            todoItem[idItem].classList.add("todo--completed");
            btnCom.innerHTML = `<i class="fas fa-undo-alt"></i>`;
            todoDataArr[idItem].status = "true";
            localStorage.setItem( "todo", JSON.stringify(todoDataArr) );

        }
    }







});