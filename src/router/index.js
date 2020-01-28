import Vue from "vue";
import VueRouter from "vue-router";
import Order from "../views/Order.vue";
import Welcome from "../views/Welcome.vue";
import Schedule from "../views/Schedule.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "welcome",
    component: Welcome
  },
  {
    path: "/order",
    name: "order",
    component: Order
  },
  {
    path: "/schedule",
    name: "schedule",
    component: Schedule
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
