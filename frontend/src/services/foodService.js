import { sample_foods, sample_tags } from '../data.js'

export const getAll = async () => sample_foods;

export const search = async(searchTerm) => 
    sample_foods.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ); //Checks for letters are same, case insensitive

export const getAllTags = async () => sample_tags;

export const getAllByTag = async tag => {
    if (tag === 'All'){
        return getAll();
    }
    return sample_foods.filter(item => item.tags?.includes(tag));
};

export const getById = async foodId => 
    sample_foods.find(item => item.id === foodId);