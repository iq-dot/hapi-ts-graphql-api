'use strict';

let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('post', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    title: { type: 'string', notNull: true },
    content: { type: 'text', notNull: true },
    author_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'auth_user_id_fk',
        table: 'user',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
        }
      }
    },
  });
};

exports.down = function (db) {
  return db.dropTable('post');
};

exports._meta = {
  version: 1,
};
