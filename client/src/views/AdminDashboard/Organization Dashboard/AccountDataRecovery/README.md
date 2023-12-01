---Strapi Backend Setup for Data Recovery--- 

The account data recovery feature is based on the soft deletion design pattern, where students in the "student" database are soft deleted by setting a a new boolean attribute "deleted" to true.

Steps
1. In the "Student" collection type, add a new boolean field named "deleted". Go to the advanced settings and set the default value to false and set the field as a required field. 
2. In the same collection, add another field named "time_deleted" with the data type being "datetime". 

