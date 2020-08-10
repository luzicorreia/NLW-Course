const database = require('./database/db')
const {subjects, weekdays, getSubject, convertHoursToMinutes} = require('./utils/format')
const { query } = require('express')
//const createProffy = require('./database/createProffy')  --> recriada como SaveClass, abaixo

// Funcionalidades 
function pageLanding(req, res) {
    return res.render("index.html")
}

async function pageStudy(req, res) {
    const filters = req.query 

    if (!filters.subject || !filters.weekday || !filters.time) {
        return res.render("study.html", { filters, subjects, weekdays })   
    }

    // converter horas em minutes
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
    
 `

 // caso haja erro na hora da consulta do banco de dados
try {
    const db = await  database
    const proffys = await db.all(query)

    proffys.map((proffy) => {
        proffys.subject = getSubject(proffy.subject)
    })

    return res.render("study.html", { proffys, filters, subjects, weekdays })

} catch (error) {
    console.log(error)
}

}

function  pageGiveClasses(req, res) {
    return res.render("give-classes.html", { subjects, weekdays })
}

async function saveClasses(req, res) {
    const createProffy = require('./database/createProffy')
    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }
    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }
    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHoursToMinutes(req.body.time_from[index]),
            time_to: convertHoursToMinutes(req.body.time_to[index])
        }
    }) 
    
    try {
        const db = await database
                
        await createProffy(db, { proffyValue, classValue, classScheduleValues})
        
        let queryString = "?subject=" + req.body.subject
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/study" + queryString)
    } catch (error) {
        console.log(error)
    }
}
    
// Deletar linhas 51 até 59, pois foram usadas para navegar como GET (req query), ANTES do comando POST (req.body)
// no POST não precisa tratar vazio
// const data = req.query
// se tiver dados (data)
//    const isNotEmpty = Object.keys(data).length > 0
//    if (isNotEmpty) {
//        data.subject = getSubject(data.subject)
//        // adicionar data à lista de proffys
//        proffys.push(data)
//        return res.redirect("/study")
//    }
//    // senao,mostrar a página

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}