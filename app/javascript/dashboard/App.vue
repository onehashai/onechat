<template>
  <div v-if="!authUIFlags.isFetching" id="app" class="app-wrapper app-root">
    <update-banner :latest-chatwoot-version="latestChatwootVersion" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <add-account-modal
      :show="showAddAccountModal"
      :has-accounts="hasAccounts"
    />
    <woot-snackbar-box />
    <network-notification />
  </div>
  <loading-state v-else />
</template>

<script>
import { mapGetters } from 'vuex';
import AddAccountModal from '../dashboard/components/layout/sidebarComponents/AddAccountModal';
import LoadingState from './components/widgets/LoadingState.vue';
import NetworkNotification from './components/NetworkNotification';
import { accountIdFromPathname } from './helper/URLHelper';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:
    process.env.FIREBASE_API_KEY || 'AIzaSyBSvmAj5FZtMtEysYDCVxuftles6Qs7qms',
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN || 'onechat-3b3b4.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'onechat-3b3b4',
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET || 'onechat-3b3b4.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID || '661340067942',
  appId:
    process.env.FIREBASE_APP_ID || '1:661340067942:web:2f9308849614b9cc95f5a7',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-6HMEZCLM44',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import UpdateBanner from './components/app/UpdateBanner.vue';
import vueActionCable from './helper/actionCable';
import WootSnackbarBox from './components/SnackbarContainer';
import {
  registerSubscription,
  verifyServiceWorkerExistence,
} from './helper/pushHelper';

export default {
  name: 'App',

  components: {
    AddAccountModal,
    LoadingState,
    NetworkNotification,
    UpdateBanner,
    WootSnackbarBox,
  },

  data() {
    return {
      showAddAccountModal: false,
      latestChatwootVersion: null,
    };
  },

  computed: {
    ...mapGetters({
      getAccount: 'accounts/getAccount',
      currentUser: 'getCurrentUser',
      globalConfig: 'globalConfig/get',
      authUIFlags: 'getAuthUIFlags',
      currentAccountId: 'getCurrentAccountId',
    }),
    hasAccounts() {
      const { accounts = [] } = this.currentUser || {};
      return accounts.length > 0;
    },
  },

  watch: {
    currentUser() {
      if (!this.hasAccounts) {
        this.showAddAccountModal = true;
      }
      verifyServiceWorkerExistence(registration =>
        registration.pushManager.getSubscription().then(subscription => {
          if (subscription) {
            registerSubscription();
          }
        })
      );
    },
    currentAccountId() {
      if (this.currentAccountId) {
        this.initializeAccount();
      }
    },
  },
  mounted() {
    this.setLocale(window.chatwootConfig.selectedLocale);
  },
  methods: {
    setLocale(locale) {
      this.$root.$i18n.locale = locale;
    },
    async initializeAccount() {
      await this.$store.dispatch('accounts/get');
      const {
        locale,
        latest_chatwoot_version: latestChatwootVersion,
      } = this.getAccount(this.currentAccountId);
      const { pubsub_token: pubsubToken } = this.currentUser || {};
      this.setLocale(locale);
      this.latestChatwootVersion = latestChatwootVersion;
      vueActionCable.init(pubsubToken);
    },
  },
};
</script>

<style lang="scss">
@import './assets/scss/app';
.update-banner {
  height: var(--space-larger);
  align-items: center;
  font-size: var(--font-size-small) !important;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
