const db = require('../../config/db');

module.exports = {
    all(callback) {

        db.query(`
        SELECT contacts.*, count(members) AS total_drs
        FROM contacts 
        LEFT JOIN members ON (members.contact_id = contacts.id)
        GROUP BY contacts.id
        ORDER BY total_drs DESC`, function(err, results) {
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows);
        });

    },
    create(data, callback) {
        const query = `
            INSERT INTO contacts (
                name,
                avatar_url,
                unity,
                email,
                contact
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `
        const values = [
            data.name,
            data.avatar_url,
            data.unity,
            data.email,
            data.contact
        ]

        db.query(query, values, function(err, results) {
            if(err) throw "Database Error"

            callback(results.rows[0]);
        });
    },
    find(id, callback) {
        db.query(`
            SELECT * 
            FROM contacts 
            WHERE id = $1`, [id], function(err, results) {
                if(err) throw `Database Error! ${err}`

                callback(results.rows[0])
            });
    },
    findBy(filter, callback) {
        db.query(`
        SELECT contacts.*, count(members) AS total_drs
        FROM contacts
        LEFT JOIN members ON (members.contact_id = contacts.id)
        WHERE contacts.name ILIKE '%${filter}%'
        GROUP BY contacts.id
        ORDER BY total_drs DESC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows);
        });
    },
    update(data, callback) {
        const query = `
            UPDATE contacts SET
                avatar_url = ($1),
                name = ($2),
                unity = ($3),
                email = ($4),
                contact = ($5)
            WHERE id = $6
        `

        const values = [
            data.avatar_url,
            data.name,
            data.unity,
            data.email,
            data.contact,
            data.id,
        ]
        
        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        });
    },
    delete(id, callback) {
        db.query(`DELETE FROM contacts WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        });
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM contacts
            ) AS total`

        if(filter) {
            filterQuery = `
            WHERE contacts.name ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM contacts
                ${filterQuery}
                ) AS total`
        }

        query = `
            SELECT contacts.*, ${totalQuery}, count(members) AS total_drs
            FROM contacts
            LEFT JOIN members ON (members.contact_id = contacts.id)
            ${filterQuery}
            GROUP BY contacts.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err, results) {
            if(err) throw 'Database Error'

            callback(results.rows);
        });
    }
}