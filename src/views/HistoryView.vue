<template>
  <v-container fluid class="bg-grey-lighten-3">
    <v-row class="px-16 justify-center">
      <v-col md="10">
        <v-card class="pb-10 rounded-xl">
          <v-card-title>
            <h2
              class="text-teal font-weight-medium text-start px-4 pt-10 pb-3 text-h4"
            >
              Transactions History
            </h2>
          </v-card-title>
          <v-list>
            <v-list-item v-for="(payment, i) in transactions" :key="i">
              <v-row>
                <v-col cols="9" class="px-12">
                  <v-row>
                    <div class="bullet align-self-center"></div>
                    <v-col>
                      <v-list-item-title class="text-h6 text-start py-3">
                        {{ payment.type }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="grey--text text-start"
                        >Date: {{ payment.date }}</v-list-item-subtitle
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="3">
                  <!-- Payment Amount -->
                  <v-list-item-content
                    v-if="payment.In"
                    class="text-h6 text-green"
                    >+ {{ payment.amount }} EGP</v-list-item-content
                  >
                  <v-list-item-content v-else class="text-h6 text-red"
                    >- {{ payment.amount }} EGP</v-list-item-content
                  >
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApiStore } from "@/store/api";
import { userStore } from "@/store/user";
// import { storeToRefs } from "pinia";

const userApi = userStore();
const apiRequest = useApiStore();
const selectedValue = userApi.getActiveAccount;

const endpoint = ref("/account/api");

let transactions = ref([]);

const history = () => {
  apiRequest
    .makeApiCall(`${endpoint.value}/history/?mobile=${selectedValue}`, "GET")
    .then((response) => response.json())
    .then((data) => {
      transactions.value = data;
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(async () => {
  history();
});
</script>
