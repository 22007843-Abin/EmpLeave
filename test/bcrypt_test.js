//chatgpt
const bcrypt = require('bcryptjs');

const storedHash = '$2a$10$D4G5f18o7aMMmFh4h0uLfeHntt3r/eB1xo4p4a6rMJ1Mm8A9z5S2W'; // Example hash from database
const plainTextPassword = 'password';

bcrypt.compare(plainTextPassword, storedHash, (err, isMatch) => {
    if (err) throw err;
    console.log('Password Match:', isMatch); // Should output: Password Match: true
});
