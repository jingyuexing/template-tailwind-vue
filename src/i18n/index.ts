import { createI18n } from "vue-i18n"
import { nextTick, isRef } from "vue"
import type {
  I18n,
  I18nOptions,
  VueI18n,
  Composer,
  I18nMode
} from "vue-i18n"

type Languages = "en" | "zh"

export const I18N = setupI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "",
  messages: {

  }
})

function isComposer(
  instance: VueI18n | Composer,
  mode: I18nMode
): instance is Composer {
  return mode === 'composition' && isRef(instance.locale)
}

export function getLocale(i18n: I18n): string {
  if (isComposer(i18n.global, i18n.mode)) {
    return i18n.global.locale.value
  }
  return i18n.global.locale
}

export function setLocale(i18n: I18n, locale: Languages): void {
  if (isComposer(i18n.global, i18n.mode)) {
    i18n.global.locale.value = locale
  } else {
    i18n.global.locale = locale
  }
}

export function setupI18n(options: I18nOptions = { locale: 'en' as Languages }): I18n {
  const i18n = createI18n(options)
  setI18nLanguage(i18n, (options.locale as Languages))
  return i18n
}

export function setI18nLanguage(i18n: I18n, locale: Languages): void {
  setLocale(i18n, locale)
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResourceMessages = (r: { default: any } | any) => r.default || r

export async function loadLocaleMessages(i18n: I18n, locale: Languages) {
  // load locale messages
  const messages = await import(`./locale/${locale}.json`).then(
    getResourceMessages
  )

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages)

  return nextTick()
}
