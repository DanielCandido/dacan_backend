import express from 'express'
import cors from 'cors'
import router from './router'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

class App {
    public express: express.Application

    public constructor () {
      this.express = express()
      this.middlewares()
      this.router()
      dotenv.config()
      this.database()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private database (): void {
      mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
    }

    private router (): void {
      this.express.use('/api', router)
    }
}

export default new App().express
