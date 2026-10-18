<script setup>
/**
 * WalletSeam — one row of saddle stitches for ExperienceWallet, from the
 * `sew()` output there. Each stitch is layered: the awl hole it sinks into,
 * its shadow on the leather, the thread, and a glint of light along it.
 */
defineProps({
  seam: { type: Object, required: true },
})
</script>

<template>
  <path class="seam__groove" :d="seam.d" />
  <g v-for="(s, n) in seam.stitches" :key="n">
    <line class="seam__hole" v-bind="s" />
    <line class="seam__shadow" v-bind="s" />
    <line class="seam__thread" v-bind="s" />
    <line class="seam__shine" v-bind="s" />
  </g>
</template>

<style scoped>
line {
  stroke-linecap: round;
}
/* the line pressed into the leather before sewing */
.seam__groove {
  fill: none;
  stroke: rgba(0, 0, 0, 0.18);
  stroke-width: 0.42;
}
/* holes show past both ends of the thread */
.seam__hole {
  stroke: rgba(0, 0, 0, 0.5);
  stroke-width: 0.5;
}
.seam__shadow {
  stroke: rgba(0, 0, 0, 0.35);
  stroke-width: 0.36;
  transform: translateY(0.14px);
}
.seam__thread {
  stroke: var(--leather-stitch);
  stroke-width: 0.34;
}
/* light from the top left catches the upper side of the twisted thread */
.seam__shine {
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 0.1;
  transform: translate(-0.04px, -0.07px);
}
</style>
