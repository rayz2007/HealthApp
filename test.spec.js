const fs = require('fs');

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

describe('Source code is valid', () => {
    test('HTML validates without errors', async () => {
        const lintOpts = {
            'attr-bans': ['align', 'background', 'bgcolor', 'border', 'frameborder', 'marginwidth', 'marginheight', 'scrolling', 'style'], //adding height, allow longdesc
            'tag-bans': ['style', 'b'], //<i> allowed for font-awesome
            'doctype-first': true,
            'doctype-html5': true,
            'html-req-lang': true,
            'attr-name-style': false, //for meta tags
            'line-end-style': false, //either way
            'indent-style': 'nonmixed', // non mixed
            'indent-width': 4, // need to beautify
            'id-class-style': false, //I like dashes in classnames
            'img-req-alt': true
        }

        const htmlfiles = fs.readdirSync(__dirname).filter((f) => f.endsWith('.html'));
        for (let f of htmlfiles) {
            await expect(f).toHaveNoHtmlLintErrorsAsync(lintOpts);
        }
    })

    test('CSS validates without errors', async () => {
        await expect('css/*.css').toHaveNoCssLintErrorsAsync(); //test all files in css folder
    })

    test('JavaScript lints without errors', () => {
        if (fs.existsSync(__dirname + '/js')) {
            const jsfiles = fs.readdirSync(__dirname + '/js').filter((f) => f.endsWith('.js'));

            for (let f of jsfiles) {
                expect(['js/' + f]).toHaveNoEsLintErrors();
            }
        }
    })
});
