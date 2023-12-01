import React from "react";
import { BackbagSVG, CodeSVG, LeftArrowSVG, MapSVG, PeopleSVG, StackSVG, TrashSVG } from "../../../../assets/SVG";
import MListView from "./MentorListView/MListView";
import SListView from "./StudentListView/SListView";
import { deleteMentor, deleteStudent, deleteClassroom } from "../../../../Utils/requests";
import { message } from "antd";
import { deleteOrganization } from "../../../../Utils/requests";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import ClassroomCreator from "../ClassroomCreator/ClassroomCreator";
import StudentCreator from "../StudentCreator/StudentCreator";
import MentorCreator from "../MentorCreator/MentorCreator";


const ALL = -1;


export default function SClassrooms(props) {
    // Unselects all .classElement(s)
    function unselectClassElements() {
        let selectedClassElements = document.querySelectorAll(`li.classElement.selected`);
        selectedClassElements.forEach((element) => {
            element.classList.remove("selected");
        });
    }


    // Selects .classElement w ID
    function selectClassElement(classroomID) {
        let classElement = document.querySelector(`li.classElement[classroomID='${classroomID}']`);
        if (classElement != null)
            classElement.classList.add("selected");
    }


    // Selects a Classroom
    function selectClassroom(classroomID) {
        unselectClassElements();
        selectClassElement(classroomID);
        props.selectClassroom(classroomID);
    }


    // Delete Organization Button
    const handleOrganizationDelete = (organizationId) => {
        deleteOrganization(organizationId);
        navigate('/organization-dashboard');
    }


    async function handleMentorDelete(key, reload=true) {
        const res = await deleteMentor(key);
        if (res.data) {
            message.success(`Successfully Deleted Mentor ${res.data.first_name + ' ' + res.data.last_name}.`);
            if (reload)
                props.load();
        }
        else {
            message.error(res.err);
        }
    }


    async function handleStudentDelete(key, reload=true) {
        const res = await deleteStudent(key);
        if (res.data) {
            message.success(`Successfully Deleted Student ${res.data.name}.`);
            if (reload)
                props.load();
        }
        else {
            message.error(res.err);
        }
    }
    
    
    async function handleMentorAllDelete() {
        let mentors = props.classroomID == ALL ? props.school.mentors : props.school.classrooms[props.classroomID].mentors
        for (const mentorID in mentors) {
            handleMentorDelete(mentorID, false);
        }
        props.load();
    }


    async function handleStudentAllDelete() {
        let students = props.classroomID == ALL ? props.school.students : props.school.classrooms[props.classroomID].students
        for (const studentID in students) {
            handleStudentDelete(studentID, false)
        }
        props.load();
    }


    async function handleClassroomDelete(key) {
        if (key == ALL) {
            for (const classroomID in props.school.classrooms) {
                const res = await deleteClassroom(parseInt(classroomID));
                if (res.data) {
                    message.success(`Successfully Deleted Classroom ${res.data.name}`);
                    props.load();
                }
                else {
                    message.error(res.err);
                }
            }
            selectClassroom(ALL);
            return;
        }

        // Deleting 1 Classroom
        const res = await deleteClassroom(key);
        if (res.data) {
            message.success(`Successfully Deleted Classroom ${res.data.name}`);
            props.load();
            selectClassroom(ALL);
        }
        else {
            message.error(res.err);
        }
    }

    React.useEffect(() => {
        unselectClassElements(props.classroomID);
        selectClassElement(props.classroomID);
    }, [])


    return (
        <div id='school-container'>
            <div className='shadow'>
                <div id='school-header-container' className='top'>
                    <div id='school-header'>
                        <button onClick={() => props.goBack()} id='go-back-btn'>
                            <LeftArrowSVG/>
                            <span>Go Back to Schools</span>
                        </button>
                        <h1>{props.schoolID == ALL ? "Showing all Schools" : props.school.name}</h1>
                        <p><MapSVG/>In {props.organizationName}</p>
                        <p><PeopleSVG/>{Object.keys(props.school.mentors).length} Mentors</p>
                        <p><BackbagSVG/>{Object.keys(props.school.students).length} Students</p>
                        <p><StackSVG/>{Object.keys(props.school.classrooms).length} Classes</p>
                    </div>
                    <div className='action-buttons'>
                        {/* Create a Classroom */}
                        <ClassroomCreator
                            schoolName={props.schoolID == ALL ? "All Schools" : props.school.name}
                            schoolID={props.schoolID}
                            load={props.load}
                        />


                        {/* Create a Mentor */}
                        <MentorCreator
                            schoolName={props.schoolID == ALL ? "All Schools" : props.school.name}
                            schoolID={props.schoolID}
                            classroomID={props.classroomID}
                            load={props.load}
                            organizationID={props.organizationID} 
                            classroomName={props.classroomID != ALL && props.school.classrooms[props.classroomID].name || ""}
                        />


                        {/* Create a Student */}
                        <StudentCreator
                            schoolName={props.schoolID == ALL ? "All Schools" : props.school.name}
                            schoolID={props.schoolID}
                            classroomID={ALL}
                            load={props.load}
                            organizationID={props.organizationID} 
                        />


                        {/* Delete School(s) */}
                        <Popconfirm
                            title={`Are you sure you want to delete ${props.schoolID == ALL ? `all schools in ${props.organizationName}` : props.school.name}?`}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => props.handleSchoolDelete(props.schoolID)}
                        >
                            <button id='delete-school-btn'>
                                <TrashSVG/>
                                <span>{`Delete ${props.schoolID == ALL ? "All Schools" : "School"}`}</span>
                            </button>
                        </Popconfirm>
                        

                        {/* Delete Organization */}
                        <Popconfirm
                            title={`Are you sure you want to delete ${props.organizationName}?`}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleOrganizationDelete(props.organizationID)}
                        >
                            <button id='delete-school-btn'>
                                <TrashSVG/>
                                <span>Delete Organization</span>
                            </button>
                        </Popconfirm>
                    </div>
                </div>        
                <div id='classroom-container'className='classes'>
                    <ul id='classroomMenu'>


                        {/* Default Class Element */}
                        <li 
                            className='classElement'
                            classroomid={ALL} 
                            key={ALL} 
                            onClick={() => selectClassroom(ALL)}>
                            <span>All Classrooms</span>
                        </li>


                        {/* Generated Class Elements */}
                        {Object.keys(props.school.classrooms).map((classroomID) => {
                            return (
                                <li 
                                    className='classElement' 
                                    classroomid={classroomID} 
                                    key={classroomID} 
                                    onClick={() => selectClassroom(classroomID)}>
                                    <span>{props.school.classrooms[classroomID].name}</span>
                                    {(props.schoolID == ALL ? <span className='school_tag'>{props.school.classrooms[classroomID].school_name}</span> : <></>)}
                                </li>
                            )
                        })}
                    </ul>
                    <div id='classroom-info' className='class-breakdown'>
                        {/* Classroom Name */}
                        <h3>{props.school == null ? "" : (props.classroomID == ALL ? "All Classrooms" : props.school.classrooms[props.classroomID].name)}</h3>


                        {/* Buttons */}
                        <div className='action-buttons'>
                            <button>
                                <CodeSVG/>
                                <span>Go to {props.schoolID == ALL ? "" : (props.classroomID == ALL ? "School's" : "Classroom's")} Gallery</span>
                            </button>


                            {/* Delete Classroom(s) */}
                            <Popconfirm
                                title={`Are you sure you want to delete ${props.classroomID == ALL ? "all classrooms" : props.school.classrooms[props.classroomID].name}?`}
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onConfirm={() => handleClassroomDelete(props.classroomID)}
                            >
                                <button id='delete-classroom-btn'>
                                    <TrashSVG/>
                                    <span>Delete {props.classroomID == ALL ? "All Classrooms" : "Classroom"}</span>
                                </button>
                            </Popconfirm>


                            {/* Add Student to Classroom */}
                            {props.classroomID != ALL && 
                                <StudentCreator
                                    schoolName={props.schoolID == ALL ? "All Schools" : props.school.name}
                                    schoolID={props.schoolID}
                                    classroomID={props.classroomID}
                                    load={props.load}
                                    organizationID={props.organizationID}
                                    classroomName={props.school.classrooms[props.classroomID].name || ""}
                                />
                            }


                            {/* Add Mentor to Classroom */}
                            {props.classroomID != ALL &&
                                <MentorCreator
                                    schoolName={props.schoolID == ALL ? "All Schools" : props.school.name}
                                    schoolID={props.schoolID}
                                    classroomID={props.classroomID}
                                    load={props.load}
                                    organizationID={props.organizationID} 
                                    classroomName={props.school.classrooms[props.classroomID].name || ""}
                                />
                            }


                            {/* Delete All Mentors */}
                            <Popconfirm
                                title={`Are you sure you want to delete the mentors in ${props.classroomID == ALL ? "all classrooms" : props.school.classrooms[props.classroomID].name}?`}
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onConfirm={() => handleMentorAllDelete()}
                            >
                                <button id='delete-school-btn'>
                                    <TrashSVG/>
                                    <span>Delete Mentors</span>
                                </button>
                            </Popconfirm>


                            {/* Delete All Students */}
                            <Popconfirm
                                title={`Are you sure you want to delete the students in ${props.classroomID == ALL ? "all classrooms" : props.school.classrooms[props.classroomID].name}?`}
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onConfirm={() => handleStudentAllDelete()}
                            >
                                <button id='delete-school-btn'>
                                    <TrashSVG/>
                                    <span>Delete Students</span>
                                </button>
                            </Popconfirm>
                        </div>


                        {/* Mentor Table for Class Goes Here */}
                        <div className='classroom-table mentors'>
                            <p>Mentors</p>
                            <div>
                                <MListView
                                    data={props.classroomID == ALL ? Object.values(props.school.mentors) : Object.values(props.school.classrooms[props.classroomID].mentors)} 
                                    handleDelete={handleMentorDelete}
                                    showSchools={props.schoolID == ALL}
                                />
                            </div>
                        </div>


                        {/* Student Table for Class Goes Here */}
                        <div className='classroom-table students'>
                            <p>Students</p>
                            <div>
                                <SListView
                                    data={props.classroomID == ALL ? Object.values(props.school.students) : Object.values(props.school.classrooms[props.classroomID].students)} 
                                    handleDelete={handleStudentDelete} 
                                    showSchools={props.schoolID == ALL}
                                />
                            </div>
                        </div>
                    </div>         
                </div>
            </div>
        </div>       
    )
}