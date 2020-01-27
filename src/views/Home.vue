<template>
  <div class="home">
    <v-container fluid>
      <v-row>
        <v-col cols="9">
          <template>
            <v-expansion-panels focusable>
              <v-expansion-panel v-for="(items, category) in menu" v-bind:key="category.id">
                <v-expansion-panel-header v-text="category" />
                <v-expansion-panel-content>
                  <v-container fluid>
                    <v-row justify="start" align="center">
                      <v-col v-for="item in items" v-bind:key="item.id" cols="auto">
                        <v-card hover max-width="300px">
                          <v-img
                            v-bind:src="item.imageURL"
                            lazy-src="../assets/pizza-min.png"
                            class="black--text align-end"
                            gradient="to bottom, rgba(0,0,0,0) 80%, white 100%"
                            aspect-ratio
                          >
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                              </v-row>
                            </template>
                          </v-img>
                          <v-card-title style="word-break: normal" v-text="item.name"></v-card-title>
                          <v-card-subtitle>$5</v-card-subtitle>
                          <v-card-actions>
                            <v-spacer />
                            <v-btn
                              color="deep-purple lighten-2"
                              class="ma-2 white--text"
                              v-on:click="addToCart(item.code)"
                            >
                              Add to order
                              <v-icon right dark>mdi-playlist-plus</v-icon>
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </v-col>
        <v-col>
          <v-card dense>
            <v-card-subtitle style="word-break: normal" v-if="getTotal == 0">Cart is empty</v-card-subtitle>
            <div v-else>
              <v-card-actions>
                <v-card-title style="word-break: normal">Total: ${{ getTotal }}</v-card-title>
                <v-spacer />
                <v-btn color="green" class="ma-2 white--text" v-on:click="showCheck = true">
                  checkout
                  <v-icon right dark>mdi-playlist-check</v-icon>
                </v-btn>
              </v-card-actions>
              <v-list>
                <div v-for="item in addedToCart" :key="item.id">
                  <div v-if="item.count > 0">
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title style="word-break: normal" v-text="item.name">></v-list-item-title>
                        <v-list-item-subtitle style="word-break: normal">Quantity: {{ item.count }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn
                          x-small
                          color="deep-purple lighten-1"
                          fab
                          v-on:click="addToCart(item.code)"
                        >
                          <v-icon color="white">mdi-plus</v-icon>
                        </v-btn>
                      </v-list-item-action>
                      <v-list-item-action>
                        <v-btn
                          x-small
                          color="deep-purple lighten-1"
                          fab
                          v-on:click="removeFromCart(item.code)"
                        >
                          <v-icon color="white">mdi-minus</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </div>
                </div>
              </v-list>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-btn v-on:click="mockPay">mock pay</v-btn>
    <div class="text-center">
      <v-dialog v-model="showCheck" width="50%">
        <!-- <template v-slot:activator="{ on }">
          <v-btn color="red lighten-2" dark v-on="on">Click Me</v-btn>
        </template> -->
        <v-card>
          <v-card-title style="word-break: normal" primary-title>
            <div
              v-if="!selectedDorm"
            >${{ getTotal }} will be charged to your card via Stripe once we match you up with someone in your dorm.</div>
            <div
              v-else
            >${{ getTotal }} will be charged to your card via Stripe once we match you up with someone in {{ selectedDorm }}.</div>
          </v-card-title>

          <v-card-subtitle
            style="word-break: normal"
          >Please provide your payment details. For testing, spam '42.'</v-card-subtitle>
          <div class="px-2">
            <card
              class="stripe-card"
              :class="{ complete }"
              stripe="pk_test_LU90MiDvOMQN2TtHMybNODUH00HSFtn6eC"
              :options="stripeOptions"
              @change="complete = $event.complete"
            />
          </div>
          <v-card-actions>
            <v-select
              @change="getDorm"
              :items="validDorms"
              v-model="selectedDorm"
              label="Select Dorm"
              color="deep-purple lighten-2"
              item-color="deep-purple lighten-2"
              @input="updateValue($event.target.value)"
              class="px-2"
            ></v-select>
            <v-form v-model="valid">
            <v-text-field
            v-model="customerName"
            :rules="nameRules"
            :counter="20"
            label="Your Name"
            required
          ></v-text-field>
            </v-form>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="showCheck = false">close</v-btn>
            <v-btn
              color="deep-purple lighten-2"
              class="pay-with-stripe ma-2 white--text"
              v-on:click="pay"
              :disabled="!complete || !selectedDorm || !customerName"
            >Pay with credit card</v-btn>
            
          </v-card-actions>
          
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import cart from "../assets/cart.json";
import { Card, createToken } from "vue-stripe-elements-plus";

export default {
  name: "home",
  data() {
    return {
      menu: "",
      validDorms: ["Simmons", "Masseeh", "Baker"],
      showCheck: false,
      addedToCart: cart,
      complete: false,
      valid: false,
      customerName: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 20 || 'Name must be at most 20 characters',
      ],
      selectedDorm: null,
      stripeOptions: {
        hidePostalCode: false,
        style: {
          base: {
            fontSize: "32px"
          }
        }
      }
    };
  },
  components: { Card },

  computed: {
    getTotal: function() {
      let total = 0;
      for (let itemCode in this.addedToCart) {
        if (this.addedToCart[itemCode].count > 0) {
          total +=
            this.addedToCart[itemCode].price * this.addedToCart[itemCode].count;
        }
      }
      return total;
    }
  },

  methods: {
    addToCart: function(itemCode) {
      this.addedToCart[itemCode].count += 1;
    },
    removeFromCart: function(itemCode) {
      this.addedToCart[itemCode].count -= 1;
    },
    pay() {
      createToken().then(data => {
        console.log(data.token);
        //send token to server
        axios
          .get("/api/dominos/charge/" + data.token.id)
          .then(response => {
            console.log(response);
          })
          .catch(error => console.log(error));
      });
    },
    mockPay() {
      console.log(this.addedToCart);
      //send token to server
      axios
        .post("/api/dominos/charge/", {
          cart: this.addedToCart,
          customer: "Jona",
          dorm: "Simmons",
          token: "replace this later"
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error));
    }
  },

  created: function() {
    axios
      .get("/api/dominos/menu")
      .then(response => {
        console.log(response);
        this.menu = response.data;
      })
      .catch(error => console.log(error));
  }
};
</script>
<style scoped>
.stripe-card {
  padding: 1em;
  min-width: 100%;
  border: 1px solid transparent;
}
.stripe-card.complete {
  border-color: green;
  border-radius: 10px;
}
</style>
