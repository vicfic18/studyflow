import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {

    // Put this in the page.ts file only then will you get the async featrues
    console.log("Getting the session hist")
    const response = await fetch('http://127.0.0.1:8000/chat_data/'+params.slug)
    const hehe = await response.json();
    console.log(hehe);

    return {
        leslug: params.slug,
        lehistory: hehe
    };


    error(404, 'Not hehe found');
};