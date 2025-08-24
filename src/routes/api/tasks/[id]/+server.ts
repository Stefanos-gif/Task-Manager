import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/db";

function parseId(s: string | undefined): number | null {
    if(!s){
        return null;
    }
    const n = Number(s);
    return Number.isInteger(n) && n > 0 ? n : null;
}

export const GET: RequestHandler = async ( { params } ) => {
    const id = parseId(params.id);
    if(id === null){
        return json ({ error: ' id must be a positive integer ' }, { status: 400 });
    }

    const task = await prisma.task.findUnique( { where: { id } } );
    if(!task){
        return json({ error: 'task not found...' }, {status:404});
    }
    
    return json(task, {status:200});
};

export const PATCH:RequestHandler = async ( { params, request } ) => {
    const id = parseId(params.id);

    if(id === null){
        return json({error: 'id must be a positive integer'}, {status:400});
    }
    
    

    let raw : unknown;
    try{
        raw = await request.json();
    }catch{
        return json({ error: 'INVALID JSON'}, { status: 400 });
    }

    if(typeof raw !== 'object' || raw === null){
        return json({ error: 'body must be an object' }, {status: 400});
    }

    const body = raw as Record<string, unknown>;

    const data: Record<string, unknown> = {};

    if('title' in body){
        if(typeof body.title !== 'string'){
            return json({error: 'body must be a string '}, {status: 422});
        }
        const t = body.title.trim();
        if(t.length < 1 || t.length > 80){
            return json({error: 'title must be 1-80 characters'}, {status:422});
        }
        data.title = t;
    }

    if('notes' in body){
        if(typeof body.notes !== 'string'){
            return json({ error: 'notes must be a string' }, { status: 422});
        }
        data.notes = body.notes.trim();
    }

    
    if('done' in body){
        if(typeof body.done !== 'boolean'){
            return json({ error: 'done must be a boolean' }, { status: 422});
        }
        data.done = body.done;
    }

    if(Object.keys(data).length === 0){
        return json({ error: 'must have atleast a body or note or done'}, { status: 400});
    }

    try{
        const updated = await prisma.task.update({ where: {id}, data});
        return json(updated, { status: 200 });

    }catch(e){
        return json({ error: 'task NOT found' }, { status: 404});
    }
    
};


export const DELETE: RequestHandler = async ({ request, params }) => {
    const id = await parseId(params.id);
    if(!id){
        return json({error: 'id must be a positive intiger'}, {status:400});
    }
    try{
        await prisma.task.delete({ where: {id}});
        return new Response(null, {status:204});
    }catch{
        return json({error: 'task not found'}, {status:404});
    }
}

export const PUT: RequestHandler = async ({ request, params })=>{
    const id = parseId(params.id);
    if(!id){
        return json({error: ' id missin'}, {status: 404});
    }
    let raw: unknown;

    try{
        raw = await request.json();
    }catch{
        return json({error: "INVALID JSON"}, {status: 400});
    }
    const body = raw as Record<string, unknown>;
    
    const data: Record<string, unknown> = {};

    if(typeof body.title === 'string'){
        const t = body.title.trim();
        data.title = t;
    }else{
        return json({error:' must include Title notes and done'}, {status:422});
    }
    if(typeof body.notes === 'string'){
        const t = body.notes.trim();
        data.notes = t;
    }else{
        return json({error:' must include title Notes and done'}, {status:422});
    }
    if(typeof body.done === 'boolean'){
        
        data.done = body.done;
    }else{
        return json({error:' must include Title notes and Done'}, {status:422});
    }
    
        try{
            const updated = await prisma.task.update( { where: {id}, data});
            return json(updated, {status:201});
        }catch{
            return json({error: ' Body must include title, notes, done'}, {status:422});
        }
    
    

}