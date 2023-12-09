import React, {useState} from 'react';
import './AddStudy.less';

function AddStudy({handleAddStudy}) {
    const [studyID, setStudyID] = useState('');
    const [studyName, setStudyName] = useState('');
    const [studyDesc, setStudyDesc] = useState('');
    
    //creates new study object and adds it to strapi database + list
    function addStudyFunc(){
        const newStudy = {
            id: studyID,
            name: studyName,
            description: studyDesc,
        }

        handleAddStudy(newStudy);

        setStudyID('');
        setStudyName('');
        setStudyDesc('');
    }
    
    return (
        <div className='box'>
          <h2>Add a Study</h2>
          <div>
            <label style={{ padding: '10px' }}>Study ID:</label>
            {/*Takes in study id, name, and desc and stores them in the variables above*/}
            <input
              type="text"
              value={studyID}
              onChange={(e) => setStudyID(e.target.value)}
            />
          </div>
          <div>
            <label style={{ padding: '10px', paddingBottom: '20px'}}>Study Name:</label>
            <input
              type="text"
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ padding: '10px', paddingBottom: '20px'}}>Study Desc:</label>
            <input
              type="text"
              value={studyDesc}
              onChange={(e) => setStudyDesc(e.target.value)}
            />
          </div>
          {/*adds study by calling addStudyFunc*/}
          <button onClick={addStudyFunc}>Add Study</button>
        </div>
      );
  }
  
  export default AddStudy;