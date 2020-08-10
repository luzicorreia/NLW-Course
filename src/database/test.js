const Database = require('./db')
const createProffy = require('./createProffy')

Database.then(async (db) => {
    // Inserir dados
    proffyValue = {
        name: 'Mayk Brito',
        avatar: 'https://avatars2.githubusercontent.com/u/6643122?s=400&u=1e9e1f04b76fb5374e6a041f5e41dce83f3b5d92&v=4',
        whatsapp: '98765434567',
        bio: 'Instrutor de Educação Física',
    }
    classValue = {
        subject: 4,
        cost: '20',
        //proffy_id: virá pelo Banco de Dados
    }
    classScheduleValues = [
        //class_id: virá pelo Banco de Dados, após cadastrarmos a class
        {
            weekday: 1,
            time_from: 720,
            time_to: 1220
        },
        {
            weekday: 0,
            time_from: 520,
            time_to: 1220
        }
    ]

    // await createProffy(db, {proffyValue, classValue, classScheduleValues})

    // Consultar os dados inseridos

    // consultar todos is proffys
    const selectedProffys = await db.all("SELECT * FROM proffys")
    //console.log(selectedProffys)

    // CONSULTAR AS CLASSES DE UM DETERMINADO PROFESSOR E TRAZER JNTO OS DADOS DO PROFESSOR
    const selectedClassesAndProffys = await db.all(` 
    SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE classes.proffy_id = 1;
    `)
  //  console.log(selectedClassesAndProffys)

    // o horário que a pessoa trabalha TIME_FROM precisa ser maior ou igual ao horário solicitado
    // e menor que o horário TIME_TO
    const selectClassesSchedules = await db.all(`
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = "1"
        AND class_schedule.weekday = "0"
        AND class_schedule.time_from <= "520"
        AND class_schedule.time_to > "1100"
    `) 
    //console.log(selectClassesSchedules)
})