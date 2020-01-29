<template>
  <div class="schedule">
    <v-container fluid>
      <v-select
        @change="getDorm"
        :items="validDorms"
        v-model="selectedDorm"
        label="Select Dorm"
        color="deep-purple"
        item-color="deep-purple"
        solo
      ></v-select>
      <v-parallax height="150" v-bind:src="getImageURL(selectedDorm)">
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12">
            <h1 class="display-1 font-weight-bold mb-4">Showing partnerships for {{ selectedDorm }}</h1>
          </v-col>
        </v-row>
      </v-parallax>
      <v-row justify="center">
        <v-col v-for="partnership in partnerships" v-bind:key="partnership.id" cols="auto">
          <v-card min-height="65vh" min-width="20vw" hover shaped outlined>
            <v-list
              shaped
              dense
              v-for="order in partnership.orders"
              v-bind:key="order.id"
              class="overflow-y-auto"
              max-height="400"
            >
              <v-subheader>{{ order.customer }}'s items:</v-subheader>
              <v-list-item v-for="item in order.items" :key="item">
                <v-list-item-content style="word-break: normal">{{item.name}} ({{item.count}}x)</v-list-item-content>
              </v-list-item>
              <v-divider />
            </v-list>
            <v-footer absolute>
              <v-card-title style="word-break: normal" v-text="partnership.status" />
            </v-footer>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "schedule",
  data() {
    return {
      partnerships: "",
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
      selectedDorm: "Simmons Hall"
    };
  },

  methods: {
    getImageURL: function(dorm) {
      var images = require.context("../assets/pictures/dorms", false, /\.jpg$/);
      return images("./" + dorm + ".jpg");
  },
    getDorm: function() {
      axios
        .get("/api/schedule/all/" + this.selectedDorm)
        .then(response => {
          console.log(response);
          this.partnerships = response.data;
        })
        .catch(error => console.log(error));
    }
  },
  created: function() {
    this.getDorm();
  }
};
</script>
