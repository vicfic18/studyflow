import type { PageLoad } from './$types';

export const load: PageLoad = async () => {

    console.log("Getting the session list")
    const response = await fetch('http://127.0.0.1:8000/sessions_info/')
    const hehe = await response.json();
    console.log(hehe);

	return {
        sesslist: hehe
	};
};
