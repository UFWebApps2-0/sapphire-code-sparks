import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Tag } from 'antd';
import './CodeReplayReport.less';
import { useSearchParam } from '../../Utils/useSearchParam';
import NavBar from '../../components/NavBar/NavBar';

import {
  getSessionsWithFilter,
  getSessionCountWithFilter,
  getSession,
  getGrades,
  getUnit,
  getGrade,
  getClassroom,
} from '../../Utils/requests';
import Form from 'antd/lib/form/Form';


const CodeReplayReport = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [classroomFilter, setClassroomFilter] = useState([]);
    const [UnitFilter, setUnitFilter] = useState([]);
    const [LessonFilter, setLessonFilter] = useState([]);
  
    useEffect(() => {
      
      const fetchData = async () => {
        setLoading(true);
        
        let filter = '';
        
        
        try {
          const sessionRes = await getSessionsWithFilter(filter);
          if (sessionRes.error) {
            console.error(sessionRes.error);
          } else {

            const classrooms = sessionRes.data.map(session => session.classroom && session.classroom.name).filter(Boolean);
            setClassroomFilter(makeFilterOptions(classrooms));
            const units = sessionRes.data.map(session => session.unit && session.unit.name).filter(Boolean);
            setUnitFilter(makeFilterOptions(units));
            const lessons = sessionRes.data.map(session => session.lesson_module && session.lesson_module.name).filter(Boolean);
            setLessonFilter(makeFilterOptions(lessons));

            const detailedSessions = await Promise.all(
                sessionRes.data.map(async (session) => {
                  
                  
                  
                  const detailedSession = await getSession(session.id);
                  const saves = detailedSession.data.saves;
                  const lastReplay = saves[0]?.replay[saves[0]?.replay.length - 1];
                  const clicks = lastReplay ? lastReplay.clicks : null;
                  const startTime = new Date(session.created_at).getTime();
                  const endTime = new Date(saves[saves.length - 1]?.created_at).getTime();
                  const duration = !isNaN(startTime) && !isNaN(endTime) ? (endTime - startTime) / 1000 : null;
                  const timeTested = session.submissions?.length;      
                  return { ...session, saves, clicks, duration, timeTested };
                })
              );
    
              setSessions(detailedSessions);
              setTbClassroomFilter(makeFilter(sessionRes.data, 'classroom'));
          }
        } catch (error) {
          console.error('Failed to fetch sessions', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []); 

    const makeFilterOptions = (data) => {
        return [...new Set(data)].map(value => ({
          text: value,
          value: value,
        }));
      };
  
    // Define columns for the Ant Design Table
    const columns = [
      {
        title: 'Classroom',
        dataIndex: ['classroom', 'name'],
        key: 'classroom',
        filters: classroomFilter,
        onFilter: (value, record) => record.classroom.name === value,
      },
      {
        title: 'Unit',
        dataIndex: ['unit', 'name'], 
        key: 'unit',
        filters: UnitFilter,
        onFilter: (value, record) => record.unit.name === value,
      },
      {
        title: 'Lesson',
        dataIndex: ['lesson_module', 'name'], 
        key: 'lesson_module',
        filters: LessonFilter,
        onFilter: (value, record) => record.lesson_module.name === value,
      },
      {
        title: 'Click Times',
        key: 'clickTimes',
        sorter: (a, b) => a.clicks - b.clicks,
        render: (_, session) => {
          
          return session.clicks !== null ? session.clicks : 'N/A';
        },
      },
      {
        title: 'Replay Times (sec)',
        key: 'replayTimes',
        sorter: (a, b) => a.duration - b.duration,
        render: (_, session) => {
          
          return session.duration !== null ? session.duration : 'N/A';
        },
      },
      {
        title: 'Time Tested',
        key: 'timeTested',
        sorter: (a, b) => a.timeTested - b.timeTested,
        render: (_, session) => {
          
          return session.timeTested !== null ? session.timeTested : 'N/A';
        },
      },
      {
        title: 'View Report',
        dataIndex: 'enrolled',
        key: 'enrolled',
        width: '2%',
        align: 'right',
        render: (_, session) => {
            const lastSave = session.saves[session.saves.length - 1];
            // Check if lastSave and its id are not null
            if (lastSave && lastSave.id) {
              return (
                <Link to={`/replay/${lastSave.id}`}>View Replay</Link>
              );
            }
            return 'Replay Not Available';
          },
      },
      // ...add more columns as needed
    ];
  
    return (
      <div className='container nav-padding'>
        <NavBar />
        <div className='menu-bar'>
          <div id='codereplay-report-header'>Codereplay Report</div>
          <button
            id={'codereplay-level-return'}
            className='btn-primary btn-sm'
            type='button'
            onClick={() => navigate('/report')}
          >
            Return to Dashboard
          </button>
        </div>
  
        <main>
          <Table
            columns={columns}
            dataSource={sessions}
            loading={loading}
            rowKey={record => record.id} 
          />
        </main>
      </div>
    );
  };
  
  export default CodeReplayReport;
