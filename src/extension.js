import { visualDomDiff } from "visual-dom-diff";

import styles from "./styles.css";

/**
 * visual-dom-diff options
 *
 * See https://github.com/Teamwork/visual-dom-diff#options
 */
const VISUAL_DIFF_OPTIONS = {
  addedClass: "doc-diff-added",
  modifiedClass: "doc-diff-modified",
  removedClass: "doc-diff-removed",
  skipModified: true,
};

/**
 * Load configuration file from script block
 *
 * Look for explicit configuration file for just this extension, or load
 * READTHEDOCS_DATA script object.
 *
 * @returns {Promise}
 */
export function load_configuration() {
  // Default config
  let config = {
    base_host: "",
    base_version: "latest",
    base_language: "en",
    base_page: "index.html",
    root_selector: "div.document[role='main']",
    inject_styles: true,
  };

  return new Promise((resolve, reject) => {
    /*
     * First try script#READTHEDOCS_DATA element, specific to Read the Docs
     *
     * This data looks like:
     *
     * {
     *   "ad_free": false,
     *   "api_host": "https://readthedocs.org",
     *   "build_date": "2022-08-18T12:00:58Z",
     *   "builder": "sphinx",
     *   "canonical_url": null,
     *   "commit": "bbfc9916",
     *   "docroot": "/docs/",
     *   "features": {
     *     "docsearch_disabled": false
     *   },
     *   "global_analytics_code": null,
     *   "language": "en",
     *   "page": "index",
     *   "programming_language": "words",
     *   "project": "test-builds",
     *   "proxied_api_host": "/_",
     *   "source_suffix": ".rst",
     *   "subprojects": {},
     *   "theme": "sphinx_rtd_theme",
     *   "user_analytics_code": "UA-12341234-1",
     *   "version": "latest"
     * }
     */
    const rtd_config_element = document.querySelector(
      "script#READTHEDOCS_DATA"
    );
    if (rtd_config_element) {
      try {
        const rtd_config = JSON.parse(rtd_config_element.innerText);

        // TODO we need a programmatic way to do this, this is a hack
        config.base_host = "https://" + rtd_config.project + ".readthedocs.io";
        config.base_language = rtd_config.language;
        config.base_page = rtd_config.page + ".html";
        // TODO configure root selector based on theme and/or builder?
        // config.root_selector: "div.document[role='main']",
      } catch (err) {
        console.debug("Error parsing configuration data", err);
      }
    }

    // Next load custom configuration for overrides
    const config_element = document.querySelector("script#doc-diff-config");
    if (config_element) {
      try {
        const custom_config = JSON.parse(config_element.innerText);
        Object.assign(config, custom_config);
      } catch (err) {
        console.debug("Error parsing configuration data", err);
      }
    }

    if (config.base_url === undefined) {
      config.base_url = get_base_url(
        config.base_host,
        config.base_language,
        config.base_version,
        config.base_page
      );
    }

    return resolve(config);
  });
}

/**
 * Get the URL of the base document to fetch and compare against
 *
 * This is constructed from several configuration options by default.
 *
 * @param {string} host - Host name part of the base URL
 * @parma {string} page - Page part of the base URL
 * @param {string} [version="latest"] - Base version to compare against
 * @param {string} [language="en"] - Base language to compare against
 */
export function get_base_url(host, language = "en", version = "latest", page) {
  let parts = [];

  // Single version
  if (version == null && language == null) {
    parts = [host, page];
  }
  // Only version, not really supported, but hey
  else if (language == null) {
    parts = [host, version, page];
  } else {
    parts = [host, language, version, page];
  }
  return parts.join("/");
}

/**
 * Main process for showing visual diff
 *
 * @param config {Object}
 * @returns {Promise}
 */
export function compare(config) {
  // TODO make this configurable, but probably still hardcoded
  // TODO error handling :shrug:
  return new Promise((resolve, reject) => {
    fetch(config.base_url)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const html_document = parser.parseFromString(text, "text/html");
        const old_body = html_document.documentElement.querySelector(
          config.root_selector
        );
        const new_body = document.querySelector(config.root_selector);

        if (old_body == null || new_body == null) {
          reject(new Error("Element not found in both documents."));
        }

        // Conditionally inject our base styles
        if (config.inject_styles) {
          document.adoptedStyleSheets = [styles];
        }

        // After finding the root element, and diffing it, replace it in the DOM
        // with the resulting visual diff elements instead.
        const diffNode = visualDomDiff(old_body, new_body, VISUAL_DIFF_OPTIONS);
        new_body.replaceWith(diffNode.firstElementChild);

        resolve(true);
      });
  });
}

/**
 * Automatically set this up if it is included via `<script>`
 *
 * Don't do anything if this is used as a module instead.
 */
export function setup() {
  const is_loaded = new Promise((resolve) => {
    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      return resolve();
    } else {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          resolve();
        },
        {
          capture: true,
          once: true,
          passive: true,
        }
      );
    }
  });

  return new Promise((resolve) => {
    is_loaded
      .then(() => {
        return load_configuration();
      })
      .then((config) => {
        return compare(config);
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.error(err.message);
      });
  });
}
