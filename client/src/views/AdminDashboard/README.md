## Purpose
I tried to clean up the code and introduce some form of standardization. Here is a garbled list of what I tweaked and added. I may have missed some things, my bad if I did!

### Notes
1. Make sure you that the administrator role has the permission to delete mentors (via back-end) so that the mentors are deleted when you're using OrganizationClassroomManagement.jsx.

### Tweaked
1. I changed the paths for two or three routes so that they would match with the pre-existing routes. If a path is not working, you probably just need to add a dash somewhere.
2. I changed the names for the "handleNavigation" functions. There would be multiple of these "handleNavigation" with "dissenting" names, if you will. So I tried to introduce some sort of standard by (for these functions specifically) starting with "navigate" and ending with what page the function would navigate to.
    - For example navigateOrganizationDash is a function that navigates the user to the path "organization-dashboard".
3. I tried to introduce consistent spacing. There are now 2 lines between each function or big parts of code. This might make the code more friendlier in terms of appearance. A spacing of line is used to convey some separation, but not as much as 2 lines. I may have gone overboard with the 1-line spacing in some areas.
4. I removed the console.log() statements that I had introduced for testing purposes. They were making the code look unorganized.
5. I tried to standardize spacing.
    - For example, id = "..." was changed to id="..."
        - Not because it was bad or anything, just so that the code was more congruent.
6. I attempted to make the HTML look more friendly in terms of spacing. I also fixed the indentation so that it properly reflected the degree of element nesting.
7. Simplified comments and removed bulkier ones, I tried to not go overboard with these.
8. Fixed indentation in general, or at least I think I did.
9. Removed some unused lines of code and import statements
10. Modified the formatting of imports in OrganizationClassroomManagement.jsx
11. Also made sure that semicolons were at the end of each statement, although they don't need to be with JS.

### Added
1. I modified OrganizationHome.jsx so that it stores all the organization's data rather than its name.
2. Gave OrganizationModeration.jsx the same prop as its brethren.
3. Added PrivateRoutes for certain routes so that users who have not logged in cannot view those routes. However, if you've logged in as someone, you will be able to see those routes although nothing will load. I'm sure there's something to be added to prevent this, but I haven't gotten to that yet.
4. I also changed the styling for some buttons.
  

---
---
---
---
---
---
## Purpose
Michael recommended that we create a "placeholder Administrator role with bare-bones functionality [for the sake of building functionality and testing]". This role is created in the back-end. Furthermore, we are tasked with creating the Organization type. To my knowledge, this is also done in the back-end. Neither of these tasks are hard to do. However, because I began working on this without informing anyone until I had already started, I am going to outline the steps that I took. **By the way, I realized I should have asked about doing this - that is my bad. I am going to hold off on doing anything else.**


## Creating an Organization Type
I am not going to be ultra-specific with these steps as it's probably unneeded since the back-end is relatively intuitive.  
1. Go to "Content-Types Builder" and click "+ Create new collection type"
2. Set the display name to "Organization"
3. Create a short text field called "name"
4. Create a relational field called "schools"
    * The big box on the right should say "School" in bold letters.
    * From the six relational types, choose the one on the farthest right.
5. Make sure to save the collection type when you're done. 

  
After creating the collection, you can create entries. If you do create entries, I would publish them. Albeit I'm not sure what publishing does.

## The Administrator
In this part, we need to (1) make the administrator role, (2) create a new entry in the User collection, (3) create an Administrator collection type, and (4) create a new entry in the Adminstrator collection.  
### Creating the Administrator Role
1. Go to "Settings" and click "Roles" of the "Users & Permissions Plugin" section
2. Click "+ Add new role"
3. Set the name to "Administrator" and add a generic description
4. Find the "Permissions" section and activate the following:
    - Application
        * Administrator: Activate "findOne" and "find"
        * Organization: Activate all the boxes
        * School: Activate all the boxes
    - Users-Permission
        * User: Activate "me"
5. Make sure to save or finish (cannot remember the button) the role when you're done
### Creating a User Entry
The User collection type is already made, we are just creating a User entry to use later on.
1. Find the "User" collection type in "Collection Types"
2. Click "+ Add New Users"
3. Set the **username**, **email**, and **password** to whatever you'd like
4. Set **confirmed** field to "ON"
5. Set the **role** to "Administrator"
6. Save and publish
### Create an Administrator Collection Type
1. Go to "Content-Types Builder" and click "+ Create new collection type"
2. Set the display name to "Administrator"
3. Add two short text fields named "first_name" and "last_name"
4. Add a relational field called "organizations"
    - Similar to the prior collection type, an Administrator can have many Organizations. Thus, from the six relational boxes, choose the one on the farthest right.
5. Add a relational field called "user"
    - An Administrator is associated with a User. This is like how a Spotify Premium account can be associated with a student account to receive a discount.
    - From the six relational boxes, choose the one on the farthest left.
6. Click the button to finish or save (cannot remember). Just make sure you don't lose your work and that the type is created.
### Creating an Administrator Entry
1. Find the "Administrator" collection type that you've just made in "Collection Types"
2. Click "+ Add New Administrators"
3. Set the **first** and **last names**
4. If you already made organizations, you can associate them with this particular Administrator. You don't have to though, you can leave this blank
5. Set the **user** to the one you just made. I think the usernames are showing here
6. Save and publish

## Ending Remarks
I added **client/src/views/AdminLogin/AdminLogin.jsx** and **client/src/views/AdminDashboard/AdminDash.jsx**. I tried to include comments wherever I changed or added something. And frankly, whatever I did could have been done in another way. Feel free to change anything you want. 

Anyway, if you're looking to figure out how the project works in a greater sense, I would recommend looking through the various project files and seeing how parts work together. It can be time- and energy-intensive, but it could help. Regardless, here are some tips if you need any:

1. The client/src/App.jsx file is where routing (for the web application) is handled.
2. If you're wondering about API routing, access the Swagger documentation through the back-end site for more information.
    - Certain roles are authorized to access certain API routes. You can modify a role's authroization in the "Permissions" section of a role. Click the "cog" to see what API route you'd be allowing a specific role to access.
    - In the documentation, you can test API routes.
3. Looking to see how pre-existing pages were implemented could help you understand how to create your own pages.
4. Speaking of pages, React components and style sheets are grouped together by the page they are used for. This can be seen in the various folders of the client/src/views directory. Likewise, I created two folders for the two pages.
    - React components that are used across various pages are defined in the client/src/components folder. The NavBar component is defined here.
        - In the NavBarConfig.json file, you can define the navigation links that appear in the navigation bar for a particular role. If you do define a navigation link, you must make sure that it has been associated with a route. The routes are defined near the top of the file.
            - I added the "Administrator" role to this file and only specified the "SignOut" link or route for said role.
5. I do not know much about requests and interacting with the API, but I know that a lot of it happens in the client/src/Utils folder.