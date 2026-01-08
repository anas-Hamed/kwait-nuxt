export default function(ctx) {
  if (ctx.$auth.loggedIn){
    ctx.$axios.get('notifications/numberUnread').then(({ data }) => {
      ctx.store.dispatch('setNotificationsCount', data.data);
    });
  }
}
