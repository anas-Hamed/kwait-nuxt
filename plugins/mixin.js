import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

Vue.use({
  install() {
    Vue.mixin({
      computed: {
        ...mapGetters({
          errors: 'validations/errors',
          unread_notifications: 'unread_notifications',
          setting: 'setting'
        }),
        hasError: (error) => {
          return this.errors && this.errors[error];
        },
        media() {
          return {
            'isPhone': this.$screen.sm,
            'isTablet': this.$screen.md,
            'isDesktop': this.$screen.lg,
            'canTouch': this.$screen.touch,
            'breakpoint': this.$screen.breakpoint,
          };
        }
      },
      methods: {
        ...mapActions({
          setErrors: 'validations/setErrors',
          clearErrors: 'validations/clearErrors'
        }),
        metaBuilder(title = null,description = null,image = null){
          const url =  this.$route.fullPath;
          const _title = title ? 'Kuwait Explorer' + ' | ' + title : 'Kuwait Explorer';
          const _description = description ?? this.$t('kuwait_explorer_description');
          const _image = image ?? '/logo.png';
          return {
            title:_title,
            meta: [
              {charset: 'utf-8' },
              {hid: 'og:title',property: 'og:title',content: _title },
              {hid: 'og:description',property: 'og:description',content: _description },
              {hid: 'description',property: 'description',content: _description },
              {name: 'description',content: _description },
              {property: 'og:image',content:_image},
              {itemprop:'image',content:_image},
              {property:'og:url',content:url},
              {property:'og:type',content:'website'},
              {name:'twitter:card',content:'summary_large_image'},
              {name:'twitter:title',content:_title},
              {name:'twitter:description',content:_description},
              {name:'twitter:image',content:_image},
            ]
          }
        },
        checkAuth() {
          if (!this.$auth.loggedIn) {
            this.$toast.error('يجب تسجيل الدخول').goAway(1000);
            return false;
          }
          return true;

        }
      }
    });
  }
});
