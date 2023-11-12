import React from "react";
import { useState } from "react";
import "./OrganizationManeuver.css"
import { getClassroom, getSchool } from "../../../../Utils/requests.js";
import SchoolClassrooms from "./SchoolClassrooms.jsx"
import { OrganizationSchools } from "./OrganizationSchools.jsx";


export function OrganizationManeuver(props) {
    const [school, setSchool] = useState(false);

    
    // Shows the Selected School
    function showSchool(id) {

        // We load the school with the matching ID
        getSchool(id)
            .then(async (response) => {
                // The response will return the school in the form of an object.
                // This object will have a key for "classrooms". However, the value for this key is a bit sparse in terms of information.
                // Thus, to get better/more information, you need to load the classrooms by ID.
                // Because we have the classroom ID in the response, we can use that
                let data = response.data;
                let classroomData = [];

                for (let classroom in response.data.classrooms) {
                    let data = await getClassroom(response.data.classrooms[classroom].id);
                    classroomData.push(data);
                }

                // Updating the data with the more detailed classroom data
                data["classrooms"] = classroomData;

                // Set school
                setSchool(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    // Shows the Organization's Schools
    function showAllSchools() {
        // This will stop a singular school from showing
        setSchool(false);
    }


    return (
        (!school) ? 
            <OrganizationSchools 
                showSchool={showSchool} 
                schools={props.organization[0].schools} 
                organizationName={props.organization[0].name}
            /> : 
            <SchoolClassrooms 
                goBack={showAllSchools} 
                school={school}
            />
    )
}
