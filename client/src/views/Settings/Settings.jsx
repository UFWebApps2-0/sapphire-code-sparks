import React from "react"
import NavBar from "../../components/NavBar/NavBar"
import "./Settings.less"

export default function Settings(props) {
  return (
    <div className="container nav-padding">
      <NavBar />
      <div id="about-content-container">
        <h1 id="title">Settings</h1>
        <div id="divider" />
        <div class="button-container" id="container button-container">
          <input
            type='button'
            value='Edit Password'
          />
          <input
            type='button'
            value='Merge Account'
          />
        </div>
        <input class="delete-account-button"
          type='button'
          value='Delete Account'
        />
      </div>
    </div>
  )
}
