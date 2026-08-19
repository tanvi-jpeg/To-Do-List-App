    const taskInput = document.querySelector(".task-input input"),
    taskBox = document.querySelector(".task-box"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clearbtn");

    //getting localStorage todo-list
    let todos = JSON.parse(localStorage.getItem("todo-list"))||[];

    filters.forEach(btn =>{
        btn.addEventListener("click",()=>{
           document.querySelector("span.active").classList.remove("active");
           btn.classList.add("active");
          showtodolist(btn.innerText.toLowerCase());
        })
    })

    function getCurrentFilter() {
    return document.querySelector(".filters span.active").innerText.toLowerCase();
}

    function showtodolist(filter){
        let liTag = "";
        todos.forEach((todo,id) =>{
           if(filter==todo.status||filter=="all"){
            liTag += `
                <li class="task" data-id="${id}">
                        <div class="task-content">
                            <input type="checkbox"
                            ${todo.status === "completed" ? "checked" : ""}>
                            <p class="${todo.status === "completed" ? "checked" : ""}"
                            >${todo.name}</p>
                        </div>
                        <div class="buttons">
                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
                </button>
                </div>
                    </li>`;
           }
    });
        //if li is not empty ,insert span message
        
   const emptyMessages = {
    all: {
        icon: "fa-clipboard-list",
        text: "Nothing to do yet!"
    },

    active: {
        icon: "fa-list-check",
        text: "All tasks are completed!"
    },

    completed: {
        icon: "fa-circle-check",
        text: "No completed tasks yet!"
    }
};

function typeMessage(element, text) {
    element.textContent = "";

    const words = text.split(" ");
    let index = 0;

    const interval = setInterval(() => {
        element.textContent += (index > 0 ? " " : "") + words[index];
        index++;

        if (index === words.length) {
            clearInterval(interval);
        }
    }, 160);
}

taskBox.innerHTML = liTag || `
    <div class="empty-msg">
         <div class="empty-icon">
            <i class="fa-solid ${emptyMessages[filter].icon}"></i>
        </div>
        <span class="typing-text"></span>
    </div>
`;
const typingText = taskBox.querySelector(".typing-text");
if (typingText) {
    typeMessage(typingText, emptyMessages[filter].text);
}
    }

    //for editing & deleting
    taskBox.addEventListener("click", (e) => {
    const task = e.target.closest(".task");
    if (!task) return;
    const id = Number(task.dataset.id);
    if (e.target.closest(".delete-btn")) {
        deleteTask(id);//deletes a task
    }
    if (e.target.closest(".edit-btn")) {
        editTask(id);//edits the task
    }
});

//for checkbox
taskBox.addEventListener("change", (e) => {

    if (e.target.matches('input[type="checkbox"]')) {
        updateStatus(e.target);
    }

});
   

 function updateStatus(selectedTask){
     const task = selectedTask.closest(".task");
    const id = Number(task.dataset.id);

    if (selectedTask.checked) {
        todos[id].status = "completed";
    } else {
        todos[id].status = "active";
    }

    localStorage.setItem("todo-list", JSON.stringify(todos));

    showtodolist(getCurrentFilter());
    }

//clear all button
  clearAll.addEventListener("click", () =>{
    todos.splice(0,todos.length);//removing all items of array/todos
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showtodolist(getCurrentFilter());
  });

  // to edit the task
    function editTask(id) {
       const task = taskBox.querySelector(`[data-id="${id}"]`);
        if (!task) return;
       const taskName = task.querySelector(".task-content p");
        const input = document.createElement("input");
        input.type = "text";
        input.value = todos[id].name;
        input.classList.add("edit-input");
        taskName.replaceWith(input);
        input.focus();
        input.addEventListener("keyup", e => {
            if (e.key === "Enter") {
                let newTask = input.value.trim();
                if (newTask) {
                    todos[id].name = newTask;
                    localStorage.setItem("todo-list",  JSON.stringify(todos));
                   showtodolist(getCurrentFilter());
                }
            }
            if (e.key === "Escape") {
                showtodolist(getCurrentFilter());
            }
        });
    }

    //to delete a task
    function deleteTask(id) {
        todos.splice(id, 1);
        localStorage.setItem( "todo-list",JSON.stringify(todos));
       showtodolist(getCurrentFilter());
    }

    // to add inputs
    taskInput.addEventListener("keyup", e => { 
    let userTask = taskInput.value.trim();
    
    if(e.key=="Enter"&& userTask){
        let taskInfo ={ name:userTask, status :"active"};
        todos.push(taskInfo);

        taskInput.value="";
        localStorage.setItem("todo-list",JSON.stringify(todos));

        showtodolist("all");
    }
    });
     showtodolist("all");
