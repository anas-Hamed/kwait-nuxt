import Vue from "vue"
import InfiniteLoading from 'vue-infinite-loading'
import noResults from "~/components/infinity_scroll/noResults";
import noMore from "~/components/infinity_scroll/noMore";
Vue.use(InfiniteLoading, {
  slots: {
    noResults,
    noMore,
    error: {
      render: h => h('div'),
    },
  },
});
