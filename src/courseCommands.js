import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';

import chalk from 'chalk';

function addCourse(name, startDate) {
  if (!name || !startDate) {
    console.log(chalk.red(`ERROR: Must provide course name and start date `));
    return;
  }
  const courses = loadCourseData();

  const id = Math.floor(Math.random() * 100000);

  // validate date format - must be yyyy-MM-dd
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate)) {
    console.log(
      chalk.red('ERROR: Invalid start date. Must be in yyyy-MM-dd format')
    );
    return;
  }

  // create a new course object with empty participants list
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
  if (!id || !name || !startDate) {
    console.log(chalk.red(`ERROR: Must provide ID, name and start date `));
    return;
  }

  const courses = loadCourseData();

  // find the course by ID in the list
  const foundCourse = courses.find((course) => course.id === id);
  if (!foundCourse) {
    console.log(chalk.red(`ERROR: Course with ID ${id} does not exist`));
    return;
  }

  // replace old name and start date with new ones
  foundCourse.name = name;
  foundCourse.startDate = startDate;

  saveCourseData(courses);
  console.log(`UPDATED: ${id} ${name} ${startDate}`);
}

function deleteCourse(id) {
  const courses = loadCourseData();

  // find the course by ID in the list
  const foundCourse = courses.find((course) => course.id === id);
  if (!foundCourse) {
    console.log(chalk.red(`ERROR: Course with ID ${id} does not exist`));
    return;
  }
  // find the position of the course in the list and remove 1 element at that position
  const index = courses.indexOf(foundCourse);
  courses.splice(index, 1);

  // save the updated list to the file
  saveCourseData(courses);
  console.log(`DELETED: ${foundCourse.id} ${foundCourse.name}`);
}

function joinCourse(courseID, traineeID) {
  if (!courseID || !traineeID) {
    console.log(chalk.red('ERROR: Must provide course ID and trainee ID'));
    return;
  }
  const courses = loadCourseData();
  //find the course by ID
  const foundCourse = courses.find((course) => course.id === courseID);
  if (!foundCourse) {
    console.log(chalk.red(`ERROR: Course with ID ${courseID} does not exist`));
    return;
  }
  const trainees = loadTraineeData();
  //find the trainee by ID
  const foundTrainee = trainees.find(
    (trainee) => trainee.id === Number(traineeID)
  );
  if (!foundTrainee) {
    console.log(
      chalk.red(`ERROR: Trainee with ID ${traineeID} does not exist`)
    );
    return;
  }

  //check if trainee already joined this course
  if (foundCourse.participants.includes(Number(traineeID))) {
    console.log(chalk.red('ERROR: The Trainee has already joined this course'));
    return;
  }

  // check if course has reached maximum capacity
  if (foundCourse.participants.length >= 20) {
    console.log(chalk.red('ERROR: The course is full'));
    return;
  }

  //find all courses this trainee has already joined
  const traineeCourses = courses.filter((course) =>
    course.participants.includes(Number(traineeID))
  );

  //check if trainee has reached maximum course enrolments
  if (traineeCourses.length >= 5) {
    console.log(
      chalk.red('ERROR: A trainee is not allowed to join more than 5 courses.')
    );
    return;
  }

  // add trainee ID to course participants
  foundCourse.participants.push(Number(traineeID));
  saveCourseData(courses);
  console.log(`${foundTrainee.firstName} joined ${foundCourse.name}`);
}

function leaveCourse(courseID, traineeID) {
  if (!courseID || !traineeID) {
    console.log(chalk.red('ERROR: Must provide course ID and trainee ID'));
    return;
  }
  const courses = loadCourseData();

  // find the course by ID
  const foundCourse = courses.find((course) => course.id === Number(courseID));
  if (!foundCourse) {
    console.log(chalk.red(`ERROR: Course with ID ${courseID} does not exist`));
    return;
  }
  const trainees = loadTraineeData();

  // find the trainee by ID
  const foundTrainee = trainees.find(
    (trainee) => trainee.id === Number(traineeID)
  );
  if (!foundTrainee) {
    console.log(
      chalk.red(`ERROR: Trainee with ID ${traineeID} does not exist`)
    );
    return;
  }

  // check if trainee is actually in this course
  if (!foundCourse.participants.includes(traineeID)) {
    console.log(chalk.red(`ERROR: The Trainee did not join the course`));
    return;
  }

  //  remove trainee ID from participants list
  foundCourse.participants = foundCourse.participants.filter(
    (id) => id !== Number(traineeID)
  );
  saveCourseData(courses);

  console.log(`${foundTrainee.firstName} left ${foundCourse.name}`);
}

function getCourse(id) {
  const courses = loadCourseData();

  // find the course by ID
  const foundCourse = courses.find((course) => course.id === Number(id));
  if (!foundCourse) {
    console.log(chalk.red(`ERROR: Course with ID ${id} does not exist`));
    return;
  }
  const trainees = loadTraineeData();

  // display course info
  console.log(`${foundCourse.id} ${foundCourse.name} ${foundCourse.startDate}`);

  console.log(`Participants (${foundCourse.participants.length}):`);

  //loop through each participant ID and find their full info
  foundCourse.participants.forEach((participantId) => {
    const trainee = trainees.find((t) => t.id === participantId);
    if (trainee) {
      console.log(`- ${trainee.id} ${trainee.firstName} ${trainee.lastName}`);
    }
  });
}

function getAllCourses() {
  const courses = loadCourseData();

  // sort courses chronologically by start date
  const sortedByStartDate = courses.sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );
  console.log('Courses:');

  // display each course one by one
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
    default:
      console.log(chalk.red(`ERROR: Unknown subcommand ${subcommand}`));
  }
}
