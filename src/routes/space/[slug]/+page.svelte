<script lang="ts">
	import type { PageProps } from './$types';
    // import { onMount, tick } from "svelte";
    import { Input, Button } from 'flowbite-svelte';
    import snarkdown from 'snarkdown';

	let { data }: PageProps = $props();
    console.log(data.lehistory);
    let mess_list = $state(data.lehistory.chat_history);
    mess_list.shift()
    let file_list = $state(data.lefiles);
    console.log(file_list)
    let q_box = $state("");
    let bubble_div: any;
    let cur_file = $state<HTMLInputElement>();

    // $inspect(cur_file?.files)
    // bubble_div.scrollTop = bubble_div.scrollHeight;

    // onMount(() => {
    //     bubble_div.scrollTop = bubble_div.scrollHeight;
    // });

    async function disp_files() {
        const file_resp = await fetch('http://127.0.0.1:8000/list_files/'+data.leslug)
        const file_dat = await file_resp.json();
        return file_dat;
    }

    async function new_question() {
        console.log("askbuttonpressed")

        const boop = q_box;
        q_box = ""
        console.log(bubble_div);

        mess_list.push({
            role: "user",
            content: boop,
        });

        bubble_div.scrollTop = bubble_div.scrollHeight;

        const rawResponse = await fetch('http://127.0.0.1:8000/chat_completion/', {
            method: 'POST',
            headers: {
            'Accept': 'application/json; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
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


    async function new_file() {
        console.log("newfile uploaded");
        console.log(cur_file.files[0]);

        const rawResponse = await fetch('http://127.0.0.1:8000/upload_resource/'+data.leslug, {
            method: 'POST',
            // headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data'
            // },
            body: (() => {
                const formData = new FormData();
                formData.append('file', cur_file.files[0]);
                return formData;
            })()
        });
        const content = await rawResponse.json();

        $inspect(cur_file?.files)
        file_list.push({
            file_id: "we dont have it",
            filename: cur_file.files[0],
        });

        let file_list = $state(disp_files())
    }

    function handleEnterKeyPress(event: any) {
        if (event.key === "Enter") {
            new_question();
            console.log("ENTTERERER")
        }
    }

    function extractUserQuery(sentence: String) {
        const queryMarker = "User Query:";
        const queryIndex = sentence.indexOf(queryMarker);

        if (queryIndex !== -1) {
            return sentence.substring(queryIndex + queryMarker.length).trim();
        } else if (sentence.indexOf("New file uploaded:") != -1) {
            return "File uploaded."
        } else {
            return sentence;
        }
    }

    async function actionButton(qatype: String) {
        console.log("QA button clicked!")

        bubble_div.scrollTop = bubble_div.scrollHeight;

        const qa_resp = await fetch('http://127.0.0.1:8000/'+qatype+'/'+data.leslug)
        const qa_dat = await qa_resp.json();

        mess_list.push({
            role: "assistant",
            content: qa_dat
        });
        // Scrolling into view
        bubble_div.scrollTop = bubble_div.scrollHeight;
    }
</script>


<div class="h-screen">
    <div class='flex flex-col h-full p-5'>
        <!-- Nav bar kinda -->
        <div class="flex flex-row mb-2">
            <Button color="light" href="/">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"></path>
                </svg>
            </Button>

            <h1 class="font-bold text-3xl ml-4">{data.lehistory.description}</h1>

        </div>
        <div class="grid grid-cols-4 gap-4 flex-row grow">
            <!-- Source management -->
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">

                <!-- Drop Zone -->
                <div class="flex items-center justify-center w-full">
                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, TXT, etc</p>
                        </div>
                        <input id="dropzone-file" type="file" class="hidden" bind:this={cur_file} oninput={new_file}/>
                    </label>
                </div>

                <!-- Sources List -->
                <div>
                    <h3 class="text-2xl my-2">Document Sources</h3>
                    <ul>
                        {#each file_list as file}
                            <li class="text-xl hover:bg-gray-600 rounded-lg m-1 py-1">📄 {file.filename}</li>
                        {/each}
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
                    <Input id="query_box" placeholder="Ask something..." size="lg" on:keydown={handleEnterKeyPress} bind:value={q_box}>
                      <Button slot="right" color="blue" size="sm" on:click={new_question}>
                        <svg class="w-5 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"></path>
                          </svg>
                      </Button>
                    </Input>
                </div>

            </div>
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-4 dark:bg-gray-800 dark:border-gray-700">
                <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-900 dark:border-gray-600">
                    <h1 class="text-xl font-bold mb-4">Quick Options</h1>
                    <div class="grid-cols-2 gap-4 justify-between">
                        <!-- The on:click event thing was messed up so I pulled this little manoeuvre with the event arg -->
                        <Button on:click={(event) => actionButton("quick_summary")} outline color="blue" class="w-full my-2">Quick Summary</Button>
                        <Button on:click={(event) => actionButton("revision_notes")} outline color="blue" class="w-full my-2">Revision Notes</Button>
                        <Button on:click={(event) => actionButton("faqs")} outline color="blue" class="w-full my-2">Frequently Asked Questions</Button>
                        <Button on:click={(event) => actionButton("study_plan")} outline color="blue" class="w-full my-2">Study Plan</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

<!-- <div>{@html data.content}</div> -->
</div>

