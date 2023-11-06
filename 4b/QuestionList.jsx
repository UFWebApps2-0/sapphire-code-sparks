function QuestionList({ data, updateSelect }) {
  //Display each question
  const qList = data.map((qs) => {
    return (
      <tr onClick={() => updateSelect(qs)}>
        <td>
          {/* TODO: Add question display component to include necessary props */}{" "}
        </td>
        <td> Click to Edit </td>
      </tr>
    );
  });

  return (
    <table className="table table-hover" style={{ border: "1px solid black" }}>
      <tbody>{qList}</tbody>
    </table>
  );
}

export default QuestionList;
