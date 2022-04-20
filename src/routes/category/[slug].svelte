<!--
/**
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 *
 * This component displays the assets belonging to a category in a grid view.
 * Upon clicking an image, it allows display of the images in a slideshow.
 *
 * @param categoryId the id of the category whose items are to be displayed
 * @param categoryName the name of the category whose items are to be displayed
 */
-->

<script context="module">
  import { getImageGridPageData } from "../../scripts/services.js";
  export async function preload(page) {
    const categoryId = page.params.slug;
    const categoryName = page.query.categoryName;
    const data = await getImageGridPageData(categoryId);

    return { categoryName, data };
  }
</script>

<script>
  export let data;
  export let categoryName;
  import { onMount } from "svelte";

  let currentImage = -1;
  let items = data.items;
  let totalResults = data.totalResults;
  let prevClassName = `prev`;
  let nextClassName = `next`;

  onMount(() => {
    // add event listener for keydown for navigating through large view of images
    document.addEventListener(
      "keydown",
      (e) => handleKeypressFunction(e),
      false
    );
  });

  function setCurrentImage(image) {
    // class names for the next/previous buttons
    let hidePrev = image === 0;
    let hideNext = image === totalResults - 1;
    prevClassName = `prev${hidePrev ? " hidden" : ""}`;
    nextClassName = `next${hideNext ? " hidden" : ""}`;
    currentImage = image;
  }

  /**
   * Handle click on the grid item. Sets the current image on the state.
   */
  function handleClick(event) {
    const imageClicked = event.target.getAttribute("data-key");
    if (!imageClicked) {
      return; // check for null image. This may be null when you click on empty white space
    }

    const el = document.getElementsByTagName("body");
    el[0].classList.add("modal-open");
    setCurrentImage(parseInt(imageClicked, 10));
  }

  /**
   * Handle Keypress events. If the left arrow or right arrow key is pressed,
   * adjust the slideshow accordingly. If esc is pressed, exit slideshow mode.
   */
  function handleKeypressFunction(e) {
    if (currentImage === -1) {
      return;
    }
    if (e.keyCode === 37) {
      // left arrow
      handlePrevNextClick(e, false);
    } else if (e.keyCode === 39) {
      // right arrow
      handlePrevNextClick(e, true);
    } else if (e.keyCode === 27) {
      // esc key
      handleCloseClick(e);
    }
  }

  /**
   * Handle clicks on the prev/next buttons. If its on the first item
   * or last item, don't do anything on the prev or next respectively
   */
  function handlePrevNextClick(e, increment) {
    e.preventDefault();
    if (
      (currentImage === 0 && !increment) ||
      (currentImage === totalResults - 1 && increment)
    ) {
      return;
    }
    setCurrentImage(increment ? currentImage + 1 : currentImage - 1);
  }

  /**
   * Handle click on the close button of the slideshow.
   * Remove the modal-open class from the body so that scrollbars can
   * work again.
   */
  function handleCloseClick(e) {
    e.preventDefault();
    const el = document.getElementsByTagName("body");
    el[0].classList.remove("modal-open");
    currentImage = -1;
  }
</script>

<!--
/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */ -->

<svelte:head>
  <title>{categoryName}</title>
</svelte:head>

{#if !data}
  <div class="progress-spinner" />
{:else}
  <div>
    <div>
      <a href="." class="back">
        <img src="images/back.png" alt="Navigate back to Home" />
        <span class="home">Home</span>
      </a>
      <h1 class="heading">{categoryName}</h1>
      <h2 class="subheading">{totalResults} photos</h2>
    </div>

    {#if items}
      <div class="grid" on:click={(e) => handleClick(e)}>
        <!-- the HTML for rendering every item's rendition URL -->
        {#each items as item, i}
          <div class="grid-item fade">
            <picture>
              <source
                type="image/webp"
                srcset={item.renditionUrls.srcset}
                sizes="(min-width: 480px) 200px, 150px" />
              <source
                srcset={item.renditionUrls.jpgSrcset}
                sizes="(min-width: 480px) 200px, 150px" />
              <img
                src={item.renditionUrls.small}
                loading="lazy"
                data-key={i}
                alt="Small Preview"
                width={item.renditionUrls.width}
                height={item.renditionUrls.height} />
            </picture>
          </div>
        {/each}
      </div>
    {:else}
      <!-- {/* No items message */} -->
      <div class="message">There are no images in this category.</div>
    {/if}

    <!-- {/* Image preview overlaid ontop of grid of images */} -->
    {#if currentImage !== -1}
      <div class="page-container">
        <section class="slideshow-container">
          <div class="mySlides fade">
            <div class="imgdiv">
              <picture>
                <source
                  type="image/webp"
                  srcset={items[currentImage].renditionUrls.srcset}
                  sizes="90vh" />
                <source
                  srcset={items[currentImage].renditionUrls.jpgSrcset}
                  sizes="90vh" />
                <img
                  src={items[currentImage].renditionUrls.large}
                  sizes="90vh"
                  loading="lazy"
                  alt="Large preview"
                  width={items[currentImage].renditionUrls.width}
                  height={items[currentImage].renditionUrls.height}/>
              </picture>
              <div class="numbertext">{currentImage + 1} / {totalResults}</div>
            </div>
          </div>
        </section>

        <div
          class={prevClassName}
          on:click={(e) => handlePrevNextClick(e, false)}
          on:keydown={(e) => handlePrevNextClick(e, false)}
          role="button"
          tabIndex="0">
          &#10094;
        </div>

        <div
          class={nextClassName}
          on:click={(e) => handlePrevNextClick(e, true)}
          on:keyDown={(e) => handlePrevNextClick(e, true)}
          role="button"
          tabIndex="0">
          &#10095;
        </div>

        <div
          class="close"
          on:click={(e) => handleCloseClick(e, true)}
          on:keydown={(e) => handleCloseClick(e, true)}
          role="button"
          tabIndex="0">
          X
        </div>
      </div>
    {/if}
  </div>
{/if}
