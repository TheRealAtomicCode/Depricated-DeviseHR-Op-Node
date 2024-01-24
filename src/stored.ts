import client from './DB/connection';

console.log('lol');

client.connect();

const name = 'kaki baki'



client.query('SELECT insert_user($1)', [name])
  .then(() => {
    console.log('User inserted successfully');
  })
  .catch((err) => {
    console.error('Error executing query', err);
  });



client.query('SELECT get_all_users()')
  .then((result) => {
    console.log(result.rows);
  })
  .catch((err) => {
    console.error('Error executing query', err);
  })
  .finally(() => {
    client.end(); // Disconnect from the database
  });