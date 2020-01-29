<template>
  <v-app-bar color="deep-purple" dense hide-on-scroll>
    <v-img
      alt="Vuetify Logo"
      class="shrink mr-2"
      contain
      src="../assets/logo.png"
      transition="scale-transition"
      width="40"
    />
    <div>
      <v-toolbar-title
        class="shrink mr-2 hidden-xsm-and-down white--text"
        contain
        min-width="100"
        width="100"
      >Pizza Partner</v-toolbar-title>
    </div>
    <v-tabs background-color="deep-purple" dark right>
      <v-tab to="/">welcome</v-tab>
      <v-tab to="/order">order</v-tab>
      <v-tab to="/schedule">schedule</v-tab>
    </v-tabs>
    
  </v-app-bar>
</template>

<script>
export default {};
</script>
