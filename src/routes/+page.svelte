
<script>
    import { GradientButton } from 'flowbite-svelte';

    async function new_space() {
        console.log("buttonpressed")
        const response = await fetch('http://127.0.0.1:8000/new_session/')
        const hehe = await response.json();
        console.log(hehe);
        window.location.replace("space/"+hehe.id)
    }

	let sessions = $state([
        '1','2','3','4','5'
    ]);
</script>

<nav class="bg-blue-950">
    <div>
      <a class="prose-2xl font-black m-3" href="/">StudyFlow!</a>
    </div>
</nav>

<article class="mx-15">

<h2 class="font-bold m-3">
    Your workspaces
</h2>

<GradientButton color="cyanToBlue" class="font-black" on:click={new_space}>New Space!</GradientButton>


<div class="grid grid-cols-4 gap-4 m-3">

    {#each sessions as sess}
    <a href={"space/"+sess} class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {sess}
        </h5>
        <!-- <p class="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> -->
        </a>
    {/each}
</div>


</article>
