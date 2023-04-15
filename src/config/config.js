import dotenv from 'dotenv';

dotenv.config({
    override: true,
    path: './src/.env'
})

export const config = {
    PORT:process.env.PORT,
    SECRET:process.env.SECRET,
    MONGOURL:process.env.MONGOURL
}