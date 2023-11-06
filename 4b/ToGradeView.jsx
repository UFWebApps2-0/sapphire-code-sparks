function ToGradeView({data, selectedStudent}) {
    // TODO: Redirect to next page based off the selected students id/name and display full assessment grading info
    
    const bldg = data.find(dir =>{return(dir.id === selectedStudent);})

    if(bldg != undefined){
        return(null);//assesment page with grades
      }
  }
  
  export default ToGradeView;
  