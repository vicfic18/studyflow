<script lang="ts">
	import type { PageProps } from './$types';
    import { Input, Button } from 'flowbite-svelte';

	let { data }: PageProps = $props();

    let mess_list = $state([]);
    let q_box = "";

/*
{
    author: user | bot,
    msg: ""
}
*/

    async function new_question() {
        console.log("askbuttonpressed")
        
        const boop = q_box;
        // const response = await fetch('http://127.0.0.1:8000/chat_completion/'+data.title)
        // const hehe = await response.json();

        mess_list.push({
            author: "user",
            msg: boop,
        });

        const rawResponse = await fetch('http://127.0.0.1:8000/chat_completion/', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "session_id": data.title,
                "user_query": boop
            })
        });
        const content = await rawResponse.json();

        console.log(content.assistant_message);
        mess_list.push({
            author: "bot",
            msg: content.assistant_message,
        });
    }

</script>
<div class="h-screen">
    <div class='flex flex-col h-full p-5'>
        <h1 class="font-bold text-3xl flex flex-row mb-2">{data.title}</h1>
        <div class="grid grid-cols-4 gap-4 flex-row grow">
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            </div>
            <!-- Chat window -->
            <div class="col-span-2 w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-900 dark:border-gray-700">

                <div class="max-h-185 overflow-hidden overflow-y-scroll">
                    {#each mess_list as mess}

                    {#if mess.author == "bot"}
                        <div class="flex w-full mt-2 space-x-3 max-w-lx">
                                <div>
                                    <div class="bg-gray-700 p-3 rounded-r-lg rounded-bl-lg">
                                        <p class="text-sm">{mess.msg}</p>
                                    </div>
                                    <span class="text-xs text-gray-500 leading-none">2 min ago</span>
                                </div>
                        </div>                    
                    {:else}
                        <div class="flex w-full mt-2 space-x-3 max-w-ls ml-auto justify-end">
                            <div>
                                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p class="text-sm">{mess.msg}</p>
                                </div>
                                <span class="text-xs text-gray-500 leading-none">2 min ago</span>
                            </div>
                        </div>  
                    {/if}




  
                    {/each}
                </div>

                <!-- Input Box -->
                <div class="m-2">
                    <Input id="query_box" placeholder="Ask something..." size="lg" bind:value={q_box}>
                      <Button slot="right" size="sm" on:click={new_question}>Ask</Button>
                    </Input>
                </div>

            </div>
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            </div>
        </div>
    </div>

<!-- <div>{@html data.content}</div> -->
</div>

