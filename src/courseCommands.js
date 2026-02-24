import { saveCourseData, loadCourseData, loadTraineeData } from './storage.js';

import { validateDate } from './helpers.js';
import chalk from 'chalk';

function addCourse(name, startDate) {
  if (!name || !startDate) {
    throw new Error(`ERROR: Must provide course name and start date `);
  }
  const courses = loadCourseData();

  const id = Math.floor(Math.random() * 100000);

  // validate date format - must be yyyy-MM-dd
  if (!validateDate(startDate)) {
    throw new Error('ERROR: Invalid start date. Must be in yyyy-MM-dd format');
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
    throw new Error(`ERROR: Must provide ID, name and start date `);
  }

  if (!validateDate(startDate)) {
    throw new Error('ERROR: Invalid start date. Must be in yyyy-MM-dd format');
  }

  const courses = loadCourseData();

  // find the course by ID in the list
  const foundCourse = courses.find((course) => course.id === id);
  if (!foundCourse) {
    throw new Error(`ERROR: Course with ID ${id} does not exist`);
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
    throw new Error(`ERROR: Course with ID ${id} does not exist`);
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
    throw new Error('ERROR: Must provide course ID and trainee ID');
  }
  const courses = loadCourseData();
  //find the course by ID
  const foundCourse = courses.find((course) => course.id === courseID);
  if (!foundCourse) {
    throw new Error(`ERROR: Course with ID ${courseID} does not exist`);
  }
  const trainees = loadTraineeData();
  //find the trainee by ID
  const foundTrainee = trainees.find(
    (trainee) => trainee.id === Number(traineeID)
  );
  if (!foundTrainee) {
    throw new Error(`ERROR: Trainee with ID ${traineeID} does not exist`);
  }

  //check if trainee already joined this course
  if (foundCourse.participants.includes(Number(traineeID))) {
    throw new Error('ERROR: The Trainee has already joined this course');
  }

  // check if course has reached maximum capacity
  if (foundCourse.participants.length >= 20) {
    throw new Error('ERROR: The course is full');
  }

  //find all courses this trainee has already joined
  const traineeCourses = courses.filter((course) =>
    course.participants.includes(Number(traineeID))
  );

  //check if trainee has reached maximum course enrolments
  if (traineeCourses.length >= 5) {
    throw new Error(
      'ERROR: A trainee is not allowed to join more than 5 courses.'
    );
  }

  // add trainee ID to course participants
  foundCourse.participants.push(Number(traineeID));
  saveCourseData(courses);
  console.log(`${foundTrainee.firstName} joined ${foundCourse.name}`);
}

function leaveCourse(courseID, traineeID) {
  if (!courseID || !traineeID) {
    throw new Error('ERROR: Must provide course ID and trainee ID');
  }
  const courses = loadCourseData();

  // find the course by ID
  const foundCourse = courses.find((course) => course.id === Number(courseID));
  if (!foundCourse) {
    throw new Error(`ERROR: Course with ID ${courseID} does not exist`);
  }
  const trainees = loadTraineeData();

  // find the trainee by ID
  const foundTrainee = trainees.find(
    (trainee) => trainee.id === Number(traineeID)
  );
  if (!foundTrainee) {
    throw new Error(`ERROR: Trainee with ID ${traineeID} does not exist`);
  }

  // check if trainee is actually in this course
  if (!foundCourse.participants.includes(traineeID)) {
    throw new Error(`ERROR: The Trainee did not join the course`);
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
    throw new Error(`ERROR: Course with ID ${id} does not exist`);
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
    case 'ADD': {
      const name = args[0];
      const startDate = args[1];
      addCourse(name, startDate);
      break;
    }
    case 'UPDATE': {
      const id = Number(args[0]);
      const name = args[1];
      const startDate = args[2];
      updateCourse(id, name, startDate);
      break;
    }
    case 'DELETE': {
      const id = Number(args[0]);
      deleteCourse(id);
      break;
    }
    case 'JOIN': {
      const courseId = Number(args[0]);
      const traineeId = Number(args[1]);
      joinCourse(courseId, traineeId);
      break;
    }
    case 'LEAVE': {
      const courseId = Number(args[0]);
      const traineeId = Number(args[1]);
      leaveCourse(courseId, traineeId);
      break;
    }
    case 'GET': {
      const id = Number(args[0]);
      getCourse(id);
      break;
    }
    case 'GETALL':
      getAllCourses();
      break;
    default:
      console.log(chalk.red(`ERROR: Unknown subcommand ${subcommand}`));
  }
}
