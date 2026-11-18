/* Pure locale resolution is shared by the browser and dependency-free tests. */
(() => {
  const supported = Object.freeze(['zh-Hant', 'zh-Hans', 'en', 'de', 'fr', 'ja', 'ko', 'es']);
  function normalize(value) {
    if (typeof value !== 'string') return null;
    const parts = value.trim().replaceAll('_', '-').toLowerCase().split('-');
    if (parts[0] === 'zh') {
      if (parts.includes('hant')) return 'zh-Hant';
      if (parts.includes('hans')) return 'zh-Hans';
      return parts.some(part => ['tw', 'hk', 'mo'].includes(part)) ? 'zh-Hant' : 'zh-Hans';
    }
    return supported.includes(parts[0]) ? parts[0] : null;
  }
  function choose(explicit, preferences) {
    if (explicit !== null && explicit !== undefined) return normalize(explicit) || 'en';
    for (const preference of preferences || []) {
      const matched = normalize(preference);
      if (matched) return matched;
    }
    return 'en';
  }
  function localizedURL(href, base, language) {
    const target = new URL(href, base);
    const origin = new URL(base).origin;
    if (target.origin === origin && ['http:', 'https:', 'file:'].includes(target.protocol)) {
      target.searchParams.set('lang', language);
    }
    return target.href;
  }
  globalThis.SipByClockLanguage = Object.freeze({supported, normalize, choose, localizedURL});
  globalThis.SipByClockMessages = Object.create(null);
})();
