<template>
  <div :class="['star-animate', className]">
    <div :class="['overlap-group-2', overlapGroupClassName]">
      <img
        :class="['group-2', property1, groupClassName]"
        alt="Group"
        :src="property1 === 'variant-2' ? 'https://c.animaapp.com/bX3QfjDJ/img/group-1-1.png' : group"
      />
      <img
        :class="['group-3', 'property-1-' + property1, groupClassNameOverride]"
        alt="Group"
        :src="property1 === 'variant-2' ? 'https://c.animaapp.com/bX3QfjDJ/img/group-2-1.png' : img"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "StarAnimate",
  props: {
    property1: {
      type: String as () => "frame-1" | "variant-2",
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    overlapGroupClassName: {
      type: String,
      default: "",
    },
    groupClassName: {
      type: String,
      default: "",
    },
    group: {
      type: String,
      default: "https://c.animaapp.com/bX3QfjDJ/img/group-1.png",
    },
    groupClassNameOverride: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "https://c.animaapp.com/bX3QfjDJ/img/group-2.png",
    },
  },
});
</script>

<style>
.star-animate {
  height: 963px;
  width: 1337px;
}

.star-animate .overlap-group-2 {
  height: 1555px;
  left: -81px;
  position: relative;
  top: -276px;
  width: 1585px;
}

.star-animate .group-2 {
  position: absolute;
}

.star-animate .group-3 {
  position: absolute;
}

.star-animate .frame-1 {
  height: 964px;
  left: 81px;
  top: 300px;
  width: 1337px;
}

.star-animate .variant-2 {
  height: 1503px;
  left: 0;
  top: 0;
  width: 1585px;
}

.star-animate .property-1-frame-1 {
  height: 1622px;
  left: 0;
  top: 0;
  width: 1582px;
}

.star-animate .property-1-variant-2 {
  height: 1541px;
  left: 130px;
  top: 14px;
  width: 1277px;
}
</style>
