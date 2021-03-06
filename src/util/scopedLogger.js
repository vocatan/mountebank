'use strict';

var inherit = require('./inherit');

function wrap (wrappedLogger, logger) {
    ['debug', 'info', 'warn', 'error'].forEach(function (level) {
        wrappedLogger[level] = function () {
            var args = Array.prototype.slice.call(arguments);
            args[0] = wrappedLogger.scopePrefix + args[0];
            logger[level].apply(logger, args);
        };
    });
}
function create (logger, scope) {

    function formatScope (scopeText) {
        return scopeText.indexOf('[') === 0 ? scopeText : '[' + scopeText + '] ';
    }

    var wrappedLogger = inherit.from(logger, {
            scopePrefix: formatScope(scope),
            withScope: function (nestedScopePrefix) {
                return create(logger, wrappedLogger.scopePrefix + nestedScopePrefix + ' ');
            },
            changeScope: function (newScope) {
                wrappedLogger.scopePrefix = formatScope(newScope);
                wrap(wrappedLogger, logger);
            }
        });

    wrap(wrappedLogger, logger);
    return wrappedLogger;
}

module.exports = {
    create: create
};
