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
    <!-- use draggable to drag the columns -->
    <draggable
      v-model="columns"
      :component-data="{ type: 'transition-group' }"
      item-key="title"
      class="kanban-columns"
      :group="{ name: 'columns' }"
    >
      <template #item="{ element: column, index: colIndex }">
        <KanbanColumn
          :key="colIndex"
          :title="column.title"
          v-model:tasks="column.tasks"
          :column-index="colIndex"
          @addTask="addTask(colIndex)"
          @deleteTask="deleteTask(colIndex, $event)"
          @saveTask="saveTask"
          @openLink="openLink"
          @update:tasks="handleTasksUpdate(colIndex, $event)"
        />
      </template>
    </draggable>
  </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import KanbanColumn from './KanbanColumn.vue';
import draggable from 'vuedraggable';

export default {
  components: { KanbanColumn, draggable },
  setup() {
    const columns = ref([
      { title: 'To Do', tasks: [] },
      { title: 'In Progress', tasks: [] },
      { title: 'Done', tasks: [] }
    ]);

    const handleTasksUpdate = (columnIndex, newTasks) => {
      columns.value[columnIndex].tasks = newTasks;
      console.log('Column tasks updated:', {
        columnIndex,
        newTasks,
        allColumns: columns.value
      });
    };

    const addTask = (columnIndex) => {
      const newId = Math.max(...columns.value.flatMap(col => col.tasks.map(task => task.id)), 0) + 1;
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

    return { columns, addTask, deleteTask, saveTask, openLink, handleTasksUpdate };
  }
};
</script>

<style>
.kanban-board { display: flex; padding: 20px; height: 100vh; box-sizing: border-box; }
.kanban-columns { display: flex; flex-direction: row; gap: 15px; width: 100%; height: 100%; }
</style>
  