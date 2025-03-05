<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<h1 class="font-bold text-3xl">{data.title}</h1>
<div class="grid grid-cols-4 gap-4" style="min-height: 0;height: 46vw;overflow: content;">
    <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    </div>
    <div class="col-span-2 w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div>
        <h2>
            Main chat area
        </h2>
    </div>
    </div>
    <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    </div>
</div>

<!-- <div>{@html data.content}</div> -->