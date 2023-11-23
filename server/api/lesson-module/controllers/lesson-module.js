'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async update(ctx) {
    const { id } = ctx.params;

    // ensure request was not sent as formdata
    if (ctx.is('multipart'))
      return ctx.badRequest('Multipart requests are not accepted!', {
        id: 'Learning-standard.update.format.invalid',
        error: 'ValidationError',
      });

    // validate the request
    const { name, expectations, standards } = ctx.request.body;
    if (!expectations || !name || !standards)
      return ctx.badRequest('A name, standards and expectations must be provided!', {
        id: 'Learning-standard.update.body.invalid',
        error: 'ValidationError',
      });

    return await strapi.services['lesson-module'].update(
      { id },
      ctx.request.body
    );
  },
  async revert(ctx) {
    const { id } = ctx.params;
    const { historyId } = ctx.request.body;

    // Find the lessonn history for this lesson module
    const historyRecord = strapi.query('lesson-history').findOne({id : historyId });
    if (!historyRecord)
      return ctx.error(404, 'Lesson history not found');

    const updatedLesson = await strapi.query('lesson-module').update( 
      { id },
      {
        number: historyRecord.number,
        name: historyRecord.name,
        expectations: historyRecord.expectations,
        activities: historyRecord.activities,
        unit: historyRecord.unit,
        standards: historyRecord.standards,
        link: historyRecord.link,
        lesson_history: historyRecord.id,
      }
    );

    return updatedLesson;
  },
};
