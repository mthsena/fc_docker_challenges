const express = require('express')
const mysql = require('mysql2/promise');
const app = express()
const port = 3000

const db = {
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'fc_docker_challenge_password',
    database: 'fc_docker_challenge_database',
    bootstrap: async (connection) => {
        await connection.execute(`create table if not exists peoples(id int(10) not null auto_increment, name varchar(255) not null, primary key(id))`)
    },
    insert: async (connection, name) => {
        await connection.execute(`insert into peoples(name) values('${name}')`)
    },
    select: async (connection) => {
        const [results] = await connection.execute(`select id, name from peoples order by id desc`);
        return results
    }
};

const util = {
    generateName: (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = 'Code.education Rocks - ';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
    generateBody: (peoples) => {
        var lines = ''
        for (var i = 0; i < peoples.length; i++) {
            lines += `<tr><td>${peoples[i].id}</td><td>${peoples[i].name}</td></tr>`
        }
        console.log(lines)
        const table = `<table><thead><tr><th>Id</th><th>Name</th></tr></thead><tbody>${lines}</tbody></table>`
        return `<h1>Code.education Rocks!</h1><br><br><h4>Peoples:</h4>${table}`
    }
}

app.get('/', async (_, res) => {
    const dbConnection = await mysql.createConnection(db);
    await db.bootstrap(dbConnection)
    await db.insert(dbConnection, util.generateName(5))
    const peoples = await db.select(dbConnection)
    console.log(peoples)
    const body = util.generateBody(peoples)
    await dbConnection.end()
    res.send(body)
})

app.listen(port, () => {
    console.log('Listening on port: ' + port)
})
