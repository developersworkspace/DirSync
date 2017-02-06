// Imports 
import { Express, Request, Response } from "express";
import path = require('path');

import * as express from 'express';
let router = express.Router();

router.post('/create', (req: Request, res: Response, next: Function) => {
    let file = req.files[Object.keys(req.files)[0]];
    let path = req.body.path;

    file.mv(path, function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('OK');
        }
    });
});


router.get('/exist', (req: Request, res: Response, next: Function) => {
    path.exist(req.query.path, function (exists) {
        res.send(exists);
    });
});


export = router;