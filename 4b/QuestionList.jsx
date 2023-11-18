function QuestionList({ data, updateSelect, onDelete }) {
  //Display each question
  const qList = data.map((qs, index) => {
    return (
      <tr className="row" key={index}>
        <td>
          {/* TODO: Add question display component to include necessary props */}{" "}
          <p>
            {`${index + 1} `}: {`${qs.prompt}`}
            <br />
            type: {`${qs.type} `}| Points: {`${qs.points} `}
          </p>
          <button onClick={() => updateSelect(qs)}>Edit Question</button>
          <button
            style={{ marginLeft: "3%" }}
            onClick={() => {
              onDelete(index);
            }}
          >
            Delete Question
          </button>
          <ul>
            {qs.choices.map((c, index) => {
              if (qs.answers[index]) {
                return (
                  <li key={c} style={{ backgroundColor: "green" }}>{`${c}`}</li>
                );
              } else {
                return (
                  <li key={c} style={{ backgroundColor: "red" }}>{`${c}`}</li>
                );
              }
            })}
          </ul>
        </td>
      </tr>
    );
  });

  return (
    <table
      className="table table-hover table-bordered"
      style={{ border: "1px solid black" }}
    >
      <tbody>{qList}</tbody>
    </table>
  );
}

export default QuestionList;
