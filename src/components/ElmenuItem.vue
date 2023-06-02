<template>
  <div>asd</div>
</template>

<script>
export default {
  name: "Elmenu-item",
  props: {
    paddingNone: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      routeName: this.$route.meta.title,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
