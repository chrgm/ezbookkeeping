import { defaultLanguage, allLanguages } from '../locales/index.js'

const validatorErrorCode = 200000;
const parameterizedErrors = [
    {
        localeKey: 'parameter invalid',
        regex: /^parameter "(\w+)" is invalid$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }]
    },
    {
        localeKey: 'parameter required',
        regex: /^parameter "(\w+)" is required$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }]
    },
    {
        localeKey: 'parameter too long',
        regex: /^parameter "(\w+)" must be less than (\d+)$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }, {
            field: 'length',
            localized: false
        }]
    },
    {
        localeKey: 'parameter too short',
        regex: /^parameter "(\w+)" must be more than (\d+)$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }, {
            field: 'length',
            localized: false
        }]
    },
    {
        localeKey: 'parameter length not equal',
        regex: /^parameter "(\w+)" length is not equal to (\d+)$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }, {
            field: 'length',
            localized: false
        }]
    },
    {
        localeKey: 'parameter cannot be blank',
        regex: /^parameter "(\w+)" cannot be blank$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }]
    },
    {
        localeKey: 'parameter invalid username format',
        regex: /^parameter "(\w+)" is invalid username format$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }]
    },
    {
        localeKey: 'parameter invalid email format',
        regex: /^parameter "(\w+)" is invalid email format$/,
        parameters: [{
            field: 'parameter',
            localized: true
        }]
    }
];

export function getAllLanguages() {
    return allLanguages;
}

export function getLanguage(locale) {
    return allLanguages[locale];
}

export function getDefaultLanguage() {
    if (!window || !window.navigator) {
        return defaultLanguage;
    }

    let browserLocale = window.navigator.browserLanguage || window.navigator.language;

    if (!browserLocale) {
        return defaultLanguage;
    }

    if (!allLanguages[browserLocale]) {
        const locale = getLocaleFromLanguageAlias(browserLocale);

        if (locale) {
            browserLocale = locale;
        }
    }

    if (!allLanguages[browserLocale]) {
        return defaultLanguage;
    }

    return browserLocale;
}

export function getI18nOptions() {
    return {
        locale: defaultLanguage,
        fallbackLocale: defaultLanguage,
        formatFallbackMessages: true,
        messages: (function () {
            const messages = {};

            for (let locale in allLanguages) {
                if (!Object.prototype.hasOwnProperty.call(allLanguages, locale)) {
                    continue;
                }

                const lang = allLanguages[locale];
                messages[locale] = lang.content;
            }

            return messages;
        })()
    };
}

export function getLocalizedError(error) {
    if (error.errorCode !== validatorErrorCode) {
        return {
            message: `error.${error.errorMessage}`
        };
    }

    for (let i = 0; i < parameterizedErrors.length; i++) {
        const errorInfo = parameterizedErrors[i];
        const matches = error.errorMessage.match(errorInfo.regex);

        if (matches && matches.length === errorInfo.parameters.length + 1) {
            return {
                message: `parameterizedError.${errorInfo.localeKey}`,
                parameters: errorInfo.parameters.map((param, index) => {
                    return {
                        key: param.field,
                        localized: param.localized,
                        value: matches[index + 1]
                    }
                })
            };
        }
    }

    return {
        message: error.errorMessage
    };
}

function getLocaleFromLanguageAlias(alias) {
    for (let locale in allLanguages) {
        if (!Object.prototype.hasOwnProperty.call(allLanguages, locale)) {
            continue;
        }

        const lang = allLanguages[locale];
        const aliases = lang.aliases;

        if (!aliases || aliases.length < 1) {
            continue;
        }

        for (let i = 0; i < aliases.length; i++) {
            if (aliases[i] === alias) {
                return locale;
            }
        }
    }

    return null;
}
