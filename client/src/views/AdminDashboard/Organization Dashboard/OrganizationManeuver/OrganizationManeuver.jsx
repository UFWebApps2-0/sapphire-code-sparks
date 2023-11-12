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

        // Loading school
        getSchool(id)
            .then(async (response) => {
                // Loading classrooms
                // If you individually load them by ID, there's better or more information about mentors and students within the response
                let data = response.data;
                let classroomData = [];

                for (let classroom in response.data.classrooms) {
                    let data = await getClassroom(response.data.classrooms[classroom].id);
                    classroomData.push(data);
                }

                // Adding tweaked-classroom data
                data["classrooms"] = classroomData;
                setSchool(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    // Shows the Organization's Schools
    function showAllSchools() {
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
