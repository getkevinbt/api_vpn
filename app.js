console.clear();

require('dotenv').config()
const axios = require('axios')
const express = require('express')
const linkCheck = require('link-check');

const app = express()

const controller = async ({query}, res) => {

    let {url, ...params} = query


    try{
        /*linkCheck(`${url}?api_key=${params.api_key}`, async (e, result) => {
            if (e) 
                console.error(e.message)
            console.log(`${result.link} is ${result.status}`);
        });*/
        if (url.split("//").length == 1) url = '//'+url
        const {data} = await axios.get(url, {params})
        console.log
        return res.json(data)
    }catch(e){
        console.error(e.message)
        if (e.message === 'Invalid URL')
            return res.status(400).json({error: 'invalid url', from: 'vpn'})
        else if (e.message.includes('Unsupported protocol'))
            return res.status(400).json({error: `unsupported protocol (${e.message.split('Unsupported protocol ')[1]})`, from: 'vpn'})
        else if (e.message.includes('connect ECONNREFUSED'))
            return res.status(400).json({error: 'connection refused', from: 'vpn'})
        else if (e.message.includes('getaddrinfo ENOTFOUND'))
            return res.status(404).json({error: `host was not found => ${e.message.split('getaddrinfo ENOTFOUND ')[1]}`, from: 'vpn'})
        else if (e.message.includes('Request failed with status code'))
            return res.status(parseInt(e.message.split(' code ')[1])).json({
                error: `request failed with status code ${e.message.split(' code ')[1]}`,
                from: 'api',
                data: e.response.data
            })
    }
}

app.get('/', controller)

app.listen(process.env.PORT, () => console.log(`Server running on PORT: ${process.env.PORT}`))

