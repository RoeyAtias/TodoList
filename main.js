const validation = () => {
    const task = document.getElementById('taskName').value;
    const deadlineD = document.getElementById('deadline').value;
    const choose = document.getElementById('choose').value;
    const taskError = document.getElementById('taskP');
    const deadlineDateError = document.getElementById('deadlineP');
    const categoryError = document.getElementById('urgentP');
    const allowedDigits = /\d/;
    const allowedCharacters = /[.,:]/;
    const now = new Date();
    let allow = true;
  
    if (!task) {
      taskError.innerHTML = 'Please include a valid task';
      allow = false;
    } else {
      taskError.innerHTML = '';
    }
  
    if (!allowedDigits.test(deadlineD) || !allowedCharacters.test(deadlineD) || new Date(deadlineD) <= now) {
      deadlineDateError.innerHTML = 'Please include a valid date';
      allow = false;
    } else {
      deadlineDateError.innerHTML = '';
    }
  
    if (choose === '0') {
      categoryError.innerHTML = 'Please select one of the categories';
      allow = false;
    } else {
      categoryError.innerHTML = '';
    }
  
    return allow;
  };
  
  const initWebsite = () => {
    drawTasks();
  };
  
  const createNewTaskObject = (taskName, taskDesc, taskDeadline, taskUrgency) => {
    return {
      taskName,
      taskDesc,
      taskDeadline,
      taskUrgency,
      isChecked: false,
      date: new Date().toLocaleDateString()
    };
  };
  
  const getLocalStorageArray = () => {
    const storageArray = localStorage.getItem('userTasks');
    if (storageArray) {
      return JSON.parse(storageArray);
    }
    return [];
  };
  
  const uploadNewTaskToLocal = () => {
    const newTaskObject = createNewTaskObject(
      document.getElementById('taskName').value,
      document.getElementById('taskDesc').value,
      document.getElementById('deadline').value,
      document.getElementById('choose').value
    );
  
    const storageArray = getLocalStorageArray();
    storageArray.push(newTaskObject);
    updateObjectToLocalStorage(storageArray);
  
    const newIndex = storageArray.length - 1;
    cleanForm();
    drawTasks(() => {
      fade(newIndex, 'fade-in');
    });
  };
  
  const updateObjectToLocalStorage = (newArr) => {
    localStorage.setItem('userTasks', JSON.stringify(newArr));
  };
  
  const cleanForm = () => {
    document.getElementById('taskName').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('choose').value = '0';
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.style.display = 'none';
  };
  
  const btn = document.getElementById('btn');
  
  btn.addEventListener('click', () => {
    const allow = validation();
    if (allow) {
      uploadNewTaskToLocal();
      const saveBtn = document.getElementById('saveBtn');
      saveBtn.style.display = 'none';
    } else {
      return;
    }
  });
  
  
  function drawTasks(callback) {
    const uncompletedTasksContainer = document.getElementById('uncompletedTasks');
    const completedTasksContainer = document.getElementById('completedTasks');
    const storageArray = getLocalStorageArray();
    uncompletedTasksContainer.innerHTML = ''; 
    completedTasksContainer.innerHTML = ''; 
  
    storageArray.forEach((task, index) => {
        const [deadlineDate, deadlineTime] = task.taskDeadline.split('T');

      let taskContainer = `
      <div onmouseout="out(${index})" onmouseover='hover(${index})' class="taskContainer task" id="task${index}">
        <div class="createdAt">${task.date}
        <div class="task">
          <h3>${task.taskName}</h3>
          <p>Task's Desc -</p>
          <div class="desc">${task.taskDesc}</div>
          <p>Task's Deadline -</p>
          <p class="line">${deadlineDate} - ${deadlineTime}</p>
          <p>Task's Urgency -</p>
          <p class="${task.taskUrgency}">${task.taskUrgency}</p>
          </div>
          ${buttons(task, index)}
          </div>
          
      `;

  
      if (task.isChecked) {
        completedTasksContainer.innerHTML += taskContainer;
      } else {
        uncompletedTasksContainer.innerHTML += taskContainer;
      }
    });

    if(callback) {
        callback()
    }
  }

  const buttons = (task, index) => {
    if(task.isChecked){
        return `
        <div id='button' onmouseout="out(${index})" onmouseover='hover(${index})' class='taskButtons' style="display: none">
        <button class="input" onclick="deleteItem(${index})"><i class="fa-solid fa-delete-left fa-beat-fade" style="color: #eb0000;"></i></button>
        <button class="input" onclick="uncheckItem(${index})"><i class="fa-solid fa-circle-check fa-beat-fade" style="color: #e0d900;"></i></button>
       </div>
     `;
    } else {
        return `
        <div id='button' onmouseout="out(${index})" onmouseover='hover(${index})' class='taskButtons' style="display: none">
          <button class="input" onclick="deleteItem(${index})"><i class="fa-solid fa-delete-left fa-beat-fade" style="color: #eb0000;"></i></button>
          <button class="input" onclick="editItem(${index})"><i class="fa-solid fa-pen fa-beat-fade" style="color: #0047c2;"></i></button>
          <button class="input" onclick="moveTaskToCompleted(${index})"><i class="fa-solid fa-circle-check fa-beat-fade" style="color: #08b805;"></i></button>
        </div>`
    }
  } 
  
  document.addEventListener('DOMContentLoaded', initWebsite());
  
      
      

    
    const deleteItem = (index) => {
        const storageArray = getLocalStorageArray();
        storageArray.splice(index, 1)
        updateObjectToLocalStorage(storageArray);
        drawTasks();
    };

    const editItem = (index) => {
        const storageArray = getLocalStorageArray();
        const taskToEdit = storageArray[index];
        document.getElementById('taskName').value = taskToEdit.taskName
        const [deadlineDate] = taskToEdit.taskDeadline.split(' - ');
        document.getElementById('deadline').value = deadlineDate;
        document.getElementById('choose').value = taskToEdit.taskUrgency
        document.getElementById('taskDesc').value = taskToEdit.taskDesc
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.style.display = 'block';
        saveBtn.addEventListener('click', () => {
            saveButton(index);
          });

    }

        const moveTaskToCompleted = (index) => {
            const storageArray = getLocalStorageArray();
            const taskToCheck = storageArray[index];
          
            taskToCheck.isChecked = true;
            updateObjectToLocalStorage(storageArray);
          
            fade(index, 'fade-out', drawTasks)
          };
          
          const uncheckItem = (index) => {
            const storageArray = getLocalStorageArray();
            const taskToCheck = storageArray[index];
          
            taskToCheck.isChecked = false;
            updateObjectToLocalStorage(storageArray);
          
            fade(index, 'fade-out', drawTasks)
          };


      const saveButton = (index) => {
        const allowed = validation()
        const saveBtn = document.getElementById('saveBtn');
        const storageArray = getLocalStorageArray();
        const task = document.getElementById('taskName').value
        const deadline = document.getElementById('deadline').value
        const choose = document.getElementById('choose').value
        const taskDesc = document.getElementById('taskDesc').value

        const taskDeadline = `${deadline}`
        if(allowed) {
            storageArray[index].taskName = task;
            storageArray[index].taskDeadline = taskDeadline;
            storageArray[index].taskUrgency = choose;
            storageArray[index].taskDesc = taskDesc;
            
            updateObjectToLocalStorage(storageArray);
            saveBtn.style.display = 'none';
            drawTasks()
            cleanForm()
        } else {
            return
        }
      }

      const fade = (index, animationClass, callback) => {
        const taskRow = document.getElementById(`task${index}`);
        taskRow.classList.add(animationClass);
        setTimeout(() => {
          taskRow.classList.remove(animationClass);
          if (callback) {
            setTimeout(callback(), 500);
          }
        }, 500);
      };

      const hover = (taskId) => {
        const taskRow = document.getElementById(`task${taskId}`);
        const taskButtons = taskRow.querySelector('.taskButtons');
        taskButtons.style.display = 'flex';
      };
      
      const out = (taskId) => {
        const taskRow = document.getElementById(`task${taskId}`);
        const taskButtons = taskRow.querySelector('.taskButtons');
        taskButtons.style.display = 'none';
      };

    initWebsite();



