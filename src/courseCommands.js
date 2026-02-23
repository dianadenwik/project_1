import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';

function addCourse(name, startDate) {
  // TODO: Implement logic
  if (!name || !startDate) {
    console.log(`ERROR: Must provide course name and start date `);
    return;
  }
  const courses = loadCourseData();

  const id = Math.floor(Math.random() * 100000);

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(startDate)) {
    console.log('ERROR: Invalid start date. Must be in yyyy-MM-dd format');
    return;
  }

  const newCourse = {
    id: id,
    name: name,
    startDate: startDate,
    participants: [],
  };

  courses.push(newCourse);
  saveCourseData(courses);

  console.log(`CREATED: ${id} ${name} ${startDate}`);
}

function updateCourse(id, name, startDate) {
  // TODO: Implement logic
  if (!id || !name || !startDate) {
    console.log(`ERROR: Must provide ID, name and start date `);
    return;
  }
  const courses = loadCourseData();
  const foundCourse = courses.find((course) => course.id === id);
  if (!foundCourse) {
    console.log(`ERROR: Course with ID ${id} does not exist`);
    return;
  }
  foundCourse.name = name;
  foundCourse.startDate = startDate;

  saveCourseData(courses);
  console.log(`UPDATED: ${id} ${name} ${startDate}`);
}

function deleteCourse(id) {
  // TODO: Implement logic
  const courses = loadCourseData();

  const foundCourse = courses.find((course) => course.id === id);
  if (!foundCourse) {
    console.log(`ERROR: Course with ID ${id} does not exist`);
    return;
  }
  // delete
  const index = courses.indexOf(foundCourse);
  courses.splice(index, 1);
  //save
  saveCourseData(courses);
  console.log(`DELETED: ${foundCourse.id} ${foundCourse.name}`);
}

function joinCourse(courseID, traineeID) {
  // TODO: Implement logic
  if (!courseID || !traineeID) {
    console.log('ERROR: Must provide course ID and trainee ID');
    return;
  }
  const courses = loadCourseData();
  const foundCourse = courses.find((course) => course.id === Number(courseID));
  if (!foundCourse) {
    console.log(`ERROR: Course with ID ${courseID} does not exist`);
    return;
  }
  const trainees = loadTraineeData();
  // find the trainee
  const foundTrainee = trainees.find(
    (trainee) => trainee.id === Number(traineeID)
  );
  if (!foundTrainee) {
    console.log(`ERROR: Trainee with ID ${traineeID} does not exist`);
    return;
  }

  if (foundCourse.participants.includes(Number(traineeID))) {
    console.log('ERROR: The Trainee has already joined this course');
    return;
  }
  if (foundCourse.participants.length >= 20) {
    console.log('ERROR: The course is full');
    return;
  }

  const traineeCourses = courses.filter((course) =>
    course.participants.includes(Number(traineeID))
  );
  if (traineeCourses.length >= 5) {
    console.log('ERROR: A trainee is not allowed to join more than 5 courses.');
    return;
  }
  foundCourse.participants.push(Number(traineeID));
  saveCourseData(courses);
  console.log(`${foundTrainee.firstName} joined ${foundCourse.name}`);
}

function leaveCourse(courseID, traineeID) {
  // TODO: Implement logic
  if (!courseID || !traineeID) {
    console.log('ERROR: Must provide course ID and trainee ID');
    return;
  }
  const courses = loadCourseData();

  const foundCourse = courses.find((course) => course.id === Number(courseID));
  if (!foundCourse) {
    console.log(`ERROR: Course with ID ${courseID} does not exist`);
    return;
  }
  const trainees = loadTraineeData();

  const foundTrainee = trainees.find(
    (trainee) => trainee.id === Number(traineeID)
  );
  if (!foundTrainee) {
    console.log(`ERROR: Trainee with ID ${traineeID} does not exist`);
    return;
  }
  if (!foundCourse.participants.includes(traineeID)) {
    console.log(`ERROR: The Trainee did not join the course`);
    return;
  }

  foundCourse.participants = foundCourse.participants.filter(
    (id) => id !== Number(traineeID)
  );
  saveCourseData(courses);

  console.log(`${foundTrainee.firstName}  left ${foundCourse.name}`);
}

function getCourse(id) {
  // TODO: Implement logic
  const courses = loadCourseData();

  const foundCourse = courses.find((course) => course.id === Number(id));
  if (!foundCourse) {
    console.log(`ERROR: Course with ID ${id} does not exist`);
    return;
  }
  const trainees = loadTraineeData();

  console.log(`${foundCourse.id} ${foundCourse.name} ${foundCourse.startDate}`);

  console.log(`Participants (${foundCourse.participants.length}):`);

  foundCourse.participants.forEach((participantId) => {
    const trainee = trainees.find((t) => t.id === participantId);
    if (trainee) {
      console.log(`- ${trainee.id} ${trainee.firstName} ${trainee.lastName}`);
    }
  });
}

function getAllCourses() {
  const courses = loadCourseData();
  const sortedByStartDate = courses.sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );
  console.log('Courses:');


  sortedByStartDate.forEach((course) => {
    const fullLabel = course.participants.length >= 20 ? 'FULL' : '';
    console.log(`${course.id} ${course.name} ${course.startDate} ${fullLabel}`);
  });
  console.log(`\nTotal: ${courses.length}`);
}

export function handleCourseCommand(subcommand, args) {
  // Read the subcommand and call the appropriate function with the arguments
  switch (subcommand) {
    case 'ADD':
      addCourse(args[0], args[1], args[3]);
      break;
    case 'UPDATE':
      updateCourse(Number(args[0]), args[1], args[2]);
      break;
    case 'DELETE':
      deleteCourse(Number(args[0]));
      break;
    case 'JOIN':
      joinCourse(Number(args[0]), args[1]);
      break;
    case 'LEAVE':
      leaveCourse(Number(args[0]), args[1]);
      break;
    case 'GET':
      getCourse(Number(args[0]));
      break;
    case 'GETALL':
      getAllCourses();
      break;
  }
}
