const Dialog = require('./dialog');

function removeThose(array, predicate) {
  var removed = [];

  for (var i = 0; i < array.length;) {

      if (predicate(array[i])) {
          removed.push(array.splice(i, 1)[0]);
          continue;
      }

      i++;                
  }

  return removed;
}

/**
 * PromptDialog class.
 */
class PromptDialog extends Dialog {
  constructor(config, brain, parameters) {
    super(config, brain, parameters);
    this.maxComplexity = Object.keys(parameters.entities).length + 1;
  }

  /**
   * Executes.
   * @param {string} id the user id
   * @param {Object[]} responses
   * @param {Object[]} messageEntities - entities array from user message
   */
  async execute(id, responses, messageEntities, confirmDialog) {
    console.warn('PromptDialog.execute', id, responses, messageEntities, confirmDialog);
    const localMessageEntities = removeThose(messageEntities, entity => this.parameters.entities[entity.dim] !== undefined);
    console.warn('PromptDialog.execute: remaindersMessageEntities', messageEntities, this.parameters.entities);
    console.warn('PromptDialog.execute: filteredMessageEntities', localMessageEntities, this.parameters.entities);
    const dialogEntities = await this.brain.conversationGet(id, this.parameters.namespace) || {};
    for (const messageEntity of localMessageEntities) {
      dialogEntities[messageEntity.dim] = messageEntity;
    }
    console.warn('PromptDialog.execute: dialogEntities', dialogEntities);
    await this.brain.conversationSet(id, this.parameters.namespace, dialogEntities);
    this.confirm(id, responses, localMessageEntities, confirmDialog);
    const missingEntities = Object
          .keys(this.parameters.entities)
          .filter(entityKey => dialogEntities[entityKey] === undefined);
    this.ask(id, responses, missingEntities);

    const done = missingEntities.length === 0;
    if (done) {
      this.pushMessages(responses, this.textMessages(id, `${this.parameters.namespace}_finish`, {}));
    }
    return done;
  }

  ask(id, responses, entities) {
    console.warn('PromptDialog.ask', id, responses, entities);
    // TODO: put all this in a single template
    for (const entityKey of entities) {
      this.pushMessages(responses, this.textMessages(id,
                                                     `${this.parameters.namespace}_${entityKey}_ask`,
                                                     { entity: entityKey }));
    }
  }

  confirm(id, responses, entities, confirmDialog) {
    console.warn('PromptDialog.confirm', id, responses, entities, confirmDialog);
    // TODO: put all this in a single template
    if (confirmDialog) {
      this.pushMessages(responses, this.textMessages(id,
                                                     `${this.parameters.namespace}_confirm`));
    }
    for (const entity of entities) {
      this.pushMessages(responses, this.textMessages(id,
                                                     `${this.parameters.namespace}_${entity.dim}_confirm`,
                                                     { entity }));
    }
  }

  getBack(id, responses) {
    this.pushMessages(responses, this.textMessages(id,`${this.parameters.namespace}_goback`,{}));
  }
}

module.exports = PromptDialog;
