<!--
/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */  
-->

<script>
  export let status;
  export let error;
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>
<h1 class="error">Sorry, something went wrong.</h1>

<pre>{error}</pre>
