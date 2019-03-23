<template>
  <div class="add-smoothie container">
    <h2 class="center-align indigo-text">Add new smoothie recipe</h2>

    <form @submit.prevent="AddSmoothie">
      <div class="field title">
        <label for="title">Smoothie Title</label>
        <input type="text" name="title" v-model="title">
      </div>

      <div class="field" v-for="(ingredient, index) in ingredients" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="ingredients[index]">
        <i class="material-icons delete" @click="deleteIngredient(ingredient)">delete</i>
      </div>

      <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient</label>
        <input type="text" name="add-ingredient" @keydown.tab.enter.prevent="addIngredient" v-model="another">
      </div>

      <div class="field center-align">
        <p v-if="feedback">{{ feedback }}</p>
        <button class="btn pink">Add smoothie</button>
      </div>
    </form>
  </div>
</template>

<script>
import slugify from 'slugify'

import db from "@/services/firebase"

export default {
  name: "AddSmoothie",
  data: () => ({
    title: null,
    another: null,
    ingredients: [],
    feedback: null,
  }),
  methods: {
    async AddSmoothie() {
      if(this.title) {
        this.feedback = null

        try {
            const smoothie = {
                title: this.title,
                slug: this.slugTitle,
                ingredients: this.ingredients,
            }

            await db.collection('smoothies').add(smoothie)

            this.$router.push({ name: 'Home' })
        } catch (error) {
          this.giveFeedback(`That's an internet error, ${error}`)
        }
      } else {
        this.giveFeedback('You must enter a smoothie title')
      }
    },

    addIngredient() {
      if(this.another) {
        this.ingredients.push(this.another)

        this.another = null
        this.feedback = null
      } else {
        this.feedback = "You must enter a value to add an ingredient"
      }
    },

    deleteIngredient(ingredient) {
      this.ingredients = this.ingredients.filter(item => item !== ingredient)
    },

    giveFeedback(message) {
      this.feedback = message
    }
  },
  computed: {
    slugTitle() {
      return slugify(this.title, {
        replacement: "-",
        remove: /[$*_+~.()'"!\-:@]/g,
        lower: true
      })
    }
  }
}
</script>

<style lang="scss">
  .add-smoothie {
    padding: 20px;
    max-width: 500px;
    margin-top: 60px;

    h2 {
      font-size: 2em;
      margin: 20px auto;
    }

    .field {
      margin: 20px auto;
      position: relative;
    }

    .delete {
      position: absolute;
      right: 0;
      bottom: 16px;

      color: #AAA;
      font-size: 1.4em;
      cursor: pointer;
    }

    button { margin-top: 20px; }
  }
</style>
