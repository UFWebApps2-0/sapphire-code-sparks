import React from "react"
<<<<<<< HEAD
import NSF from "../../assets/nsf_logo.png"
import TAMU from "../../assets/tamu_logo.png"
import UF from "../../assets/uf_logo.png"
import NavBar from "../../components/NavBar/NavBar"
import "./gallery.less"

export default function Gallery(props) {
    return (
        <div className="container nav-padding">
            <NavBar />
            <div id="about-content-container">

            </div>
        </div>
    )
}
=======
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
>>>>>>> origin/paige
