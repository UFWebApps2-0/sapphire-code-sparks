//Import stuff
import React, { useEffect, useRef, useState, useReducer } from 'react';
import Badge1 from "../../Images/Badge1.jpg";
import Badge2 from "../../Images/Badge2.jpg";
//https://pusher.com/blog/getting-started-with-react-router-v4/#application-structure
//https://stackoverflow.com/questions/49728705/adding-new-page-to-reactjs-template

//Image carousel video = https://www.youtube.com/watch?v=SK9AlIbexOE

//Function component to select/view badges
function badgeSelection ({badges, onBadgeSelect})
{
    //State variable to keep track of current badge using ID
    const [currentBadgeID, setBadgeID] = useState(0);
    //const [selectedBadgeID, setSelectedBadgeID] = useState(0);
    //Array of badge images - will add more later as I draw them
    const badgeImages = [Badge1, Badge2];

    //Style for the badge carousel
    const sliderStyles = {
        height: "100%",
        position: "relative",
    }

    //Style to display each badge
    const badgeStyles = {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover",
        //Set badge image based on the current badge ID
        backgroundImage: `url(${badgeImages[currentBadgeID]}`,

    }

    //Left arrow style to navigate from each badge
    const leftArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translated(0, -50%",
        left: "32px",
        fontSize: '45px',
        color: "#fff",
        zIndex: 1,
        cursor: "pointer",
    }

    //Right arrow style to navigate from each badge
    const rightArrowStyles = {
        position: "absolute",
        top: "50%",
        transform: "translated(0, -50%",
        left: "32px",
        fontSize: '45px',
        color: "#fff",
        zIndex: 1,
        cursor: "pointer",
    }

    //Function to navigate to previous badge
    const goToPrevious = () => {
        const isFirstBadge = currentBadgeID === 0;
        const newIndex = isFirstBadge ? badgeImages.length - 1 : currentBadgeID - 1;
        setBadgeID(newIndex);
    }

    //Function to navigate to next badge
    const goToNext = () => {
        const isLastBadge = currentBadgeID === badgeImages.length - 1;
        const newIndex = isLastBadge ? 0 : currentBadgeID + 1;
        setBadgeID(newIndex);
    }

    //Function to select current badge, and pass to parent component
    const selectBadge = () => {
        const selectedBadge = badgeImages[currentBadgeID];
        onBadgeSelect(selectedBadge);
    }

    //Render the badge selection on page
    return (
        <div style={sliderStyles}>
            <div style={leftArrowStyles} onClick={goToPrevious}></div>
            <div style={badgeStyles}></div>
            <div style={rightArrowStyles} onClick={goToNext}></div>
            <button onClick={selectBadge}>Select the badge</button>
        </div>
    )

    //Add folder in the src folder to store badge images?
    //Display the badges to choose
    /*const displayBadges = () =>
    {
        <div>
            <img src={Badge1} id='Badge1' alt={'badge1'}/>
        </div>
    }*/
}

export default badgeSelection;

