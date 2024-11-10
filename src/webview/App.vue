<template>
    <div id="app">
        <KanbanBoard />
    </div>
  </template>
  
<script>

import KanbanBoard from "./components/KanbanBoard.vue";

export default {
  name: 'app',
  components: {
    KanbanBoard,
  }
}
</script>

<style>

</style>
