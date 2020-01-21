<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col cols="10">
          <template>
            <v-expansion-panels focusable>
              <v-expansion-panel
                v-for="(items, category) in menu"
                v-bind:key="category.id"
              >
                <v-expansion-panel-header v-text="category"/>
                <v-expansion-panel-content>

                  <v-container fluid>
                    <v-row
                      
                      justify="start"
                      align="center"
                      
                    >
                      <v-col
                        v-for="item in items"
                        v-bind:key="item.id"
                        cols="auto"
                      >
                        <v-card
                          hover
                          max-width="300px"
                        >
                          <v-img
                            src="../assets/pizza.png"
                            lazy-src="../assets/pizza-min.png"
                            class="black--text align-end"
                            gradient="to bottom, rgba(0,0,0,0), rgba(255,255,255,1)"
                            aspect-ratio
                          >
                            <template v-slot:placeholder>
                              <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                              >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                              </v-row>
                            </template>
                          </v-img>
                          <v-card-title 
                          v-text="item.name"
                          style="word-break: normal"
                          >
                          </v-card-title>
                          <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                              color="deep-purple lighten-2"
                              class="ma-2 white--text"
                              v-on:click="addToCart(item)"
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
          <v-card>
            {{ addedToCart }}
            <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                              color="green"
                              class="ma-2 white--text"
                              to="/schedule"
                            >
                              checkout
                              <v-icon right dark>mdi-playlist-check</v-icon>
                            </v-btn>
                          </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      menu: "",
      addedToCart: {hi:"hello"}
    };
  },

  methods: {
    addToCart: function (item) {
      if(!this.addedToCart[item.name]){
        this.$set(this.addedToCart, item.name, 1);
        
      }
      else{
        let current = this.addedToCart[item.name];
        this.$set(this.addedToCart, item.name, current + 1);
        console.log(this.addedToCart);
      }
    }
  },

  created: function() {
  
  axios
    .get('/api/dominos/menu')
    .then(response => {
      console.log(response);
      this.menu = response.data;
    })
    .catch(error => console.log(error));
  }
};
</script>
