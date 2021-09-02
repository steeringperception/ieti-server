const db = require('../models')
const { Op } = require('sequelize');
var base = require('base-converter');

async function updateBasics(uid, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  return db.user.update(data, { where: { uid } });
}
async function updateAcademicRecord(user, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  return db.academicRecord.scope('')
    .findOrCreate({ where: { user }, defaults: data })
    .then(r => r[0].update(data));
  // return db.academicRecord.update(data, { where: { uid } });
}
async function updateEmergencyContacts(user_uid, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  return db.emergency_contacts.scope('')
    .findOrCreate({ where: { user_uid }, defaults: data })
    .then(r => r[0].update(data));
  // return db.emergency_contacts.update(data, { where: { uid } })
}
async function updateExperience(user_uid, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  return db.experience.scope('')
    .findOrCreate({ where: { user_uid }, defaults: data })
    .then(r => r[0].update(data));
  // return db.experience.update(data, { where: { uid } })
}
async function updateChecklist(user_uid, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  return db.checklist.scope('')
    .findOrCreate({ where: { user_uid }, defaults: data })
    .then(r => r[0].update(data));
  // return db.checkist.update(data, { where: { uid } })
}
async function updateIdentity(user_uid, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  let promises = []
  data = Object.values(data);
  data.forEach(element => {
    promises.push(
      db.identity.scope('').findOrCreate({ where: { user_uid, id_type: element.id_type }, defaults: element })
        .then(r => r[0].update(element))
    )
  });
  return Promise.all(promises)
}
async function updateEducation(user_uid, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  data = Object.values(data);
  let promises = []
  data.forEach(element => {
    promises.push(
      db.education.scope('').findOrCreate({ where: { user_uid, lavel: element.lavel }, defaults: element })
        .then(r => r[0].update(element))
    )
  });
  return Promise.all(promises)
}
async function updateDocuments(user_uid, data) {
  if (!!!data) {
    return Promise.resolve();
  }
  data = Object.values(data);
  let promises = []
  data.forEach(element => {
    promises.push(
      db.document.scope('').findOrCreate({ where: { user_uid, document_name: element.document_name }, defaults: element })
        .then(r => r[0].update(element))
    )
  });
  return Promise.all(promises)
}

module.exports = {
  updateEnrollment: async (req, res, next) => {
    let data = req.body || {};
    return updateBasics(data.uid, data)
      .then(() => updateIdentity(data.uid, data.identity))
      .then(() => updateAcademicRecord(data.uid, data.academicRecord))
      .then(() => updateEmergencyContacts(data.uid, data.emergency_contact))
      .then(() => updateEducation(data.uid, data.education))
      .then(() => updateDocuments(data.uid, data.documents))
      .then(() => updateExperience(data.uid, data.experience))
      .then(() => updateChecklist(data.uid, data.checklist))
      .then(() => res.send({ status: true }))
      .catch(e => res.sendError(e))
  }
}

