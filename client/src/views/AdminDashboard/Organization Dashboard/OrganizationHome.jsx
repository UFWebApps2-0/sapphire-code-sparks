import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { getOrganization, deleteOrganization, getSchool, getClassroom, deleteMentor, deleteStudent, deleteSchool, deleteClassroom } from "../../../Utils/requests";
import { TrashSVG } from "../../../assets/SVG";
import './Organization.less';
import "./OrganizationHome.css";
import { MListView, SListView, SchoolListView,ClassroomListView} from "./OrganizationHomeTables"
import { message } from "antd";
import MentorCreator from "./MentorCreator/MentorCreator";
import StudentCreator from "./StudentCreator/StudentCreator";
import SchoolCreator from "./SchoolCreator/SchoolCreator";
import ClassroomCreator from "./ClassroomCreator/ClassroomCreator";


export default function OrganizationHome({ organizationId, organizationName }) {
    const [organization, setOrganization] = useState({});
    const navigate = useNavigate();

    const [schools, setSchools] = useState({})
    const [classrooms, setClassrooms] = useState({})
    const [mentors, setMentors] = useState({})
    const [students, setStudents] = useState({})


    const navigateOrganizationDash = () => {
        navigate('/organization-dashboard');
    }


    async function handleMentorDelete(key, reload=true) {
        const res = await deleteMentor(key);
        if (res.data) {
            message.success(`Successfully Deleted Mentor ${res.data.first_name + ' ' + res.data.last_name}.`);;
            if (reload)
                load();
        }
        else {
            message.error(res.err);
        }
    }


    async function handleMentorAllDelete() {
        for (const mentorID in mentors) {
            await handleMentorDelete(mentorID, false);
        }
        load();
    }


    async function handleStudentDelete(key, reload=true) {
        const res = await deleteStudent(key);
        if (res.data) {
            message.success(`Successfully Deleted Student ${res.data.name}.`);
            if (reload)
                load();
        }
        else {
            message.error(res.err);
        }
    }


    async function handleStudentAllDelete() {
        for (const studentID in students) {
            await handleStudentDelete(studentID, false);
        }
        load();
    }


    async function handleSchoolDelete(key, reload=true) {
        const res = await deleteSchool(key);
        if (res.data) {
            message.success(`Successfully Deleted School ${res.data.name}.`);
            if (reload)
                load();
        }
        else {
            message.error(res.err);
        }
    }


    async function handleSchoolAllDelete() {
        for (const schoolID in schools) {
            await handleSchoolDelete(schoolID, false);
        }
        load();
    }


    async function handleClassroomDelete(key, reload=true) {
        const res = await deleteClassroom(key);
        if (res.data) {
            message.success(`Successfully Deleted Classroom ${res.data.name}.`);
            if (reload)
                load();
        }
        else {
            message.error(res.err);
        }
    }


    async function handleClassroomAllDelete() {
        for (const classroomID in classrooms) {
            await handleClassroomDelete(classroomID, false);
        }
        load();
    }


    async function handleOrganizationDelete(id) {
        await deleteOrganization(id);
        navigate('/organization-dashboard');
    }


    async function load() {
        let getOrganizationResponse = await getOrganization(organizationId);

        if (getOrganizationResponse.err) {
            message.error(err.message || 'An error occurred while fetching organization details.');
            return;
        }

        // The organization, and the mentors, students, classrooms, and schools thereof
        let _organization = getOrganizationResponse.data;
        let _mentors = {};
        let _students = {};
        let _classrooms = {};
        let _schools = {};


        for (const oSchool of _organization.schools) {
            let getSchoolResponse = await getSchool(oSchool.id);
            let school = getSchoolResponse.data;
            
            let schoolMentors = {};
            let schoolStudents = {};

            // Loading students and mentors from classrooms
            for (const oClassrooms of school.classrooms) {
                let getClassroomResponse = await getClassroom(oClassrooms.id);
                let classroom = getClassroomResponse.data;

                // Iterating through each mentor of classroom
                for (const mentor of classroom.mentors) {
                    // If we've already loaded the mentor from another classroom, add the current classroom
                    if (_mentors.hasOwnProperty(mentor.id)) {
                        _mentors[mentor.id].classrooms.push(classroom.name);
                    }
                    // Add the mentor
                    else {
                        _mentors[mentor.id] = {
                            ...mentor,
                            key: mentor.id,
                            school_name: school.name,
                            classrooms: [classroom.name]
                        }
                        // This is just so I can count the # of mentors
                        schoolMentors[mentor.id] = 1;
                    }

                }

                // Iterating through each student of classroom
                for (const student of classroom.students) {
                    _students[student.id] = {
                        ...student,
                        key: student.id,
                        school_name: school.name,
                        classroom_name: classroom.name,
                    }
                    // So that the individual schools of the school table have access to the students
                    schoolStudents[student.id] = student;
                }

                // Load classrooms
                _classrooms[classroom.id] = {
                    ...classroom,
                    key: classroom.id,
                    grade: classroom.grade.name,
                    school_name: school.name,
                    number_students: classroom.students.length,
                    number_mentors: classroom.mentors.length
                }
            }

            // Loading mentors from school
            for (const mentor of school.mentors) {
                let mentorID = mentor.id;

                // If this mentor has not been added, add the mentor
                if (!schoolMentors.hasOwnProperty(mentorID))
                    schoolMentors[mentorID] = 1;

                // Add the mentor
                if (!_mentors.hasOwnProperty(mentorID)) {
                    _mentors[mentorID] = {
                        ...mentor,
                        key: mentorID,
                        school_name: school.name,
                        classrooms: []
                    }
                }
            }

            // Load the school
            _schools[school.id] = {
                ...school,
                students: schoolStudents,
                key: school.id,
                number_students: Object.values(schoolStudents).length,
                number_mentors: Object.values(schoolMentors).length,
                number_classes: school.classrooms.length
            }
        }

        // Set States
        setOrganization(_organization);
        setMentors(_mentors);
        setStudents(_students);
        setSchools(_schools);
        setClassrooms(_classrooms);
    }
    

    useEffect(() => {
        load();
    }, [organizationId]);


    return (
        <div>
            <button id='home-back-btn' onClick={navigateOrganizationDash}>
                <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
            <div id='page-header'>
                <h1>{organization.name}</h1>
            </div>
            <div id='home-content-container' class='organization-home'>

            {/* School Table */}
                <div className='table-box'>
                    <p>All Schools</p>
                    <div className="button-box">
                        <SchoolCreator
                            schoolName={"All Schools"}
                            schoolID={-1}
                            classroomID={-1}
                            load={load}
                            organizationID={organizationId}
                            organizationName={organizationName}
                        />
                        <Popconfirm
                            title={`Are you sure you want to delete all students?`}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleSchoolAllDelete()}
                        >
                            <button className='action danger'>
                                <TrashSVG/>
                                <span>Delete All Schools</span>
                            </button>
                        </Popconfirm>
                    </div>
                    <SchoolListView
                        data={Object.values(schools)} 
                        handleDelete={handleSchoolDelete}
                    />
                </div>

            {/* Classroom Table */}
                <div className='table-box'>
                    <p>All Classrooms</p>
                    <div className="button-box">
                        <ClassroomCreator
                            schoolName={"All Schools"}
                            schoolID={-1}
                            classroomID={-1}
                            load={load}
                            organizationID={organizationId}
                        />
                        <Popconfirm
                            title={`Are you sure you want to delete all classrooms?`}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleClassroomAllDelete()}
                        >
                            <button className='action danger'>
                                <TrashSVG/>
                                <span>Delete All Classrooms</span>
                            </button>
                        </Popconfirm>
                    </div>
                    <ClassroomListView
                        data={Object.values(classrooms)} 
                        handleDelete={handleClassroomDelete}
                    />
                </div>

            {/* Mentor Table */}
                <div className='table-box'>
                    <p>All Mentors</p>
                    <div className="button-box">
                        <MentorCreator
                            schoolName={"All Schools"}
                            schoolID={-1}
                            classroomID={-1}
                            load={load}
                            organizationID={organizationId}
                        />
                        <Popconfirm
                            title={`Are you sure you want to delete all mentors?`}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleMentorAllDelete()}
                        >
                            <button className='action danger'>
                                <TrashSVG/>
                                <span>Delete All Mentors</span>
                            </button>
                        </Popconfirm>
                    </div>
                    <MListView
                        data={Object.values(mentors)} 
                        handleDelete={handleMentorDelete}
                    />
                </div>

            {/* Student Table */}
                <div className='table-box'>
                    <p>All Students</p>
                    <div className="button-box">
                        <StudentCreator
                            schoolName={"All Schools"}
                            schoolID={-1}
                            classroomID={-1}
                            load={load}
                            organizationID={organizationId}
                        />
                        <Popconfirm
                            title={`Are you sure you want to delete all students?`}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleStudentAllDelete()}
                        >
                            <button className='action danger'>
                                <TrashSVG/>
                                <span>Delete All Students</span>
                            </button>
                        </Popconfirm>
                    </div>
                    <SListView
                        data={Object.values(students)} 
                        handleDelete={handleStudentDelete}
                    />
                </div>

            {/* Delete Organization Button */}
                <Popconfirm
                    title={`Are you sure you want to delete ${organization.name}?`}
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => handleOrganizationDelete(organizationId)}
                >
                    <button id='delete-organization-button'>
                        <TrashSVG/>
                        <span>Delete Organization</span>
                    </button>
                </Popconfirm>
            </div>
        </div>
    )
}