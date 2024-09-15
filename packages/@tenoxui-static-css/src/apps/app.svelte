<script>
  let isActive = false;
  let count = 0;
</script>

<div class="container">
  <button class="transform btn" class:active={isActive} on:click={() => count++}>
    Clicked {count}
    {count === 1 ? "time" : "times"}
  </button>
</div>
