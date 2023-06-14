<template>
  <div>
    <h1>The space id is {{ space_id }}</h1>
  </div>
</template>

<script>
export default {
  name: "AuthExamplePage",
  middleware: ["auth"],
  data: () => ({
    space_id: null
  }),
  mounted() {
    // get the space_id from $router.query object
    this.space_id = this.$route.query.space_id;
    console.log("test vue");
  }
};
</script>
