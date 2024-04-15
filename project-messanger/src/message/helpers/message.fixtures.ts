import { faker } from '@faker-js/faker';

export const defaultText = 'Hola mi amor';

export function defaultMessage(text = defaultText) {
  return {
    text,
    creator: faker.database.mongodbObjectId(),
    chat: faker.database.mongodbObjectId(),
    created: faker.date.anytime(),
    read: faker.date.anytime(),
  };
}

export function messageTest() {
  return {
    text: faker.word.noun(),
    creator: '65622c88cc855ee6e780c183',
    chat: faker.database.mongodbObjectId().toString(),
    created: faker.date.anytime(),
    read: faker.date.anytime(),
  };
}

export function updateMessage() {
  return {
    id: faker.database.mongodbObjectId().toString(),
    text: defaultText,
    creator: faker.database.mongodbObjectId().toString(),
    chat: faker.database.mongodbObjectId().toString(),
  };
}

export function removeMessage() {
  const id = '65622c88cc855ee6e780c183';
  const message = defaultText;
  const creator = faker.database.mongodbObjectId().toString();
  const chat = faker.database.mongodbObjectId().toString();
  return {
    id,
    message,
    creator,
    chat,
  };
}

export const messageId = '65622c88cc855ee6e780c183';

export const messageIdTest = faker.database.mongodbObjectId();
