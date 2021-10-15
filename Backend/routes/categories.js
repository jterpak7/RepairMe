//Category ROUTE HANDLING

var express = require('express');
var router = express.Router();
import Category from '../models/category';
import fetch from 'node-fetch';

var apiKey = "f39dbc6a87cd7aa2498f03efd91f40b0";

router.route('/')

    .get((request, response) => {
        Category.find({}, (error, categories) => {
            if(error){
                response.status(400).send({error: error});
                return;
            }
            
            response.status(200).send({categories: categories});
        })
    })

    .post((request, response) => {
        var category = new Category;
        category.name = request.body.name;
        category.firstHour = request.body.firstHour;
        category.subsequent = request.body.subsequent;
        category.save((err) => {
            if(err){
                response.status(400).send({error: err});
                return;
            }
            
            response.status(200).send({category: category});
        })
    })
    .put((request, response) => {
        //dump categories
        Category.deleteMany({}, function(err){
            if(err){
                console.log(err);
                return;
            }
            setCategories(request.body.categories, response)
        })
    })

function setCategories(cats, response){
    if(cats.length==0){
        Category.find({}, (error, categories) => {
            if(error){
                response.status(400).send({error: error});
                return;
            }
            response.status(200).send({categories: categories});
        })
    }else{
        var category = new Category;
        category.name = cats[0].name;
        category.firstHour = cats[0].firstHour;
        category.subsequent = cats[0].subsequent;
        category.save((err) => {
            if(err){
                response.status(400).send({error: err});
                return;
            }
            cats.shift();
            setCategories(cats, response)
        })
    }
}
    
router.route('/suggest/:bucket')

    .get((request, response) => {
        Category.find({}, (error, categories) => {
            if(error){
                response.status(400).send({error: error});
                return;
            }
            
            var results = relevance(request.params.bucket, response);
        })
    })

module.exports = router;

const relevance = (bucket, resp) => {
    Category.find({}, (error, categories) => {
        var cats = [];
        for(var i = 0; i < categories.length; i++) {
            cats.push(categories[i].name)
        }
        fetch('https://apiv2.indico.io/relevance', {
            method: 'POST',
            body: JSON.stringify({
                api_key: apiKey,
                data: bucket,
                queries: cats
            })
        })
        .then(r => r.json())
        .then(response => {
            var newCats = [];
            for(var i = 0; i < categories.length; i++){
                var obj = {
                    '_id': categories[i]._id,
                    'name': categories[i].name, 
                    'rel': response.results[i]
                };
            newCats.push(obj)
            }
            
            newCats =  newCats.sort((a,b) => (b.rel > a.rel) ? 1 : ((a.rel > b.rel) ? -1 : 0));
           
           resp.status(200).send({categories: newCats});
        })
        .catch(err => console.log(err));
    })  
}