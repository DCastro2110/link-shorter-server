
import { z } from 'zod';
import express from 'express';
import cors from 'cors'

import { accessOriginalLink, getShortLink } from './models/getUserLink';
import { prisma } from './configs/prisma';


const urlSchema = z.string().url();

const app = express();

app.use(cors());

app.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await accessOriginalLink(id)
        
        if(data === null) {
            throw new Error()
        }
        const originalLink = data.original_link;
        return res.redirect(301, originalLink);
    } catch(err) {
        res.writeHead(400, 'URL not found!');
    }
     return;
})

app.post("/api", async (req, res) => {
    let host  = req.headers.host;

    if (!host) {
        res.writeHead(400, "Host not found")
        res.end()
        return;
    }

    host = host.replace(",", ".");


    const originalUrl = req.query.q
    const result = urlSchema.safeParse(originalUrl);

    if(!result.success) {
        res.writeHead(400, "Invalid URL!")
        res.end(JSON.stringify({message: "Invalid URL!"}));
        return;
    }

    try {
        const data = await getShortLink(result.data)
        const url = `${host}/${data.id}`
    
        res.end(JSON.stringify({
            url
        }))
    } catch(err) {
        res.writeHead(500, "Internal error!")
            .end();
    }
    
})

app.listen(process.env.PORT, async () => {
    console.log("Is running!");
    try {
        await prisma.$connect();
    } catch(err) {
        throw err;
    }
})
