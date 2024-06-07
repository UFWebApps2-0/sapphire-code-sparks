import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Tag } from 'antd';
import './ActivityLevelReport.less';
import { useSearchParam } from '../../Utils/useSearchParam';
import NavBar from '../../components/NavBar/NavBar';

import {
  getSessionsWithFilter,
  getSessionCountWithFilter,
  getGrades,
  getUnit,
  getGrade,
  getClassroom,
  getAllUnits,
  getAllClassrooms,
  getLessonModuleAll,
  getAllStudents,
} from '../../Utils/requests';
import Form from 'antd/lib/form/Form';

const ActivityLevelReport = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const navigate = useNavigate();
  const { paramObj, setSearchParam } = useSearchParam();
  const [showFilter, setShowFilter] = useState(false);
  const [tbNameFilter, setTbNameFilter] = useState([]);
  const [tbClassroomFilter, setTbClassroomFilter] = useState([]);
  const [tbGradeFilter, setTbGradeFilter] = useState([]);
  const [tbUnitFilter, setTbUnitFilter] = useState([]);
  const [tbLessonFilter, setTbLessonFilter] = useState([]);
  const [tbPrevFilter, setTbPrevFilter] = useState(null);
  const [isTransition, setIsTransition] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      let filter = '';
      for (const [k, v] of Object.entries(paramObj)) {
        switch (k) {
          case '_start':
            filter += `_start=${v}&`;
            break;
          case '_sort':
            filter += `_sort=${v}&`;
            break;
          case 'pageSize':
            filter += `_limit=${v}&`;
            break;
          default:
            filter += `${k}=${v}&`;
        }
      }
      const [sessionRes, sessionCountRes] = await Promise.all([
        getSessionsWithFilter(filter),
        getSessionCountWithFilter(filter),
      ]);
      if (sessionRes.error) {
        console.error(sessionRes.error);
      }
      setSessions(sessionRes.data);
      setSessionCount(sessionCountRes.data);

      // set table head filter data
      makeTbNameFilter(sessionRes.data);
      setTbClassroomFilter(makeFilter(sessionRes.data, 'classroom'));
      setTbGradeFilter(makeFilter(sessionRes.data, 'grade'));
      setTbUnitFilter(makeFilter(sessionRes.data, 'unit'));
      setTbLessonFilter(makeFilter(sessionRes.data, 'lesson_module'));
    };
    if (paramObj['_sort']) fetchData();
  }, [paramObj]);

  const makeTbNameFilter = (data) => {
    let filter = [];
    const map = new Map();

    data.forEach((element) => {
      const names = element.students.map((student) => student.name);
      names.forEach((name) => {
        if (!map.get(name)) {
          filter.push({ text: name, value: name });
          map.set(name, true);
        }
      });
    });
    setTbNameFilter(filter);
  };

  const makeFilter = (data, category) => {
    let filter = [];
    const map = new Map();

    data.forEach((element) => {
      const name = element[category]?.name;
      if (name && !map.has(name)) {
        filter.push({ text: name, value: name });
        map.set(name, true);
      }
    });
    return filter;
  };

  const formatMyDate = (value, locale = 'en-US') => {
    let output = new Date(value).toLocaleDateString(locale);
    return output + ' ' + new Date(value).toLocaleTimeString(locale);
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      width: '2%',
      align: 'left',
      filters: tbNameFilter,
      onFilter: (value, key) => {
        let result = false;
        key.students.forEach((student) => {
          if (student.name.indexOf(value) === 0) {
            result = true;
            return;
          }
        });
        return result;
      },
      render: (_, key) => <div>{key.students[0].name}</div>,
    },
    {
      title: 'Classroom',
      key: 'classroom',
      dataIndex: ['classroom', 'name'],
      width: '6%',
      align: 'left',
      filters: tbClassroomFilter,
      onFilter: (value, key) => key.classroom?.name.indexOf(value) === 0,
    },
    {
      title: 'Grade',
      dataIndex: ['grade', 'name'],
      key: 'grade',
      width: '2%',
      align: 'left',
      filters: tbGradeFilter,
      onFilter: (value, key) => key.grade?.name.indexOf(value) === 0,
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'name'],
      key: 'unit',
      width: '4%',
      align: 'left',
      filters: tbUnitFilter,
      onFilter: (value, key) => key.unit?.name.indexOf(value) === 0,
    },
    {
      title: 'Lesson',
      dataIndex: ['lesson_module', 'name'],
      key: 'lesson_module',
      width: '3%',
      align: 'left',
      filters: tbLessonFilter,
      onFilter: (value, key) =>
        key.lesson_module?.name.indexOf(value) === 0,
    },
    {
      title: 'Session Started',
      dataIndex: 'created_at',
      key: 'sessionStart',
      width: '4%',
      align: 'left',
      sorter: true,
      sortOrder: paramObj['_sort'] === 'created_at:DESC' ? 'descend' : 'ascend',
      sortDirections:
        paramObj['_sort'] === 'created_at:DESC'
          ? ['ascend', 'descend', 'ascend']
          : ['descend', 'ascend', 'descend'],
      onHeaderCell: () => {
        return {
          onClick: () => {
            const _start = paramObj['_start'];
            const pageSize = paramObj['pageSize'];
            const _sort =
              paramObj['_sort'] === 'created_at:DESC'
                ? 'created_at:ASC'
                : 'created_at:DESC';
            setSearchParam({ _start, _sort, pageSize });
          },
        };
      },
      render: (_, key) => <div>{formatMyDate(key.created_at)}</div>,
    },
    {
      title: 'Partners',
      key: 'hasPartners',
      width: '2%',
      align: 'left',
      render: (_, key) => (
        <div>
          {key.students
            .slice(1)
            .map((student) => student.name)
            .join(', ')}
        </div>
      ),
    },
    {
      title: 'View Report',
      dataIndex: 'enrolled',
      key: 'enrolled',
      width: '2%',
      align: 'right',
      render: (_, session) => (
        <Link to={`/activityLevel/${session.id}`}>View Report</Link>
      ),
    },
  ];

  // toggles filter transition
  const handleFilterClick = () => {
    setIsTransition(!isTransition);
    setShowFilter(!showFilter);
  };

  return (
    <div className='container nav-padding'>
      <NavBar />
      <div className='menu-bar'>
        <div id='activity-level-report-header'>Activity Level - Student Report</div>
        <button
          className='activity-level-return'
          onClick={() => navigate('/report')}
        >
          Return to Dashboard
        </button>
      </div>
      <button id='show-filter-btn' onClick={() => {handleFilterClick()} }>
        {showFilter ? (
          <p> Click to Hide Filter</p>
        ) : (
          <span> Click to Show Filter</span>
        )}
      </button>
        <div className={`filter-show ${isTransition ? 'big' : ''}`}>
          <div className='filter-items'>
            <Filter setSearchParam={setSearchParam} paramObj={paramObj} />
          </div>
        </div>
        <div className='filter-hide'>
          <Filter setSearchParam={setSearchParam} paramObj={paramObj} />
        </div>
  
      <main id='activity-report-content-wrapper'>
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey='id'
          onChange={(Pagination, filters) => {
            if (
              tbPrevFilter == null ||
              JSON.stringify(filters) === JSON.stringify(tbPrevFilter)
            ) {
              setSearchParam({
                _start: (Pagination.current - 1) * Pagination.pageSize,
                _sort: paramObj['_sort'],
                pageSize: Pagination.pageSize,
              });
              if (tbPrevFilter == null) {
                setTbPrevFilter(filters);
              }
            } else {
              setTbPrevFilter(filters);
            }
          }}
          pagination={{
            current: paramObj['_start'] / paramObj['pageSize'] + 1,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSize: paramObj['pageSize'] || 10,
            total: sessionCount,
          }}
        />
      </main>
    </div>
  );
};
const Filter = ({ setSearchParam, paramObj }) => {
  const [grades, setGrades] = useState([]);
  const [ls, setLs] = useState([]);
  const [units, setUnits] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedGrade, setselectedGrade] = useState('');
  const [selectedLs, setselectedLs] = useState('');
  const [selectedUnit, setselectedUnit] = useState('');
  const [selectedClassroom, setselectedClassroom] = useState('');
  const [selectedStudent, setselectedStudent] = useState('');
  
  // loads data from the database
  useEffect(() => {
    // loads the grades, stores them in grades
    const fetchData = async () => {
      const gradesRes = await getGrades();
      if (gradesRes.error) {
        console.error('Fail to retrieve grades');
      }
      setGrades(gradesRes.data);
      console.log(grades);
    };
    // loads the lessons, stores them in lessons
    const fetchData2 = async () => {
      const lessons = await getLessonModuleAll();
      setLs(lessons.data);
    };
    // loads the classrooms, stores them in classrooms
    const fetchData3 = async () => {
      const allClassrooms = await getAllClassrooms();
      setClassrooms(allClassrooms.data);
    };
    // loads the students, stores them in students
    const fetchData4 = async () => {
      const allStudents = await getAllStudents();
      setStudents(allStudents.data);
    };
    // loads the units, stores them in units
    const fetchData5 = async () => {
      const allUnits = await getAllUnits();
      setUnits(allUnits.data);
    };
  
    fetchData();
    fetchData2();
    fetchData3();
    fetchData4();
    fetchData5();
  }, []);

  // on taskbar change events
  const onGradeChange = async (e) => {
    const grade = e.target.value;
    grade ? setselectedGrade(grade) : setselectedGrade('');
    let obj = {};
    if( grade !== "" ) obj.grade = grade;
    setSearchParam(obj);
  };
  const onUnitChange = async (e) => {
    const unit = e.target.value;
    unit ? setselectedUnit(unit) : setselectedUnit('');
    let obj = {};
    if( unit !== "" ) obj.unit = unit;
    setSearchParam(obj);
  };
  const onClassroomChange = async (e) => {
    const classroom = e.target.value;
    classroom ? setselectedClassroom(classroom) : setselectedClassroom('');
    let obj = {};
    if( classroom !== "" ) obj.classroom = classroom;
    setSearchParam(obj);
  };
  const onStudentChange = async (e) => {
    const student = e.target.value;
    student ? setselectedStudent(student) : setselectedStudent('');
    let obj = {};
    if( student !== "" ) obj.student = student;
    setSearchParam(obj);
  };

  // clears search filter
  const handleClear = async () => {
    let obj = {};
    setSearchParam(obj);
  };

  return (
    <>
      <Form>
        <select
          className='select'
          placeholder='Select a grade'
          onChange={onGradeChange}
        >
          <option key='empty' value=''>
            Select a grade
          </option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>
        <select
          className='select'
          placeholder='Select a unit'
          onChange={onUnitChange}
        >
          <option key='empty' value=''>
            Select a unit
          </option>
          {
            units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))
          }
        </select>
        <select
          className='select'
          placeholder='Select a classroom'
          onChange={onClassroomChange}
        >
          <option key='empty' value=''>
            Select a classroom
          </option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
        <select
          className='select'
          placeholder='Select a student'
          onChange={onStudentChange}
        >
          <option key='empty' value=''>
            Select a student
          </option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <Button
          type='secondary'
          className='activity-level-submit'
          size='large'
          onClick = {handleClear}
        >
          Clear
        </Button>
      </Form>
      <div>
        <h3 className='filter-text' style={{ display: 'inline' }}>
          Current Filter:{' '}
        </h3>
        {Object.keys(paramObj).map((key) =>
          key === '_start' ? null : key === '_sort' ? null : key ===
            'pageSize' ? null : (
            <Tag>
              {key === 'lesson_module' ? `lesson(id)` : `${key}(id)`}:{' '}
              {paramObj[key]}
            </Tag>
          )
        )}
      </div>
    </>
  );
};

export default ActivityLevelReport;
