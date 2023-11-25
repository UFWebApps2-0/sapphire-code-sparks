import React from "react";
import { useState } from "react";
import { getClassroom, getSchool } from "../../../../Utils/requests.js";
import OSchools from "./OSchools.jsx";
import SClassrooms from "./SClassrooms.jsx";


export function Maneuver(props) {
    const [schools, setSchools] = useState(null);
    const [selectedSchoolID, setSelectedSchoolID] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState(null);


    function loadSchools() {
        if (props.organization.schools == null)
            return;

        let schoolsData = {};
        props.organization.schools.forEach((school) => {
            getSchool(school.id)
                .then(async (response) => {
                    let schoolData = response.data;
                    let schoolClassroomsData = [];
                    
                    for (const index in response.data.classrooms) {
                        let classroomID = response.data.classrooms[index].id;
                        let classroomData = await getClassroom(classroomID);
                        schoolClassroomsData.push(classroomData.data);
                    }

                    schoolData["classrooms"] = schoolClassroomsData;
                    schoolsData[school.id] = schoolData;
                })
                .catch((err) => {
                    console.log(err);
                })
        });
        setSchools(schoolsData);
    }


    function unselectSchool() {
        setSelectedSchool(null);
        setSelectedSchoolID(null);
    }


    function selectSchool(id) {
        if (id === -1) {
            setSelectedSchoolID(-1);
            setSelectedSchool(schools);
        }
        else {
            setSelectedSchoolID(id);
            let oSchool = {};
            oSchool[id] = schools[id];
            setSelectedSchool(oSchool);
        }
    }


    React.useEffect(() => {
        loadSchools();
    }, [props]);


    return (
        (selectedSchool == null) ?
            <OSchools
                selectSchool={selectSchool}
                organizationName={props.organization.name}
                schools={props.organization.schools}
            />
            :
            <SClassrooms
                goBack={unselectSchool}
                organizationName={props.organization.name}
                school={selectedSchool}
                schoolID={selectedSchoolID} 
                updateOrganization={props.updateOrganization}
            />
    )

}