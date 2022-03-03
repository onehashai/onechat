<template>
  <div id="app" class="app-wrapper app-root">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <add-account-modal
      :show="showAddAccountModal"
      :has-accounts="hasAccounts"
    />
    <woot-snackbar-box />
    <network-notification />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AddAccountModal from '../dashboard/components/layout/sidebarComponents/AddAccountModal';
import WootSnackbarBox from './components/SnackbarContainer';
import NetworkNotification from './components/NetworkNotification';
import { accountIdFromPathname } from './helper/URLHelper';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log(process.env, 'env');
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
export default {
  name: 'App',

  components: {
    WootSnackbarBox,
    AddAccountModal,
    NetworkNotification,
  },

  data() {
    return {
      showAddAccountModal: false,
    };
  },

  computed: {
    ...mapGetters({
      getAccount: 'accounts/getAccount',
      currentUser: 'getCurrentUser',
    }),
    hasAccounts() {
      return (
        this.currentUser &&
        this.currentUser.accounts &&
        this.currentUser.accounts.length !== 0
      );
    },
  },

  watch: {
    currentUser() {
      if (!this.hasAccounts) {
        this.showAddAccountModal = true;
      }
    },
  },
  mounted() {
    this.$store.dispatch('setUser');
    this.setLocale(window.chatwootConfig.selectedLocale);
    this.initializeAccount();
  },

  methods: {
    setLocale(locale) {
      this.$root.$i18n.locale = locale;
    },

    async initializeAccount() {
      const { pathname } = window.location;
      const accountId = accountIdFromPathname(pathname);

      if (accountId) {
        await this.$store.dispatch('accounts/get');
        const { locale } = this.getAccount(accountId);
        this.setLocale(locale);
      }
    },
  },
};
</script>

<style lang="scss">
@import './assets/scss/app';
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
