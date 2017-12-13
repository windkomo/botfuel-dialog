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

const SdkError = require('./sdk-error');

module.exports = class DialogError extends SdkError {
  /**
   * @constructor
   * @param {String} message - the error message
   * @param {Object} dialog - the dialog in error
   */
  constructor({ message, dialog }) {
    super(message || 'Unknown DialogError');
    this.dialog = dialog;
  }
};
