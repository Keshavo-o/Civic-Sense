const Report = require('../models/report.js');
async function publicmapcontroller(req, res) {
    const reports = await Report.find(); // get all reports
    // console.log(reports);
  res.render('map_view_everyone', { reports }); // send to EJS template

}
module.exports = { publicmapcontroller }; 