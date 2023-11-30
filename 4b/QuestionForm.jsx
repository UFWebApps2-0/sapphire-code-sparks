import React, { Component } from "react";
import Question from "./QuestionObj";
import "./QuestionFormStyles.css";

class QuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState = (props) => {
    return props.question
      ? { ...props.question }
      : {
          type: "multipleChoice",
          points: 0.0,
          prompt: "",
          promptImage: "",
          choices: [{ text: "", isCorrect: false }],
        };
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChoiceChange = (index, key, value) => {
    let updatedChoices = [...this.state.choices];

    if (
      (this.state.type === "multipleChoice" ||
        this.state.type === "dropdown") &&
      key === "isCorrect"
    ) {
      updatedChoices = updatedChoices.map((choice, idx) => ({
        ...choice,
        isCorrect: idx === index ? value : false,
      }));
    } else {
      updatedChoices[index] = { ...updatedChoices[index], [key]: value };
    }

    this.setState({ choices: updatedChoices });
  };

  handleAddChoice = () => {
    this.setState((prevState) => ({
      choices: [...prevState.choices, { text: "", isCorrect: false }],
    }));
  };
  handleRemoveChoice = (index) => {
    const choices = this.state.choices.filter((_, i) => i !== index);
    this.setState({ choices });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const question = new Question(this.state);
    this.props.addOrUpdateQuestion(question);
    this.props.closeForm();
  };

  renderChoices = () => {
    return (
      <div>
        {this.state.choices.map((choice, index) => (
          <div key={index}>
            <input
              type="text"
              value={choice.text}
              onChange={(e) =>
                this.handleChoiceChange(index, "text", e.target.value)
              }
            />
            {(this.state.type === "multipleChoice" ||
              this.state.type === "dropdown") && (
              <input
                type="radio"
                name="correctChoice"
                checked={choice.isCorrect}
                onChange={(e) =>
                  this.handleChoiceChange(index, "isCorrect", e.target.checked)
                }
              />
            )}
            {this.state.type === "multiSelect" && (
              <input
                type="checkbox"
                checked={choice.isCorrect}
                onChange={(e) =>
                  this.handleChoiceChange(index, "isCorrect", e.target.checked)
                }
              />
            )}
            <button
              type="button"
              onClick={() => this.handleRemoveChoice(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={this.handleAddChoice}>
          Add Choice
        </button>
      </div>
    );
  };

  render() {
    const { currentQuestionIndex, totalQuestions } = this.props;

    return (
      <div className="container my-5">
        <div className="card">
          <div className="card-header">
            Question {currentQuestionIndex} of {totalQuestions}
          </div>
          <div className="card-body">
            <form onSubmit={this.handleSubmit} className="form">
              <div className="mb-3">
                <label htmlFor="questionType" className="form-label">
                  Question Type:
                </label>
                <select
                  id="questionType"
                  name="type"
                  value={this.state.type}
                  onChange={this.handleChange}
                  className="form-select"
                >
                  {Question.TYPES.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="points" className="form-label">
                  Points:
                </label>
                <input
                  id="points"
                  type="number"
                  name="points"
                  value={this.state.points}
                  onChange={this.handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="prompt" className="form-label">
                  Prompt:
                </label>
                <input
                  id="prompt"
                  type="text"
                  name="prompt"
                  value={this.state.prompt}
                  onChange={this.handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="promptImage" className="form-label">
                  Image URL:
                </label>
                <input
                  id="promptImage"
                  type="text"
                  name="promptImage"
                  value={this.state.promptImage}
                  onChange={this.handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Choices:</label>
                {this.renderChoices()}
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionForm;
