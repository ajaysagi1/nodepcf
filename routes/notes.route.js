const express = require('express');
const router =  express.Router();
const joi = require('express-joi-validator');
const schema = require('../schemas/notes.schema');
const verifyToken = require('../middleware/verifyToken')

const services = require('../services/notes.service');

router.get('/tokenGen',services.tokenGen);
router.get('/login',services.getUserData);
router.get('/getAllUsers',verifyToken,services.getUsers);
router.get('/getMeetings',services.getAllMeetings);
router.get('/getAllNotes',services.getNotes);
//router.post('/addAttendee',joi(schema.attendeeSchema),services.addAttendees);
router.post('/addNote',joi(schema.hostSchema),services.addNotes);
router.put('/update',services.updateNotes);
router.delete('/delete',services.deleteNotes);
router.get('/info',function(req,res,next){

    res.send({
        "Status":200,
        "Info": "Meeting Notes App"
    })
});
module.exports = router;