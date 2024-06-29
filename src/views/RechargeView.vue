<template>
  <v-breadcrumbs :items="items" class="pl-16">
    <template v-slot:prepend>
      <v-icon size="small" icon="$vuetify" class="pl-16"></v-icon>
    </template>
  </v-breadcrumbs>
  <v-container fluid class="bg-grey-lighten-3">
    <v-row class="pt-10 justify-center">
      <v-col cols="12" md="6">
        <v-card
          class="mx-auto align-start pa-6"
          rounded="lg"
          height="100%"
          justify-center
        >
          <div class="text-left mb-6 text-teal text-h6">Select Provider</div>
          <v-item-group mandatory>
            <v-row class="justify-center">
              <v-col
                v-for="(provider, i) in providers"
                :key="provider.title"
                cols="12"
                md="2"
              >
                <v-item>
                  <v-card
                    :color="isSelected(i) ? 'teal' : ''"
                    class="align-center pa-1 h-75"
                    width="100%"
                    @click="selectCard(i)"
                    v-model="value"
                  >
                    <v-img
                      id="donation"
                      :src="provider.img"
                      height="100%"
                    ></v-img>
                  </v-card>
                  <div class="text-subtitle-2">{{ provider.title }}</div>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="py-16 justify-center">
      <v-col cols="12" md="6">
        <v-card class="mx-auto">
          <message-display
            :show="snack.displayMessage"
            :message="snack.message"
            :color="snack.messageColor"
          ></message-display>
          <v-card-title
            class="text-h6 font-weight-regular justify-space-between text-left pl-9 pt-8"
          >
            <v-avatar
              color="teal"
              size="22"
              v-text="step"
              class="mr-3"
            ></v-avatar>
            <span id="title">{{ currentTitle }}</span>
          </v-card-title>

          <v-window v-model="step" class="pa-6">
            <v-window-item :value="1">
              <v-card-text>
                <v-text-field
                  placeholder="Enter Mobile Number"
                  prepend-inner-icon="mdi-phone-outline"
                  variant="outlined"
                  label="Mobile Number"
                  color="teal"
                  v-model="transfer.mobile"
                  required
                ></v-text-field>
                <v-text-field
                  placeholder="Enter Recharge Amount"
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                  label="Amount"
                  color="teal"
                  v-model="transfer.amount"
                  required
                ></v-text-field>
              </v-card-text>
            </v-window-item>

            <v-window-item :value="2">
              <v-card-text>
                <v-text-field
                  prepend-inner-icon="mdi-phone-outline"
                  variant="outlined"
                  label="Mobile Number"
                  :placeholder="transfer.mobile"
                  v-model="transfer.mobile"
                  readonly
                  color="teal"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                  label="amount"
                  v-model="transfer.amount"
                  readonly
                  color="teal"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                  label="charges"
                  v-model="transfer.charges"
                  readonly
                  color="teal"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                  label="Total"
                  v-model="total"
                  readonly
                  color="teal"
                ></v-text-field>
              </v-card-text>
            </v-window-item>

            <v-window-item :value="3">
              <div class="pa-4 text-center">
                <v-img
                  class="mb-4"
                  contain
                  height="128"
                  src="https:www.kablooe.com/wp-content/uploads/2019/08/check_mark.png"
                ></v-img>
                <h3 class="text-h6 font-weight-light mb-2">
                  Transaction Completed Successfully
                </h3>
              </div>
            </v-window-item>
          </v-window>

          <v-divider></v-divider>

          <v-card-actions class="pa-3 pr-9">
            <v-btn
              v-if="(step > 1) & (step != 3)"
              variant="text"
              @click="step--"
            >
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="step < 3" color="teal" variant="flat" @click="stepp">
              Next
            </v-btn>
            <v-btn
              v-if="step == 3"
              color="teal"
              variant="flat"
              @click="dashboard"
            >
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MessageDisplay from "@/components/MessageDisplay.vue";
import router from "@/router";
import { useApiStore } from "@/store/api";

const apiRequest = useApiStore();
const selectedCardIndex = ref(0);
const step = ref(1);
const total = ref(0);
const transfer = ref({
  mobile: "",
  amount: 0,
  charges: 2.5,
  account_id: "",
});
const snack = ref({
  displayMessage: false,
  message: {},
  messageColor: "",
});
const items = ref([
  { title: "Dashboard", disabled: false, href: "/dashboard" },
  { title: "Services", disabled: false, href: "/services" },
  { title: "Recharge", disabled: true, href: "breadcrumbs_link_2" },
]);
const providers = ref([
  { title: "Orange", img: require("@/assets/orange.png"), Selected: false },
  { title: "Etisalat", img: require("@/assets/etisalat.png"), Selected: false },
  { title: "Vodafone", img: require("@/assets/vodafone.png"), Selected: false },
  { title: "We", img: require("@/assets/we.jpg") },
]);
const isSelected = (index) => {
  return selectedCardIndex.value === index;
};
const selectCard = (index) => {
  selectedCardIndex.value = index;
};
const stepp = () => {
  if (step.value == 2) {
    create_recharge();
  } else {
    total.value =
      Number(transfer.value.amount) + Number(transfer.value.charges);
    step.value++;
  }
};
const currentTitle = computed(() => {
  switch (step.value) {
    case 1:
      return "Recharge Data";
    case 2:
      return "Payment Confirmation";
    default:
      return "Payment Successful";
  }
});
const create_recharge = async () => {
  const account = JSON.parse(localStorage.getItem("activeAccount"));
  console.log(account);
  const data = {
    amount: total.value,
    mobile_number: transfer.value.mobile,
    account_id: account,
    service_provider: providers.value[selectedCardIndex.value].title,
  };
  apiRequest
    .makePostApiCallHome("/services/recharge/", data)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data != "stored") {
        showMessage(data, "error");
      } else step.value++;
    })
    .catch((error) => {
      showMessage(error, "error");
    });
};
const showMessage = (message, color) => {
  snack.value.displayMessage = true;
  snack.value.message = message;
  snack.value.messageColor = color;

  // Close the message after a certain duration
  setTimeout(() => {
    snack.value.displayMessage = false;
    snack.value.message = {};
    snack.value.messageColor = "";
  }, 3000);
};
const dashboard = () => {
  router.push("/dashboard");
};
onMounted(async () => {
  console.log(router.currentRoute.value.params.name);
  if (router.currentRoute.value.params.name != "none") {
    const index = providers.value.findIndex(
      (provider) =>
        provider.title.toLowerCase() ==
        router.currentRoute.value.params.name.toLowerCase()
    );
    selectCard(index);
  }
});
</script>
