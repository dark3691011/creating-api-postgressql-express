"use strict";

var dbm;
var type;
var seed;
var fs = require("fs");
var path = require("path");
var Promise;

const mockUser = require("../dist/src/models/mock/user.mock.js");
const bcrypt = require("bcrypt");

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS || "10";

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function (db) {
  var filePath = path.join(__dirname, "sqls", "20240406063826-user-up.sql");
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
      if (err) return reject(err);
      console.log("received data: " + data);

      resolve(data);
    });
  }).then(async function (data) {
    await db.runSql(data);
    const mock = mockUser?.default;
    if (mock)
      for (let item of mock) {
        const hash = bcrypt.hashSync(
          item.password + pepper,
          parseInt(saltRounds)
        );
        await db.insert(
          "users",
          ["user_name", "first_name", "last_name", "password"],
          [item.userName, item.firstName, item.lastName, hash],
          {}
        );
      }
  });
};

exports.down = function (db) {
  var filePath = path.join(__dirname, "sqls", "20240406063826-user-down.sql");
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
      if (err) return reject(err);
      console.log("received data: " + data);

      resolve(data);
    });
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports._meta = {
  version: 1,
};
