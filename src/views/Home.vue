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
                          <v-card-title v-text="item.name" style="word-break: normal"></v-card-title>
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
            <v-card-subtitle v-if="addedToCart.length == 0">Cart is empty</v-card-subtitle>
            <div v-else>
              <v-card-actions>
                <v-card-title>Total: ${{ getTotal }}</v-card-title>
                <v-spacer />
                <v-btn color="green" class="ma-2 white--text" to="/schedule">
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
                        <v-list-item-title v-text="item.name"></v-list-item-title>
                        <v-list-item-subtitle>Quantity: {{ item.count }}</v-list-item-subtitle>
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
  </div>
</template>

<script>
import axios from "axios";
import cart from "../assets/cart.json";

export default {
  name: "home",
  data() {
    return {
      menu: "",
      addedToCart: cart
    };
  },
  computed: {
    getTotal: function() {
      let total = 0;
      for (let itemCode in this.addedToCart) {
        if (this.addedToCart[itemCode].count > 0) {
          total += this.addedToCart[itemCode].price * this.addedToCart[itemCode].count;
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
    getItemPrice: function() {
      return "$5";
      // axios
      //   .get("/api/dominos/pricing/" + itemCode)
      //   .then(response => {
      //     console.log(response);
      //     return response;
      //   })
      //   .catch(error => console.log(error));
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
