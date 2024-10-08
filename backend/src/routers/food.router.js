import { Router } from "express";
import {FoodModel} from '../models/food.model.js';
import handler from 'express-async-handler';
import {sample_foods, sample_tags} from "../data.js";

const router = Router();

router.get('/', handler(async (req, res) => {
    const foods = await FoodModel.find({})
    //res.send(sample_foods);
    res.send(foods);
}))

router.get('/tags', handler(async (req, res) => {
    const tags = await FoodModel.aggregate([
        {
            $unwind: '$tags',
        },
        {
            $group: {
                _id: '$tags',
                count: {$sum: 1}
            },
        },
        {
            $project: {
                _id: 0,
                name: '$_id',
                count: '$count',
            },
        },
    ]).sort({count: -1});

    const all = {
        name: 'All',
        count: await FoodModel.countDocuments(),
    };
    tags.unshift(all);
    res.send(tags);
    //res.send(sample_tags);
}))

router.get('/search/:searchTerm', handler(async (req, res) => {
    const {searchTerm} = req.params;
    const searchRegex = new RegExp(searchTerm, 'i');

    const foods = await FoodModel.find({name: {$regex: searchRegex}});
    //const foods = sample_foods.filter(item =>
        //item.name.toLowerCase().includes(searchTerm.toLowerCase())
    //); //Checks for letters are same, case insensitive
    console.log(foods)
    res.send(foods);
}))

router.get('/tag/:tag', handler(async (req, res) => {
    const {tag} = req.params;
    //const foods = sample_foods.filter(item => item.tags?.includes(tag));
    const foods = await FoodModel.find({tags: tag});
    res.send(foods);
}))

router.get('/:foodId', handler(async (req, res) => {
    const {foodId} = req.params;
    //const foods = sample_foods.find(item => item.id === foodId);
    const foods = await FoodModel.findById(foodId);
    res.send(foods);
}))

export default router;