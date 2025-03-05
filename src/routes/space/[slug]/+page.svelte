<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>
<div class="h-screen">
    <div class='flex flex-col h-full p-5'>
        <h1 class="font-bold text-3xl flex flex-row mb-2">{data.title}</h1>
        <div class="grid grid-cols-4 gap-4 flex-row grow">
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            </div>
            <!-- Chat window -->
            <div class="max-h-211 overflow-hidden overflow-y-scroll col-span-2 w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-900 dark:border-gray-700">

                <div class="flex w-full mt-2 space-x-3 max-w-lx">
                    <div>
                        <div class="bg-gray-700 p-3 rounded-r-lg rounded-bl-lg">
                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <span class="text-xs text-gray-500 leading-none">2 min ago</span>
                    </div>
                </div>

                <div class="flex w-full mt-2 space-x-3 max-w-ls ml-auto justify-end">
                    <div>
                        <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                        </div>
                        <span class="text-xs text-gray-500 leading-none">2 min ago</span>
                    </div>
                </div>

            </div>
            <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            </div>
        </div>
    </div>

<!-- <div>{@html data.content}</div> -->
</div>

