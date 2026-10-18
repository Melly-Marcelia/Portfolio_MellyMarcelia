<script setup>
import { reactive, ref, computed } from 'vue'
import { site } from '@/data/site'
import AppText from '@/components/ui/AppText.vue'
import AppButton from '@/components/ui/AppButton.vue'

const form = reactive({ name: '', email: '', message: '' })
const touched = reactive({ name: false, email: false, message: false })
const sent = ref(false)
const headingWords = site.contact.form.heading.split(/\s+/)

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const errors = computed(() => ({
  name: form.name.trim() ? '' : 'Please add your name.',
  email: !form.email.trim()
    ? 'Please add your email.'
    : emailOk(form.email.trim())
      ? ''
      : 'That email doesn’t look right.',
  message: form.message.trim() ? '' : 'Please add a short message.',
}))

const isValid = computed(() => Object.values(errors.value).every((e) => !e))

function submit() {
  touched.name = touched.email = touched.message = true
  if (!isValid.value) return

  // No backend: hand the message to the visitor's mail app, pre-filled
  const subject = `Portfolio enquiry from ${form.name.trim()}`
  const body = `${form.message.trim()}\n\n${form.name.trim()}\n${form.email.trim()}`
  window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  sent.value = true
}

function reset() {
  form.name = form.email = form.message = ''
  touched.name = touched.email = touched.message = false
  sent.value = false
}
</script>

<template>
  <section class="section">
    <div class="container contact">
      <header class="contact__head">
        <AppText v-reveal="{ words: true }" variant="h1" as="h1">
          <template v-for="(w, i) in headingWords" :key="i">
            <span class="reveal-word" :style="{ '--w': i }">{{ w }}</span>{{ ' ' }}
          </template>
        </AppText>
        <AppText
          variant="body"
          tone="soft"
          measure
          class="contact__intro enter-left"
          style="--enter-delay: 260ms"
        >
          {{ site.contact.form.intro }}
        </AppText>
      </header>

      <div class="contact__card enter-rise" style="--enter-delay: 360ms">
        <Transition name="swap" mode="out-in">
        <form v-if="!sent" class="contact__form" novalidate @submit.prevent="submit">
          <label class="field enter-up" style="--enter-delay: 520ms">
            <span class="field__label">Name</span>
            <input
              v-model="form.name"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="First, Last"
              class="field__input"
              :class="{ 'is-error': touched.name && errors.name }"
              @blur="touched.name = true"
            />
            <span v-if="touched.name && errors.name" class="field__error">
              {{ errors.name }}
            </span>
          </label>

          <label class="field enter-up" style="--enter-delay: 600ms">
            <span class="field__label">Email</span>
            <input
              v-model="form.email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="name@gmail.com"
              class="field__input"
              :class="{ 'is-error': touched.email && errors.email }"
              @blur="touched.email = true"
            />
            <span v-if="touched.email && errors.email" class="field__error">
              {{ errors.email }}
            </span>
          </label>

          <label class="field enter-up" style="--enter-delay: 680ms">
            <span class="field__label">Message</span>
            <textarea
              v-model="form.message"
              name="message"
              rows="3"
              placeholder="Let's work together!"
              class="field__input field__input--area"
              :class="{ 'is-error': touched.message && errors.message }"
              @blur="touched.message = true"
            ></textarea>
            <span v-if="touched.message && errors.message" class="field__error">
              {{ errors.message }}
            </span>
          </label>

          <AppButton
            type="submit"
            class="contact__submit enter-up"
            style="--enter-delay: 760ms"
          >
            Submit
          </AppButton>
        </form>

        <div v-else class="contact__sent" role="status">
          <AppText variant="h3" as="p">Thanks, {{ form.name.split(' ')[0] || 'there' }}!</AppText>
          <AppText variant="body" tone="soft">
            Your message should now be open in your email app. Just hit send. If
            nothing opened, you can reach me at
            <a :href="`mailto:${site.contact.email}`">{{ site.contact.email }}</a>.
          </AppText>
          <AppButton variant="outline" type="button" @click="reset">
            Send another
          </AppButton>
        </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding-block: clamp(1.5rem, 4vw, 2.75rem);
}

.contact {
  max-width: 560px;
}

.contact__head {
  margin-bottom: var(--space-m);
}

.contact__intro {
  margin-top: var(--space-2xs);
}

.contact__card {
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-l);
  background: var(--color-surface);
}

.contact__form {
  display: grid;
  gap: var(--space-s);
}

.field {
  display: grid;
  gap: var(--space-3xs);
}

.field__label {
  font-size: var(--step--1);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.field__input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  font: inherit;
  color: var(--color-ink);
  background: var(--color-bg);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-m);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.field__input::placeholder {
  color: var(--color-ink-faint);
}

.field__input:focus-visible {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 22%, transparent);
}

.field__input--area {
  resize: vertical;
  min-height: 4.5rem;
}

.field__input.is-error {
  border-color: var(--color-accent);
}

.field__error {
  font-size: var(--step--1);
  color: var(--color-accent);
}

.contact__submit {
  width: 100%;
  margin-top: var(--space-2xs);
}

.contact__sent {
  display: grid;
  gap: var(--space-s);
  justify-items: start;
}
</style>
