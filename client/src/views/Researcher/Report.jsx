import NavBar from '../../components/NavBar/NavBar';
import RouteButton from '../../components/RouteButton/RouteButton';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Report.less';

export default function Report(props) {
  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='main-header'>Welcome Researcher!</div>
      <h1 id='report-subheader'>Reports</h1>
      <div id='button-container'>
        <Link to={'/studies'}>
          <button
            id={'route-button'}
            className={`btn-${'primary'} btn-${'sm'}`}
            type='button'
          >
            Studies
          </button>
        </Link>
        <Link to={'/activityLevel'}>
          <button
            id={'route-button'}
            className={`btn-${'primary'} btn-${'sm'}`}
            type='button'
          >
            Activity Level Report
          </button>
        </Link>
        {/* New button for Code Replay Report */}
        <Link to={'/codereplay-report'}>
          <button
            id={'route-button'}
            className={`btn-${'primary'} btn-${'sm'}`}
            type='button'
          >
            Codereplay Report
          </button>
        </Link>
      </div>
    </div>
  );
}
