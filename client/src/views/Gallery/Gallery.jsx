import React from "react"
import NavBar from "../../components/NavBar/NavBar"
import Search from "../../components/Search/Search"
import "./Gallery.less"

export default function Gallery(props) {
  return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <p>Public Gallery</p>
        <Search />
      </div>
    </div>
  )
}
