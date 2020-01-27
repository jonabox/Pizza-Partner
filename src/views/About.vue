<template>
  <div id="app">
    <h1>Please give us your payment details:</h1>
    <card
      class="stripe-card"
      :class="{ complete }"
      stripe="pk_test_LU90MiDvOMQN2TtHMybNODUH00HSFtn6eC"
      :options="stripeOptions"
      @change="complete = $event.complete"
    />
    <button class="pay-with-stripe" @click="pay" :disabled="!complete">Pay with credit card</button>
  </div>
</template>
 
<script>
import { stripeKey, stripeOptions } from "../stripeConfig.json";
import axios from "axios";
import { Card, createToken } from "vue-stripe-elements-plus";

export default {
  data() {
    return {
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      }
    };
  },

  components: { Card },

  methods: {
    pay() {
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      console.log(stripeOptions);
      console.log(stripeKey);
      createToken().then(data => {
        console.log(data.token);
        //send token to server
        axios
          .get("/api/dominos/charge")
          .then(response => {
            console.log(response);
            this.menu = response.data;
          })
          .catch(error => console.log(error));
      });
    }
  }
};
</script> 
 
<style>
.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style> 