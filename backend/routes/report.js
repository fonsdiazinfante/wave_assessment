const router = require('express').Router();
let Report = require('../models/report.model');


router.route('/').get((req, res) => {
    Report.find()
    .then(report => res.json(report))
    .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/add').post((req, res) => {
    console.log(req.body);
    const date = req.body.date;
    const hours = req.body['hours worked'];
    const employeeID = req.body['employee id'];
    const jobGroup = req.body['job group '];

    const newReport = new Report({
        date,
        hours,
        employeeID,
        jobGroup
    });

    newReport.save()
    .then(() => res.json('Report added!'))
    .catch(err =>  res.status(400).json('Error: '+ err))
});

router.route('/addMany').post((req, res) => {

    Report.find({ title: req.body.title }, function (err, docs) {

    if ( docs.length === 0 ){
        console.log(req.body)
        Object.keys(req.body.properties).forEach((key) => {
        req.body.properties[key].hours_worked = req.body.properties[key]['hours worked']
        req.body.properties[key].employee_id = req.body.properties[key]['employee id']
        req.body.properties[key].job_group = req.body.properties[key]['job group\r']
        delete req.body.properties[key]['hours worked']
        delete req.body.properties[key]['employee id']
        delete req.body.properties[key]['job group\r']  
        });
        Report.insertMany(req.body)
        .then(() => res.json('Report added successfully'))
        .catch(err =>  res.status(400).json('Error: '+ err))
    
    }else{
        console.log('Document already exists!')
        res.json('Document already exists!')
    }
    });
});

router.route('/getReport').post((req, res) => {
    const reportNumber = req.body.ReportNumber
    const jobGroup ={
    A : 20,
    B : 30
    }
    Report.find({ title: reportNumber }, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        var payrollReport =  {employeeReports : []}
        Object.entries(docs[0].properties).forEach((entry) => {
            const [key, value] = entry;
            const splitDate = value.date.split("/")
                payrollReport.employeeReports.push({
                    employee_id : value.employee_id,
                    payPeriod :  (splitDate[0] >= 16 ? {startDate:`${splitDate[2]}-${splitDate[1]}-16`, endDate:`${splitDate[2]}-${splitDate[1]}-31`} 
                                                    : 
                                                    {startDate:`${splitDate[2]}-${splitDate[1]}-01`, endDate:`${splitDate[2]}-${splitDate[1]}-15`}),
                    amountPaid : `$${value.hours_worked * jobGroup[value.job_group]}.00`,
                    });
        });
        const jsonContent = JSON.stringify(payrollReport);
        res.end(jsonContent);
    }
    })
})

router.route('/getReportNumbers').get((req, res) => {
    Report.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
    });
})

module.exports = router;