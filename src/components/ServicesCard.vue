<!-- ServicesCard.vue -->
<template>
  <v-card
    class="mx-auto mb-3 align-start d-flex"
    rounded="lg"
    max-height="160"
    height="100%"
    justify-center
    @click="fn"
  >
    <v-img :src="getImgUrl()" width="100" height="100%"></v-img>
    <v-card-text class="height-100 align-self-center pl-1 text-start">
      <div class="text-h6">{{ props.title }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from "vue";

// Define props and methods in the setup function
const props = defineProps(["title", "imageSrc", "fn"]);
// let imageSource = null;

const getImgUrl = () => {
  var images = require.context("../assets/", false);
  return images("./" + props.imageSrc);
};
</script>
