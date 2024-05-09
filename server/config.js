'use strict';

module.exports = {
    default: ({ env }) => ({ 
        regenerateOnUpdate: false,
        forceRegenerateOnUpdate: false,
    }),
    validator: (config) => {
        if (typeof config.regenerateOnUpdate !== 'boolean') {
            throw new Error('regenerateOnUpdate has to be a boolean');
        }
        if (typeof config.forceRegenerateOnUpdate !== 'boolean') {
            throw new Error('forceRegenerateOnUpdate has to be a boolean');
        }
    },
};
