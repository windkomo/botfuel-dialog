/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint prefer-arrow-callback: "off" */

const {
  Bot,
  ActionsMessage,
  BotTextMessage,
  Postback,
  UserTextMessage,
} = require('botfuel-dialog');
const config = require('../test-config');

describe('Qna', () => {
  test('should respond when not understood', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Where is bryan ?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Where is bryan ?'),
        new BotTextMessage(
          'I’m sorry, I did not understand your question. Please reach us at contact@my-sample-compagny.com for further assistance.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('default');
  });

  test('should respond with many qnas when question not fully understood', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('get an invoice')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('get an invoice'),
        new BotTextMessage('What do you mean?'),
        new ActionsMessage([
          new Postback('Will I get an invoice?', 'qnas', [
            {
              dim: 'qnas',
              value: [
                {
                  answer:
                    'The invoice for your purchase will be sent along with your goods. You can also download an electronic version from your account.',
                },
              ],
            },
          ]),
          new Postback('Can I get an invoice ?', 'qnas', [
            {
              dim: 'qnas',
              value: [
                {
                  answer:
                    'Of curse! The invoice for your purchase will be sent along with your goods. You can also download an electronic version from your account.',
                },
              ],
            },
          ]),
        ]),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(1);
    expect(dialogs.stack[0].name).toBe('qnas');
    expect(dialogs.previous).toHaveLength(0);
  });

  test('should respond to hello', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Hello')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Hello'),
        new BotTextMessage(
          'Hello! I can provide you with information about our payment and shipping policies.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond to invoice question', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Could you send me an invoice please?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Could you send me an invoice please?'),
        new BotTextMessage(
          'The invoice for your purchase will be sent along with your goods. You can also download an electronic version from your account.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond to assistance need', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('A have a problem on the website.')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('A have a problem on the website.'),
        new BotTextMessage(
          'Please reach us at contact@my-sample-compagny.com for further assistance.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond question about payment options', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Can I pay in bitcoins?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Can I pay in bitcoins?'),
        new BotTextMessage(
          'You can pay for your purchase with Visa, Mastercard or using a PayPal account.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });

  test('should respond to question about shipping policy', async () => {
    const bot = new Bot(config);
    const userId = bot.adapter.userId;
    await bot.play([new UserTextMessage('Do you ship to France?')]);
    expect(bot.adapter.log).toEqual(
      [
        new UserTextMessage('Do you ship to France?'),
        new BotTextMessage(
          'Your purchase can be shipped worldwide. However, delivery charges may vary.',
        ),
      ].map(msg => msg.toJson(userId)),
    );
    const user = await bot.brain.getUser(userId);
    const dialogs = await bot.brain.getDialogs(userId);
    expect(user.userId).toBe(userId);
    expect(user.conversations.length).toBe(1);
    expect(dialogs.stack.length).toBe(0);
    expect(dialogs.previous.length).toBe(1);
    expect(dialogs.previous[0].name).toBe('qnas');
  });
});
