import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import { getClassroom, getSchool, getOrganization, deleteSchool } from "../../../../Utils/requests.js";
import OSchools from "./OSchools.jsx";
import SClassrooms from "./SClassrooms.jsx";
import { useNavigate } from 'react-router-dom';
import { message } from "antd";


const ALL = -1;

export function Maneuver({organizationID}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sID = searchParams.get('sID');
    const cID = searchParams.get('cID');

    const [organization, setOrganization] = useState({})

    const [aggregateData, setAggregateData] = useState({});
    
    const [currSchool, setCurrSchool] = useState(null);
    const [currSchoolID, setCurrSchoolID] = useState(null);
    const [currClassroomID, setCurrClassroomID] = useState(null);

    const navigate = useNavigate();

    async function load() {
        let oResponse = await getOrganization(organizationID);
        let organization = oResponse.data;

        let organizationSchools = {};

        for (const skool of organization.schools) {
            let sResponse = await getSchool(skool.id);

            let school = sResponse.data;

            let schoolClassroomsData = [];

            for (const index in sResponse.data.classrooms) {
                let cResponse = await getClassroom(sResponse.data.classrooms[index].id);
                schoolClassroomsData.push(cResponse.data);
            }
            school["classrooms"] = schoolClassroomsData;
            organizationSchools[skool.id] = school;
        }

        let organizationMentors = {};
        let organizationStudents = {};
        let organizationClassrooms = {};

        for (const schoolID in organizationSchools) {
            let schoolMentors = {};
            let schoolStudents = {};
            let schoolClassrooms = {};

            const school = organizationSchools[schoolID];
            
            for (const classroom of school.classrooms) {
                let classroomStudents = {};
                let classroomMentors = {};

                if (classroom.students) {
                    for (const student of classroom.students) {
                        schoolStudents[student.id] = {
                            ...student,
                            key: student.id,
                            classroom_name: classroom.name,
                            organization_name: organization.name,
                            last_logged_in: student.last_logged_in,
                            school_name: school.name
                        };
                        classroomStudents[student.id] = schoolStudents[student.id];
                    }
                }

                if (classroom.mentors) {
                    for (const mentor of classroom.mentors) {
                        schoolMentors[mentor.id] = {
                            ...mentor, 
                            name: `${mentor.first_name} ${mentor.last_name}`,
                            classroom_id: classroom.id,
                            classroom_name: classroom.name,
                            organization_name: organization.name,
                            key: mentor.id,
                            school_name: school.name
                        };
                        classroomMentors[mentor.id] = schoolMentors[mentor.id];
                    }
                }

                schoolClassrooms[classroom.id] = {
                    ...classroom,
                    classroom_id: classroom.id,
                    code: classroom.code,
                    name: classroom.name,
                    school_id: classroom.school,
                    school_name: classroom.school.name,
                    mentors: classroomMentors,
                    students: classroomStudents
                };

                organizationMentors[schoolID] = schoolMentors;
                organizationStudents[schoolID] = schoolStudents;
                organizationClassrooms[schoolID] = schoolClassrooms;
            }
        }

        setOrganization(organization);

        setAggregateData({
            schools: organizationSchools,
            schoolMentors: organizationMentors,
            schoolStudents: organizationStudents,
            schoolClassrooms: organizationClassrooms
        });
    }
    

    function allMentors() {
        let allMentors = {}
        Object.values(aggregateData.schoolMentors).forEach((mentors) => {
            Object.values(mentors).forEach((mentor) => {
                allMentors[mentor.id] = mentor;
            })
        })
        return allMentors;
    }


    function allStudents() {
        let allStudents = {}
        Object.values(aggregateData.schoolStudents).forEach((students) => {
            Object.values(students).forEach((student) => {
                allStudents[student.id] = student;
            })
        })
        return allStudents;
    }


    function allClassrooms() {
        let allClassrooms = {};
        Object.values(aggregateData.schoolClassrooms).forEach((classrooms) => {
            Object.values(classrooms).forEach((classroom) => {
                allClassrooms[classroom.id] = classroom;
            })
        })
        return allClassrooms;
    }


    async function handleSchoolDelete(key) {
        if (key == ALL) {
            for (const schoolID in aggregateData.schools) {
                const res = await deleteSchool(parseInt(schoolID));
                if (res.data) {
                    message.success(`Successfully Deleted School ${res.data.name}`)
                }
                else {
                    message.error(res.err);
                }
            }
        }
        else {
            const res = await deleteSchool(key);
            if (res.data) {
                message.success(`Successfully Deleted School ${res.data.name}`)
            }
            else {
                message.error(res.err);
            }
        }
        load();
        unselectSchool();
    }

    function unselectSchool() {
        setCurrSchool(null);
        setCurrSchoolID(null, null);
        setSearchParams({tab: 'classroom_management'})
    }


    function selectSchool(schoolID, classroomID = null) {
        setCurrSchoolID(schoolID);
        setCurrClassroomID(classroomID);

        if (schoolID == ALL) {
            let abllMentors = allMentors();
            let abllStudents = allStudents();
            let abllClassrooms = allClassrooms();

            setCurrSchool({
                name: "All",
                mentors: abllMentors || {},
                students: abllStudents || {},
                classrooms: abllClassrooms || {}
            });
        }
        else if (schoolID)
            setCurrSchool({
                name: aggregateData.schools[schoolID].name,
                mentors: aggregateData.schoolMentors[schoolID] || {},
                students: aggregateData.schoolStudents[schoolID] || {},
                classrooms: aggregateData.schoolClassrooms[schoolID] || {}
            });

        
        if (classroomID)
            setSearchParams({tab: 'classroom_management', "sID": schoolID, "cID": classroomID})
        else
            setSearchParams({tab: 'classroom_management', "sID":schoolID})
    }


    function selectClassroom(classroomID) {
        setCurrClassroomID(classroomID);
        setSearchParams({tab: 'classroom_management', "sID": currSchoolID, "cID": classroomID})
    }
    
    useEffect(() => {
        load()
    }, [])


    useEffect(() => {
        if (Object.values(aggregateData).length == 0) return

        if (sID && !cID) {
            selectSchool(sID, ALL);
        }
        else if (sID && cID) {
            selectSchool(sID, cID)
        }
    }, [aggregateData])

    return (
        
        (currSchoolID == null) ?
            <OSchools
                selectSchool={selectSchool}

                organizationID={organizationID}
                organizationName={organization.name}
                
                schools={organization.schools}

                load={load}
            />
            :
            <SClassrooms
                goBack={unselectSchool}
                selectClassroom={selectClassroom}

                organizationID={organizationID}
                organizationName={organization.name}

                school={currSchool}
                schoolID={currSchoolID} 
                classroomID={currClassroomID}

                handleSchoolDelete={handleSchoolDelete}

                load={load}
            />
    )
}