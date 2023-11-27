'use strict'

const fixRoles = async () => {

    // get all the current roles
    const roles = await strapi.query('role', 'users-permissions').find({}, [])

    // if the authenticated role has the default name, update it 
    const authenticated = roles.find(role => role.type === 'authenticated')
    if (authenticated.name !== 'Classroom Manager') await strapi.query('role', 'users-permissions').update({ id: authenticated.id }, { name: 'Classroom Manager' })

    // if the student role doesn't exist, alert the user
    const student = roles.find(role => role.type === 'student')
    if (!student) console.log('There is currently not a student role! Make sure to make one.')
}

module.exports = async () => {

    // Connect to the compile queue
    strapi.services.submission.initCompileQueue()

    // Check the student roles
    await fixRoles()

    // Fetch Lesson Modules
    const lessonModules = await strapi.query('lesson-module').find();

    for (let lessonModule of lessonModules) {
        // Find existing lesson history
        const existingHistory = await strapi.query('lesson-history').find({ lesson_module: lessonModule.id });

        if (existingHistory.length === 0) {
            try {
                // Create lesson history if none exists
                await strapi.query('lesson-history').create({
                    number: lessonModule.number,
                    name: lessonModule.name,
                    expectations: lessonModule.expectations,
                    activities: lessonModule.activities,
                    unit: lessonModule.unit,
                    standards: lessonModule.standards,
                    link: lessonModule.link,
                    lesson_modules: lessonModule.id,
                });
            } catch (error) {
                console.log(`Error creating history for lesson-module with ID: ${lessonModule.id}:`, error);
            }
        }
    }
}
