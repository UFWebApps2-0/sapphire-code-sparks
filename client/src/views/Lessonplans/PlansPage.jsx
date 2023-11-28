import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import './planspage.less';
import VideoPlayer from './VideoPlayer.jsx';

function PlansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoId, setVideoId] = useState('');

  const handleSearch = () => {
    // Implement your search logic here
    console.log('Searching for:', searchQuery);
    // Assuming the searchQuery is the video URL, extract the video ID
    const videoIdMatch = searchQuery.match(/(?:\?v=|&v=|youtu\.be\/|\/embed\/|\/v\/|\/e\/|\/u\/\w+\/|\/d\/|\/1\/|\/?vi?=|&vi?=|\/?\w+=)([\w-]{11})/);
    
    if (videoIdMatch) {
      setVideoId(videoIdMatch[1]);
    } else {
      console.error('Invalid YouTube URL');
    }
  };

  return (
    <>
      <NavBar />
      <div className='container nav-padding'>
        <h1>Lesson Plans</h1>
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Video URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Add Video</button>
          <button onClick={() => setVideoId('')}>Remove Video</button>
        </div>
        <VideoPlayer
        name = {"Fossil Fuels - Activity 1"}
        />
        {/* {videoId && (
          <div style={{ marginTop: '20px' }}>
           <h2>Video Player</h2>
            <YouTube videoId={videoId} />
           </div>
        )} */}
      </div>
    </>
  );
}

export default PlansPage;
