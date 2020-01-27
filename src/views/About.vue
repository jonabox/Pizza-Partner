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
    <v-btn 
    class="pay-with-stripe" v-on:click="pay" :disabled="!complete"
    >
    Pay with credit card
    </v-btn>
  </div>
</template>
 
<script>
import axios from "axios";
import { Card, createToken } from "vue-stripe-elements-plus";

export default {
  data() {
    return {
      complete: false,
      stripeOptions: {
        hidePostalCode: false,
        style: {
          base: {
            fontSize: '32px',
          }
        }
      }
    };
  },

  components: { Card },

  methods: {
    pay() {
      createToken().then(data => {
        console.log(data.token);
        //send token to server
        axios
          .get("/api/dominos/charge/" + data.token.id)
          .then(response => {
            console.log(response);
            // this.menu = response.data;
          })
          .catch(error => console.log(error));
      });
    }
  }
};
</script> 
 
<style>
.stripe-card {
  width: 50%;
  padding: 1em;
  min-width: 600px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style> 