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

Configuration can be performed using `<script>` element:

.. code:: html

    <script type="application/json" id="doc-diff-config">
    {
        "base_url": "/en/stable/index.html",
    }
    </script>

Options
~~~~~~~

base_url
    Base URL to diff against.

    Default: `/en/latest/<page name>`

inject_styles
    Automatically inject basic stylesheets for the diff elements. See `Styling`_
    below for information on how to style these yourself.

    Default: `true`

Styling
-------

There are several selectors that you can redefine with your own CSS. Make sure to
disable the `inject_styles` option as well.

* `.doc-diff-added`
* `.doc-diff-modified`
* `.doc-diff-removed`
