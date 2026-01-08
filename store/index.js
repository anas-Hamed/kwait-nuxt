export const state = () => {
  return {
    setting: {},
    unread_notifications: 0
  };
};
export const getters = ({
  setting(state) {
    return state.setting;
  },
  unread_notifications(state) {
    return state.unread_notifications;
  }
});
export const mutations = ({
  INCREASE_NOTIFICATIONS_COUNT(state) {
    if (state.unread_notifications !== '+9') {
      state.unread_notifications++;
    }
  },
  DECREASE_NOTIFICATIONS_COUNT(state) {
    if (state.unread_notifications !== 0) {
      state.unread_notifications--;
    }
  },
  RESET_NOTIFICATIONS_COUNT(state) {
    state.unread_notifications = 0;
  },
  SET_NOTIFICATIONS_COUNT(state,count) {
    state.unread_notifications = count <= 9 ? count : '+9';
  },
  SET_SETTING(state,setting) {
    state.setting = setting;
  },
});
export const actions = ({
  async nuxtServerInit({ commit, state }) {
    try {
      state.setting = (await this.$axios.get('setting')).data.data;
      const count = ((await this.$axios.get('notifications/numberUnread')).data.data);
      state.unread_notifications = count <= 9 ? count : '+9';
    } catch (e) {

    }
  },
  decreaseNotificationsCount({ commit }) {
    commit('DECREASE_NOTIFICATIONS_COUNT');
  },
  resetNotificationsCount({ commit }) {
    commit('RESET_NOTIFICATIONS_COUNT');
  },
  setNotificationsCount({ commit },count) {
    commit('SET_NOTIFICATIONS_COUNT',count);
  },
  setSetting({ commit },setting) {
    commit('SET_SETTING',setting);
  }
});
