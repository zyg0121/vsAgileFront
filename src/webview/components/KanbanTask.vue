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
    <!-- delete task button -->
    <el-button 
      type="danger"
      size="default"
      circle
      class="delete-button"
      @click="$emit('delete')"
      text
    >
      <el-icon><Close /></el-icon>
    </el-button>
    

    <template #header>
      <!-- title display -->
      <div class="card-header">
        <!-- edit mode -->
        <div v-if="isEditingTitle" class="title-edit-mode">
          <el-input
            v-model="editingTitle"
            placeholder="Input Task Title"
            class="task-title-input"
            ref="titleInput"
            @keyup.enter="saveTitleEdit"
          />
          <div class="title-edit-buttons">
            <el-button
              type="success"
              size="small"
              @click="saveTitleEdit"
              text
            >
              <el-icon><CircleCheck /></el-icon>
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="cancelTitleEdit"
              text
            >
              <el-icon><CircleClose /></el-icon>
            </el-button>
          </div>
        </div>
        <!-- display mode -->
        <div v-else class="title-display-mode">
          <span class="task-title">{{ task.title }}</span>
          <el-button
            type="primary"
            size="small"
            @click="startTitleEdit"
            text
          >
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>
      </div>
    </template>
    

    <div class="card-body">
      <!-- content input -->
      <div class="list-container">
        <div v-for="(item, index) in task.listItems" :key="index" class="list-item">
          <!-- normal display -->
          <div v-if="!item.isEditing" class="item-content">
            <span class="list-bullet">•</span>
            <span class="item-text">{{ item.text }}</span>
            <div class="item-buttons">
              <!-- edit button -->
              <el-button
                type="primary"
                size="small"
                @click="startEdit(index)"
                text
              >
                <el-icon><Edit /></el-icon>
              </el-button>

              <!-- delete item button -->
              <el-button
                type="danger"
                size="small"
                @click="removeListItem(index)"
                text
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- editing display -->
          <div v-else class="item-edit">
            <el-input
              v-model="item.text"
              size="small"
              @keyup.enter="saveEdit(index)"
            >
              <template #prefix>
                <span class="list-bullet">•</span>
              </template>
            </el-input>
            <div class="item-buttons">
              <!-- save button -->
              <el-button
                type="success"
                size="small"
                @click="saveEdit(index)"
                text
              >
                <el-icon><CircleCheck /></el-icon>
              </el-button>

              <!-- cancel button -->
              <el-button
                type="info"
                size="small"
                @click="cancelEdit(index)"
                text
              >
                <el-icon><CircleClose /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- add item button -->
        <el-button
          type="primary"
          size="small"
          @click="addListItem"
          class="add-item-button"
          :disabled="hasEditingItem"
          text
        >
          <el-icon><Plus /></el-icon>
          Add Item
        </el-button>
      </div>
    </div>


    <template #footer>
      <div class="card-footer">
        <div class="footer-icons">
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

          <!-- assignee dropdown -->
          <el-dropdown
            trigger="click"
            @command="handleAssigneeChange"
            class="assignee-dropdown"
          >
            <div class="assignee-trigger">
              <el-icon><User /></el-icon>
              <span class="assignee-name">{{ task.assignees?.length ? task.assignees[0].name : 'Not Assigned' }}</span>
              <span v-if="task.assignees?.length > 1" class="assignee-count">+{{ task.assignees.length - 1 }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- assigned members -->
                <el-dropdown-item divided disabled>
                  <div class="assignee-group-title">Assigned Members</div>
                </el-dropdown-item>
                
                <el-dropdown-item 
                  v-for="user in assignedUsers" 
                  :key="user.id" 
                  :command="user.id"
                >
                  <div class="assignee-item">
                    <span>{{ user.name }}</span>
                    <span class="assignee-role">{{ user.role }}</span>
                  </div>
                </el-dropdown-item>

                <!-- available members -->
                <el-dropdown-item divided disabled>
                  <div class="assignee-group-title">Available Members</div>
                </el-dropdown-item>

                <!-- not assigned -->
                <el-dropdown-item command="unassign">
                  <div class="assignee-item">
                    <span>Not Assigned</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item 
                  v-for="user in unassignedUsers" 
                  :key="user.id" 
                  :command="user.id"
                >
                  <div class="assignee-item">
                    <span>{{ user.name }}</span>
                    <span class="assignee-role">{{ user.role }}</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>  

        <!-- due time picker -->
        <div class="date-picker">
          <el-date-picker
            v-model="task.duetime"
            type="datetime"
            placeholder="Set Due Time"
            format="DD-MM-YYYY HH:mm"
            value-format="DD-MM-YYYY HH:mm"
            :shortcuts="dateShortcuts"
            @change="handleDuetimeChange"
          />
        </div>
      </div>
    </template>
  </el-card>
</template>

<script>
import { Close, Flag, Delete, Plus, Edit, CircleCheck, CircleClose, User, Check } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import axios from 'axios';

export default {
  components: {
    Close,
    Flag,
    Delete,
    Plus,
    Edit,
    CircleCheck,
    CircleClose,
    User,
    Check
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
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
      ],
      // available users table
      availableUsers: [],
      isEditingTitle: false,
      editingTitle: '',
      originalTitle: '',
      clickOutsideHandler: null,
    }
  },
  created() {
    this.fetchUsers();
    if (!this.task.listItems) {
      this.task.listItems = []
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
    // assigned users
    assignedUsers() {
      if (!this.task.assignees) return []
      return this.task.assignees
    },
    // unassigned users
    unassignedUsers() {
      if (!this.task.assignees) return this.availableUsers
      return this.availableUsers.filter(user => 
        !this.task.assignees.some(assigned => assigned.id === user.id)
      )
    },
    // add the detector
    hasEditingItem() {
      return this.task.listItems.some(item => item.isEditing)
    }
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
      return dayjs(date).format('DD-MM-YYYY HH:mm')
    },
    // add list item
    addListItem() {
      if (this.hasEditingItem) {
        return
      }
      
      const newItem = {
        text: '',
        isEditing: true,
        isNew: true,
        originalText: ''
      }
      this.task.listItems.push(newItem)
      
      // outside listener
      this.$nextTick(() => {
        const index = this.task.listItems.length - 1
        this.setupClickOutsideListener(() => {
          this.cancelEdit(index)
          this.removeClickOutsideListener()
        })
      })
    },
    // start edit
    startEdit(index) {
      const item = this.task.listItems[index]
      item.originalText = item.text
      item.isEditing = true

      this.removeClickOutsideListener()
      this.setupClickOutsideListener(() => {
        if (item.isEditing) {
          this.cancelEdit(index)
        }
      })
    },
    // save edit
    saveEdit(index) {
      const item = this.task.listItems[index]
      if (item.text.trim()) {
        item.isEditing = false
        item.isNew = false
        delete item.originalText
        this.$emit('save', this.task)
      } else {
        this.removeListItem(index)
      }
      this.removeClickOutsideListener()
    },
    // cancel edit
    cancelEdit(index) {
      const item = this.task.listItems[index]
      if (item.isNew) {
        this.removeListItem(index)
      } else if (item.isEditing) {
        item.text = item.originalText
        item.isEditing = false
        delete item.originalText
      }
      this.removeClickOutsideListener()
    },
    // remove item
    removeListItem(index) {
      this.task.listItems.splice(index, 1)
      this.$emit('save', this.task)
    },
    handleAssigneeChange(command) {
      if (command === 'unassign') {
        this.task.assignees = []
      } else {
        const userId = command
        const user = this.availableUsers.find(u => u.id === userId)
        if (!this.task.assignees) {
          this.task.assignees = []
        }
        const existingIndex = this.task.assignees.findIndex(a => a.id === userId)
        if (existingIndex >= 0) {
          this.task.assignees.splice(existingIndex, 1)
        } else {
          this.task.assignees.push(user)
        }
      }
      this.$emit('save', this.task)
    },
    startTitleEdit() {
      this.isEditingTitle = true
      this.editingTitle = this.task.title
      this.originalTitle = this.task.title
      
      // set outside listener
      this.setupClickOutsideListener(() => {
        if (this.task.isNew) {
          this.saveTitleEdit()
        } else {
          this.cancelTitleEdit()
        }
        this.removeClickOutsideListener()
      })

      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    saveTitleEdit() {
      const newTitle = this.editingTitle.trim()
      if (newTitle) {
        this.task.title = newTitle
        this.$emit('save', this.task)
      } else if (this.task.isNew) {
        this.task.title = `New Task ${this.task.id}`
        this.$emit('save', this.task)
      } else {
        this.editingTitle = this.originalTitle
      }
      this.isEditingTitle = false
      this.task.isNew = false
      this.removeClickOutsideListener()
    },
    cancelTitleEdit() {
      if (this.task.isNew) {
        this.saveTitleEdit()
      } else {
        this.isEditingTitle = false
        this.editingTitle = this.originalTitle
      }
      this.removeClickOutsideListener()
    },
    setupClickOutsideListener(callback) {
      this.removeClickOutsideListener()
      
      this.clickOutsideHandler = (event) => {
        const cardEl = this.$el
        if (!cardEl.contains(event.target) && 
            !event.target.closest('.el-dropdown-menu') &&
            !event.target.closest('.el-picker-panel')) {
          callback()
        }
      }
      document.addEventListener('mousedown', this.clickOutsideHandler)
    },
    removeClickOutsideListener() {
      if (this.clickOutsideHandler) {
        document.removeEventListener('mousedown', this.clickOutsideHandler)
        this.clickOutsideHandler = null
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('/user/getAll');
        this.availableUsers = response.data.users.map(user => ({
          id: user.id,
          name: user.name,
          role: user.role
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
  },
  mounted() {
    if (this.task.isNew) {
      this.startTitleEdit()
    }
  },
  beforeDestroy() {
    this.removeClickOutsideListener()
  }
};
</script>

<style scoped>
/* card base style */
.kanban-task { margin: 10px 0; padding: 15px; border-radius: 8px; position: relative; }
.kanban-task :deep(.el-card__header) { padding: 2px 10px; }
.kanban-task--danger { border-left: 8px solid #F56C6C; }
.kanban-task--warning { border-left: 8px solid #E6A23C; }
.kanban-task--normal { border-left: 8px solid #67C23A; }

/* card header, content, footer */
.card-header { display: flex; justify-content: space-between; align-items: center;}
.card-content { display: flex; flex-direction: column; gap: 15px; padding: 10px 0; }
.card-footer { display: flex; justify-content: space-between; flex-direction: column; gap: 8px; align-items: center; }

/* task title input */
.task-title { font-size: 16px; color: var(--el-text-color-primary); flex: 1; margin-right: 10px; }
.task-title-input { width: 100%; }
.task-title-input :deep(.el-input__wrapper) { box-shadow: none !important; border-radius: 0; border: none; padding-left: 0; background-color: transparent;}
.task-title-input :deep(.el-input__wrapper):hover,
.task-title-input :deep(.el-input__wrapper.is-focus) { border: none; box-shadow: none; }
.title-display-mode { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 5px 0; }
.title-edit-mode { display: flex; align-items: center; width: 100%; gap: 8px; }
.title-edit-buttons { display: flex; gap: 4px; }

/* delete task button */
.delete-button { position: absolute; top: 8px; right: 8px; z-index: 1; transition: all 0.3s; }
.delete-button :deep(.el-icon) { font-size: 16px; color: #909399; }
.delete-button:hover :deep(.el-icon) { transform: scale(1.1); color: #ff4d4f; }

/* priority icon */ 
.priority-icon { cursor: pointer; font-size: 16px; color: #909399; transition: color 0.3s;}
.priority-icon:hover { transform: scale(1.1); color: #409EFF;}
.priority-icon--normal { color: #67C23A; }
.priority-icon--warning { color: #E6A23C; }
.priority-icon--danger { color: #F56C6C; }

/* priority option */
.priority-option { display: inline-block; margin-right: 5px; color: #909399; }
.priority-option--normal { color: #67C23A; }
.priority-option--warning { color: #E6A23C; }
.priority-option--danger { color: #F56C6C; }

/* list item styles */
.list-item { margin-bottom: 8px; align-self: flex-start;}
.item-content, .item-edit { display: flex; align-items: center; padding: 4px 8px; background-color: #f5f7fa; border-radius: 4px; }
.item-text { flex: 1; margin-left: 5px; }
.item-buttons { display: flex; }
.list-bullet { color: #909399; margin-right: 5px; }
.add-item-button { margin-top: 10px; width: 100%; justify-content: center; }
.item-edit :deep(.el-input) { flex: 1; margin-right: 8px; }
.item-buttons .el-button { transition: all 0.3s ease; }
.item-buttons .el-button:hover { transform: scale(1.1); }
.item-buttons :deep(.el-icon) { font-size: 14px; }

/* footer icons row */
.footer-icons { display: flex; align-items: center; gap: 16px; }

/* assignee styles */
.assignee-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; }
.assignee-trigger:hover { transform: scale(1.1); }
.assignee-trigger:hover .el-icon,
.assignee-trigger:hover .assignee-name,
.assignee-trigger:hover .assignee-count { color: #409EFF; }
.assignee-trigger .el-icon { font-size: 16px; color: #606266; transition: all 0.3s ease; }
.assignee-name { font-size: 14px; color: #606266; transition: color 0.3s ease; }
.assignee-count { font-size: 12px; color: #909399; transition: color 0.3s ease; }
.assignee-role { font-size: 12px; color: #909399; position: relative; padding-left: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* assignee dropdown menu */
.assignee-group-title { font-size: 12px; color: #909399; padding: 0 12px; }
.assignee-dropdown :deep(.el-dropdown-menu) { min-width: 160px; }
.assignee-dropdown :deep(.el-dropdown-menu__item.is-disabled) { background-color: #f5f7fa; padding: 5px 0; }

/* disabled */
.add-item-button.is-disabled { opacity: 0.6; cursor: not-allowed; }
</style>