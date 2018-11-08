# Jest Style Matchers

A small set of Jest matchers used for doing style-based linting, gathered here for my own uses. This is almost pure proof-of-concept, but feedback and improvements are welcome.

These matchers make use of [htmllint](https://github.com/htmllint/htmllint), [stylelint](https://github.com/stylelint/stylelint), and [eslint](https://eslint.org/) for performing actual linting; see the associated docs and guides for more configuration options.

## `async toHaveNoHtmlLintErrorsAsync(filepath, config)`
Checks whether the specified file path contains any errors. This is an **asynchronous** matcher. Takes in the path to a _single_ `.html` file, as well as an object of `htmllint` options to use.

Usage:

```js
//example lint options (none required)
const lintOpts = {
  'doctype-first':true,
  'indent-width':false, //don't need to beautify
  'class-style':'none', //I like dashes in classnames
  'img-req-alt':true, //for this test; captured later
}

//check the file
await expect('path/to/index.html').toHaveNoHtmlLintErrorsAsync(lintOpts);
```

## `async toHaveNoCssLintErrorsAsync(files, config)`
Checks whether the specified file path contains any HTML linting errors. This is an **asynchronous** matcher. Works on a glob of CSS files to lint (per `stylelint`), and takes in an optional object of `stylelint` options to use (which are merged into the `config` option).

Usage:

```js
//example config of custom rules
const config = {
  rules:{
    "declaration-colon-space-after": "always",
  }
}

//check the files
await expect('path/to/css/file.css').toHaveNoCssLintErrorsAsync(config);
```


## `toHaveNoEsLintErrors(sourcesList, options)`
Checks whether the specified files contain any JavaScript linting errors. Works on an array glob of file sources (which is passed into into `executeOnFiles()`), and takes in an additional `eslint` config object (which has been lightly tested).

Usage:

```js
//check the files
expect(['path/to/js/file.js']).toHaveNoEsLintErrors();
```
