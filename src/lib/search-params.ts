import { createParser } from "nuqs/server";

import { defaultLocale, isLocale } from "~/i18n/config";
import {
  isSameLocalDay,
  startOfLocalDay,
} from "~/lib/dates";

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

export const dateParser = createParser({
  parse(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  },
  serialize(value) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
  eq: isSameLocalDay,
})
  .withDefault(startOfLocalDay(new Date()))
  .withOptions({ clearOnDefault: true });
