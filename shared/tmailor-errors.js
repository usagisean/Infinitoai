(function(root, factory) {
  const exports = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }

  root.TmailorErrors = exports;
})(typeof globalThis !== 'undefined' ? globalThis : self, function() {
  const TMAILOR_API_NODE_RETRY_HINT = 'Please change node and retry.';

  function getErrorMessage(error) {
    return typeof error === 'string' ? error : error?.message || '';
  }

  function isTmailorApiCaptchaError(error) {
    const message = getErrorMessage(error);
    return /errorcaptcha/i.test(message);
  }

  function getTmailorApiManualTakeoverMessage() {
    return 'TMailor API triggered a Cloudflare captcha.';
  }

  function isTmailorApiNodeRetryError(error) {
    const message = getErrorMessage(error);
    return /\b502\b|\b503\b|\b504\b|bad gateway|gateway timeout|timed out|timeout/i.test(message);
  }

  function addTmailorApiNodeRetryHint(message) {
    const text = String(message || '').trim();
    if (!text) {
      return TMAILOR_API_NODE_RETRY_HINT;
    }
    if (text.includes(TMAILOR_API_NODE_RETRY_HINT)) {
      return text;
    }
    return isTmailorApiNodeRetryError(text)
      ? `${text} ${TMAILOR_API_NODE_RETRY_HINT}`
      : text;
  }

  return {
    addTmailorApiNodeRetryHint,
    getTmailorApiManualTakeoverMessage,
    isTmailorApiCaptchaError,
    isTmailorApiNodeRetryError,
  };
});
