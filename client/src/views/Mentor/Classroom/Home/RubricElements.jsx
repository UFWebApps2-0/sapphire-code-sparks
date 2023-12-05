import { Button, Input, Form, Tag } from "antd"
import React, { useEffect, useState } from "react"
import "./Home.less"
//const [criteria, setCriteria] = useState([]);

let nextId = 0;

const RubricElements = ({ criteria, setCriteria }) => { //pass in rubric here
  const [inputCriteria, setInputCriteria] = useState("");
  const [inputPoints1, setInputPoints1] = useState('');
  const [inputPoints2, setInputPoints2] = useState('');
  const [inputPoints3, setInputPoints3] = useState('');
  const [inputRating1, setInputRating1] = useState("");
  const [inputRating2, setInputRating2] = useState("");
  const [inputRating3, setInputRating3] = useState("");
  //const [criteria, setCriteria] = useState([]);
  console.log(criteria)
  // useEffect(() => {
  //   setCriteria(rubric.criteria)
  // }, []);
  //setCriteria(rubric.critera)

  const handleDelete = criterion => {
    const newCriteria = criteria.filter(c => c.id !== criterion.id)
    setCriteria(newCriteria)
  }

  const handleCriteria = () => {
    setCriteria([...criteria, {id: nextId++, name: inputCriteria, 
      ratings: [{points: inputPoints3, descriptor: inputRating3}, {points: inputPoints2, descriptor: inputRating2}, {points: inputPoints1, descriptor: inputRating1}]}
    ])
    setInputCriteria("");
    setInputRating3("");
    setInputRating2("");
    setInputRating1("");
    setInputPoints3('');
    setInputPoints2('');
    setInputPoints1('');
  }

  return (
 <div>
  <div id = "display-rubric">
    <table>
        <tr>
          <th id = "display-rubric-header">Criteria</th>
          <th id = "display-rubric-header" colspan = "3">Description & Points</th>
        </tr>
        {criteria.map(criterion => (
          <tr>
            <td id = "display-rubric-criteria" key={criterion.id}>{criterion.name}</td>
            {criterion.ratings.map(rating => (
              <td id = "display-ratings"><div id = "display-ratings-points">{rating.points} points</div>{rating.descriptor}</td>
            ))}
            <td><Button onClick={() => {handleDelete(criterion)}}>x</Button></td>
          </tr>
        ))}
    </table>

    <form float="center">
      <table class = "input-rubric-item">
        <tr>
          <th colspan = "2" id = "rubric-header">Add Rubric Item</th>
        </tr>
        <tr>
          <td colspan = "2">
            <input
              value={inputCriteria}
              onChange={e => setInputCriteria(e.target.value)}
              placeholder = "Input criteria"
              required = "required"
              class = "input-criteria"
            />
          </td>  
        </tr>
        <div id = "ratings">
        <tr>
          <td>
            <input
              value={inputRating3}
              onChange={e => setInputRating3(e.target.value)}
              placeholder = "Input description"
              class = "input-rating"
            />
          </td>
          <td>
            <input
              value={inputPoints3}
              onChange={e => setInputPoints3(e.target.value)}
              placeholder = "# pts"
              class = "input-points"
            />
          </td>
        </tr>
        <tr>
          <td>
            <input
              value={inputRating2}
              onChange={e => setInputRating2(e.target.value)}
              placeholder = "Input description"
              class = "input-rating"
            />
          </td>
          <td>
            <input
              value={inputPoints2}
              onChange={e => setInputPoints2(e.target.value)}
              placeholder = "# pts"
              class = "input-points"
            />
          </td>
        </tr>
        <tr>
          <td>
            <input
              value={inputRating1}
              onChange={e => setInputRating1(e.target.value)}
              placeholder = "Input description"
              class = "input-rating"
            />
          </td>
          <td>
            <input 
              value={inputPoints1}
              onChange={e => setInputPoints1(e.target.value)}
              placeholder = "# pts"
              class = "input-points"
            />
          </td>
        </tr>
        </div>
      </table>
    </form>
  </div>
  <Button
    onClick={() => handleCriteria()}
    type="primary"
    size="small"
    className="content-creator-button"
  >
    Add Rubric Item
  </Button> 
 </div> 
  )
}

export default RubricElements
