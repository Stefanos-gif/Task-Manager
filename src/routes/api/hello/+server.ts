import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET:RequestHandler = async ({ url }) => {
    const name = url.searchParams.get('name')?.trim() || 'world';
    if(name.length > 30){
        return json({ error: "character limit exceeded (30)"}, { status: 422});
    }
    if(name === 'prodromos'){
        return json({ message: `Hello gay nigger!!!` }, {status:200});
    }
    return json({ message: `Hello ${name}!!!` }, {status:200});
}
