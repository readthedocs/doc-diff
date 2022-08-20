import { get_base_url, load_configuration } from "./extension";

describe("Configuration loading", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  test("Default values", () => {
    expect(document).toBeDefined();
    return load_configuration().then((config) => {
      expect(config).toMatchObject({
        base_version: "latest",
        base_language: "en",
        base_page: "index.html",
      });
    });
  });

  test("From a custom script", () => {
    expect(document).toBeDefined();

    const config = {
      base_version: "mocked",
      root_selector: "body",
    };
    const config_element = document.createElement("script");
    config_element.setAttribute("type", "application/json");
    config_element.setAttribute("id", "doc-diff-config");
    config_element.innerText = JSON.stringify(config);
    document.head.appendChild(config_element);

    return load_configuration().then((config) => {
      expect(config).toMatchObject({
        base_version: "mocked",
        base_language: "en",
        base_page: "index.html",
        root_selector: "body",
      });
    });
  });

  test("From READTHEDOCS_DATA script", () => {
    expect(document).toBeDefined();

    const config = {
      version: "devel",
      language: "de",
      page: "changelog",
      project: "doc-diff",
    };
    const config_element = document.createElement("script");
    config_element.setAttribute("type", "application/json");
    config_element.setAttribute("id", "READTHEDOCS_DATA");
    config_element.innerText = JSON.stringify(config);
    document.head.appendChild(config_element);

    return load_configuration().then((config) => {
      expect(config).toMatchObject({
        base_version: "latest",
        base_language: "de",
        base_host: "https://doc-diff.readthedocs.io",
        base_page: "changelog.html",
        root_selector: "div.document[role='main']",
      });
    });
  });

  test("From READTHEDOCS_DATA script in nested page", () => {
    expect(document).toBeDefined();

    const config = {
      version: "devel",
      language: "de",
      page: "guides/shrug",
      project: "doc-diff",
    };
    const config_element = document.createElement("script");
    config_element.setAttribute("type", "application/json");
    config_element.setAttribute("id", "READTHEDOCS_DATA");
    config_element.innerText = JSON.stringify(config);
    document.head.appendChild(config_element);

    return load_configuration().then((config) => {
      expect(config).toMatchObject({
        base_version: "latest",
        base_language: "de",
        base_host: "https://doc-diff.readthedocs.io",
        base_page: "guides/shrug.html",
        root_selector: "div.document[role='main']",
      });
    });
  });

  test("From both custom and READTHEDOCS_DATA scripts", () => {
    expect(document).toBeDefined();

    const configs = [
      {
        id: "READTHEDOCS_DATA",
        data: {
          version: "devel",
          language: "de",
          page: "guides/shrug",
          project: "doc-diff",
        },
      },
      {
        id: "doc-diff-config",
        data: {
          base_language: "ja",
          inject_styles: false,
        },
      },
    ];

    for (const config of configs) {
      const config_element = document.createElement("script");
      config_element.setAttribute("type", "application/json");
      config_element.setAttribute("id", config.id);
      config_element.innerText = JSON.stringify(config.data);
      document.head.appendChild(config_element);
    }

    return load_configuration().then((config) => {
      expect(config).toMatchObject({
        base_host: "https://doc-diff.readthedocs.io",
        base_language: "ja",
        base_version: "latest",
        base_page: "guides/shrug.html",
        root_selector: "div.document[role='main']",
        inject_styles: false,
      });
    });
  });

  test("From both but with base_url override", () => {
    expect(document).toBeDefined();

    const configs = [
      {
        id: "READTHEDOCS_DATA",
        data: {
          version: "devel",
          language: "de",
          page: "guides/shrug",
          project: "doc-diff",
        },
      },
      {
        id: "doc-diff-config",
        data: {
          base_url: "/guides/tacos.html",
          inject_styles: false,
        },
      },
    ];

    for (const config of configs) {
      const config_element = document.createElement("script");
      config_element.setAttribute("type", "application/json");
      config_element.setAttribute("id", config.id);
      config_element.innerText = JSON.stringify(config.data);
      document.head.appendChild(config_element);
    }

    return load_configuration().then((config) => {
      expect(config).toMatchObject({
        base_host: "https://doc-diff.readthedocs.io",
        base_language: "de",
        base_version: "latest",
        base_page: "guides/shrug.html",
        base_url: "/guides/tacos.html",
        root_selector: "div.document[role='main']",
        inject_styles: false,
      });
    });
  });
});

describe("Base URL generation", () => {
  test("With everything", () => {
    expect(
      get_base_url(
        "https://doc-diff.readthedocs.io",
        "en",
        "latest",
        "guides/shrug.html"
      )
    ).toBe("https://doc-diff.readthedocs.io/en/latest/guides/shrug.html");
  });

  test("Without a language", () => {
    expect(
      get_base_url(
        "https://doc-diff.readthedocs.io",
        null,
        "latest",
        "guides/shrug.html"
      )
    ).toBe("https://doc-diff.readthedocs.io/latest/guides/shrug.html");
  });

  test("Without a language or version", () => {
    expect(
      get_base_url(
        "https://doc-diff.readthedocs.io",
        null,
        null,
        "guides/shrug.html"
      )
    ).toBe("https://doc-diff.readthedocs.io/guides/shrug.html");
  });

  test("Without a host", () => {
    expect(get_base_url(null, "en", "latest", "guides/shrug.html")).toBe(
      "/en/latest/guides/shrug.html"
    );
  });
});
