import { faker } from '@faker-js/faker';

export const defaultName = 'Kirill';

export function defaultUser(name = defaultName) {
  return {
    name,
    lastName: faker.word.words(),
    phoneNumber: faker.number.int(),
    email: faker.internet.email(),
    password: faker.word.words(),
    roles: [faker.person.jobType()],
    subLevel: faker.database.mongodbObjectId(),
  };
}

export function userTest() {
  return {
    name: faker.word.noun(),
    lastName: faker.word.words(),
    phoneNumber: faker.number.int(),
    email: faker.internet.email(),
    password: faker.word.words(),
    roles: [faker.person.jobType()],
    subLevel: faker.database.mongodbObjectId(),
  };
}

export const UserId = '65639ea784481de1430ea3e4';

export function updateUser() {
  const id = '65639ea784481de1430ea3e4';
  const name = defaultName;
  const lastName = 'Klimavtsov';
  const phoneNumber = 980812009240;
  const email = faker.internet.email();
  const password = faker.word.words();
  const roles = [faker.person.jobType()];
  const subLevel = faker.database.mongodbObjectId();
  return {
    id,
    name,
    lastName,
    phoneNumber,
    email,
    password,
    roles,
    subLevel,
  };
}

export function removeUser() {
  const id = '65639ea784481de1430ea3e4';
  const name = 'Alexey';
  const lastName = 'Klimavtsov';
  const phoneNumber = 980812009240;
  const email = faker.internet.email();
  const password = faker.word.words();
  const roles = [faker.person.jobType()];
  return {
    id,
    name,
    lastName,
    phoneNumber,
    email,
    password,
    roles,
  };
}
