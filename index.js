const express = require('express');
const path = require('path');
const fs = require('fs');
const { timerify } = require('perf_hooks');

const app = express();
const port = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'data.json');
const cache = {};
async function readData(){
    try{
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }catch(err){
        console.log(err.message)
    }
}

async function readFileWithDelay(){
    try{
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 1500);
        });
        return await readData();
    }catch(err){
        console.log(err.message)
    }
}

app.get('/', (request, response) => {
	response.json({ message: 'API is running' });
});

app.get('/products', async (request, response) => {
    try{
        let key = request.url;
        let value = cache[key];

        if (value)
            return response.status(200).json(value);

        let data = await readFileWithDelay();
        cache[key] = data;
        return response.status(200).json(data);
    }catch(err){
        console.log(err.message)
    }
});

app.get('/products/:id', async (request, response) => {
    try{
        let key = request.url;
        let value = cache[key];

        if (value)
            return response.status(200).json(value);
        
        let data = await readFileWithDelay();
        const id = Number(request.params.id);
        let product = data.find(product => {
            return product.id === id
        });
        cache[key] = product;
        return response.status(200).json(product);
    }catch(err){
        console.log(err.message)
    }
});

app.listen(port, () => {
	console.log(`Welcome to the Server of Null Vector`);
});
