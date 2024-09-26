<script setup lang="ts">
import { useTodoStore } from "../stores/todo";
import { ref } from "vue";

const todoStore = useTodoStore();
todoStore.initFromLocalStorage();

let currentTodoInp = ref("");
let editingTodoId = ref<string | null>(null);
let editingTodoText = ref("");

function addTodo() {
  const text = currentTodoInp.value;
  currentTodoInp.value = "";

  if (text.trim() !== "") {
    todoStore.addTodo(text);
  }
}

function editTodo(todo: any) {
  editingTodoId.value = todo.id;
  editingTodoText.value = todo.text;
}

function saveEditedTodo() {
  if (editingTodoId.value !== null) {
    todoStore.updateTodo(editingTodoId.value, editingTodoText.value);
    editingTodoId.value = null;
    editingTodoText.value = "";
  }
}

function cancelEdit() {
  editingTodoId.value = null;
  editingTodoText.value = "";
}
</script>

<template>
  <main>
    <h1>Todos</h1>

    <button @click="todoStore.clearCompletedTodos()" class="clear">
      Clear completed todos
    </button>

    <div class="prog">
      <progress
        :max="todoStore.todos.length"
        :value="todoStore.completedTodos.length"
      ></progress>
      <p>
        <b>{{ todoStore.completedTodos.length }}</b> out of
        <b>{{ todoStore.todos.length }}</b> completed
      </p>
    </div>
    <ul class="todos">
      <li v-for="todo in todoStore.todos" :key="todo.id" class="todo">
        <input
          type="checkbox"
          name="isCompleted"
          :id="todo.id"
          :checked="todo.isCompleted"
          @change="todoStore.toggleTodo(todo.id)"
        />

        <!-- Если задача редактируется, выводим поле ввода для редактирования -->
        <template v-if="editingTodoId === todo.id">
          <input v-model="editingTodoText" class="edit-input" />
          <button @click="saveEditedTodo" class="save-btn">Save</button>
          <button @click="cancelEdit" class="cancel-btn">Cancel</button>
        </template>

        <!-- Иначе выводим обычную задачу -->
        <template v-else>
          <label
            :for="todo.id"
            :class="todo.isCompleted ? 'completed' : 'incomplete'"
            >{{ todo.text }}</label
          >
          <button @click="editTodo(todo)" class="edit-btn">Edit</button>
          <button @click="todoStore.removeTodo(todo.id)" class="delete-btn">Delete</button>
        </template>
      </li>
    </ul>

    <form @submit.prevent="addTodo" class="addForm">
      <label for="add">Add todo</label>
      <div class="sl">
        <input type="text" name="add" id="add" v-model="currentTodoInp" />
        <button type="submit">Add</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
progress {
  width: 100%;
}

.prog {
  margin-bottom: 1.5rem;
}
.prog > p {
  text-align: end;
  margin-top: 0rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 1.5rem;
}

input[type="checkbox"] {
  display: inline-block;
  padding: 1rem;
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}

.clear {
  margin-bottom: 1.5rem;
  border: 1px solid hsl(244, 7%, 54%);
  color: hsl(247, 34%, 85%);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 12px;
  cursor: pointer;
}
label.completed {
  color: hsl(245, 20%, 76%);
  text-decoration: line-through;
}

.addForm {
  margin-top: 1rem;
  border-top: 1px solid #242424;
  padding: 1rem 0;
}

.addForm > label {
  display: block;
  color: #ccc5d8;
}

.sl {
  display: flex;
  margin-top: 0.25rem;
}
.sl > input {
  border: 1px solid #3f3f3f;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-right: 0.25rem;
  width: 100%;
}

.sl > button {
  border-color: #42d392;
  background-color: #42d392;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #1a1a1a;
}

.edit-btn, .delete-btn {
  margin-left: 10px;
  padding: 0.25rem 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 0.25rem;
}

.edit-btn {
  background-color: #f0ad4e;
  color: white;
}

.delete-btn {
  background-color: #d9534f;
  color: white;
}

.edit-input {
  flex: 1;
  margin-right: 10px;
  padding: 0.25rem;
  font-size: 1.5rem;
}

.save-btn {
  background-color: #42d392;
  color: #1a1a1a;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>