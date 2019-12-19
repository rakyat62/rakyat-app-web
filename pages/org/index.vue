<template>
  <div>
    <v-navigation-drawer class="deep-purple accent-4"
                         dark
                         permanent
                         app
                         clipped
                         width="40%"
    >
      lol
    </v-navigation-drawer>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field label="Cari"
                        single-line
                        dense
                        outlined
                        prepend-icon="mdi-magnify"
          />
        </v-col>
        <v-col>
          <v-text-field label="Status"
                        single-line
                        dense
                        outlined
                        prepend-icon="mdi-filter"
                        disabled
          />
        </v-col>
        <v-col>
          <v-text-field label="Urutkan"
                        single-line
                        dense
                        outlined
                        disabled=""
          />
        </v-col>
      </v-row>

      <v-card v-for="i in 6"
              :key="i"
              class="mb-3"
              outlined
      >
        <v-list two-line>
          <v-list-item>
            <v-list-item-action>
              <v-list-item-action-text :style="{width: '100%'}">
                <v-icon color="error">
                  mdi-close-circle
                </v-icon>
              </v-list-item-action-text>
              <div>
                <v-icon>
                  mdi-arrow-up-bold
                </v-icon>
                16
              </div>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                #123
                parkir bikin macet
              </v-list-item-title>
              <v-list-item-subtitle v-text="'2 hari yang lalu oleh agus'" class="text--primary" />
              <v-list-item-subtitle v-text="'shukakaa'" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>
