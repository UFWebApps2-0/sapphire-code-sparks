import React, { Component } from "react";
import Question from "./QuestionObj";

class QuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "multipleChoice",
      prompt: "",
      promptImage: "",
      choices: [{ text: "", imageUrl: "" }],
      answers: [false],
      freeResponseAnswer: "",
      matchPairs: [{ left: "", right: "" }]
    };
  }

  handleTypeChange = (e) => {
    this.setState({ type: e.target.value });
  };

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
    this.setState((prevState) => ({
      choices: [...prevState.choices, { text: "", imageUrl: "" }],
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

  handleFreeResponseChange = (e) => {
    this.setState({ freeResponseAnswer: e.target.value });
  };

  handleMatchPairChange = (index, side, value) => {
    const newMatchPairs = this.state.matchPairs.slice();
    newMatchPairs[index] = { ...newMatchPairs[index], [side]: value };
    this.setState({ matchPairs: newMatchPairs });
  };

  addMatchPair = () => {
    this.setState((prevState) => ({
      matchPairs: [...prevState.matchPairs, { left: "", right: "" }]
    }));
  };

  removeMatchPair = (index) => {
    const { matchPairs } = this.state;
    this.setState({
      matchPairs: matchPairs.filter((_, i) => i !== index)
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { type, prompt, promptImage, choices, answers, freeResponseAnswer, matchPairs } = this.state;
    const question = new Question();
    question.update({
      type: type,
      prompt: prompt,
      promptImage: promptImage,
      choices: choices.map((choice) => choice.text),
      answers: answers,
      choiceImages: choices.map((choice) => choice.imageUrl),
      freeResponseAnswer: freeResponseAnswer,
      matchPairs: matchPairs
    });
    this.props.addQuestion(question);

    //Reset the form state
    this.setState({
      prompt: "",
      promptImage: "",
      choices: [{ text: "", imageUrl: "" }],
      answers: [false],
      freeResponseAnswer: "",
      matchPairs: [{ left: "", right: "" }]
    });
  };

  renderChoices = () => {
    const { type, choices, answers, matchPairs } = this.state;

    switch (type) {
      case "multipleChoice":
        return choices.map((choice, index) => (
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
              checked={answers[index]}
              onChange={() => this.handleAnswerChange(index)}
            />
            <button type="button" onClick={() => this.removeChoice(index)}>
              Remove
            </button>
          </div>
        ));

      case "dropdown":
        return (
          <div>
            <select>
              {choices.map((choice, index) => (
                <option key={index} value={choice.text}>
                  {choice.text}
                </option>
              ))}
            </select>
            <button type="button" onClick={this.addChoice}>
              Add Choice
            </button>
          </div>
        );

      case "matchMaking":
        return (
          <div>
            {matchPairs.map((pair, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Left Item"
                  value={pair.left}
                  onChange={(e) => this.handleMatchPairChange(index, 'left', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Right Item"
                  value={pair.right}
                  onChange={(e) => this.handleMatchPairChange(index, 'right', e.target.value)}
                />
                <button type="button" onClick={() => this.removeMatchPair(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={this.addMatchPair}>
              Add Pair
            </button>
          </div>
        );

      case "freeResponse":
        return (
          <textarea
            value={this.state.freeResponseAnswer}
            onChange={this.handleFreeResponseChange}
          />
        );

      default:
        return null;
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Question Type:</label>
          <select value={this.state.type} onChange={this.handleTypeChange}>
            <option value="multipleChoice">Multiple Choice</option>
            <option value="dropdown">Dropdown</option>
            <option value="matchMaking">Match Making</option>
            <option value="freeResponse">Free Response</option>
          </select>
        </div>
        <div>{this.renderChoices()}</div>
        <button type="submit">Add Question</button>
      </form>
    );
  }
}

export default QuestionForm;
