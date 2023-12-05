'use strict';

/**
 * google-classroom-api.js controller
 *
 * @description: A set of functions called "actions" of the `google-classroom-api` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  list: async (ctx) => {
    const code = ctx.request.query.code

    const googleClassroomClient = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getGoogleClassroomClient(code);

    const courses = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getCourses(googleClassroomClient);

    ctx.send({
      message: 'ok',
      courses: courses.data.courses
    });
  },

  get: async (ctx) => {
    const code = ctx.request.query.code;
    const id = ctx.params.id;

    const googleClassroomClient = await strapi
      .plugins['google-classroom-api']
      .services.classroom
      .getGoogleClassroomClient(code);

    const course = await googleClassroomClient.courses.get({
      id
    })
    console.log(course)
    ctx.send({
      message: 'ok',
      course: course.data
    })
  },

  create: async (ctx) => {
    const { name, school, grade, enrollmentCode, mentorObj } = ctx.request.body;
    ctx.request.body.code = enrollmentCode;

    // Set mentor body
    ctx.request.body.first_name = mentorObj.firstName;
    ctx.request.body.last_name = mentorObj.lastName;
    ctx.request.body.user = mentorObj.user;
    console.log(ctx.request.body)

    try {
      // Check if classroom exists
      let classroom = await strapi.query('classroom').findOne({name: name})
      const classroomExists = classroom !== null;
      if(classroomExists) {
      }
      classroom = await strapi.services.classroom.create(ctx.request.body)

      ctx.request.body.classrooms = [classroom]


      // Assign user as mentor
      let mentor = await strapi.query('mentor').findOne({ user: mentorObj.user });
      const mentorExist = mentor !== null;
      if (!mentorExist) {
        mentor = await strapi.services.mentor.create(ctx.request.body)
      }
      else {
        const mentorClassrooms = mentor.classrooms;
        mentorClassrooms.push(classroom);
        console.log(mentorClassrooms)
        await strapi.query('mentor').update({id: mentor.id}, {classrooms: mentorClassrooms});
      }




      ctx.send({
        message: 'ok',
        // body: sanitizeEntity(classroom, { model: strapi.models.classroom })
      })
    }
    catch (err) {
      console.log(err)
    }
    // return sanitizeEntity(classroom, { model: strapi.models.classroom });

  }

};
