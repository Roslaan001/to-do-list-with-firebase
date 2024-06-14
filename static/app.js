document.addEventListener("DOMContentLoaded", function() {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyD9dKdcvs37jGncL9n6AZbdtNB2JcsEFDo",
    authDomain: "to-do-list-c9c8a.firebaseapp.com",
    projectId: "to-do-list-c9c8a"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Function to add a task
  function addTask() {
    const taskInput = document.getElementById("task-input");
    const task = taskInput.value.trim();

    if (task !== "") {
      try {
        db.collection("tasks").add({
          task: task,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        taskInput.value = "";
      } catch (error) {
        console.error("Error adding task:", error);
        // Display a user-friendly error message if needed
      }
    }
  }

  // Function to render tasks
  function renderTask(doc) {
    const taskList = document.getElementById("task-list");
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.setAttribute("data-id", doc.id);
    taskItem.innerHTML = `
      <span>${doc.data().task}</span>
      <button onclick="deleteTask('${doc.id}')">Delete</button>
    `;
    taskList.appendChild(taskItem);
  }

  // Real-time listener for tasks with loading indicator
  db.collection("tasks")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      showLoading();

      const taskList = document.getElementById("task-list");

      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          renderTask(change.doc);
        } else if (change.type === "removed") {
          const taskItem = taskList.querySelector(`[data-id="${change.doc.id}"]`);
          if (taskItem) {
            taskList.removeChild(taskItem);
          }
        }
      });

      hideLoading();
    });

  // Function to delete a task
  function deleteTask(id) {
    db.collection("tasks").doc(id).delete().catch(error => {
      console.error("Error deleting task:", error);
    });
  }

  // Attach the deleteTask function to the global window object
  window.deleteTask = deleteTask;

  // Helper functions for loading indicator
  function showLoading() {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = "block";
    }
  }

  function hideLoading() {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }
  }

  // Attach event listener to the add task button
  document.getElementById('add-task-button').addEventListener('click', addTask);
});
