Read the Docs visual doc diff
=============================

Add visual diffs to your documentation pull request builds!

.. warning::
    This is in beta development, you'll have to manually configure this. This
    implementation is also likely to change in the future.

Installation
------------

Just add this to your documentation output, but only for pull request builds:

.. code:: html

    <script src="readthedocs-doc-diff.js" async></script>

Configuration
-------------

On Read the Docs, configuration will be automatic, using some data that we
include on every page. If for some reason you need to override this, custom
configuration can be performed using `<script>` element:

.. code:: html

    <script type="application/json" id="doc-diff-config">
    {
        "base_url": "/en/stable/index.html",
    }
    </script>

Options
~~~~~~~

base_version
    The base version to use when constructing a URL for the diff base.

    Default: `latest`

inject_styles
    Automatically inject basic stylesheets for the diff elements. See `Styling`_
    below for information on how to style these yourself.

    Default: `true`

root_selector
    The root element to compare on both documents. This is a Sphinx specific
    node by default.

    Default: `div.document[role='main']`

Styling
-------

There are several selectors that you can redefine with your own CSS. Make sure to
disable the `inject_styles` option as well.

* `.doc-diff-added`
* `.doc-diff-modified`
* `.doc-diff-removed`
