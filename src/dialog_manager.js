const fs = require('fs');
const Dialog = require('./dialogs/dialog');

/**
 * Turns NLU output into a dialog stack.
 */
class DialogManager {
  /**
   * Constructor.
   */
  constructor(brain, config) {
    // console.log('DialogManager.constructor');
    this.brain = brain;
    this.config = config;
    this.intentThreshold = this.config.intentThreshold || 0.8;
  }

  getDialogPath(label) {
    // console.log('DialogManager.getDialogPath', label);
    const paths = [
      `${this.config.path}/src/controllers/dialogs/${label}.${this.config.adapter}`,
      `${this.config.path}/src/controllers/dialogs/${label}`,
      `${__dirname}/dialogs/${label}.${this.config.adapter}`,
      `${__dirname}/dialogs/${label}`,
    ];
    for (const path of paths) {
      // console.log('DialogManager.getDialogPath: path', path);
      if (fs.existsSync(`${path}.js`)) {
        return path;
      }
    }
    return null;
  }

  getDialog(dialog) {
    // console.log('DialogManager.getDialog', dialog);
    const path = this.getDialogPath(dialog.label);
    if (path === null) {
      return null;
    }
    const DialogConstructor = require(path);
    return new DialogConstructor(this.config, this.brain, DialogConstructor.params);
  }

  getDialogStatus(depth) {
    if (depth !== 0) {
      return Dialog.STATUS_BLOCKED;
    }
    return Dialog.STATUS_READY;
  }

  filterIntents(intents) {
    console.log('DialogManager.filterIntents', intents);
    return intents
      .filter(intent => intent.value > this.intentThreshold)
      .slice(0, 2)
      .sort((intent1, intent2) => {
        const dialog1 = this.getDialog(intent1);
        const dialog2 = this.getDialog(intent2);
        if (dialog1.maxComplexity !== dialog2.maxComplexity) {
          return dialog2.maxComplexity - dialog1.maxComplexity;
        }
        return intent1.value - intent2.value;
      });
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} dialogs - the dialogs
   * @param {Object[]} intents - the intents
   * @param {Object[]} entities - the entities
   */
  async updateDialogs(userId, dialogs, intents, entities) {
    console.log('DialogManager.updateDialogs', userId, dialogs, intents, entities);
    intents = this.filterIntents(intents);
    console.log('DialogManager.updateDialogs: intents', intents);
    for (let i = 0; i < intents.length; i++) {
      const label = intents[i].label;
      const status = this.getDialogStatus(intents.length - 1 - i);
      if (dialogs.length > 0 && dialogs[dialogs.length - 1].label === label) {
        dialogs[dialogs.length - 1].entities = entities;
        dialogs[dialogs.length - 1].status = status;
      } else {
        dialogs.push({ label, entities, status });
      }
    }
    if (dialogs.length === 0) { // no intent detected
      const dialog = await this.brain.userGet(userId, 'lastDialog');
      if (dialog !== undefined && dialog !== null) {
        dialogs.push({
          label: dialog.label,
          entities,
          status: Dialog.STATUS_READY,
        });
      } else {
        dialogs.push({
          label: 'default_dialog',
          entities,
          status: Dialog.STATUS_READY,
        });
      }
    }
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} dialogs - the dialogs
   */
  async executeDialogs(userId, dialogs) {
    console.log('DialogManager.executeDialogs', userId, dialogs);
    const responses = [];
    while (dialogs.length > 0) {
      console.log('DialogManager.executeDialogs: dialogs', dialogs);
      const dialog = dialogs[dialogs.length - 1];
      // eslint-disable-next-line no-await-in-loop
      await this.brain.userSet(userId, 'lastDialog', dialog);
      // eslint-disable-next-line no-await-in-loop
      dialog.status = await this
        .getDialog(dialog)
        .execute(userId, responses, dialog.entities || [], dialog.status);
      if (dialog.status === Dialog.STATUS_DISCARDED) {
        dialogs = dialogs.slice(0, -1);
        await this.brain.userSet(userId, 'lastDialog', null);
      } else if (dialog.status === Dialog.STATUS_COMPLETED) {
        dialogs = dialogs.slice(0, -1);
      } else { // ready or waiting
        break;
      }
    }
    await this.brain.userSet(userId, 'dialogs', dialogs);
    console.log('DialogManager.executeDialogs: responses', responses);
    return responses;
  }

  /**
   * Populates and executes the stack.
   * @param {string} userId the user id
   * @param {string[]} intents the intents
   * @param {Object[]} entities the transient entities
   */
  async execute(userId, intents, entities) {
    console.log('DialogManager.execute', userId, intents, entities);
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    await this.updateDialogs(userId, dialogs, intents, entities);
    return this.executeDialogs(userId, dialogs);
  }
}

module.exports = DialogManager;
