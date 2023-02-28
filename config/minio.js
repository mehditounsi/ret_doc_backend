var Minio = require('minio')
const configuration = require('./config.js')
const dotenv = require('dotenv');

dotenv.config();


let minioClient = new Minio.Client({
    endPoint: configuration.minio.server,
    port: parseInt(configuration.minio.port),
    useSSL: configuration.minio.ssl=="n"?false:true,
    accessKey: configuration.minio.access,
    secretKey: configuration.minio.secret,
    signatureVersion: configuration.minio.version,
    // bucket: configuration.minio.bucket
});


module.exports = minioClient ;