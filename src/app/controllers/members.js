const { sectional } = require('../../lib/utils');
const Member = require('../models/Member');

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
            callback(members) {

                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                }

                return res.render('members/index', { members, pagination, filter })
            }
        };

        Member.paginate(params);
    },
    create(req, res) {

        Member.contactsSelectOptions(function(options) {
            return res.render('members/create', { contactOptions: options });
        });

    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill all fields")
        }

        Member.create(req.body, function(member) {
            return res.redirect(`/members/${member.id}`)
        });

    },
    show(req, res) {
        Member.find(req.params.id, function(member) {
            if(!member) return res.send("Member not Found")

            member.regional = sectional(member.regional);

            return res.render('members/show', { member })
        });
    },
    edit(req, res) {

        Member.find(req.params.id, function(member) {
            if(!member) return res.send("Member not Found")

            Member.contactsSelectOptions(function(options) {
                return res.render('members/edit', { member, contactOptions: options })
            });
        });
    },
    put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if(req.body[key] == ""){
                return res.send("Please, fill a fields!")
            }
        }

        Member.update(req.body, function() {
            return res.redirect(`/members/${req.body.id}`)
        });
    },
    delete(req, res) {
        Member.delete(req.body.id, function() {
            return res.redirect('/members')
        });
    },
}