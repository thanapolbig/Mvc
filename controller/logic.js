const moment = require('moment');
const logger = require('../util/logger.js')

var sql = require("mssql");
// config for your database
var config = {
    user: 'sa',
    password: 'P@d0rU123',
    server: '167.71.200.91',
    database: 'BigDB'
};

var err = sql.connect(config)
if (err) console.log(err);

class Acc{

    async transfer(req){
        let FunctionName = '[transfer]'
        return new Promise(async function (resolve,reject) {
            try {
                if(req.Money>1000000){
                    let massageErr = {
                        statusCode: 400,
                        status: `no success เงินมากกเกินไปปปปป`,
                    }
                    reject(massageErr)
                }else{
                    var request = new sql.Request();    //เรียกใช้ sqlcommand
                    var commandP1 = `SELECT Amount FROM User_interative where Acc_num = '${req.Acc_numP1}' and Pin = '${req.Pin}';`///////////////1
                    var result1 =  await request.query(commandP1); //นำเข้าข้อมูลใส่ db
                    var data1 = result1.recordset[0].Amount
                    if(data1 < req.Money){
                        let massageErr2 = {
                            statusCode: 400,
                            status: `no success เงินไม่พอ`,
                        }
                        reject(massageErr2)
                    }else {
                        var commandP2 = `SELECT Amount FROM User_interative where Acc_num = '${req.Acc_numP2}';`//222222222222
                        var result2 =  await request.query(commandP2); //นำเข้าข้อมูลใส่ db
                        var data2 = result2.recordset[0].Amount
                        var total1 = data1 - req.Money
                        var total2 = data2 + req.Money
                        var CommandUpdateP1 = `UPDATE User_interative SET Amount = '${total1}' WHERE Acc_num = '${req.Acc_numP1}';`
                        var data = await request.query(CommandUpdateP1);
                        var CommandUpdateP2 = `UPDATE User_interative SET Amount = '${total2}' WHERE Acc_num = '${req.Acc_numP2}';`
                        var data = await request.query(CommandUpdateP2);
                        let massage = {
                            statusCode: 200,
                            status: `transfer success`,
                        }
                        logger.info(massage.status)
                        resolve(massage)
                    }
                }
            }catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    message: error.message || `${FunctionName} CREATE failed [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }
        })
    }
    async withdraw(req){
        let FunctionName = '[withdraw]'
        return new Promise( async function (resolve,reject){
            try{
                var error;
                var request = new sql.Request();
                var Amountcom = `SELECT Amount FROM User_interative where Acc_num = '${req.Acc_num}' and Pin = '${req.Pin}';`
                var Amount = await request.query(Amountcom);
                if(Amount.recordset.length == 0){
                    logger.error("getID Header : cannot find document");
                    error = {
                        status_code: "404",
                        status: "Not Found",
                        message: "ไม่พบเอกสารนี้" //404
                    }
                    reject(error);
                }
                console.log(Amount.recordset[0].Amount)
                var AmountTotal = Amount.recordset[0].Amount
                var total = AmountTotal-req.Money
                if(total<0){
                    let massage = {
                        statusCode: 400,
                        status: `no success เงินไม่พอ`,
                    }
                    reject(massage);
                }else if(req.Money>20000){
                    let massage = {
                        statusCode: 400,
                        status: `no success เงินเกิน`,
                    }
                    reject(massage);
                }else if(req.Money%100 != 0){
                    let MassageErr = {
                        statusCode: 400,
                        status: `No success กรุณาใช้ 100,500,1000 ขอบคุณค่ะ`,
                    }
                    reject(MassageErr)
                }else{
                    var datatotal = AmountTotal - req.Money
                    console.log(datatotal)
                    console.log(AmountTotal)
                    var CommandUpdate = `UPDATE User_interative SET Amount = '${datatotal}' WHERE Acc_num = '${req.Acc_num}';`
                    var data = await request.query(CommandUpdate);
                    let massage = {
                        statusCode: 200,
                        status: `withdraw success`,
                    }
                    reject(massage); //200
                }
            }catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    massage: error.massage || `${FunctionName} CREATE failed [Error] ${error}`
                }
                logger.error(messageError.message)
            }
        })
    }

    async Deposit(req){
        let FunctionName = '[Deposit]'
        return new Promise( async function (resolve,reject){
        try{
            var error;
            var request = new sql.Request();
            var money = req.Money
            console.log(req.Acc_num)
            var Amountcom = `SELECT Amount FROM User_interative where Acc_num = '${req.Acc_num}'and Pin = '${req.Pin}';`
            var Amount = await request.query(Amountcom);
            console.log(Amount.recordset[0].Amount)
            var AmountTotal = Amount.recordset[0].Amount
            var total = AmountTotal-req.Money
            if(total<0){
                let massage = {
                    statusCode: 400,
                    status: `no success เงินไม่พอ`,
                }
                reject(massage);
            }else if(money < 100){
                let MassageErr = {
                    statusCode: 400,
                    status: `No success กรุณามีเงินฃนมากกว่านี้ ขอบคุณค่ะ`,
                }
                reject(MassageErr)
            }else if(money%100 != 0){
                let MassageErr = {
                    statusCode: 400,
                    status: `No success กรุณาใช้ 100,500,1000 ขอบคุณค่ะ ขอบคุณค่ะ`,
                }
                reject(MassageErr)
            }else{
                var TotalAmount = AmountTotal + req.Money
                var CommandUpdate = `UPDATE User_interative SET Amount = ${TotalAmount} WHERE Acc_num = '${req.Acc_num}';` //update database
                var data = await request.query(CommandUpdate);
                console.log(data)
                let massage = {
                    statusCode: 200,
                    status: `update success`,
                }
                resolve(massage)
            }
        }catch (error) {
            let messageError = {
                statusCode: error.statusCode || 400,
                massage: error.massage || `${FunctionName} failed [Error] ${error}`
            }
            logger.error(messageError.message)
            reject(messageError)
        }

        })
    }

    async getdata(req){
        let FunctionName = '[UpdateWorkstatus]'
        return new Promise( async function (resolve,reject){
            try{
                var error;
                var request = new sql.Request();
                var CommandUpdate = `UPDATE Student_Profile SET Work_Status = 'N' WHERE id = ${req.ID};`
                var data = await request.query(CommandUpdate);
                let massage = {
                    statusCode: 200,
                    status: `delete success`,
                }
                resolve(massage)
            }catch (error) {
                let messageError = {
                    statusCode: error.statusCode || 400,
                    massage: error.massage || `${FunctionName} failed [Error] ${error}`
                }
                logger.error(messageError.message)
                reject(messageError)
            }

        })
    }




}




module.exports = Acc