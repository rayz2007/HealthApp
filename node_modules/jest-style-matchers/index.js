/* Custom code validation matchers (for error output) */

const fs = require('fs');
const htmllint = require('htmllint');
const stylelint = require('stylelint');
const ESLintEngine = require('eslint').CLIEngine;

const defaultCssConfig = {config:{"extends": "stylelint-config-recommended"}}

module.exports = {

  //this only works on a single file at a time
  async toHaveNoHtmlLintErrorsAsync(filepath, options) {
    const html = fs.readFileSync(filepath, 'utf-8');
    let validityObj = await htmllint(html, options);

    const pass = validityObj.length === 0;
    if (pass) {
      return { pass: true, message: () => "expected html to contain validity errors" };
    }
    else {
      return {
        pass: false, message: () => (
          //loop through and build the result string
          //these error messages could be more detailed; maybe do manually later
          validityObj.reduce((out, msg) => {
            return out + `Error: '${msg.rule}' at line ${msg.line}, column ${msg.column}.\n`
          }, '')
        )
      };
    }
  },

  async toHaveNoCssLintErrorsAsync(files, config) {
    let fullConfig = Object.assign({files:files}, Object.assign(defaultCssConfig, config));
    // console.log(fullConfig);
    let validityObj = await stylelint.lint(fullConfig);

    const pass = validityObj.errored === false;
    if (pass) {
      return { pass: true, message: () => "expected CSS to contain validity errors" };
    }
    else {
      return {
        pass: false, message: () => (
          //loop through and build the result string
          //these error messages could be more detailed; maybe do manually later
          JSON.parse(validityObj.output)[0].warnings.reduce((out, msg) => {
            return out + `${msg.severity}: ${msg.text}\n       At line ${msg.line}, column ${msg.column}.\n`
          }, '')
        )
      };
    }  
  },
  

  //takes in an array of sources and a configuration object for ESLint
  toHaveNoEsLintErrors(sourcesList, options) {
    const linter = new ESLintEngine(options); //load the configuration
    let report = linter.executeOnFiles(sourcesList); //lint the sources

    const SEVERITY_MSG = { 1: "Warn", 2: "Error" }; //for printing

    //what to return
    const pass = report.errorCount === 0;
    if (pass) {
      return { pass: true, message: () => "expected JavaScript to show linting errors" };
    }
    else {
      //doesn't seem to be handling multiple files correctly...
      return {
        pass: false, message: () => (
          //loop through and build the result string
          report.results.reduce((fout, fileMessages) => {
            return (
              fileMessages.filePath + '\n' +
              fileMessages.messages.reduce((out, msg) => {
                return out + `    ${SEVERITY_MSG[msg.severity]}: ${msg.message} At line ${msg.line}, column ${msg.column}` + '\n';
              }, '')
            )
          }, '')
        )
      };
    }
  },
};