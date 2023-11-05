import React, { Component } from 'react';
import Question from './QuestionObj';
//Importing the Question class from the provided QuestionObj.js

class QuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //default type
      type: 'multipleChoice',
      prompt: '',
      promptImage: '',
      //start with one empty choice with text and image URL
      choices: [{ text: '', imageUrl: '' }],
      //corresponding answers
      answers: [false]
    };
  }

  handlePromptChange = (e) => {
    this.setState({ prompt: e.target.value });
  };

  handleImageChange = (e) => {
    this.setState({ promptImage: e.target.value });
  };

  handleChoiceTextChange = (index, value) => {
    const newChoices = this.state.choices.slice();
    newChoices[index] = { ...newChoices[index], text: value };
    this.setState({ choices: newChoices });
  };

  handleChoiceImageChange = (index, value) => {
    const newChoices = this.state.choices.slice();
    newChoices[index] = { ...newChoices[index], imageUrl: value };
    this.setState({ choices: newChoices });
  };

  handleAnswerChange = (index) => {
    const newAnswers = this.state.answers.slice();
    newAnswers[index] = !newAnswers[index];
    this.setState({ answers: newAnswers });
  };

  addChoice = () => {
    this.setState(prevState => ({
      choices: [...prevState.choices, { text: '', imageUrl: '' }],
      answers: [...prevState.answers, false]
    }));
  };

  removeChoice = (index) => {
    const { choices, answers } = this.state;
    this.setState({
      choices: choices.filter((_, i) => i !== index),
      answers: answers.filter((_, i) => i !== index)
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { prompt, promptImage, choices, answers } = this.state;
    const question = new Question();
    question.update({
      type: 'multipleChoice',
      prompt: prompt,
      promptImage: promptImage,
      choices: choices.map(choice => choice.text),
      answers: answers,
      //This will store image URLs for choices
      choiceImages: choices.map(choice => choice.imageUrl)
    });
    //Pass the question object to the parent component
    this.props.addQuestion(question);
    this.setState({
      prompt: '',
      promptImage: '',
      choices: [{ text: '', imageUrl: '' }],
      answers: [false]
    });
  };

  //render
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Question:</label>
          <textarea value={this.state.prompt} onChange={this.handlePromptChange} />
        </div>
        <div>
          <label>Image URL (optional):</label>
          <input type="text" value={this.state.promptImage} onChange={this.handleImageChange} />
        </div>
        <div>
          {this.state.choices.map((choice, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Choice text"
                value={choice.text}
                onChange={(e) => this.handleChoiceTextChange(index, e.target.value)}
              />
              <input
                type="text"
                placeholder="Choice image URL (optional)"
                value={choice.imageUrl}
                onChange={(e) => this.handleChoiceImageChange(index, e.target.value)}
              />
              <input
                type="checkbox"
                checked={this.state.answers[index]}
                onChange={() => this.handleAnswerChange(index)}
              />
              <button type="button" onClick={() => this.removeChoice(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={this.addChoice}>Add Choice</button>
        </div>
        <button type="submit">Add Question</button>
      </form>
    );
  }
}

export default QuestionForm;
