<template>
  <div class="row app-wrapper">
    <sidebar :route="currentRoute" :class="sidebarClassName"></sidebar>
    <section class="app-content columns" :class="contentClassName">
      <router-view></router-view>
      <command-bar />
      <ShowPlans
        :is-subscription-valid="!isSubscriptionValid"
        :available-product-prices="availableProductPrices"
        :plan-id="planId"
        @hideModal="hideModal"
      />
    </section>
  </div>
</template>

<script>
import Sidebar from '../../components/layout/Sidebar';
import CommandBar from './commands/commandbar.vue';
import { BUS_EVENTS } from 'shared/constants/busEvents';
import Cookies from 'js-cookie';
import ShowPlans from './ShowPlans';
import { mapGetters } from 'vuex';

export default {
  components: {
    Sidebar,
    CommandBar,
    ShowPlans,
  },
  data() {
    return {
      isSidebarOpen: false,
      isOnDesktop: true,
      isSubscriptionValid: true,
      availableProductPrices: [],
      planId: 0,
    };
  },
  computed: {
    currentRoute() {
      return ' ';
    },
    ...mapGetters({
      globalConfig: 'globalConfig/get',
      getAccount: 'accounts/getAccount',
      uiFlags: 'accounts/getUIFlags',
    }),
    isUpdating() {
      return this.uiFlags.isUpdating;
    },
    sidebarClassName() {
      if (this.isOnDesktop) {
        return '';
      }
      if (this.isSidebarOpen) {
        return 'off-canvas position-left is-transition-push is-open';
      }
      return 'off-canvas is-transition-push is-closed';
    },
    contentClassName() {
      if (this.isOnDesktop) {
        return '';
      }
      if (this.isSidebarOpen) {
        return 'off-canvas-content is-open-left has-transition-push has-position-left';
      }
      return 'off-canvas-content has-transition-push';
    },
  },
  mounted() {
    this.$store.dispatch('setCurrentAccountId', this.$route.params.accountId);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    bus.$on(BUS_EVENTS.TOGGLE_SIDEMENU, this.toggleSidebar);
    this.initializeAccountBillingSubscription();
    bus.$on(BUS_EVENTS.SHOW_PLAN_MODAL, this.showModal);
  },
  beforeDestroy() {
    bus.$off(BUS_EVENTS.TOGGLE_SIDEMENU, this.toggleSidebar);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if (window.innerWidth > 1200) {
        this.isOnDesktop = true;
      } else {
        this.isOnDesktop = false;
      }
    },
    async initializeAccountBillingSubscription() {
      try {
        await this.$store.dispatch('accounts/getBillingSubscription');
        const { available_product_prices, plan_id } = this.getAccount(
          this.$route.params.accountId
        );
        this.availableProductPrices = available_product_prices;
        this.planId = plan_id;
      } catch (error) {
        console.log(error);
      }
    },
    hideModal() {
      Cookies.remove('subscription');
      this.isSubscriptionValid = true;
    },
    showModal() {
      this.isSubscriptionValid = false;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>
<style lang="scss" scoped>
.off-canvas-content.is-open-left {
  transform: translateX(25.4rem);
}
</style>
