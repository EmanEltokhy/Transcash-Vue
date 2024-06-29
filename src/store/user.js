import { defineStore } from "pinia";
export const userStore = defineStore("userStore", {
  state: () => ({
    responseData: {},
    activeAccount: -1,
    transactions: [],
  }),
  getters: {
    // Getter to access myData
    getResponseData: (state) => state.activeAccount,
    getActiveAccount: () => JSON.parse(localStorage.getItem("activeAccount")),
  },
  actions: {
    setActvieAccount(data) {
      this.activeAccount = data;
      localStorage.setItem("activeAccount", JSON.stringify(data));
    },
  },
});
