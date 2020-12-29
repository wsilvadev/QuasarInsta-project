<template>
  <q-page class="constrain-more q-pa-md">
<div class="camera-frame q-pa-md">
<video v-show="!imageCaptured" ref="video" class="full-width" autoplay/>
<canvas
v-show="imageCaptured"
  ref="canvas"
  class="full-width"
  height="240"
/>

</div>
<div class="text-center q-pa-md">
  <q-btn v-if="hasCameraSuport" :disable="imageCaptured" @click="captureImage" color="grey-10" icon="eva-camera" size="lg" round/>
  <q-file v-else v-model="imageFile" label="Choose an image" accept="image/*" @input="captureImageFallback" outlined> 
    <template v-slot:prepend>
      <q-icon name="attach_file"/>
    </template>
  </q-file>
</div>
<div class="row justify-center q-ma-md">
<q-input v-model="post.caption" class="col col-sm-6" label="Caption *" dense/>

</div>
<div class="row justify-center q-ma-md">
<q-input v-model="post.location" class="col col-sm-6" label="Location" :loading='locationLoading' dense>
  <template v-slot:append><q-btn v-if="!locationLoading && locationSuported" round dense flat icon="eva-navigation-2-outline" @click="getLocation" /></template>
</q-input>
</div>
<div class="row justify-center q-ma-md">
  <q-btn color="primary" :disable="!post.caption || !post.location" label="Post Image" @click="addPost" unelevated/>
</div>
  </q-page>
</template>

<script>
import {uid} from 'quasar'
require('md-gum-polyfill')
export default {
  name: 'PageCamera',
  data(){
    return{
      post:{
        id: uid(),
        caption: '',
        location: '',
        photo: null,
        date: Date.now()
      },
      imageFile: [],
      imageCaptured: false,
      hasCameraSuport: true,
      locationLoading: false,
    }
  },
  computed:{
    locationSuported(){
      if('geolocation' in navigator)return true
      return false
    }
  },
  methods:{
initCamera(){
      navigator.mediaDevices.getUserMedia({video: true,
    }).then(stream =>{
        this.$refs.video.srcObject = stream
      }).catch(error => {
        this.hasCameraSuport = false})},
captureImage(){
  let video = this.$refs.video;
  let canvas = this.$refs.canvas;
  canvas.width = video.getBoundingClientRect().width;
  canvas.height = video.getBoundingClientRect().height;
 let context = canvas.getContext('2d');
 context.drawImage(video,0,0,canvas.width,canvas.height);
 this.imageCaptured = true
 this.post.photo =  this.dataURLtoBlob(canvas.toDataURL());
 this.desableCamera();
},
 dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
},
captureImageFallback(file){
  let canvas = this.$refs.canvas;
  let context = canvas.getContext('2d');

    var reader = new FileReader();
    reader.onload = event =>{
        var img = new Image();
        img.onload = () =>{
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            this.imageCaptured = true;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);     
},
desableCamera(){
  this.$refs.video.srcObject.getVideoTracks().forEach(track =>{ track.stop()}
  )
},
getLocation(){
  this.locationLoading = true
  navigator.geolocation.getCurrentPosition(position => {
   this.getCityAndCountry(position);
  },err => {
    this.locationError()
  }, {timeout:7000})
},
getCityAndCountry(position){
  let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`;
  this.$axios.get(apiUrl).then(result =>{
    this.locationSuccess(result)
  }).catch(err =>{
    this.locationError()
  })
},
locationSuccess(result){
  this.post.location = result.data.city
  if(result.data.country){
    this.post.location += `, ${result.data.country}`
  }
  this.locationLoading = false
},
locationError(){
this.$q.dialog({
  title: 'Error',
  message: 'could not find you location'
})
  this.locationLoading = false

},
addPost(){
  let formData = new FormData()
  formData.append('id', this.post.id);
  formData.append('caption', this.post.caption);
  formData.append('location', this.post.location);
  formData.append('date', this.post.date);
  formData.append('file', this.post.photo, this.post.id +'.png');

  this.$q.loading.show();
  this.$axios.post(`${process.env.API}/createPost`,formData).then(res =>{
    this.$q.notify({
      message: 'Post created!',
      type: 'success',
      color: 'green'
    })
    this.$q.loading.hide();
      this.$router.push('/');
  }).catch(err =>{
    this.$q.notify({
      message: 'Sorry, could not create post!',
      type: 'error',
      color: 'red'
    })
    this.$q.loading.hide();
  })
}
  },
  mounted(){
    this.initCamera()
  },
  beforeDestroy(){
    if(!this.hasCameraSuport){
      this.desableCamera()
    }
  },


}
</script>

<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>