const db = require('../../config/db');

module.exports = {
    all(callback) {

        db.query(`
        SELECT members.*, contacts.name AS contact_name
        FROM members
        LEFT JOIN contacts ON (members.contact_id = contacts.id)
        `, function(err, results) {
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows);
        });

    },
    create(data, callback) {
        const query = `
            INSERT INTO members (
                name,
                avatar_url,
                email,
                unity,
                contact,
                regional,
                contact_id,
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.name,
            data.avatar_url,
            data.email,
            data.unity,
            data.contact,
            data.regional,
            data.contact_tec,
        ]

        db.query(query, values, function(err, results) {
            if(err) throw "Database Error"

            callback(results.rows[0]);
        });
    },
    find(id, callback) {
        db.query(`
            SELECT members.*, contacts.name AS contact_name
            FROM members
            LEFT JOIN contacts ON (members.contact_id = contacts.id)
            WHERE members.id = $1`, [id], function(err, results) {
                if(err) throw `Database Error! ${err}`

                callback(results.rows[0])
            });
    },
    update(data, callback) {
        const query = `
            UPDATE members SET
                avatar_url = ($1),
                name = ($2),
                unity = ($3),
                email = ($4),
                contact = ($5),
                regional = ($6),
                contact_id = ($7)
            WHERE id = $8
        `

        const values = [
            data.avatar_url,
            data.name,
            data.unity,
            data.email,
            data.contact,
            data.regional,
            data.contact_tec,
            data.id,
        ]
        
        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        });
    },
    delete(id, callback) {
        db.query(`DELETE FROM members WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        });
    },
    contactsSelectOptions(callback) {
        db.query(`SELECT name, id FROM contacts`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows);
        });
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM members
            ) AS total`

        if(filter) {
            filterQuery = `
            WHERE members.unity ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM members
                ${filterQuery}
                ) AS total`
        }

        query = `
            SELECT members.*, contacts.name AS contact_name, ${totalQuery}
            FROM members
            LEFT JOIN contacts ON (members.contact_id = contacts.id)
            ${filterQuery}
            GROUP BY members.id, contacts.name LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err, results) {
            if(err) throw 'Database Error'

            callback(results.rows);
        });
    }
}