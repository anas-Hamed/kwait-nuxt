export default function(ctx) {
  const { $axios } = ctx;
  const { store, auth, i18n } = ctx.app;
  $axios.onRequest(config => {
    store.dispatch('validations/clearErrors');
    config.headers.locale =  i18n.locale ;
    if (process.env.DEBUG == 'true'){
      config.params = {...config.params,XDEBUG_SESSION_START : 'PHPSTORM'};
    }
    return config;

  });
  $axios.onError(error => {
    const { status,data } = error.response;
    if ( status === 401) {
      if (auth?.loggedIn) auth?.logout();
    }
    if (status === 422) {
      store.dispatch('validations/setErrors',data.errors);
    }
  });
}
