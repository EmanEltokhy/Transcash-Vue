import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ProfileView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/services",
    name: "services",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ServicesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/services/recharge/:name",
    name: "recharge",
    props: true,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RechargeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/services/utilities/:name",
    name: "utilities",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UtilitiesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/services/donations/:name",
    name: "donations",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DonationsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/services/transfer",
    name: "transfer",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/TransferView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/history",
    name: "history",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HistoryView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  let isAuthenticated = null;
  const auth = Cookies.get("token");
  if (auth != undefined) {
    isAuthenticated = true;
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If the route requires authentication and the user is not authenticated, redirect to the login page
    next("/");
  } else {
    // Continue with the navigation
    next();
  }
});
export default router;
