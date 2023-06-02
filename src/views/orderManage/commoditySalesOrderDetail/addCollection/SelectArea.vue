<template>
  <el-popover
    class="popover"
    v-model="visible"
    placement="bottom"
    width="400"
    trigger="manual"
  >
    <div class="box" v-clickoutside="close">
      <div
        class="box-item"
        v-for="item in CHINESE_PLATE_LIST"
        :key="item.id"
        :class="{ active: area === item.name }"
        @click="handleSelect(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <el-button class="button" @click="visible = !visible" slot="reference">
      <span>{{ area || "省" }}</span>
      <i class="el-icon-arrow-down"></i>
    </el-button>
  </el-popover>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["update:area"]);
defineProps({
  area: {
    type: String,
    required: true,
  },
});

// 弹框 显示/隐藏
const visible = ref(false);

//车牌 地区名
const CHINESE_PLATE_LIST = [
  {
    name: "京",
    id: 1,
  },
  {
    name: "津",
    id: 2,
  },
  {
    name: "冀",
    id: 3,
  },
  {
    name: "晋",
    id: 4,
  },
  {
    name: "蒙",
    id: 5,
  },
  {
    name: "辽",
    id: 6,
  },
  {
    name: "吉",
    id: 7,
  },
  {
    name: "黑",
    id: 8,
  },
  {
    name: "沪",
    id: 9,
  },
  {
    name: "苏",
    id: 10,
  },
  {
    name: "浙",
    id: 11,
  },
  {
    name: "皖",
    id: 12,
  },
  {
    name: "闽",
    id: 13,
  },
  {
    name: "赣",
    id: 14,
  },
  {
    name: "鲁",
    id: 15,
  },
  {
    name: "豫",
    id: 16,
  },
  {
    name: "鄂",
    id: 17,
  },
  {
    name: "湘",
    id: 18,
  },
  {
    name: "粤",
    id: 19,
  },
  {
    name: "桂",
    id: 20,
  },
  {
    name: "琼",
    id: 21,
  },
  {
    name: "渝",
    id: 22,
  },
  {
    name: "川",
    id: 23,
  },
  {
    name: "贵",
    id: 24,
  },
  {
    name: "云",
    id: 25,
  },
  {
    name: "藏",
    id: 26,
  },
  {
    name: "陕",
    id: 27,
  },
  {
    name: "甘",
    id: 28,
  },
  {
    name: "青",
    id: 29,
  },
  {
    name: "宁",
    id: 30,
  },
  {
    name: "新",
    id: 31,
  },
];
/**
 * @description: 关闭弹框
 */
const close = () => {
  if (visible.value) visible.value = false;
};
/**
 * @description: 选择对应的车牌地区
 * @param name 车牌地区
 */
const handleSelect = ({ name }) => {
  emit("update:area", name);
  visible.value = false;
};
</script>


<style lang="scss" scoped>
.box {
  .box-item {
    width: 33px;
    height: 45px;
    display: inline-block;
    text-align: center;
    line-height: 45px;
    cursor: pointer;

    &:hover {
      background: #f7f7f7;
    }
  }

  .box-item.active {
    color: #fff;
    background-color: var(--color-primary);
  }
}
</style>