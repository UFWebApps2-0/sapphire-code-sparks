//const { getAllStudents, deleteStudent } = require('../../../../client/src/Utils/requests');

'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }

  //deletes accounts in students collection that were soft deleted more than 30 days ago 
  /*
  hardDeleteStudentAccounts: { 
    task: ({ strapi }) => {
      //get all students
      getAllStudents().then(async (students) => {
        const deletedStudents = (students.data) 
        deletedStudents.forEach((student) => {
          //check if account deleted  
          if (student.deleted === true)   {
            if (student.time_deleted !== null)   {
              //get current time 
              const currentTime = new Date(); 
              //get time when account was deleted
              const deletedTime = new Date(student.time_deleted);
              //get time elapsed in milliseconds  
              const diff = currentTime - deletedTime; 
              //get time elapsed in days 
              const daysDiff = diff / (1000 * 60 * 60 * 24); 
              if (daysDiff >= 30) {
                deleteStudent(student.id); 
              }
            } 
          }
        })
      })
    },
    options: { 
      //run operation on the first day of every month
      rule: "0 0 0 1 * *",
    }
  }*/
};
