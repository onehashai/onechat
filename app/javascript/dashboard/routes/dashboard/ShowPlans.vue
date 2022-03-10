<template>
  <div
    v-if="isSubscriptionValid"
    transition="modal"
    class="account-selector--modal modal-mask "
  >
    <div class="plan-modal-container">
      <div class="plan-modal-header">
        <h4 class="text-center">
          {{ error }}
        </h4>
        <h6 class="text-center">
          Your current plan is
          <b>
            {{ planName }}
          </b>
        </h6>
      </div>
      <div class="plan-modal-cross" @click="hidePlanModal">X</div>
      <br />
      <div class="row justify-content-center flex-dir-row-reverse w-100">
        <div
          v-for="availableProductPrice in availableProductPrices"
          class="card plan-column"
        >
          <h4 class="">
            {{ availableProductPrice.name }}
          </h4>
          <div class="description">
            Auto Renewable subscription
          </div>
          <div class="solution--price">
            <div class="price mb-0 mt-2">
              $
            </div>
            <div class="h2 display-2 mb-0">
              {{ availableProductPrice.unit }}
            </div>
            <div class="price mb-0 mt-2">/month</div>
          </div>

          <div
            class="solution-description"
            v-html="availableProductPrice.description"
          />
          <woot-button
            v-if="planId !== availableProductPrice.id"
            title="Select this Plan"
            @click="() => submitSubscription(availableProductPrice.id)"
          >
            Select this plan
            <woot-spinner v-if="isPlanClicked"></woot-spinner>
          </woot-button>
          <woot-button
            v-if="planId == availableProductPrice.id"
            title="Current Plan"
            style="opacity: 0.5; cursor: not-allowed"
          >
            Current Plan
          </woot-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import alertMixin from 'shared/mixins/alertMixin';
import AccountAPI from '../../api/account';
import WootButton from '../../components/ui/WootButton';
import Cookies from 'js-cookie';
export default {
  components: { WootButton },
  mixins: [alertMixin],
  props: {
    isSubscriptionValid: {
      type: Boolean,
      default: false,
    },
    planId: {
      type: [String, Number],
      default: 0,
    },
    planName: {
      type: [String, Number],
      default: 'Free',
    },
    availableProductPrices: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      error: '',
      products: '',
      isPlanClicked: false,
    };
  },

  mounted() {
    this.error = Cookies.get('subscription');
    // this.removeTrail();
  },
  methods: {
    hidePlanModal() {
      this.$emit('hideModal');
    },
    submitSubscription(value) {
      const payload = { product_price: value };
      this.isPlanClicked = true;
      AccountAPI.startBillingSubscription(payload)
        .then(response => {
          window.location.href = response.data.url;
          this.isPlanClicked = false;
        })
        .catch(error => {
          this.isPlanClicked = false;
          console.log(error, 'error');
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.alert-wrap {
  font-size: var(--font-size-small);
  margin: var(--space-medium) var(--space-large) var(--space-zero);
  .callout {
    align-items: center;
    border-radius: var(--border-radius-normal);
    display: flex;
  }
}
.account-selector--modal .modal-container {
  width: 880px !important;
}
.icon-wrap {
  margin-left: var(--space-smaller);
  margin-right: var(--space-slab);
}
.solution--price {
  display: flex;
  align-items: center;
  justify-content: center;
}
.plan-modal-container {
  max-width: 75vw;
  margin: auto;
  background-color: var(--white);
  min-width: 600px;
  position: relative;
  max-height: 100%;
  overflow-y: auto;
}
.solution-description {
  color: #869ab8 !important;
  font-size: 17px;
}
.plan-column {
  max-width: 280px;
  width: 23%;
  margin-right: 20px;
  box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.1) !important;
  &:first-child {
    margin-right: 0;
  }
}
.plan-modal-container {
  padding: 24px;
}
.badge-pill {
  background-color: rgba(31, 147, 255, 0.1);
  color: #1f93ff;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  width: fit-content;
  margin: auto;
  border-radius: 10px;
  padding: 6px 15px;
}
.plan-modal-cross {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 18px;
  font-weight: 700;
}
.justify-content-center {
  justify-content: center;
}
.description {
  height: 30px;
}
</style>
