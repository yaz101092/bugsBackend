import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())


//  List
app .get('/api/bug', async (req, res) => {
    const filterBy = {
        txt: req.query.txt,
        maxPrice: +req.query.maxcreatedAt,
        minSpeed: +req.query.minseverity
    }

    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)  
    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
        // console.log('err', err);
        
    }
})

//* Add/Update
app.get('/api/bug/save', async (req, res) => {
    console.log('req.query:', req.query)
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
        createdAt: +req.query.createdAt
    }

    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
})

//* Read
app.get('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params
    try {
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug ${bugId}`, err)
        res.status(400).send(`Couldn't get bug`)
    }
})

// delete
app.get('/api/bug/:bugId/remove', async (req, res) => {
    const { bugId } = req.params
    try {
        await bugService.remove(bugId)
        res.send('OK')
    } catch (err) {
        loggerService.error(`Couldn't remove bug ${bugId}`, err)
        res.status(400).send(`Couldn't remove bug`)
    }
})



app.get('/', (req, res) => res.send('hello there'))
app.listen(3030, () => loggerService.info(`Example app listening on port http://127.0.0.1:${3030}/`))

