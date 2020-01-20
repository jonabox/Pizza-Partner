<template>
  <div class="home">
    <v-container fluid>
      <v-row
        dense
        justify="center"
      >
        <v-col
          v-for="item in order"
          v-bind:key="item.id"
          cols="auto" 
        >
          <v-card
            hover
          >
            <v-img
              src="../assets/pizza.png"
              class="black--text align-end"
              gradient="to bottom, rgba(0,0,0,0), rgba(255,255,255,1)"
              height="200px"
              max-width="300"
              contain="true"
              aspect-ratio
            >
            </v-img>
            <v-card-title v-text="Object.keys(item)[0]"></v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
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
      order: "hey"
    };
  },
  
  created: function() {
  
  axios
    .get('/api/dominos')
    .then(response => {
      console.log(response);
      this.order = response.data.result;
    })
    .catch(error => console.log(error));
  }
};
</script>
