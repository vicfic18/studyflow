import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {

    return {
        title: params.slug,
    };


    error(404, 'Not hehe found');
};