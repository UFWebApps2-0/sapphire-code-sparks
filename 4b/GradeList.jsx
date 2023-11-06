function GradeList ({data, selectedUpdate, filterText}){
    //Display scrollable list of studetn - grade data
    const gradeList = data.filter(directory => {
      return(
        directory.name.toLowerCase().includes(filterText.toLowerCase()) || directory.code.toLowerCase().includes(filterText.toLowerCase())
      );
    })
    .map(directory => {
      return (
            // TODO: Update once json formatting for how student name/id and grade are associated
            <tr key={directory.id} onClick={()=>selectedUpdate(directory.id)}>
              <td>{directory.name} </td>
              <td> {directory.grade} </td>
            </tr>          
        );
      });
    return <>{gradeList}</>;
  }
  
  export default GradeList;
  