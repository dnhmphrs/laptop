<template>
  <div class="main">
    <three
      class="three" />
  </div>
</template>

<script>
  import {mapActions,mapGetters} from 'vuex'
  import Three from './Three'

  export default {
    name: 'Home',
    components: {
      Three
    },
    computed: {
      ...mapGetters(['isMobile'])
    },
    methods: {
      ...mapActions([])
    }
  }
</script>

<style scoped>

.main {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.three {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border-left: #1b1c1d solid 1px;
}

@media only screen and (max-width: 1000px) {

}

@media only screen and (max-width: 800px) {
  .menu__row {
    color: red;
  }

  .menu {
    width: 100vw;
  }

}




</style>
