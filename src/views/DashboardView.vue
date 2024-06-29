<template>
  <v-container fluid class="bg-grey-lighten-3 text-center">
    <div v-if="loaded">
      <v-dialog v-model="dialog" max-width="300">
        <v-card>
          <v-card-title>Bank Account Recharge</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="amount"
              label="Enter Recharge amount"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeDialog">Cancel</v-btn>
            <v-btn color="teal" @click="submitInput">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="add_dialog" max-width="300">
        <v-card>
          <v-card-title>Add New Account</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="amount"
              label="Enter Mobile Number"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeDialog">Cancel</v-btn>
            <v-btn color="teal" @click="AddAccount">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="addMoneyDialog" max-width="400">
        <v-card>
          <v-card-title v-if="title == 'Success'" class="success-dialog-title">
            {{ title }}
          </v-card-title>
          <v-card-title v-else class="error-dialog-title">
            {{ title }}
          </v-card-title>
          <v-img
            v-if="title == 'Success'"
            :src="require('@/assets/success.gif')"
            height="250"
            cover
          ></v-img>
          <v-img
            v-else
            :src="require('@/assets/error.gif')"
            height="250"
            cover
          ></v-img>
          <v-card-text> {{ message }} </v-card-text>
          <v-card-actions>
            <router-link v-if="title == 'Success'" to="/dashboard"
              ><v-btn color="success" @click="closeAddMoneyDialog"
                >OK</v-btn
              ></router-link
            >
            <router-link v-else to="/dashboard"
              ><v-btn color="error" @click="closeAddMoneyDialog"
                >OK</v-btn
              ></router-link
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row class="px-16 pt-16 justify-center">
        <v-col cols="12" md="4">
          <v-card
            class="mx-auto mb-3 py-7 px-4 align-start rounded-xl"
            elevation="0"
            color="white"
            max-height="308"
            height="250px"
          >
            <v-card-title>
              <h5 class="text-h5 text-start text-teal mb-10">
                Welcome, {{ customer.responseData.value.first_name }}
                {{ customer.responseData.value.last_name }}
              </h5>
            </v-card-title>
            <v-card-text class="text-start">
              <div class="mb-3 text-teal">You are currently managing:</div>
              <v-menu transition="scale-transition" class="align-start">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="bg-grey-lighten-3 text-teal"
                    prepend-icon="mdi-sim"
                  >
                    <div v-if="userApi.activeAccount == -1">
                      {{ selectedValue }}
                    </div>
                    <div v-else>
                      {{ selectedValue }}
                    </div>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    prepend-icon="mdi-sim"
                    v-for="(account, i) in customer.responseData.value.user"
                    :key="i"
                    @click="selectItem(account.mobile_number, i)"
                  >
                    <v-list-item-title>{{
                      account.mobile_number
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                icon="mdi-plus"
                size="30"
                class="ml-4"
                @click="openAddDialog"
              ></v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            class="mx-auto mb-3 align-center rounded-xl"
            elevation="0"
            rounded="lg"
            max-height="308"
            height="250px"
          >
            <v-img
              id="money"
              :src="require('@/assets/money.png')"
              height="308"
              contain
              class="contain-right py-7 px-4"
            >
              <v-card-title class="pt-10">
                <h5 class="text-h6 text-start text-white mb-5">Balance</h5>
                <v-row class="pl-3">
                  <div
                    class="mb-3 text-white"
                    v-if="userApi.activeAccount == -1"
                  ></div>
                  <div
                    class="text-h3 font-weight-bold text-white text-center align-self-center"
                    v-else
                  >
                    EGP
                    {{
                      customer.responseData.value.user.find(
                        (user) => user.mobile_number === selectedValue
                      ).balance
                    }}
                  </div>
                </v-row>
                <div class="text-left pt-5">
                  <v-btn
                    class="text-none text-subtitle-2 text-left text-align-self-left"
                    elevation="0"
                    :ripple="{ class: 'text-grey' }"
                    @click="openDialog"
                    >Recharge</v-btn
                  >
                </div>
              </v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="px-16 pt-1 justify-center">
        <v-col cols="12" md="10">
          <h2 class="text-teal font-weight-medium text-start pb-3 text-h4">
            Recommended Services
          </h2>
        </v-col>
      </v-row>
      <v-row class="px-16 pt-1 pb-6 justify-center">
        <v-col
          cols="12"
          md="5"
          v-for="(account, i) in recommendations_data"
          :key="i"
        >
          <v-card
            class="mx-10 align-start rounded-xl"
            elevation="0"
            height="100px"
          >
            <services-card
              v-if="account.name == 'transfer'"
              title="Transfer Money"
              image-src="transaction.png"
              :fn="() => router.push('services/transfer')"
            />
            <services-card
              v-else
              :title="account.name"
              :image-src="images[account.name]"
              :fn="() => navigate(account.category, account.name)"
            />
          </v-card>
        </v-col>
        <v-col cols="12" md="5" v-if="recommendations_data.length == 1">
        </v-col>
      </v-row>
      <v-row class="px-16 justify-center">
        <v-col md="10">
          <v-card class="mx-auto mb-3 py-7 px-4 align-start rounded-xl">
            <v-card-title>
              <h2
                class="text-teal font-weight-medium text-start px-4 pt-10 pb-3 text-h4"
              >
                Last Payments
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
    </div>
    <v-progress-circular
      v-else
      class="py-16"
      :size="100"
      :width="10"
      color="teal"
      indeterminate
    ></v-progress-circular>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import { userStore } from "@/store/user";
import { useApiStore } from "@/store/api";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import ServicesCard from "@/components/ServicesCard.vue";
// import router from "@/router";
import { useRouter } from "vue-router";
const router = useRouter();

const userApi = userStore();
const customer = storeToRefs(userApi);
const route = useRoute();
const apiRequest = useApiStore();
const title = ref("");
const message = ref("");
let selectedValue = ref("Select Account");
let amount = ref("");
const endpoint = ref("/account/api");
const menuOpen = ref(false);
const dialog = ref(false);
const add_dialog = ref(false);
const loaded = ref(false);
let recommendations_data = ref([]);
const snack = ref({
  displayMessage: false,
  message: {},
  messageColor: "",
});
const images = ref({
  Orange: "orange.png",
  Vodafone: "vodafone.png",
  Etisalat: "etisalat.png",
  We: "we.jpg",
  57357: "57.png",
  "Bet El-Zakat": "bet.png",
  "El Helal El Ahmar El Masry": "helal.jpg",
  Electricity: "elect.png",
  Water: "water.png",
  Gas: "gas.png",
  Donation: "donation.png",
  Resala: "resala.png",
});
let transactions = ref([]);

const closeMenu = () => {
  menuOpen.value = false;
};
const selectItem = (item) => {
  selectedValue.value = item;
  userApi.setActvieAccount(item);
  // overview();
  // Recommendations();
  closeMenu();
  window.location.reload();
};

const openDialog = () => {
  dialog.value = true;
};
const openAddDialog = () => {
  add_dialog.value = true;
};
const closeDialog = () => {
  dialog.value = false;
};
const submitInput = () => {
  console.log("Submitted: " + amount.value);
  dialog.value = false;
  addMoney();
};

const overview = () => {
  apiRequest
    .makeApiCall(
      `${endpoint.value}/overview/?mobile=${selectedValue.value}`,
      "GET"
    )
    .then((response) => response.json())
    .then((data) => {
      transactions.value = data;
    })
    .catch((error) => {
      console.log(error);
    });
};
const userData = () => {
  apiRequest
    .makeApiCall(`${endpoint.value}/profile/`, "GET")
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      userApi.responseData = data;
      if (userApi.getActiveAccount != undefined) {
        selectedValue.value = userApi.getActiveAccount;
        userApi.setActvieAccount(userApi.getActiveAccount);
      } else {
        console.log("customer.responseData.value.user[0].mobile_number");
        selectedValue.value = customer.responseData.value.user[0].mobile_number;
        userApi.setActvieAccount(selectedValue.value);
      }
      console.log(selectedValue.value);
      // userApi.setActvieAccount(selectedValue.value);
      overview();
      Recommendations();
      storePaymobAmount();
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
};

const addMoney = () => {
  apiRequest
    .makeApiCall(`${endpoint.value}/paymob/?amount=${amount.value}`, "GET")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.location.href = data;
      amount.value = "";
    })
    .catch((error) => {
      console.log(error);
    });
};

const storePaymobAmount = () => {
  const success = ref(route.query.success);
  const amount = ref(route.query.amount);
  const data = ref({
    amount: amount.value / 100,
    mobile_number: selectedValue.value,
    account_id: selectedValue.value,
    In: true,
  });
  if ((success.value != undefined) & (success.value != "false")) {
    title.value = "Success";
    message.value = "Successful Transaction";
    apiRequest
      .makePostApiCall("/services/transfer/?In=true", data.value)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        showAddMoneyDialog();
      })
      .catch((error) => {
        console.log(error);
        title.value = "Error";
        message.value = "Failed Transaction";
        showAddMoneyDialog();
      });
  } else if (success.value == "false") {
    title.value = "Error";
    message.value = "Failed Transaction";
    showAddMoneyDialog();
  }
};
onBeforeMount(async () => {
  userData();
});
onMounted(async () => {
  setTimeout(() => {
    // Assuming some condition to determine if the page should be loaded
    const shouldLoadPage = true;

    // Set the 'loaded' variable based on the condition
    loaded.value = shouldLoadPage;
  }, 3000);
});

const addMoneyDialog = ref(false);

const closeAddMoneyDialog = () => {
  addMoneyDialog.value = false;
  // window.location.reload();
  // emit("close");
};

const showAddMoneyDialog = () => {
  addMoneyDialog.value = true;
};
const navigate = (page, param) => {
  if (router) {
    router.push({ name: page, params: { name: param } });
  }
};
const Recommendations = () => {
  console.log(selectedValue.value);
  apiRequest
    .makeApiCall(
      `${endpoint.value}/recommendations/?id=${selectedValue.value}`,
      "GET"
    )
    .then((response) => response.json())
    .then((data) => {
      recommendations_data.value = data;
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
};
const AddAccount = async () => {
  add_dialog.value = false;
  if (customer.responseData.value.user.length < 3) {
    const data = {
      user: customer.responseData.value.id,
      mobile_number: amount.value,
      balance: 0,
    };
    apiRequest
      .makePostApiCallHome("/account/addAccount/", data)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data == "registerd") {
          showMessage({ message: "Added Succesfully" }, "success");
        } else {
          showMessage(data, "error");
        }
      })
      .catch((error) => {
        showMessage(error, "error");
      });
  }
  amount.value = "";
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
</script>

<style>
.bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3f51b5; /* Bullet color */
  margin: 0 16px; /* Adjust the margin as needed */
}
.mdi-sim::before {
  color: teal; /* Set your desired color here */
}
.v-img__img--contain {
  object-position: center;
}
#money .v-img__img--contain {
  object-position: right;
  background-image: linear-gradient(
    rgba(0, 128, 128, 0.73),
    rgba(114, 129, 255, 0.42)
  );
}
.success-dialog-title {
  background-color: green;
  color: white;
}
.error-dialog-title {
  background-color: red;
  color: white;
}
</style>
