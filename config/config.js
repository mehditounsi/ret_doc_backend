const dotenv = require('dotenv');

dotenv.config();

const env = {
    database: {
        db: process.env.DATABASE,
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        name:process.env.DB_NAME,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD
    },
    minio: {
        server:process.env.MINIO_SERVER,
        port:process.env.MINIO_PORT,
        ssl:process.env.MINIO_SSL,
        access:process.env.MINIO_ACCESS,
        secret:process.env.MINIO_SECRET,
        version:process.env.MINIO_VERSION,
        bucket:process.env.MINIO_BUCKET
    },
    logs: {
        console:process.env.LOG_CONSOLE,
        console_level:process.env.LOG_CONSOLE_LEVEL,
        file:process.env.LOG_FILE,
        file_level:process.env.LOG_FILE_LEVEL,
        file_path:process.env.LOG_FILE_PATH,
        knex:process.env.LOG_KNEX
    },
    directory:{
        tmp_dir:process.env.TMP_DIR
    },
    jwt:{
        jwt_secret:process.env.JWT_SIGN_SECRET
    },
    template:{
        template:process.env.TEMPLATE,
        vitrine:process.env.VITRINE
    },
    mailing: {
        host: process.env.MAILING_HOST,
        port: process.env.MAILING_PORT,
        from: process.env.MAILING_FROM,
        user: process.env.MAILING_USER,
        password: process.env.MAILING_PASSWORD,
        sender: process.env.MAILER_SENDER
    },
    redis: {
        server: process.env.REDIS_SERVER,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
    url:{
        societe_url: process.env.SOCIETE_URL
    }
}


module.exports = env;