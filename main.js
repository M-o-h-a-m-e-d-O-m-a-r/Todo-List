let input = document.getElementById("input");
let newTaskBtn = document.getElementById("btn-form");
let boxs = document.getElementById("boxs");
let note = document.getElementById("note");
let para_1 = document.getElementById("para_1");
let para_2 = document.getElementById("para_2");
console.log(input);

// let list = document.querySelector("#task");
let dataFromFetch;

// endpoint URL for DB
let endpoint = "https://orange-gopher-garb.cyclic.app/todo";
// showLoading();
// function to fetch all tasks from api then storage it in dataFromFetch obj
fetchGetData();

// when clicked on send btn
newTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();

  console.log(input.value);
  console.log(input.value.length);
  //verification from input not empty
  if (input.value === "") {
    para_1.classList.remove("color");
    para_2.classList.add("color");
  }
  // verification from input more than 40 characters
  if (input.value.length > "40") {
    para_2.classList.remove("color");
    para_1.classList.add("color");
  }
  // to create element in page
  if (input.value !== "" && input.value.length <= "40") {
    // to send data task to api
    fetchPostData(input.value);
    para_2.classList.remove("color");
    para_1.classList.remove("color");
  }

  // make input value is empty value
  input.value = "";
});

boxs.addEventListener("click", async (e) => {
  // when clicked on delete btn
  if (e.target.classList.contains("delete")) {
    await deleteElement(e.target.parentElement.parentElement.id); // using await since it's an asynchronous operation
    e.target.parentElement.parentElement.remove();
    // to show note if no tasks in page
    if (boxs.children.length == 2) {
      note.style.display = "inline-block";
    }
  }

  // when clicked on copy btn
  // if (e.target.classList.contains("span")) {
  //   let taskContent;
  //   taskContent = e.target.parentElement.parentElement.children[0].innerText;
  //   await navigator.clipboard.writeText(taskContent);
  //   let span_2 = e.target.parentElement.children[1];
  //   setTimeout(function () {
  //     span_2.style.display = "inline-block";
  //   }, 5);
  //   setTimeout(function () {
  //     span_2.style.display = "none";
  //   }, 250);
  // }

  // when clicked on Done btn
  if (e.target.classList.contains("check")) {
    e.target.parentElement.parentElement.classList.toggle("Done");
    // to send the statusCheck to api
    if (e.target.parentElement.parentElement.classList.contains("Done")) {
      await updateElement(e.target.parentElement.parentElement.id, true); // using await since it's an asynchronous operation
    } else {
      await updateElement(e.target.parentElement.parentElement.id, false); // using await since it's an asynchronous operation
    }
  }
});
//..........................................

// Change theme
let standardTheme = document.querySelector(".standard-theme");
let lightTheme = document.querySelector(".light-theme");
let savedTheme = localStorage.getItem("savedTheme");
savedTheme === null
  ? changeTheme("standard")
  : changeTheme(localStorage.getItem("savedTheme"));

lightTheme.addEventListener("click", () => changeTheme("light"));
standardTheme.addEventListener("click", () => changeTheme("standard"));
// function to change Theme
function changeTheme(color) {
  localStorage.setItem("savedTheme", color);
  savedTheme = localStorage.getItem("savedTheme");
  document.body.className = color;
  // Change blinking cursor for darker theme:
  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");

  document.querySelector("input").classList.add(`${color}-input`);
  // Change todo color without changing their status (completed or not):
  // document.querySelectorAll(".list").forEach((list) => {
  //   // Array.from(list.classList).some((item) => item === "completed")
  //   // ? list.classList.add(`list ${color}-list completed`)
  //   // : list.classList.add(`list ${color}-list`);
  // });
  // Change buttons color according to their type (todo, check or delete):
  document.querySelectorAll(".but-del").forEach((button) => {
    Array.from(button.classList).some((item) => {
      if (item === "check-btn") {
        button.classList.add(`check-btn ${color}-button`);
      } else if (item === "delete-btn") {
        button.classList.add(`delete-btn ${color}-button`);
      } else if (item === "todo-btn") {
        button.classList.add(`todo-btn ${color}-button`);
      }
    });
  });
}

// function to create a new task in page
function createTaskEl(TaskValue, id, statusCheck) {
  // to show loading page
  showLoading();
  // to hide note if no tasks in page
  note.style.display = "none";
  let divBoxsOfTheTasks = document.getElementById("boxs");
  let divTask = document.createElement("div");
  divTask.setAttribute("id", id);
  divTask.classList.add("task");
  divBoxsOfTheTasks.appendChild(divTask);
  let taskValue = document.createElement("p");
  taskValue.setAttribute("id", "value");
  taskValue.innerText = TaskValue;
  divTask.appendChild(taskValue);
  let divOfBtns = document.createElement("div");
  divOfBtns.setAttribute("id", "divOfBtns");
  divTask.appendChild(divOfBtns);

  // let span_1 = document.createElement("span");
  // span_1.innerText = "content_copy";
  // span_1.setAttribute("id", "span_1");
  // span_1.setAttribute("title", "click here to copy task!");
  // span_1.classList.add("material-symbols-outlined", "span");
  // divOfBtns.appendChild(span_1);
  // let span_2 = document.createElement("span");
  // span_2.innerText = "new_releases";
  // span_2.setAttribute("id", "span_2");
  // span_2.classList.add("material-symbols-outlined");
  // divOfBtns.appendChild(span_2);

  let doneBtn = document.createElement("button");
  doneBtn.classList.add("check");
  doneBtn.innerText = "Done";
  doneBtn.style.width = "max-content";
  doneBtn.style.padding = "4px";
  divOfBtns.appendChild(doneBtn);
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerText = "X";
  divOfBtns.appendChild(deleteBtn);

  if (statusCheck == true) {
    divTask.classList.add("Done");
  } else {
    divTask.classList.remove("Done");
  }
  // to hide loading page
  hideLoading();
}

// function to fetch post data for database
async function fetchPostData(TaskValue) {
  // to show loading page
  showLoading();

  try {
    let response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        todo: `${TaskValue}`,
        check: false,
      }),
      headers: {
        "Content-Type": "application/json",
        Authentication: "Muhammad Omar",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImZsYXJlIiwiaWF0IjoxNTE2MjM5MDIyfQ.futG683Z2NHY58S5AHJmKBhae-pqOp81RtiLQRdO7uc",
      },
    });

    const responseData = await response.json();

    createTaskEl(
      responseData.data.todo,
      responseData.data._id,
      responseData.data.check
    );
  } catch (err) {
    alert(`Rejected reason: ${err}`);
  }
  // to hide loading page
  hideLoading();
}

// function to fetch get data from database
async function fetchGetData() {
  // to show loading page
  showLoading();
  try {
    let myData = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authentication: "Muhammad Omar",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImZsYXJlIiwiaWF0IjoxNTE2MjM5MDIyfQ.futG683Z2NHY58S5AHJmKBhae-pqOp81RtiLQRdO7uc",
      },
    });
    dataFromFetch = await myData.json();
    if (!myData.ok) {
      throw new Error(`${myData.status} ${myData.statusText}`);
    }
  } catch (reason) {
    console.log(`Reason: ${reason}`);
  }
  // console.log(dataFromFetch["data"][0]._id);
  if (boxs.children.length != 1) {
    createPostsFromScratch(); // changed from createElA_Post for semantics
    // to hide loading page
    // hideLoading();
  } else {
    createNewPostsOnly(); // changed from createElB_Post for semantics
    // to hide loading page
    hideLoading();
  }
}

// function to create elements Before fetchPostData working
function createNewPostsOnly() {
  // to show loading page
  showLoading();
  if (!dataFromFetch || !dataFromFetch?.data) return; // verify that everything is fine before proceeding
  if (dataFromFetch.data.length != 0) {
    for (let i = 0; i < dataFromFetch.data.length; i++) {
      createTaskEl(
        dataFromFetch.data[i].todo,
        dataFromFetch.data[i]._id,
        dataFromFetch.data[i].check
      );
    }
  } else {
    // to show note if no tasks in page
    note.style.display = "inline-block";
  }
  // to hide loading page
  hideLoading();
}

// function to create elements After fetchPostData working
function createPostsFromScratch() {
  // to show loading page
  showLoading();
  let elementFound;
  let element;
  for (let i = 0; i < dataFromFetch.data.length; i++) {
    for (let j = 0; j < boxs.children.length; j++) {
      if (boxs.children[j].id == dataFromFetch.data[i]._id) {
        elementFound = true;
        break;
      } else {
        elementFound = false;
      }
    }
    if (elementFound == false) {
      element = dataFromFetch.data[i];
      createTaskEl(dataFromFetch.data[i].todo, dataFromFetch.data[i]._id);
    }
    elementFound = 2;
  }
  // to hide loading page
  hideLoading();
}

// function to delete element from api
async function deleteElement(id) {
  const apiUrl = `https://orange-gopher-garb.cyclic.app/todo/${id}`;

  /*
    switched to using async await instead of Promise, .then, and .catch
  */

  try {
    showLoading(); // a loading indicator when attempting to delete an element, since we are calling the server
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authentication: "Muhammad Omar",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImZsYXJlIiwiaWF0IjoxNTE2MjM5MDIyfQ.futG683Z2NHY58S5AHJmKBhae-pqOp81RtiLQRdO7uc",
      },
    });

    if (response.ok || response.status === 204) {
      console.log("Resource deleted successfully");
    } else {
      console.error(
        "Failed to delete resource:",
        response.status,
        response.statusText
      );
    }
  } catch (err) {
    console.error("Error during delete request:", err);
  } finally {
    hideLoading(); // finally is invoked when everything finishs, regardless of whether catch is invoked or not, which makes it perfect to place the hideLoading function
  }
}

// function to update piece of data
async function updateElement(id, statusCheck) {
  const apiUrl = `https://orange-gopher-garb.cyclic.app/todo`;
  const updatedData = {
    id: id,
    check: statusCheck,
  };
  try {
    showLoading(); // a loading indicator when attempting to delete an element, since we are calling the server
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authentication: "Muhammad Omar",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImZsYXJlIiwiaWF0IjoxNTE2MjM5MDIyfQ.futG683Z2NHY58S5AHJmKBhae-pqOp81RtiLQRdO7uc",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      console.log("Element updated successfully");
    } else {
      console.error(
        "Failed to update element:",
        response.status,
        response.statusText
      );
    }
  } catch (err) {
    console.error("Error during update request:", err);
  } finally {
    hideLoading();
  }
}

// to show loading page
function showLoading() {
  console.log("start");
  document.getElementById("loadingContainer").style.display = "flex";
  document.getElementById("boxs").style.filter = "blur(2px)";
}
// hideLoading();
// to hide loading page
function hideLoading() {
  console.log("end");
  document.getElementById("loadingContainer").style.display = "none";
  document.getElementById("boxs").style.filter = "";
}
// *******************************************************************************************************************************************************************************
// function to drag and drop element in page ui yet
// function dragAndDrop(task) {
//   let draggables = document.querySelectorAll(".draggable");
//   draggables.forEach((draggable) => {
//     draggable.addEventListener("dragstart", () => {
//       draggable.classList.add("dragging");
//       // deleteTaskFromLocalStorage(draggable.getAttribute("data-id"));
//     });
//     draggable.addEventListener("dragend", () => {
//       draggable.classList.remove("dragging");
//       // arrayNew.push(draggable);
//       // deleteTaskFromLocalStorage(ul.target.getAttribute("data-id"));
//       // arrayOfTasks.remove(draggable);
//       // addDataLocalStorageFrom(arrayOfTasks);
//       // list.appendChild(draggable);
//       // localStorage.setItem("tasks", draggable);
//       console.log(arrayOfTasks);
//     });
//   });
//   // let draggables = document.querySelectorAll(".draggable");
//   let ul = document.querySelector(".ul");
//   let arrayNew = [];

//   ul.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     let afterElement = getDragAfterElement(ul, e.clientY);
//     let draggable = document.querySelector(".dragging");
//     if (afterElement == null) {
//       ul.appendChild(draggable);
//     } else {
//       ul.insertBefore(draggable, afterElement);
//       // localStorage.setItem("tasks", JSON.stringify(draggable));
//     }
//   });

//   function getDragAfterElement(ul, y) {
//     let draggableElements = [
//       ...ul.querySelectorAll(".draggable:not(.dragging)"),
//     ];

//     return draggableElements.reduce(
//       (closest, child) => {
//         let box = child.getBoundingClientRect();
//         let offset = y - box.top - box.height / 2;
//         if (offset < 0 && offset > closest.offset) {
//           return { offset: offset, element: child };
//         } else {
//           return closest;
//         }
//       },
//       { offset: Number.NEGATIVE_INFINITY }
//     ).element;
//   }
// }
