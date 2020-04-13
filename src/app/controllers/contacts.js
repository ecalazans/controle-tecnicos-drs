const Contact = require('../models/Contact');

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(contacts) {

                const pagination = {
                    total: Math.ceil(contacts[0].total / limit),
                    page
                }

                return res.render('contacts/index', { contacts, pagination, filter })
            }
        };

        Contact.paginate(params);

    },
    create(req, res) {
        return res.render('contacts/create');
    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill all fields")
        }

        Contact.create(req.body, function(contact) {
            return res.redirect(`/contacts/${contact.id}`)
        });

    },
    show(req, res) {
        Contact.find(req.params.id, function(contact) {
            if(!contact) return res.send("Contact not Found")

            return res.render('contacts/show', { contact })
        });
    },
    edit(req, res) {
        Contact.find(req.params.id, function(contact) {
            if(!contact) return res.send("Contact not Found")

            return res.render('contacts/edit', { contact })
        });
    },
    put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if(req.body[key] == ""){
                return res.send("Please, fill a fields!")
            }
        }

        Contact.update(req.body, function() {
            return res.redirect(`/contacts/${req.body.id}`)
        });
    },
    delete(req, res) {
        Contact.delete(req.body.id, function() {
            return res.redirect('/contacts')
        });
    },
}