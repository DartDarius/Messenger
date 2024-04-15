import { faker } from '@faker-js/faker';

export const defaultInfo = 'Hello people!';

export const defaultStory = {
  info: defaultInfo,
  author: faker.database.mongodbObjectId().toString(),
  createdAt: faker.date.anytime(),
};

export const removeStory = {
  id: faker.database.mongodbObjectId().toString(),
  info: defaultInfo,
  author: faker.database.mongodbObjectId().toString(),
  createdAt: faker.date.anytime(),
};

export const storyId = '65ccd894623b6acfc695c332';
export const authUser = '65c13d79e3c90155c3888899';
