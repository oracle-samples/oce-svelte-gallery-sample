<!--
/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
-->

<script context="module">
  import { getHomePageData } from "../scripts/services.js";
  export async function preload() {
    const data = await getHomePageData();
    return { data };
  }
</script>

<script>
  export let data;
  import Gallery from "../components/Gallery.svelte";
  let categories = data.categories;
</script>

<svelte:head>
  <title>Image Gallery</title>
</svelte:head>

{#if !data}
  <div class="progress-spinner" />
{:else}
  <div>
    <h1 class="heading">Image Gallery</h1>
    <div class="gallerycontainer">
      <!-- {/* Iterate through the categories and render the gallery for each */} -->
      {#each categories as category}
        <Gallery {category} />
      {/each}
    </div>
  </div>
{/if}
