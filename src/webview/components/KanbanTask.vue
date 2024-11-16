<!--
 * @Author: zyg0121 zhouyiguo2012@qq.com
 * @Date: 2024-11-09 16:42:27
 * @LastEditors: zyg0121 zhouyiguo2012@qq.com
 * @LastEditTime: 2024-11-09 16:42:35
 * @FilePath: \vsAgileFront\src\webview\components\KanbanTask.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by yiguo, All Rights Reserved. 
-->
<template>
  <el-card :class="taskClass" shadow="hover" class="kanban-task">
    <!-- delete button -->
    <el-button 
      type="danger"
      size="default"
      circle
      class="delete-button"
      @click="$emit('delete')"
      text
    >
      <el-icon><CircleClose /></el-icon>
    </el-button>
    

    <template #header>
      <!-- title input -->
      <div class="card-header">
        <el-input
          v-model="task.title"
          placeholder="Input Task Title"
          class="task-title-input"
          clearable
        />
      </div>
    </template>
    
    <div class="card-body">
      <!-- content input -->
      <el-input
        v-model="task.content"
        placeholder="Input Task Details"
        type="textarea"
        rows="2"
        @input="$emit('save', task)"
        class="task-content-input"
        />
    
      <!-- content links -->
      <div v-html="formattedContent" @click="handleLinkClick"></div>
    </div>
    

    <template #footer>
      <div class="card-footer">
        <!-- priority dropdown -->
        <el-dropdown 
          v-model="task.priority"
          trigger="click"
          @command="handlepriorityChange"
          ref="priorityDropdown"
        >
          <el-icon :class="priorityIconClass"><Flag /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="">
                <span class="priority-option">●</span> default
              </el-dropdown-item>
              <el-dropdown-item command="normal">
                <span class="priority-option priority-option--normal">●</span> normal
              </el-dropdown-item>
              <el-dropdown-item command="warning">
                <span class="priority-option priority-option--warning">●</span> warning
              </el-dropdown-item>
              <el-dropdown-item command="danger">
                <span class="priority-option priority-option--danger">●</span> danger
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- date picker -->
        <el-date-picker
          v-model="task.duetime"
          type="datetime"
          placeholder="Set Due Time"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          :shortcuts="dateShortcuts"
          @change="handleDuetimeChange"
          class="date-picker"
        />
      </div>
    </template>
  </el-card>
</template>

<script>
import { CircleClose, Flag } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

export default {
  components: {
    CircleClose,
    Flag,
  },
  props: ['task'],
  data() {
    // date shortcuts
    return {
      dateShortcuts: [
        {
          text: 'Today',
          value: new Date()
        },
        {
          text: 'Tomorrow',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            return date
          }
        },
        {
          text: 'One Week Later',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            return date
          }
        }
      ]
    }
  },
  computed: {
    // task class choice
    taskClass() {
      return {
        'kanban-task': true,
        'kanban-task--normal': this.task.priority === 'normal',
        'kanban-task--warning': this.task.priority === 'warning',
        'kanban-task--danger': this.task.priority === 'danger'
      }
    },
    // priority class choice
    priorityIconClass() {
      return {
        'priority-icon': true,
        'priority-icon--normal': this.task.priority === 'normal',
        'priority-icon--warning': this.task.priority === 'warning',
        'priority-icon--danger': this.task.priority === 'danger'
      }
    },
    // content format check
    formattedContent() {
      return this.task.content.replace(
        /\[(.*?)\]/g,
        '<a href="#" data-link="$1">$1</a>'
      );
    },
  },
  methods: {
    handlepriorityChange(type) {
      this.task.priority = type
      this.$emit('save', this.task)
    },
    handleLinkClick() {
      this.$refs.datePicker.focus()
    },
    handleDuetimeChange() {
      this.$emit('save', this.task)
    },
    // normalize the date format
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }
  }
};
</script>

<style scoped>
.el-card ::v-deep .el-card__header { padding: 2px 10px; }

.card-header { display: flex; justify-content: space-between; align-items: center;}
.card-content { display: flex; flex-direction: column; gap: 15px; padding: 10px 0; }
.card-footer { display: flex; justify-content: flex-end; align-items: center; }

.task-title-input { width: 100%; }
.task-title-input :deep(.el-input__wrapper) { box-shadow: none !important; border-radius: 0; border: none; padding-left: 0; background-color: transparent;}

.task-content-input { width: 100%; }
.task-content-input :deep(.el-textarea__inner) { padding: 5px 0; border: none; box-shadow: none; background-color: transparent;}

.task-title-input :deep(.el-input__wrapper):hover,
.task-title-input :deep(.el-input__wrapper.is-focus),
.task-content-input :deep(.el-textarea__inner):hover,
.task-content-input :deep(.el-textarea__inner):focus { border: none; box-shadow: none; }

.delete-button { position: absolute; top: 8px; right: 8px; z-index: 1; transition: all 0.3s; }
.delete-button :deep(.el-icon) { font-size: 16px; color: #909399; }
.delete-button:hover :deep(.el-icon) { transform: scale(1.1); color: #ff4d4f; }

.priority-icon { cursor: pointer; font-size: 16px; color: #909399; transition: color 0.3s;}
.priority-icon:hover { transform: scale(1.1); }
.priority-icon--normal { color: #67C23A; }
.priority-icon--warning { color: #E6A23C; }
.priority-icon--danger { color: #F56C6C; }

.priority-option { display: inline-block; margin-right: 5px; color: #909399; }
.priority-option--normal { color: #67C23A; }
.priority-option--warning { color: #E6A23C; }
.priority-option--danger { color: #F56C6C; }

.kanban-task { margin: 10px 0; padding: 15px; border-radius: 8px; position: relative; }
.kanban-task--danger { border-left: 8px solid #F56C6C; }
.kanban-task--warning { border-left: 8px solid #E6A23C; }
.kanban-task--normal { border-left: 8px solid #67C23A; }

.time-display { font-size: 14px; color: #606266; }
.date-picker { width: 200px; }
.date-picker :deep(.el-input__wrapper) { background-color: transparent; box-shadow: none; }
.date-picker :deep(.el-input__inner) { color: #606266; font-size: 14px; }
</style>
