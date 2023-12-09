import React, {useState} from 'react';
import './AddStudy.less';

function AddStudy({handleAddStudy}) {
    const [studyID, setStudyID] = useState('');
    const [studyName, setStudyName] = useState('');
    const [studyDesc, setStudyDesc] = useState('');
    
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
        
        <div style={{ paddingRight: '80px' ,paddingLeft: '80px',paddingTop: '10px',paddingBottom: '20px', backgroundColor: 'white', marginBottom: '5px', border: '2px solid black', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.377)', borderRadius: '30px'}}>
          <h2>Add a Study</h2>
          <div>
            <label style={{ padding: '10px' }}>Study ID:</label>
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
          <div style={{ paddingBottom: '10px'}}>
            <label style={{ padding: '10px', paddingBottom: '20px'}}>Study Desc:</label>
            <input 
              type="text"
              value={studyDesc}
              onChange={(e) => setStudyDesc(e.target.value)}
            />
          </div>
          <button  onClick={addStudyFunc}>Add Study</button>
        </div>
      );
  }
  
  export default AddStudy;