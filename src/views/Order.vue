<template>
  <div class="order">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-expansion-panels focusable>
            <v-expansion-panel v-for="(items, category) in menu" v-bind:key="category.id">
              <v-expansion-panel-header v-text="category" />
              <v-expansion-panel-content>
                <v-container fluid>
                  <v-row justify="space-around" align="center">
                    <v-col v-for="item in items" v-bind:key="item.id" cols="auto">
                      <v-card hover max-width="300px">
                        <v-img
                          v-bind:src="getImageURL(item.code)"
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
                        <v-card-subtitle>${{ prices[item.code].price.toFixed(2)}}</v-card-subtitle>
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
        </v-col>
        <v-col cols="auto">
          <v-btn
            class="mb-2"
            outlined
            block
            color="deep-purple"
            v-on:click="showLogin = true"
            v-if="!loggedIn"
          >Login or Register</v-btn>
          <v-btn outlined block color="deep-purple" v-on:click="saveCart()" v-else>
            Save {{ loggedIn }}'s cart as favorite order
            <v-icon right dark>mdi-playlist-star</v-icon>
          </v-btn>
          <v-card dense>
            <div v-if="getTotal == 0">
              <v-card-actions>
                <v-card-subtitle style="word-break: normal">Cart is empty.</v-card-subtitle>
                <v-spacer />
                <v-btn
                  v-if="loggedIn"
                  color="deep-purple lighten-1"
                  class="ma-2 white--text"
                  v-on:click="loadFavorite()"
                >
                  Load Favorite
                  <v-icon right dark>mdi-star</v-icon>
                </v-btn>
              </v-card-actions>
            </div>
            <div v-else>
              <v-card-actions>
                <v-card-title style="word-break: normal">Total: ${{ getTotal }}</v-card-title>
                <v-spacer />
                <v-btn
                  v-if="loggedIn"
                  color="deep-purple lighten-1"
                  class="ma-2 white--text"
                  v-on:click="loadFavorite()"
                >
                  Load Favorite
                  <v-icon right dark>mdi-star</v-icon>
                </v-btn>
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
    <div class="text-center">
      <v-dialog
        v-model="showCheck"
        width="75%"
        scrollable
        :fullscreen="$vuetify.breakpoint.mdAndDown"
      >
        <v-card>
          <v-card-title style="word-break: normal" primary-title class="md-2">
            <div
              v-if="!selectedDorm"
            >${{ getTotal }} and a delivery fee of ${{ getFee }} will be charged to your card via Stripe and a tracking link will be sent to your phone once we match you up with someone in your dorm.</div>
            <div
              v-else
            >${{ getTotal }} and a delivery fee of ${{ getFee }} will be charged to your card via Stripe and a tracking link will be sent to your phone once we match you up with someone in {{ selectedDorm }}.</div>
          </v-card-title>

          <v-card-subtitle
            class="my-2"
            style="word-break: normal"
          >Please provide your payment details. For testing, spam '42.'</v-card-subtitle>
          <div class="px-2" shrink>
            <card
              class="stripe-card"
              :class="{ complete }"
              stripe="pk_test_LU90MiDvOMQN2TtHMybNODUH00HSFtn6eC"
              :options="stripeOptions"
              @change="complete = $event.complete"
            />
          </div>
          <v-form v-model="valid">
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
            <v-text-field
              color="deep-purple"
              v-model="customerName"
              :rules="nameRules"
              :counter="20"
              label="Your Name"
              class="px-2"
              required
            ></v-text-field>

            <v-text-field
              color="deep-purple"
              v-model="customerPhone"
              :rules="phoneRules"
              :counter="20"
              label="Your Phone Number"
              class="px-2"
              required
            ></v-text-field>
          </v-form>
          <v-card-actions>
            <v-footer :absolute="$vuetify.breakpoint.mdAndDown" min-width="100%">
              <v-spacer></v-spacer>
              <v-btn small color="deep-purple" text @click="showCheck = false">close</v-btn>
              <v-btn
                small
                color="deep-purple lighten-2"
                class="pay-with-stripe ma-2 white--text"
                v-on:click="pay"
                :disabled="!complete || !selectedDorm || !customerName || !customerPhone"
              >Pay with credit card</v-btn>
            </v-footer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="text-center">
        <v-dialog v-model="showLogin" width="75%">
          <v-card>
            <v-toolbar color="deep-purple">
              <v-toolbar-title
                v-if="!isNewUser"
                class="white--text"
                style="word-break: normal"
              >Login Form</v-toolbar-title>
              <v-toolbar-title
                v-else
                class="white--text"
                style="word-break: normal"
              >Registration Form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="validLogin">
                <v-checkbox color="deep-purple" v-model="isNewUser" label="New Account?" />
                <v-text-field
                  color="deep-purple"
                  label="Username"
                  :rules="nameRules"
                  :counter="20"
                  v-model="username"
                  prepend-icon="mdi-account"
                  type="text"
                  required
                />

                <v-text-field
                  color="deep-purple"
                  id="password"
                  label="Password"
                  :rules="passwordRules"
                  v-model="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                v-if="!isNewUser"
                color="deep-purple lighten-1"
                class="ma-2 white--text"
                v-on:click="login"
                :disabled="!password || !username"
              >Login</v-btn>
              <v-btn
                v-else
                color="deep-purple lighten-1"
                class="ma-2 white--text"
                v-on:click="register"
                :disabled="!password || !username"
              >Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-snackbar top v-model="snackbar" :timeout="timeout">
        {{ snackbarText }}
        <v-btn color="deep-purple lighten-2" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import cart from "../assets/cart.json";
import menu from "../assets/menu.json";
import prices from "../assets/prices.json";
import { Card, createToken } from "vue-stripe-elements-plus";

export default {
  name: "home",
  data() {
    return {
      menu: menu,
      prices: prices,
      validDorms: [
        "Simmons Hall",
        "Masseeh Hall",
        "Baker House",
        "East Campus",
        "MacGregor House",
        "McCormick Hall",
        "Burton Conner",
        "New House",
        "Next House",
        "Random Hall"
      ],
      showCheck: false,
      showLogin: false,
      isNewUser: false,
      addedToCart: cart,
      savedCartString: null,
      complete: false,
      valid: false,
      validLogin: false,
      username: null,
      password: null,
      loggedIn: null,
      loginResponse: null,
      customerName: null,
      customerPhone: null,
      nameRules: [
        v => !!v || "Name is required",
        v => v.length <= 20 || "Name must be at most 20 characters"
      ],
      phoneRules: [
        v => !!v || "Phone is required",
        v => /^\d+$/.test(v) || "Phone may only contain digits"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v => v.length <= 100 || "Password must be at most 100 characters"
      ],
      selectedDorm: null,
      snackbar: false,
      snackbarText: null,
      timeout: 3500,
      stripeOptions: {
        hidePostalCode: false,
        style: {
          base: {
            fontSize: "16px"
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
          total += prices[itemCode].price * this.addedToCart[itemCode].count;
        }
      }
      return total.toFixed(2);
    },
    getFee: function() {
      let total = this.getTotal;
      return (total * 0.075 + 1.5).toFixed(2);
    }
  },

  methods: {
    getImageURL: function(itemCode) {
      var images = require.context("../assets/pictures/", false, /\.jpg$/);
      return images("./" + itemCode + ".jpg");
    },
    addToCart: function(itemCode) {
      this.addedToCart[itemCode].count += 1;
    },
    removeFromCart: function(itemCode) {
      this.addedToCart[itemCode].count -= 1;
    },
    loadFavorite: function() {
      this.addedToCart = JSON.parse(this.savedCartString);
    },
    pay() {
      createToken().then(data => {
        console.log(data.token);
        //send token to server with order details
        axios
          .post("/api/dominos/charge/", {
            cart: this.addedToCart,
            customer: this.customerName,
            dorm: this.selectedDorm,
            token: data.token.id
          })
          .then(response => {
            this.showCheck = false;
            this.snackbar = true;
            this.snackbarText = response.data.message;
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
    },
    login() {
      axios
        .put("/api/users/" + this.username, {
          password: this.password
        })
        .then(response => {
          this.showLogin = false;
          this.snackbar = true;
          this.snackbarText = response.data.message;
          this.loggedIn = response.data.username;
          this.savedCartString = response.data.cart;
          console.log(response);
        })
        .catch(error => {
          console.log(error.response);
          this.showLogin = false;
          this.snackbar = true;
          this.snackbarText = error.response.data.error;
        });
    },
    register() {
      axios
        .post("/api/users/" + this.username, {
          password: this.password
        })
        .then(response => {
          this.showLogin = false;
          this.snackbar = true;
          this.snackbarText = response.data.message;
          this.loggedIn = response.data.username;
          console.log(response);
        })
        .catch(error => {
          console.log(error.response);
          this.showLogin = false;
          this.snackbar = true;
          this.snackbarText = error.response.data.error;
        });
    },
    saveCart() {
      //reset favorites
      this.savedCartString = JSON.stringify(this.addedToCart);
      axios
        .put("/api/users/" + this.username + "/favorite", {
          cart: this.addedToCart
        })
        .then(response => {
          this.showLogin = false;
          this.snackbar = true;
          this.snackbarText = response.data.message;
          console.log(response);
        })
        .catch(error => {
          console.log(error.response);
          this.showLogin = false;
          this.snackbar = true;
          this.snackbarText = error.response.data.error;
        });
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
