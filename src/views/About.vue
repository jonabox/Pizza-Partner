<template>
  <div class="about ma-5">
    <v-parallax height="300" src="../assets/purple.jpg">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="display-1 font-weight-bold mb-4">Welcome to Pizza Partner!</h1>
        </v-col>
      </v-row>
    </v-parallax>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h4 class="subheading ma-5">
          You are a hungry MIT student. It's late at night and none of your friends want to order with you.
          Thankfully, Pizza Partner lets you partner up with other students in your dorm so that together you can
          place an order and save money by splitting it. Pizza Partner automatically applies coupons to the combined order so that
          you can minimize your spending while maximizing your belly. 😉
        </h4>
      </v-col>
    </v-row>
    <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
      <v-timeline-item
        v-for="(item, i) in items"
        :key="i"
        :color="item.color"
        :icon="item.icon"
        fill-dot
      >
        <v-card :color="item.color" dark>
          <v-card-title class="title">{{item.title}}</v-card-title>
          <v-card-text class="white text--primary">
            <p class="pa-1">{{item.text}}</p>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>
<script>
export default {
  data: () => ({
    items: [
      {
        color: "deep-purple accent",
        title: "Craft Your Order!",
        text: "Choose items from the Domino's menu.",
        icon: "mdi-star"
      },
      {
        color: "deep-purple accent-1",
        title: "Checkout!",
        text: "Once you are ready to order. Hit that checkout button and input your name, dorm, and card details. Don't worry, Stripe handles all transactions and we never store your card information.",
        icon: "mdi-account-card-details"
      },
      {
        color: "deep-purple accent-2",
        title: "Partner Up!",
        text: "We will pair you up with someone in your dorm. Once a partnership is found, we will place the order and charge you. We will add coupons to save as much 💵 possible. That said, we will add a tip to show gratitude to the deliverer. Check out all pairings in the Schedule tab.",
        icon: "mdi-account-multiple"
      },
      {
        color: "deep-purple accent-5",
        title: "Pickup Your Order!",
        text: "We will update you on how your order is doing once it is placed. Once it arrives to your dorm, either you or your partner can pick it up. You are allowed sign the order on the Pizza Partner's behalf.",
        icon: "mdi-pizza"
      }
    ]
  })
};
</script>