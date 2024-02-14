'use strict'

module.exports = function updateDateFields (schema, options) {
  if (!schema.path('createdAt')) {
    schema.add({ createdAt: Date })
  }

  schema.pre('insertMany', function (next, docs) {
    // Custom logic before inserting multiple documents
    docs.forEach(doc => {
      doc.createdAt = new Date();
    });
    next();
  });
}
