import React from "react";
import { useState } from "react";
import {Table} from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import {Modal, Button} from "antd";


export const getFormattedDate = (value, locale = 'en-US') => {
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


// MENTORS ==================================================================================================================================
export function MModal({ linkBtn, mentor }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };
  
  return (
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        View
      </button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button
            key='ok' 
            type='primary' 
            onClick={handleOk}
          >
            OK
          </Button>
        ]}
      >
        <div id='modal-student-card-header'>
          <h1 id='student-card-title'>{mentor.first_name} {mentor.last_name}</h1>
        </div>
        <div id='modal-card-content-container'>
          <div className='modal-desc'>
            <p className='modal-label'>School</p>
            <p className='modal-info'>{mentor.school_name}</p>
            <br></br>
          </div>
        </div>
        <div id='modal-card-content-container'>
          <div className='modal-desc'>
            <p className='modal-label'>Classrooms</p>
            <div className='modal-list'>
              {mentor.classrooms.map((classroom) => {
                  return <li>{classroom}</li>
              })}
            </div>
            <br></br>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function MListView({data, handleDelete}) {
  const mentorColumns = [
    {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name',
        width: '10%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.first_name < b.first_name ? -1 : 1),
        },
    },
    {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
        width: '10%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.last_name < b.last_name ? -1 : 1),
        },
    },
    {
        title: 'School',
        dataIndex: 'school_name',
        key: 'school_name',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.school_name < b.school_name ? -1 : 1),
        },
    },
    {
        title: 'View',
        dataIndex: 'view',
        key: 'view',
        width: '10%',
        align: 'left',
        render: (_, record) => (
          <MModal
            mentor={record}
            linkBtn={true}
          />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'delete',
        key: 'delete',
        width: '10%',
        align: 'left',
        render: (text, record) =>
          data.length >= 1 ? (
            <Popconfirm
              title={`Are you sure you want to delete all data for ${record.first_name} ${record.last_name}?`}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record.key)}
            >
              <button id='link-btn'>Delete</button>
            </Popconfirm>
          ) : null,
      
    }
];

  return (
      <div id='table-container'>
        <Table
            columns={mentorColumns}
            dataSource={data}
            rowClassName='editable-row'
            pagination={{
              pageSizeOptions: ['10', '20', '30'],
              showSizeChanger: true,
            }}
        />
      </div>
    );
}


// STUDENTS ==================================================================================================================================
export function SListView({data, handleDelete}) {
  const studentColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.name < b.name ? -1 : 1),
        },
    },
    {
        title: 'Animal',
        dataIndex: 'character',
        key: 'character',
        width: '5%',
        align: 'center',
    },
    {
        title: 'Last Logged In',
        dataIndex: 'last_logged_in',
        key: 'last_logged_in',
        width: '10.5%',
        align: 'left',
        render: (value) => getFormattedDate(value),
    },
    {
        title: 'School',
        dataIndex: 'school_name',
        key: 'school_name',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.school_name < b.school_name ? -1 : 1),
        },
    },
    {
        title: 'Classroom',
        dataIndex: 'classroom_name',
        key: 'classroom_name',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.classroom_name < b.classroom_name ? -1 : 1),
        },
    },
    {
        title: 'View',
        dataIndex: 'view',
        key: 'view',
        width: '10%',
        align: 'left',
        render: (_, record) => (
          <SModal
            mentor={record}
            linkBtn={true}
          />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'delete',
        key: 'delete',
        width: '10%',
        align: 'left',
        render: (text, record) =>
          data.length >= 1 ? (
            <Popconfirm
              title={`Are you sure you want to delete all data for ${record.name}?`}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record.key)}
            >
              <button id='link-btn'>Delete</button>
            </Popconfirm>
          ) : null,
    }
  ];
    
  return (
    <div id='table-container'>
      <Table
          columns={studentColumns}
          dataSource={data}
          rowClassName='editable-row'
          pagination={{
          pageSizeOptions: ['10', '20', '30'],
          showSizeChanger: true,
          }}
      />
    </div>
  );
}

export function SModal({ linkBtn, mentor }) {
    const [visible, setVisible] = useState(false);
  
    const showModal = () => {
      setVisible(true);
    };
  
    const handleCancel = () => {
      setVisible(false);
    };
  
    const handleOk = () => {
      setVisible(false);
    };
  
    return (
      <div>
        <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
          View
        </button>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={[
            <Button
              key='ok' 
              type='primary' 
              onClick={handleOk}
            >
              OK
            </Button>
          ]}
        >
          <div id='modal-student-card-header'>
            <h1 id='student-card-title'>{mentor.name}</h1>
          </div>
          <div id='modal-card-content-container'>
          <div className='modal-desc'>
              <p className='modal-label'>Character</p>
              <p className='modal-info'>{mentor.character}</p>
              <br></br>
            </div>
            <div className='modal-desc'>
              <p className='modal-label'>School Name</p>
              <p className='modal-info'>{mentor.school_name}</p>
              <br></br>
            </div>
            <div className='modal-desc'>
              <p className='modal-label'>Classroom</p>
              <p className='modal-info'>{mentor.classroom_name}</p>
              <br></br>
            </div>
            <div className='modal-desc'>
              <p className='modal-label'>Last Logged In</p>
              <p className='modal-info'>{getFormattedDate(mentor.last_logged_in)}</p>
              <br></br>
            </div>
          </div>
        </Modal>
      </div>
    );
}

// SCHOOLS ==================================================================================================================================
export function SchoolListView({data, handleDelete}) {
  const schoolColumns = [
    {
        title: 'School',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.name < b.name ? -1 : 1),
        },
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.state < b.state ? -1 : 1),
        },
    },
    {
        title: 'County',
        dataIndex: 'county',
        key: 'county',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.county < b.county ? -1 : 1),
        },
    },
    {
        title: 'Number Classes',
        dataIndex: 'number_classes',
        key: 'number_classes',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.number_classes < b.number_classes ? -1 : 1),
        }
    },
    {
        title: 'Number Mentors',
        dataIndex: 'number_mentors',
        key: 'number_mentors',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.number_mentors < b.number_mentors ? -1 : 1),
        }
    },
    {
        title: 'Number Students',
        dataIndex: 'number_students',
        key: 'number_students',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.number_students < b.number_students ? -1 : 1),
        }
    },
    {
        title: 'View',
        dataIndex: 'view',
        key: 'view',
        width: '10%',
        align: 'left',
        render: (_, record) => (
          <SchoolModal
            mentor={record}
            linkBtn={true}
          />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'delete',
        key: 'delete',
        width: '10%',
        align: 'left',
        render: (text, record) =>
          data.length >= 1 ? (
            <Popconfirm
              title={`Are you sure you want to delete all data for ${record.name}?`}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record.key)}
            >
              <button id='link-btn'>Delete</button>
            </Popconfirm>
          ) : null,
    }
  ]
    
  return (
    <div id='table-container'>
      <Table
          columns={schoolColumns}
          dataSource={data}
          rowClassName='editable-row'
          pagination={{
            pageSizeOptions: ['10', '20', '30'],
            showSizeChanger: true,
          }}
      />
    </div>
  );
}

export function SchoolModal({ linkBtn, mentor }) {
    const [visible, setVisible] = useState(false);
  
    // Shows the pop-up containing the mentor's information
    const showModal = () => {
      setVisible(true);
    };
  
    // Exits out of the pop-up
    const handleCancel = () => {
      setVisible(false);
    };
  
    // Exits out of the pop-up
    const handleOk = () => {
      setVisible(false);
    };
  
  
    return (
      <div>
        <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
          View
        </button>
        <Modal
          visible={visible}
          onCancel={handleCancel}
          footer={[
            <Button
              key='ok' 
              type='primary' 
              onClick={handleOk}
            >
              OK
            </Button>
          ]}
        >
          <div id='modal-student-card-header'>
            <h1 id='student-card-title'>{mentor.name}</h1>
          </div>
          <div id='modal-card-content-container'>
          <div className='modal-desc'>
              <p className='modal-label'>State</p>
              <p className='modal-info'>{mentor.state}</p>
              <br></br>
            </div>
            <div className='modal-desc'>
              <p className='modal-label'>County</p>
              <p className='modal-info'>{mentor.county}</p>
              <br></br>
            </div>
            <div className='modal-desc'>
              <p className='modal-label'>Classrooms</p>
              <div className='modal-list'>
                {mentor.classrooms.map((classroom) => {
                    return <li>{classroom.name}</li>
                })}
              </div>
              <p className='modal-info'>{mentor.classroom}</p>
              <br></br>
            </div>
            <div className='modal-desc'>
              <p className='modal-label'>Mentors</p>
              <div className='modal-list'>
                {mentor.mentors.map((mentor) => {
                    return <li>{mentor.first_name} {mentor.last_name}</li>
                })}
              </div>
              <br></br>
            </div>
            <div className='modal-desc'>
              <p className='modal-label'>Students</p>
              <div className='modal-list'>
                {Object.values(mentor.students).map((student) => {
                    return <li>{student.name}</li>
                })}
              </div>
              <br></br>
            </div>
          </div>
        </Modal>
      </div>
    );
}

// CLASSROOMS ==================================================================================================================================
export function ClassroomListView({data, handleDelete}) {
  const classroomColumns = [
    {
        title: 'Classroom',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.name < b.name ? -1 : 1),
        },
    },
    {
        title: 'School',
        dataIndex: 'school_name',
        key: 'school_name',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.school_name < b.school_name ? -1 : 1),
        }
    },
    {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.grade < b.grade ? -1 : 1),
        },
    },
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.code < b.code ? -1 : 1),
        },
    },
    {
        title: 'Number Mentors',
        dataIndex: 'number_mentors',
        key: 'number_mentors',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.number_mentors < b.number_mentors ? -1 : 1),
        }
    },
    {
        title: 'Number Students',
        dataIndex: 'number_students',
        key: 'number_students',
        width: '40%',
        align: 'left',
        sorter: {
            compare: (a, b) => (a.number_students < b.number_students ? -1 : 1),
        }
    },
    {
        title: 'View',
        dataIndex: 'view',
        key: 'view',
        width: '10%',
        align: 'left',
        render: (_, record) => (
          <ClassroomModal
            mentor={record}
            linkBtn={true}
          />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'delete',
        key: 'delete',
        width: '10%',
        align: 'left',
        render: (text, record) =>
          data.length >= 1 ? (
            <Popconfirm
              title={`Are you sure you want to delete all data for ${record.name}?`}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record.key)}
            >
              <button id='link-btn'>Delete</button>
            </Popconfirm>
          ) : null,
    }
  ]
    
  return (
    <div id='table-container'>
      <Table
          columns={classroomColumns}
          dataSource={data}
          rowClassName='editable-row'
          pagination={{
            pageSizeOptions: ['10', '20', '30'],
            showSizeChanger: true,
          }}
      />
    </div>
  );
}

export function ClassroomModal({ linkBtn, mentor }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };
  
  return (
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        View
      </button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button
            key='ok' 
            type='primary' 
            onClick={handleOk}
          >
            OK
          </Button>
        ]}
      >
        <div id='modal-student-card-header'>
          <h1 id='student-card-title'>{mentor.name}</h1>
        </div>
        <div id='modal-card-content-container'>
          <div className='modal-desc'>
            <p className='modal-label'>School</p>
            <p className='modal-info'>{mentor.school_name}</p>
            <br></br>
          </div>
          <div className='modal-desc'>
            <p className='modal-label'>Grade</p>
            <p className='modal-info'>{mentor.grade}</p>
            <br></br>
          </div>
          <div className='modal-desc'>
            <p className='modal-label'>Code</p>
            <p className='modal-info'>{mentor.code}</p>
            <br></br>
          </div>
          <div className='modal-desc'>
            <p className='modal-label'>Mentors</p>
            {mentor.mentors.map((mentor) => {
              return (<li>{mentor.first_name} {mentor.last_name}</li>)
            })}
            <br></br>
          </div>
          <div className='modal-desc'>
            <p className='modal-label'>Students</p>
            {mentor.students.map((student) => {
              return (<li>{student.name}</li>)
            })}
            <br></br>
          </div>
        </div>
      </Modal>
    </div>
  );
}