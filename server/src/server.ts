import express from 'express';

const app = express();


app.get('/users', (request, response) =>{

    response.json([
        'Julio',
        'Camila',
        'Felipe',
        'Walter',
        'Madalena'
    ]);
});


app.listen(3334);