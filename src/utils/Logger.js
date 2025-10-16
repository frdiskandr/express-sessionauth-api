import winston from 'winston';

const Logger = new winston.createLogger({
    levels: winston.config.syslog.levels,
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [new winston.transports.Console(), new winston.transports.File({
        level: 'error',
        format: winston.format.json(),
        filename: 'error.log'
    })]
})

export default Logger