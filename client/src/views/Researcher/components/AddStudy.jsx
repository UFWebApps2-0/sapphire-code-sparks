import React, {useState} from 'react';

function AddStudy({newList, setNewList, updateStudyList}) {
    const [studyID, setStudyID] = useState('');
    const [studyName, setStudyName] = useState('');
    const [studyDesc, setStudyDesc] = useState('');
    
    function addStudyFunc(){
        const newStudy = {
            id: studyID,
            name: studyName,
            description: studyDesc,
        }

        setNewList([...newList, newStudy]);

        updateStudyList([...newList, newStudy]);

        setStudyID('');
        setStudyName('');
        setStudyDesc('');
    }

    const box={
        width: '400px',
        height: '200px',
        backgroundColor: 'white',
        padding: '20px',
        margin: '30px',
        border: '2px solid black',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.377',
        borderRadius: '10px'
       
    }
    
    return (
        
        
        <div style={box}>
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
          <div>
            <label style={{ padding: '10px', paddingBottom: '20px'}}>Study Desc:</label>
            <input
              type="text"
              value={studyDesc}
              onChange={(e) => setStudyDesc(e.target.value)}
            />
          </div>
          <button onClick={addStudyFunc}>Add Study</button>
        </div>
      );
  }
  
  export default AddStudy;