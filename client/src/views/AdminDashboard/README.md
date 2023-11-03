
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