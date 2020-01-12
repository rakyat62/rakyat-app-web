<template>
  <v-container>
    <v-row>
      <v-col class="display-1">
        Hedeeeeh <span class="grey--text">{{ `#${incidentId}` }}</span>
      </v-col>
      <v-col cols="auto">
        <v-btn :style="{textTransform:'capitalize'}"
               color="primary"
        >
          Update Riwayat
        </v-btn>
      </v-col>
    </v-row>
    <v-chip :text-color="`${$vuetify.theme.dark ? 'white' : 'black'}`"
            color="orange"
            outlined
            label
            class="white"
            small
    >
      Sedang diproses
      <v-icon right
              color="orange"
              small
      >
        mdi-account
      </v-icon>
    </v-chip>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero doloribus, molestias sequi totam veniam amet autem quisquam harum tenetur ipsa! Distinctio ipsum nulla vel minus maxime voluptas soluta atque quam?</p>
    <v-row>
      <v-col v-for="i in 6"
             :key="`img_incident_${i}`"
             cols="4"
             md="2"
             lg="2"
             class="pa-1"
      >
        <v-img :class="`grey ${ $vuetify.theme.dark ? 'darken' : 'lighten'}-3`"
               class="align-end"
               contain
               height="100px"
               src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        />
      </v-col>
    </v-row>

    <v-timeline align-top dense>
      <template v-for="(timeline, index) in timelines">
        <v-timeline-item v-if="timeline.type === 'COMMENT'"
                         :key="`tl_${index}`"
                         large
        >
          <template v-slot:icon>
            <v-avatar>
              <img :src="avaUrlUser">
            </v-avatar>
          </template>
          <template v-slot:opposite>
            <span>Tus eu perfecto</span>
          </template>
          <v-card class="elevation-2">
            <v-card-title class="py-2">
              <span class="title">Ahmad sukri</span>
              <span class="body-2 ml-4">berkomentar 3 jam g lalu</span>
            </v-card-title>
            <v-card-text>Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.</v-card-text>
          </v-card>
        </v-timeline-item>

        <v-card v-if="timeline.type === 'HISTORY'"
                :key="`tl_${index}`"
                class="elevation-2 mb-6"
        >
          <v-card-title class="py-2">
            <span class="title">Update dari Dinas Terkait</span>
            <span class="body-2 ml-4">3 jam g lalu</span>
          </v-card-title>
          <v-card-text>
            <p class="mt-2">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos a ipsam ullam officia omnis corrupti numquam minus repellat, fuga consequatur ea at beatae! Quisquam perferendis et fugit porro magni mollitia.
            </p>
            <v-row>
              <v-col v-for="i in 6"
                     :key="`img_incident_${i}`"
                     cols="4"
                     md="2"
                     lg="2"
                     class="pa-1"
              >
                <v-img class="grey lighten-4 align-end"
                       contain
                       height="120px"
                       src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </v-timeline>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      avaUrlUser: 'https://avatars0.githubusercontent.com/u/21119252?s=460&v=4',
      avaUrlOrg: 'https://avatars0.githubusercontent.com/u/54971300?s=200&v=4',
      timelines: [
        { type: 'COMMENT' },
        { type: 'HISTORY' },
        { type: 'COMMENT' },
        { type: 'COMMENT' },
        { type: 'HISTORY' },
        { type: 'COMMENT' },
        { type: 'HISTORY' },
        { type: 'HISTORY' },
        { type: 'COMMENT' }
      ]
    }
  },
  computed: {
    incidentId () {
      return this.$route.params.id
    }
  }
}
</script>
