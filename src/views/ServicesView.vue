<template>
  <v-container fluid class="bg-grey-lighten-3">
    <v-row class="pt-16 justify-center">
      <v-col cols="12" md="3" style="height: 150px">
        <services-card
          title="Mobile Recharge"
          image-src="mobil-recharge.png"
          :fn="recharge"
        />
      </v-col>
      <v-col cols="12" md="3" style="height: 150px">
        <services-card
          title="Home Interntet"
          image-src="home-internet.png"
          :fn="recharge"
        />
      </v-col>
      <v-col cols="12" md="3" style="height: 150px">
        <services-card title="Cah In & CashOut" image-src="cash.jpg" />
      </v-col>
    </v-row>
    <v-row class="pt-3 mb-16 justify-center">
      <v-col cols="12" md="3" style="height: 150px">
        <services-card
          title="Money Transfer"
          image-src="transaction.png"
          :fn="transfer"
        />
      </v-col>
      <v-col cols="12" md="3" style="height: 150px">
        <services-card
          title="Utilities"
          image-src="utilities.png"
          :fn="utilities"
        />
      </v-col>
      <v-col cols="12" md="3" style="height: 150px">
        <v-card
          class="mx-auto mb-3 align-start d-flex"
          rounded="lg"
          max-height="160"
          height="100%"
          justify-center
          @click="donations"
        >
          <v-img
            id="donation"
            :src="require('@/assets/donation.png')"
            width="100"
            height="100%"
            style="padding: 10px"
          ></v-img>
          <v-card-text class="height-100 align-self-center pl-1 text-start">
            <div class="text-h6">Donations</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import router from "@/router";
import ServicesCard from "@/components/ServicesCard.vue";

const recharge = () => {
  if (router) {
    router.push({ name: "recharge", params: { name: "none" } });
  }
};
const utilities = () => {
  if (router) {
    router.push({ name: "utilities", params: { name: "none" } });
  }
};
const donations = () => {
  if (router) {
    router.push({ name: "donations", params: { name: "none" } });
  }
};
const transfer = () => {
  router.push("services/transfer");
};
</script>

<style>
#donation .v-img__img--contain {
  padding: 10px;
}
</style>
