import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import './planspage.less';

function PlansPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      <NavBar />
      <div className='container nav-padding'>
        <h1>Lesson Plans</h1>
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Video ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Add Video</button>
          <button onClick={handleSearch}>Remove Video</button>
        </div>
      </div>
    </>
  );
}

export default PlansPage;

