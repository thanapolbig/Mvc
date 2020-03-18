const express = require('express')
const app = express()
const Acc = require('./controller/logic');
const bodyParser = require('body-parser');
const logger = require('./util/logger.js')



//สร้างรหัส นศ
app.post(`/Deposit`, async (req,res)=>{
    try{
        var result = await new Acc().Deposit(req.body)
        res.status(201)
        res.json(result)
        console.log(result)
    }catch (error) {
        let messageError = {
            statusCode: error.statusCode || 400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
        console.log(messageError)
    }
});
//เอารหัส นศ ไปหาข้อมฒุล
app.post(`/withdraw`, async (req,res)=>{
    try{
        var result = await new Acc().withdraw(req.body)
        res.status(200)
        res.json(result)
        console.log(result)
    }catch (error) {
        let messageError = {
            statusCode: error.statusCode || 400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
        console.log(messageError)
    }
});
//เอารหัสคณะไปหาโดย นศ ต้องยังศึกษาอยู่
app.post(`/transfer`, async (req,res)=>{
    try{
        var result = await new Acc().transfer(req.body)
        res.status(200)
        res.json(result)
        console.log(result)
    }catch (error) {
        let messageError = {
            statusCode: error.statusCode || 400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
        console.log(messageError)
    }
});

app.post(`/getdata`, async (req,res)=>{
    try{
        var result = await new student().getdata(req.body)
        res.status(200)
        res.json(result)
        console.log(result)
    }catch (error) {
        let messageError = {
            statusCode: error.statusCode || 400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
        console.log(messageError)
    }
});

app.post(`/delete`, async (req,res)=>{
    try{
        var result = await new student().delete(req.body)
        res.status(200)
        res.json(result)
        console.log(result)
    }catch (error) {
        let messageError = {
            statusCode: error.statusCode || 400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
        console.log(messageError)
    }
});

module.exports = app