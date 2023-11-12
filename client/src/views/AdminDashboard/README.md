# Organization Maneuver
## Rambling
The point of this commit is that when you click an organization you see its schools. Then, you can click on a school to see its classrooms. Mind blown! I assumed that this would be used inside of the "Classroom Management" tab, but I feel like it can be used anywhere. Thus, I put these files inside of the "OrganizationManeuver" folder. If anyone wants this to be used different, please let me know. By the way, my work is not perfect and there is probably many ways for it to be improved. Feel free to improve upon or change it!

## More Tasks
Assuming we use these pages, there is a lot of functionality to be implemented.
1. Add Tables
    - This had already been started, but I don't know how to do them so I left it alone.
    - I cannot remember the actions an administrator could do for a student or mentor.
1. Add School
2. Add Classroom
3. Delete School
4. Delete Classroom
5. Add Mentor
6. Add Student
7. Go to Gallery (requires the moderation tab to be minimally set up, in my opinion)
8. All Schools (Card)
    - This is where information from all schools and all classrooms within those schools would appear. I'm not sure how this is going to pan out.

## File Explanation
I'll be explaining some of the changes I made here. If the file path is abstract, it's because you can find it in the commit.

### routes.json
Got tremendous help (credit to Michael the TA) for figuring out the authorization issues. I kept getting a "401 Authentication Error" regardless of logging in, authenticating the user, and setting its permissions in Strapi. The "issue" resided in this file. The route I was trying to use ("/classrooms/:id") had requirements as defined in its corresponding ["config"]["policies"] values. The route "/classrooms/:id" had  policies "global::isClassroomManager" and "global::hasClassroom"; the administrator satisfied neither of these policies. Therefore, it was not allowed to access the route. To solve this, you can just remove the policies (or at least the strings within the array). I'd like to find a proper way of giving the administrator access to this route, but until then.
- I just tried and failed, so I don't think this will be happening, at least by me.

### OrganizationManeuver.jsx
This file defines the functional React component OrganizationManeuver that is currently used within OrganizationClassroomManagement.jsx. The component of OrganizationClassroomManagement.jsx passes in the current organization to OrganizationManeuver via props. This data is passed into the components of OrganizationSchools.jsx and SchoolClassrooms.jsx. Regardless, this page kind of toggles in between viewing the classrooms of a school and the organizations of a school. It's sort of the middleman, if you will. This is done through the 'school' React state. When it's false, it's showing all schools, when it's not, it's showing a particular school (assuming there's no error). I am going to end this paragraph.

### OrganizationSchools.jsx
This loads or renders the elements used to view the classrooms of a school. They're called "school cards". There's not much here in this file other than CSS, HTML, and some "onClick"s.

### SchoolClassrooms.jsx
Bullet points would be most effective.
- The classrooms of a school are stored in "classrooms".
- All the mentors in a school are stored in "mentors".
- All the students in a school are stored in "students".
- The data of the selected classroom is stored in "selectedClassroom".
- The ID of the selected classroom is stored in "selectedClassroomID".
    - An ID of -1 or ALL means all classrooms. A constant is defined and used in this file.
For the one and only useEffect() in this file, it's being used to load the classrooms, mentors, students, and such. You can try to parse through it, it's not incredibly difficult, but I feel like it's hard to understand why it's the way it is.
Honestly, I would just look at the file if you're looking to grasp what's going on. It's not bad or anything (except for that first React.useEffect), it's just storing data and then displaying that data to the screen. I'll add comments.

### OrganizationManeuver.css
CSS for the two .jsx files I've made. I tried to organize it, but I was never good at organizing CSS files.

### requests.js
Added a function to get a school from its ID.

### SVG.jsx
As you may see, there's a bunch of icons used in the two files. These are Bootstrap icons and I have copied and pasted their SVG thing into the document. However, I've heard it's good practice to encapsulate the SVG into a simple React component rather than having it clutter your code. This is what that file is here for. It also makes it easy to interact with SVGs, in general. Define it in this file and use it elsewhere.

## Ending Remarks
There's probably things I accidentally left out and that is again, my bad. These comments will be deleted though in the cleaning up of code and whatnot. If you have any questions, ykwtd!

Everything should work other than a couple of warnings about DOM properties and whatnot. If there are any bugs, feel free to let me know or fix them.