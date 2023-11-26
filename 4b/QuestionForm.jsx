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
          choices: [{ text: "", isCorrect: false }]
        };
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChoiceChange = (index, key, value) => {
    let choices = [...this.state.choices];

    if (
      (this.state.type === "dropDown" ||
        this.state.type === "multipleChoice") &&
      key === "isCorrect"
    ) {
      // For dropdown, ensure only one choice is marked as correct
      choices = choices.map((choice, idx) => ({
        ...choice,
        isCorrect: idx === index ? value : false
      }));
    } else {
      // For other types, update normally
      choices[index] = { ...choices[index], [key]: value };
    }

    this.setState({ choices });
  };

  handleAddChoice = () => {
    this.setState((prevState) => ({
      choices: [...prevState.choices, { text: "", isCorrect: false }]
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
    const { type, choices } = this.state;
    switch (type) {
      case "multipleChoice":
        return (
          <div>
            {choices.map((choice, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) =>
                    this.handleChoiceChange(index, "text", e.target.value)
                  }
                />
                <input
                  type="radio"
                  name="isCorrect"
                  checked={choice.isCorrect}
                  onChange={(e) =>
                    this.handleChoiceChange(
                      index,
                      "isCorrect",
                      e.target.checked
                    )
                  }
                />
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
      case "multiSelect":
        return (
          <div>
            {choices.map((choice, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) =>
                    this.handleChoiceChange(index, "text", e.target.value)
                  }
                />
                <input
                  type="checkbox"
                  checked={choice.isCorrect}
                  onChange={(e) =>
                    this.handleChoiceChange(
                      index,
                      "isCorrect",
                      e.target.checked
                    )
                  }
                />
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
      case "dropDown":
        return (
          <div>
            {choices.map((choice, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) =>
                    this.handleChoiceChange(index, "text", e.target.value)
                  }
                />
                <input
                  type="radio"
                  name="correctChoice"
                  checked={choice.isCorrect}
                  onChange={(e) =>
                    this.handleChoiceChange(
                      index,
                      "isCorrect",
                      e.target.checked
                    )
                  }
                />
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
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="card">
        <form
          onSubmit={this.handleSubmit}
          className="flex-container flex-column"
        >
          <div className="form-section">
            <label>Question Type:</label>
            <select
              name="type"
              value={this.state.type}
              onChange={this.handleChange}
              className="form-control"
            >
              {Question.TYPES.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-section">
            <label>Points:</label>
            <input
              type="number"
              name="points"
              value={this.state.points}
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
          <div className="form-section">
            <label>Prompt:</label>
            <input
              type="text"
              name="prompt"
              value={this.state.prompt}
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
          <div className="form-section">
            <label>Image URL:</label>
            <input
              type="text"
              name="promptImage"
              value={this.state.promptImage}
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
          <div className="form-section">
            <label>Choices:</label>
            {this.renderChoices()}
          </div>
          <div className="form-section">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default QuestionForm;
