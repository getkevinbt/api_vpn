console.clear();

require('dotenv').config()
const axios = require('axios')
const express = require('express')

const app = express()

const controllerImg = async ({query}, res) => {
    let {url, ...params} = query

    if (!url)return res.status(406).json({error: 'complete url is required'})

    try{
        if (url.split("//").length == 1) url = 'https://'+url
        // Realizar una solicitud GET a la URL de la imagen utilizando axios
        const {data} = await axios.get(url, {
          responseType: 'arraybuffer', // Solicitar que Axios devuelva un ArrayBuffer
        });

        // Establecer los encabezados de la respuesta para indicar que estamos enviando una imagen
        res.setHeader('Content-Type', 'image/jpeg');

        // Enviar la imagen al cliente utilizando res.end()
        res.end(data);
    }catch(e){
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
        return res.status(500).json({msg: 'reenviame el error a mc.dencidance@gmail.com', error: e})
    }
}

const controllerJSON = async ({query}, res) => {

    let {url, ...params} = query

    if (!url)return res.status(406).json({error: 'complete url is required'})

    try{
        if (url.split("//").length == 1) url = 'https://'+url
        const {data, ...response} = await axios.get(url, {params})
        console.log(response);
        return res.json(data)
    }catch(e){
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
        return res.status(500).json({msg: 'reenviame el error a mc.dencidance@gmail.com', error: e})
    }
}

app.get('/vpn/img', controllerImg)
app.get('/vpn/json', controllerJSON)

app.listen(process.env.PORT, () => console.log(`Server running on PORT: ${process.env.PORT}`))

