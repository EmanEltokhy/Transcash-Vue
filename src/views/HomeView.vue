<template>
  <v-container fluid class="bg-grey-lighten-3 mt-10">
    <v-col>
      <v-container class="pa-16">
        <div class="text-h4 text-center text-teal font-weight-bold mb-5">
          Welcome to our cash website
        </div>
        <div class="text-h6 text-center text-teal">
          Experience the convenience of digital transactions.
        </div>
      </v-container>
      <v-card
        class="mx-auto mb-3"
        elevation="0"
        max-width="448"
        rounded="lg"
        color="white"
      >
        <message-display
          :show="snack.displayMessage"
          :message="snack.message"
          :color="snack.messageColor"
        ></message-display>
      </v-card>
      <v-card
        v-if="login"
        class="mx-auto pa-12 pb-8 mb-16"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-h3 text-left mb-12">Log In</div>

        <v-text-field
          placeholder="Enter National ID"
          prepend-inner-icon="mdi-card-account-details"
          variant="outlined"
          label="National ID"
          v-model="national"
          color="teal"
        ></v-text-field>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          label="Password"
          v-model="password"
          color="teal"
          @click:append-inner="visible = !visible"
        ></v-text-field>
        <v-btn block class="mb-8" color="teal" size="large" @click="loginFun">
          Log In
        </v-btn>
        <div class="text-subtitle-1 text-medium-emphasis">
          Don't have an account yet?

          <a
            class="text-decoration-none text-deep-purple-lighten-1 text-subtitle-1"
            @click="login = !login"
            style="cursor: pointer"
          >
            Register</a
          >
        </div>
      </v-card>
      <v-card
        v-else
        class="mx-auto pa-12 pb-8 mb-16"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-h3 text-left mb-12">Register</div>

        <v-text-field
          v-for="(data, i) in registerFields"
          :label="data.label"
          :key="i"
          :placeholder="data.placeholder"
          :prepend-inner-icon="data.icon"
          variant="outlined"
          color="teal"
          v-model="register[i]"
        ></v-text-field>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          label="Password"
          color="teal"
          v-model="register[5]"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-btn
          block
          class="mb-8"
          color="teal"
          size="large"
          @click="registerFun"
        >
          Register
        </v-btn>
        <div class="text-subtitle-1 text-medium-emphasis">
          Already have an account?

          <a
            class="text-decoration-none text-deep-purple-lighten-1 text-subtitle-1"
            @click="login = !login"
            style="cursor: pointer"
          >
            Login</a
          >
        </div>
      </v-card>
    </v-col>
  </v-container>
  <v-container fluid class="bg-grey-lighten-2 text-light text-center py-5">
    <v-col>
      <h2 class="mb-16 text-teal font-weight-regular">Key Features</h2>
      <v-row justify="center" class="my-4 text-center">
        <v-card
          class="mx-2 mb-16"
          max-width="344"
          v-for="(card, id) in cards"
          :key="id"
        >
          <v-img :src="card.img" height="200px" cover></v-img>

          <v-card-title> {{ card.title }} </v-card-title>
          <v-card-text>
            {{ card.body }}
          </v-card-text>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script setup>
import Cookies from "js-cookie";
import MessageDisplay from "@/components/MessageDisplay.vue";
import { ref } from "vue";
import router from "@/router";
import { useApiStore } from "@/store/api";
import { userStore } from "@/store/user";
const userApi = userStore();

const apiRequest = useApiStore();
const national = ref("");
const password = ref("");
const visible = ref(false);
const login = ref(true);
const snack = ref({
  displayMessage: false,
  message: {},
  messageColor: "",
});
const cards = ref([
  {
    title: "Easy Payments",
    body: "Make quick and secure payments with just a few taps on your device.",
    img: require("@/assets/payment.png"),
  },
  {
    title: "Mobile Wallet",
    body: "Store and manage your funds in a digital wallet for easy access anytime.",
    img: require("@/assets/wallet.png"),
  },
  {
    title: "Secure Transactions",
    body: "Enjoy peace of mind with our robust security measures to protect your financial information.",
    img: require("@/assets/transfer.png"),
  },
]);
const registerFields = ref([
  {
    placeholder: "Enter First Name",
    icon: "mdi-account-outline",
    label: "First Name",
    type: "text",
    vari: "firstname",
  },
  {
    placeholder: "Enter Last Name",
    icon: "mdi-account-outline",
    label: "Last Name",
    type: "text",
    vari: "lastname",
  },
  {
    placeholder: "Enter User Name",
    icon: "mdi-account-outline",
    label: "Username",
    type: "text",
    vari: "username",
  },
  {
    placeholder: "Enter Naiontal ID",
    icon: "mdi-card-account-details",
    label: "National ID",
    type: "text",
    vari: "national",
  },
  {
    placeholder: "Enter Phone Number",
    icon: "mdi-sim-outline",
    label: "Phone Number",
    type: "tel",
    vari: "phone",
  },
]);
const register = ref(["", "", "", "", "", ""]);

const loginFun = async () => {
  const data = {
    national_id: national.value,
    password: password.value,
  };
  apiRequest
    .makePostApiCallHome("/account/api/login/", data)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      Cookies.set("token", data.access, { secure: true });
      if (data.refresh == undefined) {
        showMessage(data, "error");
      } else {
        showMessage("Succesfully Login", "success");
        userApi.islogin = true;
        router.push("dashboard");
      }
    })
    .catch((error) => {
      // Handle any errors
      showMessage(error, "error");
    });
};

const registerFun = async () => {
  const data = {
    first_name: register.value[0],
    last_name: register.value[1],
    username: register.value[2],
    national_id: register.value[3],
    mobile_number: register.value[4],
    password: register.value[5],
  };
  apiRequest
    .makePostApiCallHome("/account/register/", data)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data == "registerd") {
        showMessage(
          { message: "Registerd Succesfully... Pleased Logged In" },
          "success"
        );
        login.value = true;
      } else {
        showMessage(data, "error");
      }
    })
    .catch((error) => {
      // Handle any errors
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
</script>
