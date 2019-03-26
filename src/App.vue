<template>
  <div id="app">
    <notebooks-container msg="Notebook sessions to crunch data remotely 👇"/>
  </div>
</template>

<script>
import NotebooksContainer from './components/NotebooksContainer.vue'

export default {
  name: 'app',
  components: {
    NotebooksContainer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
