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
          <div class="text-left mb-6 text-teal text-h6">Select Service</div>
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
                <v-menu transition="scale-transition" class="align-start">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      class="bg-grey-lighten-3 text-teal"
                      style="width: 100%"
                    >
                      <div>{{ utility.service }}</div>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item @click="selectItem('North of Cairo')">
                      <v-list-item-title> North of Cairo </v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="selectItem('South of Cairo')">
                      <v-list-item-title> South of Cairo </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-text-field
                  placeholder="Enter Payment Code"
                  prepend-inner-icon="mdi-contactless-payment"
                  variant="outlined"
                  label="Payment Code"
                  color="teal"
                  class="mt-10"
                  v-model="utility.code"
                ></v-text-field>
              </v-card-text>
            </v-window-item>

            <v-window-item v-if="utility.amount != ''" :value="2">
              <v-card-text>
                <v-text-field
                  prepend-inner-icon="mdi-typewriter"
                  variant="outlined"
                  label="Service Type"
                  readonly
                  color="teal"
                  v-model="utility.service"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-contactless-payment"
                  variant="outlined"
                  label="Payment code"
                  readonly
                  color="teal"
                  v-model="utility.code"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                  label="Payment amount"
                  readonly
                  color="teal"
                  v-model="utility.amount"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                  label="Service Charges"
                  readonly
                  color="teal"
                  v-model="utility.charges"
                ></v-text-field>
                <v-text-field
                  prepend-inner-icon="mdi-cash"
                  variant="outlined"
                  label="Total Amount"
                  readonly
                  color="teal"
                  v-model="utility.total"
                ></v-text-field>
              </v-card-text>
            </v-window-item>
            <v-window-item v-else :value="2">
              <v-card-text> No Bill Found!! </v-card-text>
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
            <v-btn
              v-if="
                (step == 0) |
                  (step == 1) |
                  ((step == 2) & (utility.amount != ''))
              "
              color="teal"
              variant="flat"
              @click="stepp"
            >
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
import router from "@/router/";
import { useApiStore } from "@/store/api";

const apiRequest = useApiStore();
const selectedCardIndex = ref(0);
const billID = ref("");
const utility = ref({
  code: "",
  amount: "",
  charges: 2.5,
  account_id: "",
  total: "",
  service: "Select Service Provider",
});
const snack = ref({
  displayMessage: false,
  message: {},
  messageColor: "",
});
const step = ref(1);
const menuOpen = ref(false);
const items = ref([
  { title: "Dashboard", readonly: false, href: "/dashboard" },
  { title: "Services", readonly: false, href: "/services" },
  { title: "Utilities", readonly: true, href: "breadcrumbs_link_2" },
]);
const providers = ref([
  { title: "Electricity", img: require("@/assets/elect.png") },
  { title: "Water", img: require("@/assets/water.png") },
  { title: "Gas", img: require("@/assets/gas.png") },
]);
const isSelected = (index) => {
  return selectedCardIndex.value === index;
};
const selectCard = (index) => {
  selectedCardIndex.value = index;
};
const stepp = () => {
  console.log(step.value);
  if (step.value == 1) {
    billAmount().then((amount) => {
      console.log(utility.value.amount);
      utility.value.total = Number(amount) + Number(utility.value.charges);
      step.value++;
    });
  } else if (step.value == 2) {
    console.log("pay");
    create_utility();
  } else if (step.value == 0) {
    step.value++;
  }
};

const closeMenu = () => {
  menuOpen.value = false;
};
const selectItem = (item) => {
  utility.value.service = item;
  closeMenu();
};
const billAmount = async () => {
  await fetch(
    `${apiRequest.BillBaseUrl}/bill/?code=${utility.value.code}&type=${
      providers.value[selectedCardIndex.value].title
    }&service=${utility.value.service}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data[0] != "bill not found") {
        utility.value.amount = data[0];
        billID.value = data[1];
        console.log(utility.value.amount);
      }
    })
    .catch((error) => {
      console.log(error);
      showMessage(error, "error");
    });
  return utility.value.amount;
};
const billDelete = async () => {
  await fetch(`${apiRequest.BillBaseUrl}/bill/${billID.value}/`, {
    method: "DELETE",
  }).catch((error) => {
    console.log(error);
    showMessage(error, "error");
  });
};
const create_utility = async () => {
  const account = JSON.parse(localStorage.getItem("activeAccount"));
  const data = {
    amount: utility.value.total,
    mobile_number: utility.value.mobile,
    account_id: account,
    type: providers.value[selectedCardIndex.value].title,
    service_type: utility.value.service,
    payment_code: utility.value.code,
  };
  apiRequest
    .makePostApiCallHome("/services/utilities/", data)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data != "stored") {
        showMessage(data, "error");
      } else {
        billDelete();
        step.value++;
      }
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
const dashboard = () => {
  router.push("/dashboard");
};
onMounted(async () => {
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
