import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456',10),
        image: 'admin.jpg',
        isAdmin: true,
    },
    {
        name: 'Hoang Anh',
        email: 'hoanganh@email.com',
        password: bcrypt.hashSync('123456',10),
        image: 'hoanganh.jpg',
        isAdmin: false,
    },
    {
        name: 'Bao Linh',
        email: 'doanbaolinh290822@gmail.com',
        password: bcrypt.hashSync('123456',10),
        image: 'baolinh.jpg',
        isAdmin: false,
    }
];

export default users;
