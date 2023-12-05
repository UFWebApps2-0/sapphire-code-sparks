import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms, getLessonModule, getAllClassrooms, createClassroom } from '../../../Utils/requests';
import { Tabs, message, Table, Popconfirm } from 'antd';
import './Dashboard.less';
import DashboardDisplayCodeModal from './DashboardDisplayCodeModal';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import {
  getLessonModuleAll,
  deleteLessonModule,
  getGrades,
} from '../../../Utils/requests';
import UnitCreator from '../UnitCreator/UnitCreator';
import UnitEditor from '../UnitEditor/UnitEditor';
import LessonModuleActivityCreator from '../LessonModuleCreator/LessonModuleCreator';
import LessonEditor from '../LessonEditor/LessonEditor';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function Dashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [mentorClassrooms, setMentorClassrooms] = useState([]);
  const [mentor, setMentor] = useState([]);
  const [value] = useGlobalState('currUser');
  const navigate = useNavigate();

  //TODO
  // If a classroom's id matches with one of the mentor IDs, don't display the name
  // Otherwise, for each thing, get all the mentors assoicated with that classroom and show their names

  // Separate thing for whether we display the copy button - same condition
  const [searchParams, setSearchParams] = useSearchParams();
  const [gradeList, setGradeList] = useState([]);
  const [learningStandardList, setLessonModuleList] = useState([]);

  // Variable setup for 'Home' and 'Lessons' tabs
  const [tab, setTab] = useState(
    searchParams.has('tab') ? searchParams.get('tab') : 'home'
  );

  const [page, setPage] = useState(
    searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
  );

  const [viewing, setViewing] = useState(parseInt(searchParams.get('activity')))

  useEffect(() => {
    let classroomIds = [];
    let classroomsTest = [];
    getAllClassrooms().then((res) => { // getMentor
      if (res.data) {
        res.data.forEach((classroom) => {
          classroomsTest.push(classroom);
          //classroomIds.push(classroom.id);
        });
        setClassrooms(classroomsTest);
      } else {
        message.error(res.err);
        navigate('/teacherlogin');
      }

      // Get all Lesson and Grades data from Database
      const fetchData = async () => {
        const [lsResponse, gradeResponse] = await Promise.all([
          getLessonModuleAll(),
          getGrades(),
        ]);
        setLessonModuleList(lsResponse.data);

        // Sort grades if Grade tabs are shown/Mentor given permissions to see grade tabs
        const grades = gradeResponse.data;
        grades.sort((a, b) => (a.id > b.id ? 1 : -1));
        setGradeList(grades);
      };
      fetchData();
    });

    getMentor().then((res) => {
      if (res.data) {
        res.data.classrooms.forEach((classroom) => {
          classroomIds.push(classroom.id);
        });
        setMentorClassrooms(classroomIds);
        setMentor(res.data);
        console.log(mentor.name);
        // getClassrooms(classroomIds).then((classrooms) => {
        //   setClassrooms(classrooms);
        // });
      }
    });
  }, []);

  // res.data.classrooms.forEach((classroom) => {
  //   classroomIds.push(classroom.id);
  // });

  function checkForOwnership(classroom){
      // For each of the mentor's classrooms
      for (let i = 0; i < mentorClassrooms.length; i++) {
        if(mentorClassrooms.at(i) == classroom.id){
          return true;
        }
      }
      return false;
  }

  function displayMentorName(classroom){
    if(!checkForOwnership(classroom)){
      return (
        <h2>{classroom.mentors[1].first_name + ' ' + classroom.mentors[1].last_name}</h2>
      );
    }
    return '';
  }

  function displayCopyClassroomButton(classroom){
    if(!checkForOwnership(classroom)){
      return (
        <button onClick={() => handleCopyClassroom(classroom)}>
                    Copy
        </button>
      );
    }
    return '';
  }

  // Lessons tab structure
  const columns = [
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => (
        <UnitEditor id={key.unit.id} unitName={key.unit.name} linkBtn={true} />
      ),
    },
    {
      title: 'Lesson',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, key) => (
        <LessonEditor
          learningStandard={key}
          linkBtn={true}
          viewing={viewing}
          setViewing={setViewing}
          tab={tab}
          page={page}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'expectations',
      key: 'character',
      editable: true,
      width: '22.5%',
      align: 'left',
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: '10%',
      align: 'right',
      render: (_, key) => (
        <Popconfirm
          title={'Are you sure you want to delete this learning standard?'}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            const res = await deleteLessonModule(key.id);
            if (res.err) {
              message.error(res.err);
            } else {
              setLessonModuleList(
                learningStandardList.filter((ls) => {
                  return ls.id !== key.id;
                })
              );
              message.success('Delete success');
            }
          }}
        >
          <button id={'link-btn'}>Delete</button>
        </Popconfirm>
      ),
    },
  ];

  function displayCodeAndStudentCount(classroom){
    if(checkForOwnership(classroom)){
      return (
        <div id='card-right-content-container'>
                <DashboardDisplayCodeModal code={classroom.code} />
                <div id='divider' />
                <div id='student-number-container'>
                  <h1 id='number'>{classroom.students.length}</h1>
                  <p id='label'>Students</p>
                </div>
              </div>
      );
    }
    return '';
  }

  function getHighestID(){
    var highest = 0;
    for (let i = 0; i < classrooms.length; i++) {
      if(classrooms.at(i).id > highest){
        highest = classrooms.at(i).id;
      }
    }
    return highest;
  }

  const handleViewClassroom = (classroomId) => {
    
    navigate(`/classroom/${classroomId}`);
  };

  // Default filter for filtering lesson/unit data based on the grade
  const filterLS = (grade) => {
    return learningStandardList.filter((learningStandard) => {
      return learningStandard.unit.grade === grade.id;
    });
  };

  // Creates all the grade tabs if perms are given in strapi
  const setTabs = (grade) => {
    return (
      <TabPane tab={grade.name} key={grade.name}>
        <div id='page-header'>
          <h1>Lessons & Units</h1>
        </div>
        <div id='content-creator-table-container'>
          <div id='content-creator-btn-container'>
            <UnitCreator gradeList={gradeList} />
            <LessonModuleActivityCreator />
          </div>
          <Table
            columns={columns}
            dataSource={filterLS(grade)}
            rowClassName='editable-row'
            rowKey='id'
            onChange={(Pagination) => {
              setViewing(undefined);
              setPage(Pagination.current);
              setSearchParams({ tab, page: Pagination.current });
            }}
            pagination={{ current: page ? page : 1 }}
          ></Table>
        </div>
      </TabPane>
    );
  }
  

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Welcome {value.name}</div>

      <Tabs
        onChange={(activeKey) => {
          setTab(activeKey);
          setPage(1);
          setViewing(undefined);
          setSearchParams({ tab: activeKey });
        }}
        activeKey={tab ? tab : 'home'}
      >
        {/* Classroom Tab */}
        <TabPane tab='Home' key='home'>
          <MentorSubHeader title={'Your Classrooms'}></MentorSubHeader>
          <div id='classrooms-container'>
            <div id='dashboard-card-container'>
              {classrooms.map((classroom) => (
                <div key={classroom.id} id='dashboard-class-card'>
                  <div id='card-left-content-container'>
                    <h1 id='card-title'>{classroom.name}</h1>
                    {displayMentorName(classroom)}
                    <div id='card-button-container' className='flex flex-row'>
                      <button onClick={() => handleViewClassroom(classroom.id)}>
                        View
                      </button>
                    </div>
                  </div>
                <div id='card-right-content-container'>
                  {displayCodeAndStudentCount(classroom)}
                </div>
            </div>
              ))}
          </div>
        </div>
        </TabPane>

        {/* Lessons Tab 
        Need to change the first div id's to match mentor page*/}
        <TabPane tab='Lessons' key='lessons'>
                <MentorSubHeader title='Your Lessons'></MentorSubHeader>
                <div id='content-creator-table-container'>
                  <div id='content-creator-btn-container'>
                    <UnitCreator gradeList={gradeList} />
                    <LessonModuleActivityCreator
                      setLessonModuleList={setLessonModuleList}
                      viewing={viewing}
                      setViewing={setViewing}
                      tab={tab}
                      page={page}
                    />
                  </div>
                  <Table
                    columns={columns}
                    dataSource={learningStandardList}
                    rowClassName='editable-row'
                    rowKey='id'
                    onChange={(Pagination) => {
                      setViewing(undefined);
                      setPage(Pagination.current);
                      setSearchParams({ tab, page: Pagination.current});
                    }}
                    pagination = {{ current: page ? page : 1 }}
                  ></Table>
                </div>
        </TabPane>

        {gradeList.map((grade) => {
          return setTabs(grade);
        })}

      </Tabs>
    </div>
  );
}
