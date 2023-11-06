'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#life-cycle-callbacks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async beforeUpdate(params, data) {
            const currentLesson = await strapi.query('lesson-module').findOne({id: params.id});

            await strapi.query('lesson-history').create({
                number: currentLesson.number,
                name: currentLesson.name,
                expectations: currentLesson.expectations,
                activities: currentLesson.activities,
                unit: currentLesson.unit,
                standards: currentLesson.standards,
                link: currentLesson.link
            });
        },
    },
};
