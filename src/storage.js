import fs from 'node:fs';

const TRAINEE_DATA_FILE_PATH = './data/trainees.json';
const COURSE_DATA_FILE_PATH = './data/courses.json';

export function loadTraineeData() {
  // Use the fs module to read the trainees.json file and
  //  return the data as a JavaScript object  
  const data = fs.readFileSync(TRAINEE_DATA_FILE_PATH, 'utf-8')
return JSON.parse(data)
}

export function saveTraineeData(trainees) {
  // Use the fs module to write the updated trainee data back
  //  to the trainees.json file 
  const data = JSON.stringify(trainees, null, 2)
   fs.writeFileSync(TRAINEE_DATA_FILE_PATH, data)
}


export function loadCourseData() {
  const data = fs.readFileSync(COURSE_DATA_FILE_PATH, 'utf-8')
  return JSON.parse(data)
}

export function saveCourseData() {
  // TODO: Implement
   const data = JSON.stringify(trainees, null, 2)
  fs.writeFileSync(COURSE_DATA_FILE_PATH, data)
}

