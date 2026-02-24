import { saveTraineeData, loadTraineeData, loadCourseData } from './storage.js';

import chalk from 'chalk';

export function addTrainee(firstName, lastName) {
  if (!firstName || !lastName) {
    throw new Error('ERROR: Must provide first and last name');
  }

  // load existing trainees from the file
  const data = loadTraineeData();

  let id = Math.floor(Math.random() * 100000);

  //make sure the ID is unique - if it exists, generate a new one
  const idExists = data.some((a) => a.id === id);
  if (idExists) {
    id = Math.floor(Math.random() * 100000);
  }

  // add a new trainee
  const newTrainee = {
    id: id,
    firstName: firstName,
    lastName: lastName,
  };

  data.push(newTrainee);
  saveTraineeData(data);

  console.log(`CREATED: ${id} ${firstName} ${lastName}`);
}

export function updateTrainee(id, firstName, lastName) {
  if (!firstName || !lastName || !id) {
    throw new Error(`ERROR: Must provide id, first name and last name`);
  }
  // load the list
  const trainees = loadTraineeData();

  //find the trainee by ID in the list
  const foundTrainee = trainees.find((trainee) => trainee.id === Number(id));
  if (!foundTrainee) {
    throw new Error(`ERROR: Trainee with ID ${id} does not exist`);
  }

  //replace old firstname and lastname
  foundTrainee.firstName = firstName;
  foundTrainee.lastName = lastName;

  //save
  saveTraineeData(trainees);

  console.log(`UPDATED: ${id} ${firstName} ${lastName}`);
}

function deleteTrainee(id) {
  // load the list
  const trainees = loadTraineeData();

  // find the trainee by ID in the list
  const foundTrainee = trainees.find((trainee) => trainee.id === id);
  if (!foundTrainee) {
    throw new Error(`ERROR: Trainee with ID ${id} does not exist`);
  }
  // remove the trainee from the list
  const index = trainees.indexOf(foundTrainee);
  trainees.splice(index, 1);

  saveTraineeData(trainees);
  console.log(
    `DELETED: ${foundTrainee.id} ${foundTrainee.firstName} ${foundTrainee.lastName}`
  );
}

function fetchTrainee(id) {
  const trainees = loadTraineeData();

  //find the trainee by ID in the list
  const foundTrainee = trainees.find((trainee) => trainee.id === Number(id));
  if (!foundTrainee) {
    throw new Error(`ERROR: Trainee with ID ${id} does not exist`);
  }
  //load existing courses from the file
  const courses = loadCourseData();

  //find all courses where this trainee's ID is in participants
  const foundCourses = courses.filter((course) =>
    course.participants.includes(foundTrainee.id)
  );

  //extract course names and join them into one string
  const courseName =
    foundCourses.length > 0
      ? foundCourses.map((course) => course.name).join(',')
      : 'None';

  console.log(
    `${foundTrainee.id} ${foundTrainee.firstName} ${foundTrainee.lastName}`
  );
  console.log(`Courses: ${courseName}`);
}

function fetchAllTrainees() {
  const trainees = loadTraineeData();

  //sort trainees alphabetically by last name
  const sortedByLastName = trainees.sort((a, b) => a.lastName - b.lastName);

  console.log(`Trainees:`);

  sortedByLastName.forEach((trainee) => {
    console.log(`${trainee.id} ${trainee.firstName} ${trainee.lastName}`);
  });

  console.log('\nTotal:' + sortedByLastName.length);
}

export function handleTraineeCommand(subcommand, args) {
  // Read the subcommand and call the appropriate function with the arguments

  switch (subcommand) {
    case 'ADD': {
      const firstName = args[0];
      const lastName = args[1];
      addTrainee(firstName, lastName);
      break;
    }
    case 'UPDATE': {
      const id = Number(args[0]);
      const firstName = args[1];
      const lastName = args[2];
      updateTrainee(id, firstName, lastName);
      break;
    }
    case 'DELETE': {
      const id = Number(args[0]);
      deleteTrainee(id);
      break;
    }
    case 'GET': {
      const id = Number(args[0]);
      fetchTrainee(id);
      break;
    }
    case 'GETALL':
      fetchAllTrainees();
      break;
    default:
      console.log(chalk.red(`ERROR: Unknown subcommand ${subcommand}`));
  }
}
