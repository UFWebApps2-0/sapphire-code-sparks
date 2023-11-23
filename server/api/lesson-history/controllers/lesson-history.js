'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async onCreate(ctx) {
        const currentLesson = await strapi.services['lesson-module'].create(ctx.request.body);

        await strapi.query('lesson-history').create({
            number: currentLesson.number,
            name: currentLesson.name,
            expectations: currentLesson.expectations,
            activities: currentLesson.activities,
            unit: currentLesson.unit,
            standards: currentLesson.standards,
            link: currentLesson.link,
            lesson_module: lesson_module.id
        });

        return currentLesson;
    },
    async onUpdate(ctx) {
        const { id } = ctx.params;
        const currentLesson = await strapi.query('lesson-module').findOne({ id });

        await strapi.query('lesson-history').update({
            number: currentLesson.number,
            name: currentLesson.name,
            expectations: currentLesson.expectations,
            activities: currentLesson.activities,
            unit: currentLesson.unit,
            standards: currentLesson.standards,
            link: currentLesson.link,
            lesson_modules: currentLesson.id,
        });
    },
    async revertLesson(params, data) {

    }
};
