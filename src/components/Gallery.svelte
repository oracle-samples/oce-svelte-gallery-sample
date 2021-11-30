<!--
/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * This component renders the gallery for each category and also displays the
 * name of the category and the number of items belonging to the category.
 *
 * @param category the category of the items to display
 -->
 
<script>
  export let category;
  const { items, totalResults } = category;
</script>

<section>
  <a
    sapper:prefetch
    href="category/{category.id}?categoryName={category.name}"
    style={{ textDecoration: 'none' }}>
    <!-- {/* Images for the category */} -->
    <div class="gallery">
      {#each items as item, index}
        <div key={item.id} class="item fade">
          <picture>
            <source
              type="image/webp"
              srcset={item.renditionUrls.srcset}
              sizes="{index == 0 ? 230 : 75}px" />
            <source
              srcset={item.renditionUrls.jpgSrcset}
              sizes="{index == 0 ? 230 : 75}px" />
            <img
              src={item.renditionUrls.small}
              class="cover"
              loading="lazy"
              alt={item.name}
              width="item.renditionUrls.width" height="item.renditionUrls.height"/>
          </picture>
        </div>
      {/each}
    </div>

    <!-- {/* Category Name and total number of items in that category */} -->
    <div class="caption">
      <h2>{category.name}</h2>
      <h3>{totalResults} photos</h3>
    </div>
  </a>
</section>
