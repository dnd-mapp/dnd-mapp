import axios from 'axios';

module.exports = () => {
    const host = process.env['HOST'] ?? 'localhost';
    const port = process.env['PORT'] ?? 4300;

    axios.defaults.baseURL = `http://${host}:${port}/`;
};
