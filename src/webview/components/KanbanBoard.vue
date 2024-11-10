<!--
 * @Author: zyg0121 zhouyiguo2012@qq.com
 * @Date: 2024-11-09 16:40:41
 * @LastEditors: zyg0121 zhouyiguo2012@qq.com
 * @LastEditTime: 2024-11-10 20:14:13
 * @FilePath: \vsAgileFront\src\webview\components\KanbanBoard.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by yiguo, All Rights Reserved. 
-->
<template>
    <div class="kanban-board">
      <KanbanColumn
        v-for="(column, colIndex) in columns"
        :key="colIndex"
        :title="column.title"
        :tasks="column.tasks"
        @addTask="addTask(colIndex)"
        @deleteTask="deleteTask(colIndex)"
        @saveTask="saveTask"
        @openLink="openLink"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import KanbanColumn from './KanbanColumn.vue';
  
  export default {
    components: { KanbanColumn },
    setup() {
      const columns = ref([
        { title: 'To Do', tasks: [{ id: 1, title: 'Task 1', content: '' }] },
        { title: 'In Progress', tasks: [{ id: 3, title: 'Task 3', content: '' }] },
        { title: 'Done', tasks: [{ id: 4, title: 'Task 4', content: '' }] }
      ]);
  
      const addTask = (columnIndex) => {
        const newId = Math.max(...columns.value.flatMap(col => col.tasks.map(task => task.id))) + 1;
        columns.value[columnIndex].tasks.push({ id: newId, title: `New Task ${newId}`, content: '' });
      };
  
      const deleteTask = (columnIndex, taskIndex) => {
        columns.value[columnIndex].tasks.splice(taskIndex, 1);
      };
  
      const saveTask = (task) => {
        console.log('Task saved', task);
      };
  
      const openLink = (link) => {
        const vscode = acquireVsCodeApi();
        vscode.postMessage({ command: 'openFile', path: link });
      };
  
      return { columns, addTask, deleteTask, saveTask, openLink };
    }
  };
  </script>
  
  <style>
  .kanban-board { display: flex; gap: 15px; padding: 20px; }
  </style>
  