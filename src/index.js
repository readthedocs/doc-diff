import { setup, compare } from "./extension";

/**
 * Automatically set this up if it is included via `<script>`
 *
 * This actually isn't super reliable, and even Jest misfires this code. So the
 * modules are split up a bit to avoid this.
 */
if (require.main !== module) {
  setup();
}

export { compare };
