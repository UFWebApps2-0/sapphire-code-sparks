---Strapi Backend Setup for Data Recovery--- 

The account data recovery feature is based on the soft deletion design pattern, where students in the "student" database are soft deleted by setting a a new boolean attribute "deleted" to true.

Steps
1. In the "Student" collection type, add a new boolean field named "deleted". Go to the advanced settings and set the default value to false and set the field as a required field. 
2. In the same collection, add another field named "time_deleted" with the data type being "datetime". 

3. In the "Administrator" role, go to Permissions -> Content-Manager -> Collection-Types, and check the "update" box so that the recoverStudent API request works. 


Tasks to do: 
-Permanently delete the soft deleted accounts after 30 days of deletion 
    --I wrote almost fully functional code for scheduling permanent account deletion every month in server/config/functions/cron.js and server/config/srever.js, but couldn't figure out how to fix the error in cron.js where the imported API requests for deleteStudent and getAllStudents from requests.js could not be found. 
-Implement account recovery for teachers 