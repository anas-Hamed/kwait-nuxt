<template>
  <div class=" border img-wrapper ">
    <img ref="image" width="100%"  :src="src">
  </div>
</template>

<script>
  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';
  export default {
    name: 'Cropper',
    props: {
      src: {
        type: String,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
      ratio: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        cropper: {},
        width: 1000
      };
    },
    watch: {
      src(newValue, oldValue) {
        this.cropper.replace(this.src);
      }
    },
    mounted() {
      this.cropData(this.$refs.image);
    },
    methods: {
      save() {
        const canvas = this.cropper.getCroppedCanvas({ width: this.width, height: this.width * (1 / this.ratio),fillColor: '#fff' });
        canvas.toBlob(o => {
          const cropped = {};
          cropped.index = this.index;
          cropped.image = o;
          cropped.thumb = canvas.toDataURL("image/jpeg");
          this.$emit('cropped', cropped);
        });
      },
      cropData(img) {
        const s = this;
        this.cropper = new Cropper(img, {
          viewMode: 0,
          background: true,
          autoCropArea: 90,
          center: true,
          autoCrop: true,
          movable: true,
          aspectRatio: this.ratio,
          ready(event) {
            s.save();
          },
          zoom() {
            s.save();
          },
          cropend(event) {
            s.save();
          }
        });
      }
    }
  };
</script>

<style scoped>
.img-wrapper{
  height: 240px;
  width: 240px;
}
</style>
