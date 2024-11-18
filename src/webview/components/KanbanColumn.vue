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
  <el-container class="kanban-column">
    <el-header class="kanban-column-header">
      <span class="column-title">{{ title }}</span>
      <el-tag size="small" type="info" class="task-count">
        {{ localTasks.length }} tasks
      </el-tag>
    </el-header>
    
    <el-main class="kanban-column-content">
      <draggable
        v-model="localTasks"
        :group="{ name: 'tasks', pull: true, put: true }"
        item-key="id"
        class="task-list"
        @change="handleChange"
      >
        <template #item="{ element: task }">
          <KanbanTask
            :task="task"
            @delete="deleteTask($event)"
            @save="saveTask"
            @openLink="openLink"
          />
        </template>
      </draggable>
    </el-main>

    <el-footer class="kanban-column-footer">
      <el-button 
        type="primary" 
        @click="addTask" 
        size="small"
        class="add-task-btn"
      >
        <el-icon><Plus /></el-icon>
        Add New Task
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import KanbanTask from './KanbanTask.vue'
import draggable from 'vuedraggable'

export default {
  components: { 
    KanbanTask, 
    draggable,
    Plus 
  },
  props: ['title', 'tasks', 'columnIndex'],
  emits: ['update:tasks', 'addTask', 'deleteTask', 'saveTask', 'openLink'],
  
  computed: {
    localTasks: {
      get() {
        return this.tasks;
      },
      set(value) {
        this.$emit('update:tasks', value);
      }
    }
  },
  
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
    },
    handleChange(evt) {
      console.log('Task moved', evt);
      this.$emit('update:tasks', this.localTasks);
    }
  }
};
</script>

<style scoped>
.kanban-column { background-color: var(--el-bg-color); border-radius: 8px; min-width: 300px; flex: 1; height: 100%; border: 1px solid var(--el-border-color-lighter); box-shadow: var(--el-box-shadow-light); display: flex; flex-direction: column; }

.kanban-column-header { height: 50px !important; line-height: 50px; padding: 0 15px; border-bottom: 1px solid var(--el-border-color-lighter); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.column-title { font-weight: bold; font-size: 16px; color: var(--el-text-color-primary); }
.task-count { margin-left: 8px; }

.kanban-column-content { padding: 10px; overflow-y: hidden; height: calc(100% - 100px); min-height: 200px; }
.kanban-column-content:hover { overflow-y: auto; }
.kanban-column-content::-webkit-scrollbar { width: 0px; background-color: transparent; }
.kanban-column-content:hover::-webkit-scrollbar,
.kanban-column-content:active::-webkit-scrollbar { width: 6px; }
.kanban-column-content::-webkit-scrollbar-thumb { background-color: rgba(144, 147, 153, 0.3); border-radius: 3px; }
.kanban-column-content::-webkit-scrollbar-thumb:hover { background-color: rgba(144, 147, 153, 0.5); }
.kanban-column-content::-webkit-scrollbar-track { background: transparent; }

.task-list { min-height: 100%; display: flex; flex-direction: column; gap: 10px; padding: 1px; }
.task-list:empty { border: 2px dashed var(--el-border-color-lighter); border-radius: 8px; margin: -1px; min-height: calc(100% - 2px); }

.kanban-column-footer { height: 50px !important; display: flex; justify-content: center; align-items: center; padding: 0 15px; border-top: 1px solid var(--el-border-color-lighter); flex-shrink: 0; }
.add-task-btn { width: 60%; }
</style>
  