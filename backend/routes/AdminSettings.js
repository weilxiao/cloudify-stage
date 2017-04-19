/**
 * Created by Jakub on 18/04/2017.
 */

const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

const logger = require('log4js').getLogger('AdminSettings');
const db = require('../db/Connection');

router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    db.AdminSettings
        .findAll()
        .then((items) => { res.send(items); })
        .catch(next);
});

router.get('/:name', (req, res, next) => {
    db.AdminSettings
        .findOne({ where: { name: req.params.name } })
        .then((item) => { res.send(item); })
        .catch(next);
});

router.post('/', (req, res, next) => {
    db.AdminSettings
        .findOrCreate({ where: { name: req.body.name } })
        .spread((item) => {
            item
                .update({
                    table: req.body.table
                })
                .then((item) => { res.send(item); });
        })
        .catch(next);
});

router.post('/:name', (req, res, next) => {
    db.AdminSettings
        .findOrCreate({ where: { name: req.params.name } })
        .spread((item) => {
            item
                .update({
                    table: req.body.table
                })
                .then((item) => { res.send(item); });
        })
        .catch(next);
});

router.delete('/:name', (req, res, next) => {
    db.AdminSettings
        .destroy({ where: { name: req.params.name } })
        .then(() => { res.end(JSON.stringify({ status: 'ok' })); })
        .catch(next);
});

module.exports = router;
