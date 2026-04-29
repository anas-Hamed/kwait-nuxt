import { GoogleMap, Marker } from 'vue3-google-map';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('GoogleMap', GoogleMap);
  nuxtApp.vueApp.component('GMapMarker', Marker);
});
