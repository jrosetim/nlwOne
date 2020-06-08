import {Request, Response} from 'express';
import knex from '../database/connection';
require('dotenv/config');


class ItemsController{
    
    async index(request: Request, response: Response) {
        console.log( 'BackEnd ' + process.env.API_URL);

        const items = await knex('items').select('*');
        const serializedItems = items.map(item => {
            return {
              id: item.id,
              title: item.title,
              item_url: process.env.API_URL + item.image
            }
        })
    
        response.json(serializedItems);
    }
};

export default ItemsController;