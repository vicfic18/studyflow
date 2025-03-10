import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {

    // Put this in the page.ts file only then will you get the async featrues
    console.log("Getting the session hist")
    const chat_resp = await fetch('http://127.0.0.1:8000/chat_data/'+params.slug)
    const chat_dat = await chat_resp.json();
    const file_resp = await fetch('http://127.0.0.1:8000/list_files/'+params.slug)
    const file_dat = await file_resp.json();
    console.log(chat_dat);

    return {
        leslug: params.slug,
        lehistory: chat_dat,
        lefiles: file_dat.files
    };

    error(404, 'Not hehe found');
};