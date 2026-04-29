<template>
  <div class="text-center">
    <client-only>
      <GoogleMap
        :api-key="runtimeConfig.public.mapKey"
        :center="computedValue || center"
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
        @ready="onMapReady"
      >
        <GMapMarker :draggable="!readOnly"
                     :position="computedValue"
                     @dragend="updateCenter"
                     v-if="computedValue"

        >
        </GMapMarker>
      </GoogleMap>

    </client-only>
    <template v-if="!readOnly">
      <button @click="getCurrentPosition" class="my-3 text-blue-500" v-if="!modelValue">Add my location</button>
      <button @click="removePosition" class="my-3 text-blue-500" v-else>Remove my location</button>
    </template>
  </div>

</template>

<script>
  export default {
    name: 'CreateMap',
    setup() {
      const runtimeConfig = useRuntimeConfig()
      return { runtimeConfig }
    },
    props: {
      modelValue: {
        type: Object,
        required: false
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    data() {
      return {
        center: {
          lat: 29.3, lng: 47.6
        },
        mapInstance: null
      };
    },
    mounted() {

    },
    methods: {
      onMapReady(map) {
        this.mapInstance = map;
      },
      updateCenter({ latLng }) {
        this.setPosition(latLng.lat(), latLng.lng());
      },
      setPosition(lat, lng) {
        this.emitInput(Number(lat), Number(lng));
        if (this.mapInstance) {
          this.mapInstance.panTo({ lat: Number(lat), lng: Number(lng) });
        }
      },
      getCurrentPosition() {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          this.setPosition(coords.latitude, coords.longitude);
        }, (e) => {
          this.$toast.error('ERROR WHILE GET POSITION');
        });
      },
      removePosition() {
        this.$emit('update:modelValue', null);
      },
      emitInput(lat, lng) {
        this.$emit('update:modelValue', { lat, lng });
      }
    },
    computed: {
      computedValue() {
        return this.modelValue != null ? {lat:Number(this.modelValue.lat),lng:Number(this.modelValue.lng),} : null;
      }
    }
  };
</script>

<style scoped>

</style>
