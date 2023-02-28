const Mustache = require('mustache')
const configuration = require('../config/config')
const Errors = require('../helpers/errors');
const Logger = require("winston");
// const Handlebars = require("handlebars");
const fs = require('fs');
const { logger } = require('handlebars');



exports.getRetenuePrint = async (data) => {
    try {
        if (data) {
            //using Mustache

            let template = fs.readFileSync(configuration.template.template, { encoding: 'utf8' });

            if (template) {
                if (data.cin_benef) {
                    for (let i = 0; i < data.cin_benef.length; i++) {
                        data[`cin_benef_${i}`] = data.cin_benef[i]
                    }
                }

                const filledTemplate = Mustache.render(template, data)

                return filledTemplate
            } else {
                throw new Errors.NotFoundError('template not found')
            }
        } else {
            throw new Errors.InvalidDataError('no data provided')
        }
    } catch (error) {
        Logger.error(error)
        console.log(error)
        throw new Errors.InvalidDataError(error)
    }
}