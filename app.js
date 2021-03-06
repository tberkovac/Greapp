

const Joi = require('joi')
const express = require('express')
const app = express()
app.use(express.json())

const courses = [
    { id: 1, name: 'Course 1'},
    { id: 2, name: 'Course 2'},
    { id: 3, name: 'Course 3'}
]

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/api/courses', (req, res) => {
    //listu kurseva iz baze
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('Course with given id not found')
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body)    
    if(error)
        return res.status(400).send(error.details[0].message)

    const course = {
        id : courses.length + 1,
        name : req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id))
    if(!course) 
        return res.status(404).send('Course with given id not found')

    const {error} = validateCourse(req.body)    
    if(error) 
        return res.status(400).send(error.details[0].message)


    course.name = req.body.name
    res.send(course)
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course)
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id))
    if(!course) return res.status(404).send('Course with given id not found')

    const index = courses.indexOf(course)
    courses.splice(index,1)
    res.send(course)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))