const Handlebars = require('handlebars')
const fs = require("fs");

const header = fs.readFileSync(__dirname + '/../src/layout/header.html')
const footer = fs.readFileSync(__dirname + '/../src/layout/footer.html')
const events = fs.readFileSync(__dirname + '/../src/components/events.html')

module.exports = {
    loader: 'html-loader',
    options: {
        preprocessor: (content, loaderContext) => {
            let result;

            try {
                result = Handlebars.compile(content)({
                    header,
                    footer,
                    events
                });
            } catch (error) {
                loaderContext.emitError(error);

                return content;
            }

            return result;
        }
    }
}

