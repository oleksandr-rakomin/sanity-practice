const supportedLocales = ["en-GB", "pl-PL", "uk-UA"];

const locale = process.env.APP_LOCALE;

if (!supportedLocales.includes(locale)) {
  throw new Error(`Invalid or missing APP_LOCALE: ${locale}`);
}

export const APP_LOCALE = locale;
