<template>
  <div class="medium-10 column signup">
    <div class="text-center medium-12 signup--hero">
      <img
        :src="globalConfig.logo"
        :alt="globalConfig.installationName"
        class="hero--logo"
      />
      <h2 class="hero--title">
        {{ $t('REGISTER.TRY_WOOT') }}
      </h2>
    </div>
    <div class="row align-center">
      <div class="small-12 medium-9 large-9 column">
        <form class="signup--box login-box" @submit.prevent="checkEmailStatus">
          <div class="row flex-no-wrap justify-space-between">
            <div class="small-12 medium-6 large-6 column margin-right-small">
              <woot-input
                v-model="credentials.firstName"
                :class="{ error: $v.credentials.firstName.$error }"
                :label="$t('REGISTER.FIRST_NAME.LABEL')"
                :placeholder="$t('REGISTER.FIRST_NAME.PLACEHOLDER')"
                :error="
                  $v.credentials.firstName.$error
                    ? $t('REGISTER.FIRST_NAME.ERROR')
                    : ''
                "
                @blur="$v.credentials.firstName.$touch"
              />
            </div>
            <div class="small-12 medium-6 large-6 column">
              <woot-input
                v-model="credentials.lastName"
                :class="{ error: $v.credentials.lastName.$error }"
                :label="$t('REGISTER.LAST_NAME.LABEL')"
                :placeholder="$t('REGISTER.LAST_NAME.PLACEHOLDER')"
                :error="
                  $v.credentials.lastName.$error
                    ? $t('REGISTER.LAST_NAME.ERROR')
                    : ''
                "
                @blur="$v.credentials.lastName.$touch"
              />
            </div>
          </div>
          <div class="row flex-no-wrap justify-space-between">
            <div class="small-12 medium-12 large-12 column">
              <woot-input
                v-model.trim="credentials.email"
                type="email"
                :class="{ error: $v.credentials.email.$error }"
                :label="$t('REGISTER.EMAIL.LABEL')"
                :placeholder="$t('REGISTER.EMAIL.PLACEHOLDER')"
                :error="
                  $v.credentials.email.$error ? $t('REGISTER.EMAIL.ERROR') : ''
                "
                @blur="$v.credentials.email.$touch"
              />
            </div>
          </div>
          <div class="row flex-no-wrap">
            <div class="small-12 large-6 medium-6 column margin-right-small">
              <woot-input
                v-model="credentials.accountName"
                :class="{ error: $v.credentials.accountName.$error }"
                :label="$t('REGISTER.ACCOUNT_NAME.LABEL')"
                :placeholder="$t('REGISTER.ACCOUNT_NAME.PLACEHOLDER')"
                :error="
                  $v.credentials.accountName.$error
                    ? $t('REGISTER.ACCOUNT_NAME.ERROR')
                    : ''
                "
                @blur="$v.credentials.accountName.$touch"
              />
            </div>
            <div class="small-12 large-6 medium-6 column">
              <label :class="$v.credentials.phone.$error ? 'error' : ''">
                <span>{{ $t('REGISTER.PHONE.LABEL') }}</span>
                <VuePhoneNumberInput
                  v-model="credentials.phone"
                  :default-country-code="country"
                  no-example="true"
                  valid-color="#6cb8ff"
                  error-color="#F94B4A"
                  size="lg"
                  color="#6e6f73"
                  @update="formattedObject = $event"
                />
                <span
                  v-if="$v.credentials.phone.$error"
                  class="message phone-message"
                >
                  {{ $t('REGISTER.PHONE.ERROR') }}
                </span>
              </label>
            </div>
          </div>
          <div class="row flex-no-wrap">
            <div class="small-12 medium-6 large-6 column margin-right-small">
              <woot-input
                v-model.trim="credentials.password"
                type="password"
                :class="{ error: $v.credentials.password.$error }"
                :label="$t('LOGIN.PASSWORD.LABEL')"
                :placeholder="$t('SET_NEW_PASSWORD.PASSWORD.PLACEHOLDER')"
                :error="
                  $v.credentials.password.$error
                    ? $t('SET_NEW_PASSWORD.PASSWORD.ERROR')
                    : ''
                "
                @blur="$v.credentials.password.$touch"
              />
            </div>
            <div class="small-12 medium-6 large-6 column">
              <woot-input
                v-model.trim="credentials.confirmPassword"
                type="password"
                :class="{ error: $v.credentials.confirmPassword.$error }"
                :label="$t('SET_NEW_PASSWORD.CONFIRM_PASSWORD.LABEL')"
                :placeholder="
                  $t('SET_NEW_PASSWORD.CONFIRM_PASSWORD.PLACEHOLDER')
                "
                :error="
                  $v.credentials.confirmPassword.$error
                    ? $t('SET_NEW_PASSWORD.CONFIRM_PASSWORD.ERROR')
                    : ''
                "
                @blur="$v.credentials.confirmPassword.$touch"
              />
            </div>
          </div>
          <div id="recaptcha-container"></div>

          <woot-submit-button
            :disabled="isSignupInProgress"
            :button-text="$t('REGISTER.SUBMIT')"
            :loading="isSignupInProgress"
            button-class="large expanded width-50 m-auto"
          >
          </woot-submit-button>
          <p class="accept--terms" v-html="termsLink"></p>
        </form>
        <div class="column text-center sigin--footer">
          <span>{{ $t('REGISTER.HAVE_AN_ACCOUNT') }}</span>
          <router-link to="/app/login">
            {{
              useInstallationName(
                $t('LOGIN.TITLE'),
                globalConfig.installationName
              )
            }}
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="openConfirmation" class="confirmation-modal-back-draw"></div>
    <div v-if="openConfirmation" class="confirmation-modal-container">
      <div class="confirmation-modal-header">
        <div class="confirmation-modal-header-text">
          Enter code received on your number
        </div>

        <div class="confirmation-modal-body">
          <woot-input
            v-model.trim="code"
            type="text"
            :label="$t('CONFIRM_PASSWORD.ENTER_CODE')"
            :placeholder="$t('CONFIRM_PASSWORD.ENTER_CODE')"
          />
          <div class="description-reset">
            Resend code at
            <span @click="submit">
              {{ formattedObject.e164 }}
            </span>
            or
            <span @click="setChangeNumber">
              Change number
            </span>
          </div>
          <div
            class="confirmation-modal-submit-button button nice large expanded width-50 m-auto"
            @click="verifyConfirmatinCode"
          >
            {{ $t('REGISTER.SUBMIT') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import globalConfigMixin from 'shared/mixins/globalConfigMixin';
import alertMixin from 'shared/mixins/alertMixin';
import { DEFAULT_REDIRECT_URL } from '../../constants';
import Auth from '../../api/auth';
import VuePhoneNumberInput from 'vue-phone-number-input';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth';

export default {
  components: {
    VuePhoneNumberInput,
  },
  mixins: [globalConfigMixin, alertMixin],
  data() {
    return {
      credentials: {
        accountName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        // subdomain: '',
      },
      isSignupInProgress: false,
      error: '',
      openConfirmation: false,
      code: '',
      country: 'US',
      formattedObject: null,
    };
  },
  validations: {
    credentials: {
      accountName: {
        required,
        minLength: minLength(2),
      },
      firstName: {
        required,
        minLength: minLength(2),
      },
      phone: {
        required,
        minLength: minLength(9),
      },
      lastName: {
        required,
        minLength: minLength(2),
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        // minLength: minLength(6),
        valid: function(value) {
          const containsUppercase = /[A-Z]/.test(value);
          const containsLowercase = /[a-z]/.test(value);
          const containsNumber = /[0-9]/.test(value);
          const containsSpecial = /[#?!@$%^&*-]/.test(value);
          const minLengthOfPassword = value.length > 6;
          return (
            containsUppercase &&
            containsLowercase &&
            containsNumber &&
            containsSpecial &&
            minLengthOfPassword
          );
        },
      },
      confirmPassword: {
        required,
        isEqPassword(value) {
          if (value !== this.credentials.password) {
            return false;
          }
          return true;
        },
      },
    },
  },
  computed: {
    ...mapGetters({
      globalConfig: 'globalConfig/get',
    }),
    termsLink() {
      return this.$t('REGISTER.TERMS_ACCEPT')
        .replace('https://www.chatwoot.com/terms', this.globalConfig.termsURL)
        .replace(
          'https://www.chatwoot.com/privacy-policy',
          this.globalConfig.privacyURL
        );
    },
  },
  mounted() {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: response => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // this.sendRequestForSignUp();
          console.log(response);
        },
      },
      auth
    );
    this.getCountryCode();
  },
  methods: {
    async getCountryCode() {
      const countryObj = await Auth.getCountryCode();
      this.country = countryObj.data.country;
    },
    setChangeNumber() {
      this.openConfirmation = false;
      this.isSignupInProgress = false;
    },
    verifyConfirmatinCode() {
      if (this.code.length > 5) {
        window.confirmationResult
          .confirm(this.code)
          .then(res => {
            // eslint-disable-next-line no-underscore-dangle
            this.sendRequestForSignUp(res._tokenResponse.idToken);
          })
          .catch(error => {
            this.code = '';
            console.log(error);
            alert('code is not same try again');
          });
      }
    },
    async sendRequestForSignUp(firebaseToken) {
      this.isSignupInProgress = true;
      this.openConfirmation = false;
      this.credentials.phone = this.formattedObject.e164;
      try {
        const response = await Auth.register(
          this.credentials,
          firebaseToken,
          this.code
        );
        if (response.status === 200) {
          window.location = DEFAULT_REDIRECT_URL;
        }
      } catch (error) {
        let errorMessage = this.$t('REGISTER.API.ERROR_MESSAGE');
        if (error.response && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        this.showAlert(errorMessage);
      } finally {
        this.isSignupInProgress = false;
      }
    },
    async checkEmailStatus() {
      await Auth.checkEmailStatus(this.credentials.email).then(res => {
        console.log(res, 'response');
        if (res.data.found) {
          this.showAlert('Email Already Exist');
        } else {
          this.submit();
        }
      });
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.isSignupInProgress = true;
      const appVerifier = window.recaptchaVerifier;

      const auth = getAuth();
      signInWithPhoneNumber(auth, this.formattedObject.e164, appVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
          this.openConfirmation = true;
          // ...
        })
        .catch(error => {
          alert(error);
          console.log(error, 'error in firebase');
        });
    },
  },
};
</script>
<style scoped lang="scss">
.signup {
  .signup--hero {
    margin-bottom: var(--space-larger);

    .hero--logo {
      width: 180px;
    }

    .hero--title {
      margin-top: var(--space-large);
      font-weight: var(--font-weight-light);
    }
  }

  .signup--box {
    padding: var(--space-large);

    label {
      font-size: var(--font-size-default);
      color: var(--b-600);
      position: relative;
      input {
        padding: var(--space-slab);
        height: var(--space-larger);
        font-size: var(--font-size-default);
      }
    }
  }

  .sigin--footer {
    padding: var(--space-medium);
    font-size: var(--font-size-default);

    > a {
      font-weight: var(--font-weight-bold);
    }
  }

  .accept--terms {
    font-size: var(--font-size-small);
    text-align: center;
    margin: var(--space-normal) 0 0 0;
  }
}

.confirmation-modal {
  &-container {
    height: 260px;
    width: 35%;
    background-color: var(--white);
    margin: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: var(--shadow);
    padding: var(--space-medium);
    z-index: var(--z-index-high);
    min-width: 500px;
    @media only screen and (max-width: 548px) {
      width: 100%;
      min-width: 320px;
      height: 320px;
      padding: var(--space-normal);
    }
  }

  &-header {
    height: 5rem;
    line-height: 5rem;
    font-size: var(--font-size-big);
    font-weight: var(--font-weight-bold);
    text-align: center;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-small);
  }

  &-back-draw {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #00000040;
    z-index: var(--z-index-low);
  }

  &-body {
    text-align: left;
    padding-top: var(--space-medium);
    padding-bottom: var(--space-medium);
  }
}

@media screen and (max-width: 548px) {
  .signup--box .flex-no-wrap {
    flex-wrap: wrap !important;
  }
}

.description-reset {
  font-size: 14px;
  font-weight: 400;
  line-height: 7px;
  margin-bottom: 16px;
  cursor: pointer;
  & span {
    color: #1f93ff;
  }
}
</style>
<style lang="scss">
.input-tel.has-hint .input-tel__label,
.input-tel.has-value .input-tel__label {
  display: none;
}
.country-selector.has-hint .country-selector__label,
.country-selector.has-value .country-selector__label {
  display: none;
}
.country-selector.lg.has-value .country-selector__input {
  padding-top: 12px !important;
}
.country-selector.lg .country-selector__country-flag {
  top: 50% !important;
  transform: translateY(-50%);
}
.flex.align-center.country-selector__list__item {
  justify-content: flex-start;
  &.selected {
    background-color: #6cb8ff !important;
  }
}
</style>
