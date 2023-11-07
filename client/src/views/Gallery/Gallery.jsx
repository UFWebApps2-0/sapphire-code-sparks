import React from "react"
import NavBar from "../../components/NavBar/NavBar"
import Search from "../../components/Search/Search"
import GalleryView from "../../components/GalleryView/GalleryView"
import "./Gallery.less"
import { useSearchParams } from 'react-router-dom';
import { useState } from "react";


export default function Gallery(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [privacySetting, setPrivacy] = useState("Public")

  const [tab, setTab] = useState(
    searchParams.has('tab') ? searchParams.get('tab') : 'home'
  );
  const [page, setPage] = useState(
    searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
  );
  const [viewing, setViewing] = useState(parseInt(searchParams.get('activity')));

  const handlePublicButton = () => {
    setPrivacy("Public");
    alert("Displaying only Public projects");
  }
  const handleClassroomButton = () => {
    setPrivacy("Classroom");
    alert("Displaying only Classroom projects");
  }
  const handleOrganizationButton = () => {
    setPrivacy("Organization");
    alert("Displaying only Organization projects");
  }
  return (
    <div className="container nav-padding">
      <NavBar />
      <div id='page-header'>
            <h1>Gallery</h1>
        </div>
      <div id="gallery-content-container">
        <div id="Privacy-buttons">
          <button onClick={handlePublicButton}>Public</button>
          <button onClick={handleClassroomButton}>Clasroom</button>
          <button onClick={handleOrganizationButton}>Organization</button>
        </div>
        <Search />
        <GalleryView 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            privacySetting={privacySetting}
        />
      </div>
    </div>
  )
}
