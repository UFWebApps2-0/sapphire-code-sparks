import React from "react";
import { Table } from 'antd';
import { AddSVG, BackbagSVG, CodeSVG, LeftArrowSVG, MapSVG, PeopleSVG, StackSVG, TrashSVG } from "../../../../assets/SVG";
import MListView from "./MentorListView/MListView";
import SListView from "./StudentListView/SListView";
import { deleteMentor, deleteStudent } from "../../../../Utils/requests";
import { message } from "antd";

const ALL = -1;

export default function SClassrooms(props) {
    const [classrooms, setClassrooms] = React.useState({});
    const [mentors, setMentors] = React.useState([]);
    const [students, setStudents] = React.useState([]);
    const [selectedClassroom, setSelectedClassroom] = React.useState({
        name: "",
        mentors: [],
        students: [],
    });
    const [selectedClassroomID, setSelectedClassroomID] = React.useState(ALL);


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


    // Selects a Classroom (Front-End and "Back"-End)
    function selectClassroom(classroomID, qMentors = null, qStudents = null) {
        // Front-End: Toggling .selected
        unselectClassElements();
        selectClassElement(classroomID);

        // Back-End: Setting the selected classroom
        setSelectedClassroomID(classroomID);

        if (classroomID == ALL) {
            setSelectedClassroom({
                name: "All Classrooms",
                mentors: qMentors == null ? mentors : qMentors,
                students: qStudents == null ? students : qStudents
            });
        }
        else {
            setSelectedClassroom(classrooms[classroomID]);
        }
    }


    // Load Classrooms
    function loadClassrooms() {
        let mentorsData = {};
        let studentsData = {};
        let classroomsData = {};

        for (const schoolID in props.school) {
            const school = props.school[schoolID];

            school.classrooms.forEach((classroom) => {
                let classroomStudents = {};
                let classroomMentors = {};

                if (classroom.students != null) {
                    classroom.students.forEach((student) => {
                        studentsData[student.id] = {
                            ...student,
                            key: student.id,
                            classroom_name: classroom.name,
                            organization_name: props.organizationName,
                            school_name: school.name
                        };
                        classroomStudents[student.id] = studentsData[student.id];
                    });
                }

                if (classroom.mentors != null) {
                    classroom.mentors.forEach((mentor) => {
                        mentorsData[mentor.id] = {
                            ...mentor, 
                            name: `${mentor.first_name} ${mentor.last_name}`,
                            classroom_id: classroom.id,
                            classroom_name: classroom.name,
                            organization_name: props.organizationName,
                            key: mentor.id,
                            school_name: school.name
                        }
                        classroomMentors[mentor.id] = mentorsData[mentor.id];
                    });
                }
                    // Also, filtering out some currently unneeded information like "last_logged_in"
                    // Anyway, stores this student in the object for all students (studentsData)
                    studentsData[student.id] = {
                        studentID: student.id,
                        name: student.name,
                        character: student.character,
                        last_logged_in: student.last_logged_in,
                        classroom: student.classroom
                    };

                classroomsData[classroom.id] = {
                    ...classroom,
                    classroom_id: classroom.id,
                    code: classroom.code,
                    name: classroom.name,
                    school_id: classroom.school,
                    school_name: classroom.school.name,
                    mentors: classroomMentors,
                    students: classroomStudents
                };
            })
        }

        selectClassroom(ALL, mentorsData, studentsData);
        setClassrooms(classroomsData);
        setStudents(studentsData);
        setMentors(mentorsData);
    }


    async function handleMentorDelete(key) {
        const res = await deleteMentor(key);
        if (res.data) {
            message.success(`Successfully Deleted Mentor ${res.data.first_name + ' ' + res.data.last_name}.`)

            let mentorData = {...mentors};
            delete mentorData[key];
    
            let classroomData = {...classrooms}
            for (const classroomID in classroomData) {
                let classroom = classroomData[classroomID];
                delete classroom.mentors[key];
            }
    
            setClassrooms(classroomData);
            setMentors(mentorData);

            props.updateOrganization();
        }
        else {
            message.error(res.err);
        }
    }


    async function handleStudentDelete(key) {
        const res = await deleteStudent(key);
        if (res.data) {
            message.success(`Successfully Deleted Student ${res.data.name}.`)

            let studentData = {...students};
            delete studentData[key];
    
            let classroomData = {...classrooms}
            for (const classroomID in classroomData) {
                let classroom = classroomData[classroomID];
                delete classroom.students[key];
            }
    
            setClassrooms(classroomData);
            setStudents(studentData);

            props.updateOrganization();
        }
        else {
            message.error(res.err);
        }
    }
    

    React.useEffect(() => {
        selectClassroom(selectedClassroomID);
    }, [mentors])


    React.useEffect(() => {
        loadClassrooms();
    }, [])


    React.useEffect(() => {
        // Error-Checking
        console.log(classrooms);
        console.log(selectedClassroom);
    }, [selectedClassroom])


    React.useEffect(() => {
        selectClassroom(selectedClassroomID);
    }, [classrooms])

    // Function to format the last_logged_in date for students
    const getFormattedDate = (value, locale = 'en-US') => {
        if(value == null) return "Never";
        const date = new Date(value);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    }

    const mentorColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            align: 'left',
            sorter: {
                compare: (a, b) => (a.name < b.name ? -1 : 1),
            },
        },
        {
            title: 'Last logged in',
            dataIndex: 'last_logged_in',
            key: 'last_logged_in',
            width: '22.5%',
            align: 'right',
        },
    ];

    const studentColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
            align: 'left',
            sorter: {
                compare: (a, b) => (a.name < b.name ? -1 : 1),
            },
        },
        {
            title: 'Animal',
            dataIndex: 'character',
            key: 'character',
            width: '1%',
            align: 'center',
        },
        {
            title: 'Last logged in',
            dataIndex: 'last_logged_in',
            key: 'last_logged_in',
            width: '22.5%',
            align: 'right',
            render: (value) => getFormattedDate(value),
        }
    ];


    return (
        <div id='school-container'>
            <div className='shadow'>
                <div id='school-header-container' className='top'>
                    <div id='school-header'>
                        <button onClick={() => props.goBack()} id='go-back-btn'>
                            <LeftArrowSVG/>
                            <span>Go Back to Schools</span>
                        </button>
                        <h1>{props.schoolID == -1 ? "Showing all Schools" : Object.values(props.school)[0].name}</h1>
                        <p><MapSVG/>In {props.organizationName}</p>
                        <p><PeopleSVG/>{Object.keys(mentors).length} Mentors</p>
                        <p><BackbagSVG/>{Object.keys(students).length} Students</p>
                        <p><StackSVG/>{Object.keys(classrooms).length} Classes</p>
                    </div>
                    <div className='action-buttons'>
                        <button>
                            <AddSVG/>
                            <span>Add Classroom</span>
                        </button>
                        <button>
                            <AddSVG/>
                            <span>Add Mentor</span>
                        </button>
                        <button>
                            <AddSVG/>
                            <span>Add Student</span>
                        </button>
                        <button id='delete-school-btn'>
                            <TrashSVG/>
                            <span>Delete School</span>
                        </button>
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
                        {Object.keys(classrooms).map((classroomID) => {
                            return (
                                <li 
                                    className='classElement' 
                                    classroomid={classroomID} 
                                    key={classroomID} 
                                    onClick={() => selectClassroom(classroomID)}>
                                    <span>{classrooms[classroomID].name}</span>
                                    {(Object.keys(props.school).length > 1 ? <span className='school_tag'>{classrooms[classroomID].school_name}</span> : <></>)}
                                </li>
                            )
                        })}
                    </ul>
                    <div id='classroom-info' className='class-breakdown'>
                        {/* Classroom Name */}
                        <h3>{selectedClassroom == null ? "" : selectedClassroom.name}</h3>

                        {/* Buttons */}
                        <div className='action-buttons'>
                            <button>
                                <CodeSVG/>
                                <span>Go to {selectedClassroomID == ALL ? "" : "Classroom's"} Gallery</span>
                            </button>
                            <button id='delete-classroom-btn'>
                                <TrashSVG/>
                                <span>Delete {selectedClassroomID == ALL ? "All Classrooms" : "Classroom"}</span>
                            </button>
                        </div>

                        {/* Mentor Table for Class Goes Here */}
                        <div className='mentors'>
                            <p>Mentors</p>
                            <div>
                                <MListView
                                    data={selectedClassroom == null ? null : Object.values(selectedClassroom.mentors)} 
                                    handleDelete={handleMentorDelete}
                                    showSchools={props.schoolID == -1}
                                />
                            <div
                            style={{ width: '750px'}}
                            >
                                <Table
                                    columns = {mentorColumns}
                                    dataSource = {Object.values(selectedClassroom.mentors)}
                                    pagination={{
                                        pageSizeOptions: ['10', '20', '30'],
                                        showSizeChanger: true,
                                    }}
                                    >
                                </Table>
                            </div>
                        </div>

                        {/* Student Table for Class Goes Here */}
                        <div className='students'>
                            <p>Students</p>
                            <div>
                                <SListView
                                    data={selectedClassroom == null ? null : Object.values(selectedClassroom.students)} 
                                    handleDelete={handleStudentDelete} 
                                    showSchools={props.schoolID == -1}
                                />
                                <Table
                                    columns = {studentColumns}
                                    dataSource = {Object.values(selectedClassroom.students)}
                                    pagination={{
                                        pageSizeOptions: ['10', '20', '30'],
                                        showSizeChanger: true,
                                    }}
                                    >
                                </Table>
                            </div>
                        </div>
                    </div>         
                </div>
            </div>
        </div>       
    )
}