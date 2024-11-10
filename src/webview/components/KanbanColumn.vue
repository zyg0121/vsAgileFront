<!--
 * @Author: zyg0121 zhouyiguo2012@qq.com
 * @Date: 2024-11-09 16:42:07
 * @LastEditors: zyg0121 zhouyiguo2012@qq.com
 * @LastEditTime: 2024-11-09 16:42:20
 * @FilePath: \vsAgileFront\src\webview\components\KanbanColumn.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by yiguo, All Rights Reserved. 
-->
<template>
    <el-card class="kanban-column">
      <div slot="header" class="kanban-column-header">{{ title }}</div>
      <div class="kanban-tasks">
        <KanbanTask
          v-for="(task, index) in tasks"
          :key="task.id"
          :task="task"
          @delete="deleteTask(index)"
          @save="saveTask"
          @openLink="openLink"
        />
      </div>
      <el-button type="primary" @click="addTask" size="mini" class="add-task-btn">Add Task</el-button>
    </el-card>
  </template>
  
  <script>
  import KanbanTask from './KanbanTask.vue';
  
  export default {
    components: { KanbanTask },
    props: ['title', 'tasks'],
    emits: ['addTask', 'deleteTask', 'saveTask', 'openLink'],
    methods: {
      addTask() {
        this.$emit('addTask');
      },
      deleteTask(index) {
        this.$emit('deleteTask', index);
      },
      saveTask(task) {
        this.$emit('saveTask', task);
      },
      openLink(link) {
        this.$emit('openLink', link);
      }
    }
  };
  </script>
  
  <style scoped>
  .kanban-column { background-color: #ffffff; border-radius: 8px; padding: 10px; }
  .kanban-column-header { font-weight: bold; text-align: center; margin-bottom: 10px; }
  .kanban-tasks { max-height: 500px; overflow-y: auto; }
  </style>
  