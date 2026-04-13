const test = require('node:test');
const assert = require('node:assert/strict');

const {
  addTmailorApiNodeRetryHint,
  getTmailorApiManualTakeoverMessage,
  isTmailorApiCaptchaError,
  isTmailorApiNodeRetryError,
} = require('../shared/tmailor-errors.js');

test('detects TMailor API captcha failures from explicit errorcaptcha responses', () => {
  assert.equal(isTmailorApiCaptchaError('TMailor newemail failed: errorcaptcha'), true);
  assert.equal(isTmailorApiCaptchaError('tmailor inbox poll failed: ERRORCAPTCHA'), true);
});

test('ignores unrelated TMailor API failures for captcha detection', () => {
  assert.equal(isTmailorApiCaptchaError('TMailor newemail failed: unknown_error'), false);
  assert.equal(isTmailorApiCaptchaError('TMailor API request failed (503).'), false);
});

test('detects retryable TMailor API node errors and appends the change-node hint once', () => {
  assert.equal(isTmailorApiNodeRetryError('TMailor API request failed (504).'), true);
  assert.equal(isTmailorApiNodeRetryError('TMailor API request timed out after 15000ms.'), true);
  assert.equal(isTmailorApiNodeRetryError('TMailor API returned an invalid JSON payload.'), false);
  assert.equal(
    addTmailorApiNodeRetryHint('TMailor API request failed (504).'),
    'TMailor API request failed (504). Please change node and retry.'
  );
  assert.equal(
    addTmailorApiNodeRetryHint('TMailor API request failed (504). Please change node and retry.'),
    'TMailor API request failed (504). Please change node and retry.'
  );
});

test('manual takeover message is the short Cloudflare captcha notice', () => {
  assert.equal(
    getTmailorApiManualTakeoverMessage(),
    'TMailor API triggered a Cloudflare captcha.'
  );
});
