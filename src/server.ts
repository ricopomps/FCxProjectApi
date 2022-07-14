import app from './app';

const port = process.env.PORT || 5000;

console.log('Listening in port: ' + port);

app.listen(port);
