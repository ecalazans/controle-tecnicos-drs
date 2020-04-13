const express = require('express');
const routes = express.Router();
const contacts = require('./app/controllers/contacts');
const members = require('./app/controllers/members');

routes.get("/", function(req, res) {
    return res.redirect('/contacts');
});

routes.get("/contacts", contacts.index);
routes.get("/contacts/create", contacts.create);
routes.get("/contacts/:id", contacts.show);
routes.get("/contacts/:id/edit", contacts.edit);
routes.post("/contacts", contacts.post);
routes.put("/contacts", contacts.put);
routes.delete("/contacts", contacts.delete);



routes.get("/members", members.index);
routes.get("/members/create", members.create);
routes.get("/members/:id", members.show);
routes.get("/members/:id/edit", members.edit);
routes.post("/members", members.post);
routes.put("/members", members.put);
routes.delete("/members", members.delete);

module.exports = routes;