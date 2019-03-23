<template>
    <div class="index container">
      <div
        class="card"
        v-for="smoothie in smoothies"
        :key="smoothie.id"
      >
        <div class="card-content">
          <i class="material-icons delete" @click="deleteSmoothie(smoothie.id)">delete</i>

          <h2 class="indigo-text">{{ smoothie.title }}</h2>

          <ul class="ingredients">
            <li v-for="(ingredient, index) in smoothie.ingredients" :key="index">
              <span class="chip">{{ ingredient }}</span>
            </li>
          </ul>
        </div>

        <span class="btn-floating btn-large halfway-fab pink">
          <router-link
            :to="{ name: 'EditSmoothie', params: { smoothie_slug: smoothie.slug } }"
          >
            <i class="material-icons">edit</i>
          </router-link>
        </span>
      </div>
  </div>
</template>

<script>
import db from '@/services/firebase'

export default {
  name: 'Home',
  data() {
    return {
      smoothies: []
    }
  },
  async created() {
    const data = await db.collection('smoothies').onSnapshot(refs => {
      this.smoothies = refs.docs.map(item => {
        const id = item.id
        const data = item.data()

        return { id, ...data }
      })
    })
  },
  methods: {
    deleteSmoothie(id) {
      db.collection('smoothies').doc(id).delete()
    }
  },
}
</script>

<style lang="scss">
  .index {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 60px;

    .delete {
      position: absolute;
      top: 4px;
      right: 4px;

      color: #AAA;
      cursor: pointer;
      font-size: 1.4em;
    }

    h2 {
      margin-top: 0;

      font-size: 1.8em;
      text-align: center;
    }

    .ingredients {
      margin: 30px auto;

      li {
        display: inline-block;
      }
    }
  }
</style>
