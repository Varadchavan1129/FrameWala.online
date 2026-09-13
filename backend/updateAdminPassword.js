import mysql from 'mysql2/promise';

async function updateAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'framewala_db',
    port: 3306
  });
  
  const hash = '$2b$10$F.ER12vPYy/xRlw9puR6ourRrV8s9vaGZVAAStz41cgZ7rwfB60WO';
  const query = "UPDATE users SET password = ?, role = 'admin' WHERE email = 'admin@framewala.com'";
  
  const [result] = await connection.execute(query, [hash]);
  console.log('Update result:', result);
  await connection.end();
}

updateAdmin().catch(console.error);
