<template>
  <label>
    <span v-if="label">{{ label }}</span>
    <div class="input-container">
      <input
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :readonly="readonly"
        class="subdomain"
        @input="onChange"
        @blur="onBlur"
      />
      <div class="subdomain-text">
        onechat.is
      </div>
    </div>

    <p v-if="helpText" class="help-text"></p>
    <span v-if="error" class="message">
      {{ error }}
    </span>
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    helpText: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      deafaut: false,
    },
  },
  methods: {
    onChange(e) {
      this.$emit('input', e.target.value);
    },
    onBlur(e) {
      this.$emit('blur', e.target.value);
    },
  },
};
</script>
<style scoped lang="scss">
.input-container {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 4.8rem;
  margin: 0 0 1.6rem;
  //padding: 0.8rem;
  border: 1px solid #ebf0f5;
  border: 1px solid var(--s-75);
  border-radius: 0.5rem;
  border-radius: var(--border-radius-normal);
  background-color: #fff;
  box-shadow: 0;
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: normal;
  line-height: 1.5;
  color: #3c4858;
  transition: border-color 0.25s ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  & input {
    appearance: none;
    border: none;
    background: transparent;
    padding: 24px 10px;
  }
}
.subdomain-text {
  background: #d9d9d9;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 0 10px;
}
</style>
