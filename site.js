(() => {
  const {choose, localizedURL} = globalThis.SipByClockLanguage;
  const messages = globalThis.SipByClockMessages;
  const selector = document.getElementById('language');
  const valueAt = (dictionary, key) => key.split('.').reduce((value, part) => value?.[part], dictionary);
  function applyLanguage(language) {
    const dictionary = messages[language] || messages.en;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const translated = valueAt(dictionary, element.dataset.i18n);
      if (typeof translated === 'string') element.textContent = translated;
    });
    document.documentElement.lang = language;
    document.title = valueAt(dictionary, `${document.body.dataset.page}.title`);
    document.querySelector('meta[name="description"]').content = valueAt(dictionary, `${document.body.dataset.page}.meta`);
    document.querySelector('nav').setAttribute('aria-label', dictionary.common.navigation);
    selector.value = language;
    document.querySelectorAll('a[data-local], a[href^="#"]').forEach(link => {
      link.href = localizedURL(link.getAttribute('href'), window.location.href, language);
    });
  }
  function resolve() {
    return choose(new URL(window.location.href).searchParams.get('lang'),
      navigator.languages?.length ? navigator.languages : [navigator.language]);
  }
  applyLanguage(resolve());
  document.documentElement.classList.add('js');
  selector.disabled = false;
  selector.addEventListener('change', () => {
    const language = choose(selector.value, []);
    history.replaceState(null, '', localizedURL(window.location.href, window.location.href, language));
    applyLanguage(language);
  });
  window.addEventListener('popstate', () => applyLanguage(resolve()));
})();
