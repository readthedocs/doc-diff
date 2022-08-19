import { load_configuration } from "./extension";

describe("Configuration loading", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  test("Default values", () => {
    expect(document).toBeDefined();
    return load_configuration().then((config) => {
      expect(config).toBeDefined();
      expect(config).toHaveProperty("base_url");
      expect(config).toHaveProperty("root_selector");
    });
  });

  test("From a custom script", () => {
    expect(document).toBeDefined();

    const config = {
      base_url: "/mocked/en/latest/",
      root_selector: "body",
    };
    const config_element = document.createElement("script");
    config_element.setAttribute("type", "application/json");
    config_element.setAttribute("id", "readthedocs-diff-config");
    config_element.innerText = JSON.stringify(config);
    document.head.appendChild(config_element);

    return load_configuration().then((config) => {
      expect(config).toBeDefined();
      expect(config).toHaveProperty("base_url");
      expect(config).toHaveProperty("root_selector");
      expect(config).toMatchObject({
        base_url: "/mocked/en/latest/",
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
    };
    const config_element = document.createElement("script");
    config_element.setAttribute("type", "application/json");
    config_element.setAttribute("id", "READTHEDOCS_DATA");
    config_element.innerText = JSON.stringify(config);
    document.head.appendChild(config_element);

    return load_configuration().then((config) => {
      expect(config).toBeDefined();
      expect(config).toHaveProperty("base_url");
      expect(config).toHaveProperty("root_selector");
      expect(config).toMatchObject({
        base_url: "/de/latest/changelog.html",
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
    };
    const config_element = document.createElement("script");
    config_element.setAttribute("type", "application/json");
    config_element.setAttribute("id", "READTHEDOCS_DATA");
    config_element.innerText = JSON.stringify(config);
    document.head.appendChild(config_element);

    return load_configuration().then((config) => {
      expect(config).toBeDefined();
      expect(config).toHaveProperty("base_url");
      expect(config).toHaveProperty("root_selector");
      expect(config).toMatchObject({
        base_url: "/de/latest/guides/shrug.html",
        root_selector: "div.document[role='main']",
      });
    });
  });
});
