import { createParser } from "nuqs/server";

import { defaultLocale, isLocale } from "~/i18n/config";

export const langParser = createParser({
  parse(value) {
    if (!value) {
      return null;
    }

    return isLocale(value) ? value : null;
  },
  serialize(value) {
    return value;
  },
})
  .withDefault(defaultLocale)
  .withOptions({ clearOnDefault: true });
