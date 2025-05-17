import { prisma } from "../configs/prisma";

export async function getShortLink(link: string) {
    try {
        const data = await prisma.link.create({data: {
            original_link: link
        } })

        return data;
    } catch(err) {
        throw err;
    }   
}

export async function accessOriginalLink(id: string) {
    try {
        const data = await prisma.link.findUnique({where: {
            id
        }})
        return data;
    } catch(err) {
        throw err;
    }   
}