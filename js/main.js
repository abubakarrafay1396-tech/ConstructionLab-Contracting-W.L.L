/* Shared behaviour for all five pages. No libraries or build step. */
(() => {
  'use strict';
  const config = window.CL_CONFIG || {};
  document.documentElement.classList.add('js');
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const confirmed = value => typeof value === 'string' && value.trim() !== '' && !value.includes('[TO CONFIRM:');
  const httpsURL = value => {
    try { const url = new URL(value); return url.protocol === 'https:' ? url : null; }
    catch { return null; }
  };
  const phoneNumber = value => {
    if (!confirmed(value) || !/^\+?[\d\s().-]+$/.test(value.trim())) return '';
    const digits = value.replace(/\D/g, '');
    return /^[1-9]\d{7,14}$/.test(digits) ? digits : '';
  };
  const email = confirmed(config.EMAIL) ? config.EMAIL : 'info@constructionlab.com';
  const phone = phoneNumber(config.PHONE);
  const whatsapp = phoneNumber(config.WHATSAPP);
  const defaultMessage = 'Hello, I would like to discuss an HVAC project or maintenance requirement in Bahrain.';
  const whatsappURL = message => `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  // Text is assigned safely; configuration is never inserted as HTML.
  $$('[data-config]').forEach(node => {
    const value = config[node.dataset.config];
    if (value !== undefined && value !== null && String(value).trim()) node.textContent = String(value);
  });
  $$('[data-config-link]').forEach(node => {
    const url = httpsURL(config[node.dataset.configLink]);
    if (url) node.href = url.href;
  });
  $$('[data-email]').forEach(node => { node.href = `mailto:${email}`; });
  $$('[data-contact="phone"]').forEach(node => {
    node.href = phone ? `tel:+${phone}` : 'contact.html#contact-details';
    node.setAttribute('aria-label', phone ? `Call ${config.PHONE}` : 'Call: phone number to be confirmed. View contact options.');
  });
  $$('[data-contact="whatsapp"]').forEach(node => {
    node.href = whatsapp ? whatsappURL(defaultMessage) : 'contact.html#contact-details';
    node.setAttribute('aria-label', whatsapp ? 'Chat on WhatsApp' : 'WhatsApp number to be confirmed. View contact options.');
  });
  $$('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

  // GA4 and Meta are completely skipped until valid IDs are provided.
  // Event payloads contain no form contents, email addresses or phone numbers.
  const gaEnabled = /^G-[A-Z0-9]+$/.test(config.GA4_ID || '');
  const metaEnabled = /^\d+$/.test(config.META_PIXEL_ID || '');
  if (gaEnabled) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // This site's form_submit event is sent only after confirmed acceptance.
    // Also disable automatic form interactions in GA4 (see README).
    window.gtag('config', config.GA4_ID, { send_page_view: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.GA4_ID)}`;
    document.head.append(script);
  }
  if (metaEnabled) {
    if (!window.fbq) {
      const fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      window.fbq = fbq;
      window._fbq = fbq;
      fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
      const script = document.createElement('script');
      script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.append(script);
    }
    window.fbq('init', config.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  function track(eventName) {
    const data = { page_name: document.body.dataset.page || 'unknown' };
    if (gaEnabled && window.gtag) window.gtag('event', eventName, data);
    if (metaEnabled && window.fbq) window.fbq('trackCustom', eventName, data);
  }

  // Canonical and social URLs are omitted until a real deployment URL exists.
  // The schema omits unknown address, phone and hours instead of publishing placeholders.
  const base = httpsURL(config.SITE_URL);
  const pageFile = document.body.dataset.page === 'home' ? '' : `${document.body.dataset.page}.html`;
  let canonical = '';
  if (base) {
    base.search = ''; base.hash = '';
    if (!base.pathname.endsWith('/')) base.pathname += '/';
    canonical = new URL(pageFile, base).href;
    const link = $('link[rel="canonical"]') || document.createElement('link');
    link.rel = 'canonical'; link.href = canonical;
    if (!link.isConnected) document.head.append(link);
    const ogURL = $('meta[property="og:url"]') || document.createElement('meta');
    ogURL.setAttribute('property', 'og:url'); ogURL.content = canonical;
    if (!ogURL.isConnected) document.head.append(ogURL);
    const ogImage = $('meta[property="og:image"]') || document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.content = new URL('assets/images/instagram-duct-replacement.jpg', base).href;
    if (!ogImage.isConnected) document.head.append(ogImage);
  }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    name: config.COMPANY_NAME || 'Construction Lab Air Conditioning W.L.L.',
    description: 'HVAC design, installation, ductwork, testing and commissioning, servicing and maintenance contracts in Bahrain.',
    email,
    areaServed: { '@type': 'Country', name: 'Bahrain' },
    identifier: 'CR 62897-5'
  };
  if (base) { schema.url = base.href; schema['@id'] = `${base.href}#business`; schema.image = new URL('assets/images/instagram-duct-replacement.jpg', base).href; }
  if (Number.isInteger(config.FOUNDED_YEAR)) schema.foundingDate = String(config.FOUNDED_YEAR);
  if (phoneNumber(config.FAX)) schema.faxNumber = `+${phoneNumber(config.FAX)}`;
  if (phone) schema.telephone = `+${phone}`;
  if (confirmed(config.ADDRESS)) schema.address = { '@type': 'PostalAddress', streetAddress: config.ADDRESS, addressCountry: 'BH' };
  if (httpsURL(config.MAPS_URL)) schema.hasMap = config.MAPS_URL;
  if (httpsURL(config.INSTAGRAM_URL)) schema.sameAs = [config.INSTAGRAM_URL];
  const schemaNode = $('#business-schema');
  if (schemaNode) schemaNode.textContent = JSON.stringify(schema);

  // Accessible disclosure navigation. Escape closes it; Tab stays in normal page order.
  const menu = $('#primary-navigation');
  const toggle = $('.menu-toggle');
  const desktop = window.matchMedia('(min-width: 1200px)');
  function closeMenu(restoreFocus = false) {
    if (!toggle || !menu) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) toggle.focus();
  }
  if (menu && toggle) {
    toggle.addEventListener('click', () => {
      const opening = toggle.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', opening);
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    });
    menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) closeMenu();
    });
    desktop.addEventListener('change', () => closeMenu());
  }

  // The fallback is a useful contact link. Never construct tel:/wa.me URLs from placeholders.
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.matches('[data-contact="phone"]') && phone) track('phone_click');
    if (link.matches('[data-contact="whatsapp"]') && whatsapp) track('whatsapp_click');
    if (link.matches('[data-track="quote"]')) track('get_quote_click');
  });

  // Projects: visible HTML is the default; filtering is progressive enhancement.
  const filterButtons = $$('[data-filter]');
  const projectCards = $$('[data-project-category]');
  const resultCount = $('#project-count');
  if (filterButtons.length && projectCards.length) {
    const filterBar = $('.filter-list');
    if (filterBar) filterBar.hidden = false;
    filterButtons.forEach(button => button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      projectCards.forEach(card => {
        const show = category === 'all' || card.dataset.projectCategory === category;
        card.hidden = !show;
        if (show) count += 1;
      });
      if (resultCount) resultCount.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown`;
    }));
  }

  const form = $('#quote-form');
  if (!form) return;
  form.noValidate = true;
  const fields = $('#quote-fields');
  if (fields) fields.disabled = false;
  const status = $('#form-status');
  const submit = $('[type="submit"]', form);
  const sendWhatsApp = $('#form-whatsapp');
  const hasEndpoint = Boolean(httpsURL(config.FORM_ENDPOINT));
  const submitLabel = $('[data-form-submit-label]', form);
  if (submitLabel) submitLabel.textContent = hasEndpoint ? 'Send enquiry' : 'Send enquiry on WhatsApp';
  if (sendWhatsApp) sendWhatsApp.hidden = !hasEndpoint;
  const serviceSelect = $('#service');
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  if (serviceSelect && [...serviceSelect.options].some(option => option.value === service)) serviceSelect.value = service;
  const request = params.get('request');
  if (request && ['HVAC design', 'Testing and commissioning'].includes(request)) {
    const messageField = $('#message');
    if (messageField && !messageField.value) messageField.value = `I would like to enquire about ${request.toLowerCase()}.`;
  }
  function setStatus(message, state) {
    if (!status) return;
    status.hidden = false;
    status.dataset.state = state;
    status.textContent = message;
  }
  function validate() {
    let firstInvalid = null;
    $$('input:not([type="hidden"]), select, textarea', form).forEach(field => {
      if (field.name === 'website') return;
      field.setCustomValidity('');
      if (field.required && !field.value.trim()) field.setCustomValidity('Please complete this field.');
      if (field.name === 'phone' && field.value.trim() && (!/^\+?[\d\s().-]{7,25}$/.test(field.value.trim()) || !/^\d{7,15}$/.test(field.value.replace(/\D/g, '')))) field.setCustomValidity('Enter a phone number, including the country code.');
      const invalid = !field.checkValidity();
      field.setAttribute('aria-invalid', String(invalid));
      const error = document.getElementById(`${field.id}-error`);
      if (error) { error.hidden = !invalid; error.textContent = invalid ? field.validationMessage : ''; }
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      setStatus('Please check the highlighted fields. Your enquiry has not been sent.', 'error');
      firstInvalid.focus();
      return false;
    }
    return true;
  }
  form.addEventListener('input', event => {
    const field = event.target;
    if (!field.matches('input, textarea, select')) return;
    field.setCustomValidity('');
    field.removeAttribute('aria-invalid');
    const error = document.getElementById(`${field.id}-error`);
    if (error) error.hidden = true;
  });
  function getData() {
    return Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, String(value).trim()]));
  }
  function openWhatsAppEnquiry(data) {
    if (!whatsapp) {
      setStatus(`WhatsApp number to be confirmed. Please email ${email}. Your enquiry has not been sent.`, 'error');
      return;
    }
    const lines = [
      'Hello, I would like an HVAC quote.',
      `Name: ${data.name}`, data.company ? `Company: ${data.company}` : '',
      `Phone or WhatsApp: ${data.phone}`, `Email: ${data.email}`,
      `Service: ${data.service}`, `Project location: ${data.location}`, `Message: ${data.message}`
    ].filter(Boolean);
    track('whatsapp_click');
    const url = whatsappURL(lines.join('\n'));
    window.open(url, '_blank', 'noopener,noreferrer');
    setStatus('Your enquiry is ready in WhatsApp. Review it and press Send there. If WhatsApp did not open, use this link: ', 'info');
    if (status) {
      const fallback = document.createElement('a');
      fallback.href = url;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Open WhatsApp';
      status.append(fallback);
    }
  }
  if (sendWhatsApp) sendWhatsApp.addEventListener('click', () => {
    const data = getData();
    if (data.website) { setStatus('Your enquiry could not be sent. Please email us instead.', 'error'); return; }
    if (!validate()) return;
    openWhatsAppEnquiry(data);
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit && submit.disabled) return;
    const data = getData();
    if (data.website) { setStatus('Your enquiry could not be sent. Please email us instead.', 'error'); return; }
    if (!validate()) return;
    const endpoint = httpsURL(config.FORM_ENDPOINT);
    if (!endpoint) { openWhatsAppEnquiry(data); return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    const originalLabel = submit ? submit.textContent : '';
    if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your enquiry…', 'info');
    try {
      const response = await fetch(endpoint.href, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit', body: JSON.stringify(data), signal: controller.signal
      });
      if (!response.ok) throw new Error('Server rejected the enquiry');
      const result = await response.json();
      if (result.success !== true) throw new Error('No confirmed acceptance');
      setStatus('Thank you. Your enquiry has been submitted.', 'success');
      track('form_submit');
      form.reset();
    } catch (error) {
      setStatus(`We could not confirm that your enquiry was received. Please email ${email}${whatsapp ? ' or send it on WhatsApp' : ''}. Your details are still in the form.`, 'error');
    } finally {
      window.clearTimeout(timeout);
      if (submit) { submit.disabled = false; submit.textContent = originalLabel; }
      form.removeAttribute('aria-busy');
    }
  });
})();
