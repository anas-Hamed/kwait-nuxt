<template>
  <div class="text-center">
    <client-only>
      <GmapMap
        :center="computedValue || center "
        :options="{
         zoomControl: !readOnly,
         scaleControl: !readOnly,
         rotateControl: !readOnly,
        streetViewControl: false,
        mapTypeControl: false
      }"
        :zoom="15"
        ref="placeMap"
        style="width: 100%; height: 300px"
      >
        <gmap-marker :draggable="!readOnly"
                     :position="computedValue"
                     @dragend="updateCenter"
                     v-if="computedValue"

        >
        </gmap-marker>
      </GmapMap>

    </client-only>
    <template v-if="!readOnly">
      <button @click="getCurrentPosition" class="my-3 text-blue-500" v-if="!value">إضافة موقعي</button>
      <button @click="removePosition" class="my-3 text-blue-500" v-else>إزالة موقعي</button>
    </template>
  </div>

</template>

<script>
  export default {
    name: 'CreateMap',
    props: {
      value: {
        type: Object,
        required: false
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        center: {
          lat: 29.3, lng: 47.6
        }
      };
    },
    mounted() {

    },
    methods: {
      updateCenter({ latLng }) {
        this.setPosition(latLng.lat(), latLng.lng());
      },
      setPosition(lat, lng) {
        this.emitInput(Number(lat), Number(lng));
        this.$refs.placeMap.$mapPromise.then(map => {
          map.panTo(this.value);
        });
      },
      getCurrentPosition() {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          this.setPosition(coords.latitude, coords.longitude);
        }, (e) => {
          this.$toast.error('ERROR WHILE GET POSITION').goAway(2000);
        });
      },
      removePosition() {
        this.$emit('input', null);
      },
      emitInput(lat, lng) {
        this.$emit('input', { lat, lng });
      }
    },
    computed: {
      computedValue() {
        return this.value != null ? {lat:Number(this.value.lat),lng:Number(this.value.lng),} : null;
      }
    }
  };
</script>

<style scoped>

</style>
