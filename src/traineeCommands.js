import { saveTraineeData, loadTraineeData, loadCourseData } from './storage.js';

export function addTrainee(firstName, lastName) {
  if (!firstName || !lastName) {
    console.log('ERROR: Must provide first and last name');
    return;
  }

  // take info from trainees
  const data = loadTraineeData();
  //a random number for id //
  const id = Math.floor(Math.random() * 100000);

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
  if (!id || !firstName || !lastName) {
    console.log(`ERROR: Must provide id, first name and last name`);
    return;
  }
  // load the list
  const trainees = loadTraineeData();
  // find the trainee id
  const foundTrainee = trainees.find((trainee) => trainee.id === id);
  if (!foundTrainee) {
    console.log(`ERROR: Trainee with ID ${id} does not exist`);
    return;
  }

  //replace firstname or lastname
  foundTrainee.firstName = firstName;
  foundTrainee.lastName = lastName;

  //save
  saveTraineeData(trainees);

  console.log(`UPDATED: ${id} ${firstName} ${lastName}`);
}

function deleteTrainee(id) {
  // load the list
  const trainees = loadTraineeData();
  // find the trainee
  const foundTrainee = trainees.find((trainee) => trainee.id === id);
  if (!foundTrainee) {
    console.log(`ERROR: Trainee with ID ${id} does not exist`);
    return;
  }
  // delete
  const index = trainees.indexOf(foundTrainee);
  trainees.splice(index, 1);
  //save
  saveTraineeData(trainees);
  console.log(`DELETED: ${id} ${firstName} ${lastName}`);
}

function fetchTrainee(id) {
  // TODO: Implement the logic
  const trainees = loadTraineeData();
  const foundTrainee = trainees.find((trainee) => trainee.id === Number(id));
  if (!foundTrainee) {
    console.log(`ERROR: Trainee with ID ${id} does not exist`);
    return;
  }
  //load courses
  const courses = loadCourseData();
  //find all courses where id tr
  const foundCourses = courses.filter((course) =>
    course.participants.includes(foundTrainee.id)
  );
  //extract c names and join() them into string
  const courseName =
    foundCourses.length > 0
      ? foundCourses.map((course) => course.name).join(',')
      : 'None';

  console.log(`${foundTrainee.id} ${foundTrainee.firstName} ${foundTrainee.lastName}
 Courses: ${courseName}`);
}

function fetchAllTrainees() {
  const trainees = loadTraineeData();

  const sortedByLastName = trainees.sort((a, b) => a.lastName - b.lastName);

  console.log(`Trainees:`);

  sortedByLastName.forEach((trainee) => {
    console.log(`${trainee.id} ${trainee.firstName} ${trainee.lastName}`);
  });

  console.log('\nTotal:' + sortedByLastName.length);
  // TODO: Implement the logic
}

export function handleTraineeCommand(subcommand, args) {
  // Read the subcommand and call the appropriate function with the arguments
  switch (subcommand) {
    case 'ADD':
      addTrainee(args[0], args[1]);
      break;

    case 'UPDATE':
      updateTrainee(Number(args[0]), args[1], args[2]);
      break;
    case 'DELETE':
      deleteTrainee(Number(args[0]));
      break;
    case 'GET':
      fetchTrainee(Number(args[0]));
    case 'GETALL':
      fetchAllTrainees();
  }
}
