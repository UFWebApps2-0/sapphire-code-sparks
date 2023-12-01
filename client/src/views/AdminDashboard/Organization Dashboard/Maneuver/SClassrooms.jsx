import React from "react";
import { AddSVG, BackbagSVG, CodeSVG, LeftArrowSVG, MapSVG, PeopleSVG, StackSVG, TrashSVG } from "../../../../assets/SVG";
import MListView from "./MentorListView/MListView";
import SListView from "./StudentListView/SListView";
import { deleteMentor, deleteStudent, getSchool, getClassroom, deleteClassroom } from "../../../../Utils/requests";
import { message } from "antd";
import { useNavigate } from 'react-router-dom';
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
            element.classList.remove("selected")
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

    

    async function handleMentorDelete(key) {
        const res = await deleteMentor(key);
        if (res.data) {
            message.success(`Successfully Deleted Mentor ${res.data.first_name + ' ' + res.data.last_name}.`)
            props.load();
        }
        else {
            message.error(res.err);
        }
    }

    async function handleStudentDelete(key) {
        const res = await deleteStudent(key);
        if (res.data) {
            message.success(`Successfully Deleted Student ${res.data.name}.`)
            props.load();
        }
        else {
            message.error(res.err);
        }
    }
    
    async function handleClassroomDelete(key) {
        if (key == ALL) {
            for (const classroomID in props.school.classrooms) {
                const res = await deleteClassroom(parseInt(classroomID));
                if (res.data) {
                    message.success(`Successfully Deleted Classroom ${res.data.name}`)
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
                        <h1>{props.schoolID == -1 ? "Showing all Schools" : props.school.name}</h1>
                        <p><MapSVG/>In {props.organizationName}</p>
                        <p><PeopleSVG/>{Object.keys(props.school.mentors).length} Mentors</p>
                        <p><BackbagSVG/>{Object.keys(props.school.students).length} Students</p>
                        <p><StackSVG/>{Object.keys(props.school.classrooms).length} Classes</p>
                    </div>
                    <div className='action-buttons'>
                        <ClassroomCreator
                            schoolName={props.schoolID == -1 ? "All Schools" : props.school.name}
                            schoolID={props.schoolID}
                            load={props.load}
                        />

                        <MentorCreator
                            schoolName={props.schoolID == -1 ? "All Schools" : props.school.name}
                            schoolID={props.schoolID}
                            classroomID={props.classroomID}
                            load={props.load}
                        />

                        <StudentCreator
                            schoolName={props.schoolID == -1 ? "All Schools" : props.school.name}
                            schoolID={props.schoolID}
                            classroomID={props.classroomID}
                            load={props.load}
                        />


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
                                    {(props.schoolID == -1 ? <span className='school_tag'>{props.school.classrooms[classroomID].school_name}</span> : <></>)}
                                </li>
                            )
                        })}
                    </ul>
                    <div id='classroom-info' className='class-breakdown'>
                        {/* Classroom Name */}
                        <h3>{props.school == null ? "" : (props.classroomID == -1 ? "All Classrooms" : props.school.classrooms[props.classroomID].name)}</h3>


                        {/* Buttons */}
                        <div className='action-buttons'>
                            <button>
                                <CodeSVG/>
                                <span>Go to {props.schoolID == ALL ? "" : (props.classroomID == ALL ? "School's" : "Classroom's")} Gallery</span>
                            </button>
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
                            
                        </div>


                        {/* Mentor Table for Class Goes Here */}
                        <div className='mentors'>
                            <p>Mentors</p>
                            <div>
                                <MListView
                                    data={props.classroomID == -1 ? Object.values(props.school.mentors) : Object.values(props.school.classrooms[props.classroomID].mentors)} 
                                    handleDelete={handleMentorDelete}
                                    showSchools={props.schoolID == -1}
                                />
                            </div>
                        </div>


                        {/* Student Table for Class Goes Here */}
                        <div className='students'>
                            <p>Students</p>
                            <div>
                                <SListView
                                    data={props.classroomID == -1 ? Object.values(props.school.students) : Object.values(props.school.classrooms[props.classroomID].students)} 
                                    handleDelete={handleStudentDelete} 
                                    showSchools={props.schoolID == -1}
                                />
                            </div>
                        </div>
                    </div>         
                </div>
            </div>
        </div>       
    )
}