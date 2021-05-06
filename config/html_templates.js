const Handlebars = require('handlebars')
const fs = require("fs");

const header = fs.readFileSync(__dirname + '/../src/layout/header.html')
const footer = fs.readFileSync(__dirname + '/../src/layout/footer.html')
const data = JSON.parse(fs.readFileSync(__dirname + '/data.json'));

module.exports = {
    loader: 'html-loader',
    options: {
        preprocessor: (content, loaderContext) => {
            let result;

            try {
                result = Handlebars.compile(content)({
                    ...data,
                    header,
                    footer,
                });
            } catch (error) {
                loaderContext.emitError(error);

                return content;
            }

            return result;
        }
    }
}

