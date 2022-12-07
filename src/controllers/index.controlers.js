const indexCtrl = {};

indexCtrl.renderIndex =(req, res) => {
    res.render('index')
}

indexCtrl.renderAcercade =(req, res) => {
    res.render('acercade')
}

module.exports = indexCtrl;
