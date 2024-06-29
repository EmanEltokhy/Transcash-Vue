// stores/apiStore.js
import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useApiStore = defineStore({
  id: "api",
  state: () => ({
    baseUrl: "http://127.0.0.1:8000",
    BillBaseUrl: "http://127.0.0.1:4000",
    auth: Cookies.get("token"),
  }),

  actions: {
    async makeApiCall(endpoint, method) {
      //   try {
      const url = this.baseUrl + endpoint;
      return await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${this.auth}`,
        },
        credentials: "same-origin",
        // body: data,
      });
    },
    async makePostApiCall(endpoint, data) {
      const url = this.baseUrl + endpoint;
      return await fetch(url, {
        method: "Post",
        headers: {
          Authorization: `Bearer ${this.auth}`,
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });
    },
    async makePostApiCallHome(endpoint, data) {
      const url = this.baseUrl + endpoint;
      return await fetch(url, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });
    },
    async BillApi(endpoint) {
      console.log("bill api");
      const url = this.BillBaseUrl + endpoint;
      console.log(url);
      return await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  },
});
