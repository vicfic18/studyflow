<script lang="ts">
	import type { PageProps } from './$types';
    // import { onMount, tick } from "svelte"; 
    import { Input, Button } from 'flowbite-svelte';

	let { data }: PageProps = $props();
    console.log(data.lehistory);
    let mess_list = $state(data.lehistory.chat_history);
    let q_box = "";
    let bubble_div;
    // bubble_div.scrollTop = bubble_div.scrollHeight;

    // onMount(() => {
    //     bubble_div.scrollTop = bubble_div.scrollHeight;
    // });

    async function new_question() {
        console.log("askbuttonpressed")
        
        const boop = q_box;
        console.log(bubble_div);

        mess_list.push({
            role: "user",
            content: boop,
        });
        bubble_div.scrollTop = bubble_div.scrollHeight;

        const rawResponse = await fetch('http://127.0.0.1:8000/chat_completion/', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "session_id": data.leslug,
                "user_query": boop
            })
        });
        const content = await rawResponse.json();

        console.log(content.assistant_message);
        mess_list.push({
            role: "assistant",
            content: content.assistant_message,
        });
        // Scrolling into view
        bubble_div.scrollTop = bubble_div.scrollHeight;
    }

</script>


<div class="h-screen">
    <div class='flex flex-col h-full p-5'>
        <h1 class="font-bold text-3xl flex flex-row mb-2">{data.lehistory.description}</h1>
        <div class="grid grid-cols-4 gap-4 flex-row grow">
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            </div>
            <!-- Chat window -->
            <div class="col-span-2 w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-900 dark:border-gray-700">
                <!-- Bubble area -->
                <div bind:this={bubble_div} class="max-h-185 overflow-hidden overflow-y-scroll">
                    {#each mess_list as mess}

                    {#if mess.role == "assistant"}
                        <div class="flex w-full mt-2 space-x-3 max-w-lx">
                                <div>
                                    <div class="bg-gray-700 p-3 rounded-r-lg rounded-bl-lg">
                                        <p class="text-sm">{@html mess.content.replace(/\n/g, '<br>')}</p>
                                    </div>
                                    <span class="text-xs text-gray-500 leading-none">2 min ago</span>
                                </div>
                        </div>                    
                    {:else}
                        <div class="flex w-full mt-2 space-x-3 max-w-ls ml-auto justify-end">
                            <div>
                                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p class="text-sm">{mess.content}</p>
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

