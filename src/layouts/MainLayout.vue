<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
    class="bg-white text-grey-10"
     bordered>
      <q-toolbar class="constrain" >  
        <q-btn to="camera" class="large-screen-only q-mr-sm" icon="eva-camera-outline" size="18px" flat round dense/>
        <q-separator spaced vertical class="large-screen-only"/>
        <q-toolbar-title class="text-grand-hotel text-bold">
          QuasarInsta
        </q-toolbar-title>
        <q-btn to="/" class="large-screen-only" icon="eva-home-outline" size="18px" flat round dense/>

        </q-toolbar>
    </q-header>
<q-footer class="bg-white small-screen-only" bordered >
    <q-tabs  class="text-grey-10" active-color="primary" indicator-color="transparent">
    <q-route-tab to="/" icon="eva-home-outline"/>    
    <q-route-tab to="camera" icon="eva-camera-outline"/>
    </q-tabs>
</q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
     
    }
  }
}
</script>

<style lang="sass" >
.q-toolbar
  @media (min-width: $breakpoint-xs-max)
    height: 57px
  .q-toolbar_title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center
.q-footer
  .q-tab_icon 
    font-size: 30px

</style>
