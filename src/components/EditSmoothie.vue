<template>
  <div v-if="smoothie" class="edit-smoothie container">
    <h2>Edit {{ smoothie.title }} smoothie</h2>

    <form @submit.prevent="EditSmoothie">
      <div class="field title">
        <label for="title">Smoothie Title</label>
        <input type="text" name="title" v-model="smoothie.title">
      </div>

      <div class="field" v-for="(ingredient, index) in smoothie.ingredients" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="smoothie.ingredients[index]">
        <i class="material-icons delete" @click="deleteIngredient(ingredient)">delete</i>
      </div>

      <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient</label>
        <input type="text" name="add-ingredient" @keydown.tab.enter.prevent="addIngredient" v-model="another">
      </div>

      <div class="field center-align">
        <p v-if="feedback">{{ feedback }}</p>
        <button class="btn pink">Update smoothie</button>
      </div>
    </form>
  </div>
</template>

<script>
import slugify from 'slugify'

import db from '@/services/firebase'

export default {
    name: 'EditSmoothie',
    data: () => ({
        smoothie: null,
        another: null,
        feedback: null,
    }),
    async created() {
        const slug = this.$route.params.smoothie_slug

        await db.collection('smoothies').where('slug', '==' , slug).onSnapshot(ref => {
            this.smoothie = {id: ref.docs[0].id, ...ref.docs[0].data()}
        })
    },
    methods: {
        async EditSmoothie() {
            if(this.smoothie.title) {
                this.feedback = null

                try {
                    const id = this.smoothie.id

                    const smoothie = {
                        title: this.smoothie.title,
                        slug: this.slugTitle,
                        ingredients: this.smoothie.ingredients,
                    }

                    await db.collection('smoothies').doc(id).update(smoothie)

                    this.$router.push({ name: "Home" })
                } catch (error) {
                    this.giveFeedback(`That's an internet error, ${error}`)
                }
            } else {
                this.giveFeedback('You must enter a smoothie title')
            }
        },
        addIngredient() {
            if(this.another) {
                this.smoothie.ingredients.push(this.another)

                this.another = null
                this.feedback = null
            } else {
                this.feedback = "You must enter a value to add an ingredient"
            }
        },

        deleteIngredient(ingredient) {
            this.smoothie.ingredients = this.smoothie.ingredients.filter(item => item !== ingredient)
        },

        giveFeedback(message) {
            this.feedback = message
        }
    },
    computed: {
        slugTitle() {
            return slugify(this.smoothie.title, {
                replacement: "-",
                remove: /[$*_+~.()'"!\-:@]/g,
                lower: true
            })
        }
    }
}
</script>

<style lang="scss">
  .edit-smoothie {
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
