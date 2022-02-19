let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const res = require('express/lib/response');
const req = require('express/lib/request');
const PoolNamespace = require('mysql/lib/PoolNamespace');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

///home page route;
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTFULL CRUD API with NodeJS, Express, MySql',
        written_by: 'Kicks Me',
        published_on: '172.0.0.1'
    })
})

//connect to mysql db
let dbCon = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database: 'nodejs_api'
});

dbCon.connect();

//get data from books
app.get('/books', (req, res) => {
    dbCon.query('Select * from book', (error, result, fields) => {
        if(error) throw error;

        let message = "";

        if(result === undefined || result.length == 0){
            message = 'Books table is empty';
        }else{
            message = 'Successfully retrieved all books';
        }

        return res.send({error: false, data: result, message: message});
    })
});

///post new book
app.post('/create',(req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if(!name || !author){
        return res.status(400).send({error: true, message: "Please, provide book name and author."});
    }else{
        dbCon.query('insert into book(name,author) values(?,?)', [name,author], (error, result, fields) => {
            if(error) throw error;

            return res.send({error: false, data: result, message: 'Created successfully'});
        })
    }
})

///retrieve book by Id
app.get('/books/:id', (req, res) =>{
    let id = req.params.id;

    if(!id){
        return res.status(400).send({error: true, message: 'Please, provide book id'});
    }else{
        dbCon.query('select * from book where id= ?', id, (error, results, fields) =>{
            if(error) throw error;

            let message = "";
            if(results === undefined || results.length == 0){
                message = 'Not found book';
            }else{
                message = 'data retrieved successfully !';
            }

            return res.send({error: false, data: results[0], message: message});
        })
    }
});

//update book
app.put('/edit/:id', (req, res) => {
    ///change on path :id -> then can use get id from res.body.id;
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;

    if(!id || !name || !author){
        return res.status(400).send({error: true, message: 'Please, provide Id, Name and Author'});
    }else{
        dbCon.query('update book set name=?, author=? where id = ?', [name, author, id], (error, results, fields) => {
            if(error) throw error;

            let message ="";
            if(results.changedRows === 0){
                message = 'Not found edit';
            }else{
                message = "Update successfully !";
            }

            return res.send({error: false, data: results, message: message});
        })
    }

});

///delete book by id
app.delete('/delete/:id', (req, res) =>{
    let id = req.params.id;
    if(!id){
        return res.status(400).send({error: true, message:'Please, provide book Id'});
    }else{
        dbCon.query('delete from book where id = ?', [id], (error, results, fitelds) => {
            let message ="";
            if(results.affectedRows === 0){
                message = 'Not found data to delete';
            }else{
                message = 'Deleted successfully !';
            }
            return res.send({error: false, data: results, message: message});
        })
    }
})


app.listen(5000, ()=>{
    console.log('Node App is running on port 5000');
})

module.exports = app;