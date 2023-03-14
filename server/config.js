'use strict';

module.exports = {
    default: ({ env }) => ({ regenerateOnUpdate: false }),
    validator: (config) => {
        if (typeof config.regenerateOnUpdate !== 'boolean') {
            throw new Error('regenerateOnUpdate has to be a boolean');
        }
    },
};
