import dotenv from 'dotenv';

dotenv.config({
    override: true,
    path: './src/.env'
})

export const config = {
    app:{
        PORT:process.env.PORT||8081,
        PERSISTENCIA:process.env.PERSISTENCIA||'MONGO',
        SECRET:process.env.SECRET,
    },
    database:{
        MONGOURL:process.env.MONGOURL||'mongodb+srv://coderhouse:coderhouse@coderhouse.qltnizo.mongodb.net/?retryWrites=true&w=majority',
        DB:process.env.DB||'ecommerce'
    }
    
}