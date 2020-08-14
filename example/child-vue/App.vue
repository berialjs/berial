<template>
  <div>
    <h1>{{ msg }}</h1>
    <img src='https://cn.vuejs.org/images/logo.png' />
  </div>
</template>

<script>
import { setInterval } from 'timers'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Hello Vue'
    }
  },
}
</script>

<style>
  h1 {
    color: #42b983;
  }
</style>
