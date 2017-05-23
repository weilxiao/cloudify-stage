/**
 * Created by Alex on 21/03/2017.
 */

var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var logger = require('log4js').getLogger('Applications');
var db = require('../db/Connection');

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    db.Application
        .findAll()
        .then(applications => { res.send(applications) })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    db.Application
        .findOne({ where: { id: req.params.id } })
        .then(application => { res.send(application) })
        .catch(next);
});

router.post('/', (req, res, next) => {
    db.Application
        .create(req.body, { fields: ['name', 'status', 'isPrivate', 'extras'] })
        .then(application => { res.send(application) })
        .catch(next);
});

router.post('/:id', (req, res, next) => {
    db.Application
        .findOrCreate({ where: { id: req.params.id } })
        .spread(item =>
            item.update(req.body, { fields: ['name', 'status', 'isPrivate', 'extras'] })
        )
        .then(application => { res.send(application) })
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    db.Application
        .destroy({ where: { id: req.params.id } })
        .then(() => { res.end(JSON.stringify({ status: 'ok' })); })
        .catch(next);
});

module.exports = router;
