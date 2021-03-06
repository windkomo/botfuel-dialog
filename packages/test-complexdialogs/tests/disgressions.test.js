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
/* eslint-disable prefer-arrow-callback */

const { Bot, BotTextMessage, UserTextMessage } = require('botfuel-dialog');
const config = require('../test-config');

describe('Disgressions', () => {
  describe(
    'One turn',
    () => {
      test('should handle digressions', async () => {
        const bot = new Bot(config);
        const userId = bot.adapter.userId;
        await bot.play([
          new UserTextMessage('I am leaving from Paris'),
          new UserTextMessage('Hello'),
          new UserTextMessage('tomorrow'),
        ]);
        expect(bot.adapter.log).toEqual(
          [
            new UserTextMessage('I am leaving from Paris'),
            new BotTextMessage('Entities defined: city'),
            new BotTextMessage('Entities needed: time'),
            new BotTextMessage('Which time?'),
            new UserTextMessage('Hello'),
            new BotTextMessage('Hello human!'),
            new BotTextMessage('Entities defined: city'),
            new BotTextMessage('Entities needed: time'),
            new BotTextMessage('Which time?'),
            new UserTextMessage('tomorrow'),
            new BotTextMessage('Entities defined: time, city'),
          ].map(msg => msg.toJson(userId)),
        );
        const user = await bot.brain.getUser(userId);
        const dialogs = await bot.brain.getDialogs(userId);
        const lastConversation = await bot.brain.getLastConversation(userId);
        expect(user.conversations.length).toBe(1);
        expect(dialogs.stack).toHaveLength(0);
        expect(lastConversation).toHaveProperty('travel');
        expect(lastConversation.travel).toHaveProperty('city');
        expect(lastConversation.travel).toHaveProperty('time');
        expect(lastConversation.travel.city.body).toBe('Paris');
        expect(lastConversation.travel.time.body).toBe('tomorrow');
      });
    },
    15000,
  );

  describe(
    'Two turns',
    () => {
      test('should handle two turn digressions', async () => {
        const bot = new Bot(config);
        const userId = bot.adapter.userId;
        await bot.play([
          new UserTextMessage('I leave from Paris'),
          new UserTextMessage('Ask me my name'),
          new UserTextMessage('John'),
          new UserTextMessage('tomorrow'),
        ]);
        expect(bot.adapter.log).toEqual(
          [
            new UserTextMessage('I leave from Paris'),
            new BotTextMessage('Entities defined: city'),
            new BotTextMessage('Entities needed: time'),
            new BotTextMessage('Which time?'),
            new UserTextMessage('Ask me my name'),
            new BotTextMessage('Entities defined: '),
            new BotTextMessage('Entities needed: name'),
            new BotTextMessage('Which name?'),
            new UserTextMessage('John'),
            new BotTextMessage('Entities defined: name'),
            new BotTextMessage('Entities defined: city'),
            new BotTextMessage('Entities needed: time'),
            new BotTextMessage('Which time?'),
            new UserTextMessage('tomorrow'),
            new BotTextMessage('Entities defined: time, city'),
          ].map(msg => msg.toJson(userId)),
        );
        const user = await bot.brain.getUser(bot.adapter.userId);
        const dialogs = await bot.brain.getDialogs(userId);
        const lastConversation = await bot.brain.getLastConversation(bot.adapter.userId);
        expect(user.conversations.length).toBe(1);
        expect(dialogs.stack).toHaveLength(0);
        expect(lastConversation).toHaveProperty('travel');
        expect(lastConversation.travel).toHaveProperty('city');
        expect(lastConversation.travel).toHaveProperty('time');
        expect(lastConversation.travel.city.body).toBe('Paris');
        expect(lastConversation.travel.time.body).toBe('tomorrow');
        expect(lastConversation.name).toHaveProperty('name');
        expect(lastConversation.name.name.body).toBe('John');
      });
    },
    15000,
  );
});
