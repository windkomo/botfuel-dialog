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

const logger = require('logtown')('QnasDialog');
const Dialog = require('./dialog');

/**
 * The qnas dialog
 * either answers the user's question when there is a single answer
 * or displays several alternatives otherwise.
 * @extends Dialog
 */
class QnasDialog extends Dialog {
  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   */
  constructor(config, brain) {
    super(config, brain, { reentrant: false });
  }

  /** @inheritDoc */
  async execute(adapter, userMessage, messageEntities) {
    logger.debug('execute', userMessage, messageEntities);
    const extraData = await this.dialogWillDisplay(userMessage, messageEntities);
    const qnas = messageEntities[0].value;
    const dialogData = { messageEntities, qnas, extraData };
    await this.display(adapter, userMessage, dialogData);
    if (qnas.length === 1) {
      const action = await this.dialogWillComplete(userMessage, dialogData);
      return action || this.complete();
    }
    return this.wait();
  }
}

module.exports = QnasDialog;
