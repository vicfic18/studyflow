<script lang="ts">
	import type { PageProps } from './$types';
    // import { onMount, tick } from "svelte"; 
    import { Input, Button } from 'flowbite-svelte';
    import snarkdown from 'snarkdown';

	let { data }: PageProps = $props();
    console.log(data.lehistory);
    let mess_list = $state(data.lehistory.chat_history);
    mess_list.shift()
    // svelte-ignore non_reactive_update
        let q_box = "";
    let bubble_div: any;
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

    function extractUserQuery(sentence: String) {
        const queryMarker = "User Query:";
        const queryIndex = sentence.indexOf(queryMarker);

        if (queryIndex !== -1) {
            return sentence.substring(queryIndex + queryMarker.length).trim();
        } else {
            return sentence;
        }
    }

</script>


<div class="h-screen">
    <div class='flex flex-col h-full p-5'>
        <!-- Nav bar kinda -->
        <div class="flex flex-row mb-2 justify-between">
            <h1 class="font-bold text-3xl">{data.lehistory.description}</h1>
            <Button color="light" href="/">Go back!</Button>
        </div>
        <div class="grid grid-cols-4 gap-4 flex-row grow">
            <!-- Source management -->
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            
                <!-- Drop Zone -->
                <div class="flex items-center justify-center w-full">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">PDF, PPTX, DOCX, TXT, etc</p>
                        </div>
                        <input id="dropzone-file" type="file" class="hidden" />
                    </label>
                </div>

                <!-- Sources List -->
                <div>
                    <h3 class="text-xl my-2">Document Sources</h3>
                    <ul>
                        <li>source.txt</li>
                        <li>idk.pdf</li>
                    </ul>

                </div>
                

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
                                        <p class="text-xl">{@html snarkdown(mess.content.replace(/\n/g, '<br>'))}</p>
                                    </div>
                                </div>
                        </div>                    
                    {:else}
                        <div class="flex w-full mt-2 space-x-3 max-w-ls ml-auto justify-end">
                            <div>
                                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p class="text-xl">{extractUserQuery(mess.content)}</p>
                                </div>
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
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-4 dark:bg-gray-800 dark:border-gray-700">
                <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-900 dark:border-gray-600">
                    <h1 class="text-xl font-bold">Quick Options</h1>
                    <div class="grid-cols-2 gap-4">
                        <button type="button" style="box-sizing: border-box; display: block;" class="box-border text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Default</button>
                        <button type="button" style="box-sizing: border-box; display: block;" class="box-border text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Default</button>
                        <button type="button" style="box-sizing: border-box; display: block;" class="box-border text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Default</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

<!-- <div>{@html data.content}</div> -->
</div>

