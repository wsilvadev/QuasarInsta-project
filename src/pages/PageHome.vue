<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
    <div class="col-12 col-sm-8">
    <template v-if="!loadingPosts && posts.length">
    <q-card  class="card-post q-mb-md " flat bordered v-for="post in posts" :key="post.id">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://avatars0.githubusercontent.com/u/32207342?s=460&u=6c40157f8a4bd6040bd28a447cbeee0265f090b0&v=4">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">Willian</q-item-label>
          <q-item-label caption>
            Bertioga -SP
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-img
        :src="post.imageUrl"
      />
     <q-card-section>
        <div class="text-bold text-grey-8">{{post.caption}}</div>
        <div class="text-grey-6 ">{{post.date | niceDate}}</div>
      </q-card-section>
    </q-card>
    </template>
    <template v-else-if="!loadingPosts && !posts.length">
      <h3 class="text-center text-grey-13">No posts</h3>
    </template>
    <template v-else>
    <q-card flat bordered >
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" animation="fade" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" animation="fade" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" animation="fade" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-skeleton height="200px" square animation="fade" />

      <q-card-section>
        <q-skeleton type="text" class="text-subtitle2" animation="fade" />
        <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
      </q-card-section>
    </q-card>
    </template>
    </div>

    <div  class="col-4 large-screen-only">
      <q-item class="fixed">
        <q-item-section avatar>
          <q-avatar size="48px">
            <img src="https://avatars0.githubusercontent.com/u/32207342?s=460&u=6c40157f8a4bd6040bd28a447cbeee0265f090b0&v=4">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-bold">Willian</q-item-label>
          <q-item-label caption>
           Bertioga
          </q-item-label>
        </q-item-section>
      </q-item>    </div>
    </div>
  </q-page>
</template>

<script>
import {date} from 'quasar'
export default {
  name: 'PageHome',
  data(){
    return{
      posts:[],
      loadingPosts: true,
    }
  },

  methods:{
    getPosts(){
      this.loadingPosts = true;
        this.$axios.get(`${process.env.API}/posts`).then(res =>{
          this.posts = res.data
          this.loadingPosts = false;
      }).catch(err => {
        throw(err)
      })
       
      this.loadingPosts =true;
    }
  },
  filters:{
    niceDate(value){
      return date.formatDate(value, 'MMM D h:mmA')
    }
  },
  created(){
    this.getPosts()
  }
}
</script>
<style lang="sass">
.card-post
  .q-img
    min-height: 200px
</style>
