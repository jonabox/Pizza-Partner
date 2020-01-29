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
      <p align="center">Showing partnerships for {{ selectedDorm }}</p>
      <v-row justify="center">
        <v-col
          v-for="partnership in partnerships"
          v-bind:key="partnership.id"
          cols="auto"
        >
          <v-card min-height="500" min-width="500" hover shaped outlined>
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
                <v-list-item-content>
                   {{item.name}} ({{item.count}}x)
                </v-list-item-content>
              </v-list-item>
              <v-divider />
            </v-list>
            <v-footer absolute>
            <v-card-title v-text="partnership.status" />
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
      partnerships: "hey",
      validDorms: ["Simmons", "Masseeh"],
      selectedDorm: "Simmons"
    };
  },

  methods: {
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
