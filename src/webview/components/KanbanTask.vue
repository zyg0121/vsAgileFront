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
    <el-card shadow="hover" class="kanban-task">
      <el-input
        v-model="task.title"
        placeholder="Edit title"
        class="task-title-input"
        clearable
      />
      <el-input
        v-model="task.content"
        placeholder="Input content (e.g., [file/path.js])"
        type="textarea"
        rows="2"
        @input="$emit('save', task)"
      />
      <div v-html="formattedContent" @click="handleLinkClick"></div>
      <span class="delete-btn" @click="$emit('delete')">✖</span>
    </el-card>
  </template>
  
  <script>
  export default {
    props: ['task'],
    computed: {
      formattedContent() {
        return this.task.content.replace(
          /\[(.*?)\]/g,
          '<a href="#" data-link="$1">$1</a>'
        );
      }
    },
    methods: {
      handleLinkClick(event) {
        const link = event.target.getAttribute('data-link');
        if (link) this.$emit('openLink', link);
      }
    }
  };
  </script>
  
  <style scoped>
  .kanban-task { margin: 10px 0; padding: 15px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); }
  .task-title-input { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
  .delete-btn { position: absolute; top: 5px; right: 5px; cursor: pointer; color: red; }
  </style>
  