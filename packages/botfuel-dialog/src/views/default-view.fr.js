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

const logger = require('logtown')('DefaultView.fr');
const TextView = require('./text-view');

/**
 * Default text view for french.
 * @extends TextView
 */
class DefaultView extends TextView {
  /** @inheritDoc */
  getTexts(userMessage, data) {
    logger.debug('getTexts', userMessage, data);
    return ["Je n'ai pas compris."];
  }
}

module.exports = DefaultView;
