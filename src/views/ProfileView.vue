<template>
  <!-- <v-app> -->
  <v-container fluid class="bg-grey-lighten-3">
    <v-row class="px-16 justify-center">
      <v-col md="8">
        <v-card rounded="lg">
          <v-card-title class="text-teal">
            <h2
              class="pb-6 pt-3 text-start pl-4"
              style="color: rgb(191, 188, 188)"
            >
              Profile
            </h2>
          </v-card-title>
          <v-card-text class="px-10">
            <v-container>
              <v-row class="pb-4">
                <div class="bullet align-self-center"></div>
                <h2>First Name</h2>
                <v-spacer></v-spacer>
                <h2>{{ userApi.responseData.first_name }}</h2>
              </v-row>
              <v-row class="pb-4">
                <div class="bullet align-self-center"></div>
                <h2>Last Name</h2>
                <v-spacer></v-spacer>
                <h2>{{ userApi.responseData.last_name }}</h2>
              </v-row>
              <v-row class="pb-4">
                <div class="bullet align-self-center"></div>
                <h2>Username</h2>
                <v-spacer></v-spacer>
                <h2>{{ userApi.responseData.username }}</h2>
              </v-row>
              <v-row class="pb-4">
                <div class="bullet align-self-center"></div>
                <h2>Email</h2>
                <v-spacer></v-spacer>
                <h2>{{ userApi.responseData.email }}</h2>
              </v-row>
              <v-row class="pb-4">
                <div class="bullet align-self-center"></div>
                <h2>National ID</h2>
                <v-spacer></v-spacer>
                <h2>{{ userApi.responseData.national_id }}</h2>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- </v-app> -->
</template>

<script setup>
import { userStore } from "@/store/user";

const userApi = userStore();
</script>
<style>
.bullet {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3f51b5; /* Bullet color */
  margin: 0 16px; /* Adjust the margin as needed */
}
h2 {
  /* color: #3f51b5; */
  /* color: rgb(191, 188, 188); */
  color: teal;
  font-weight: 400;
}
</style>
