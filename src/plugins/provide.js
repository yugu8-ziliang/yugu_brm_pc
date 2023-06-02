/*
 * @Date: 2023-06-01 13:25:26
 * @Description: 全局注入方法/属性
 */

import { ElMessage, ElMessageBox } from "element-ui";

import { closePage } from "@/utils/global";

export default {
  $baseMessage: (
    message,
    type = "info",
    customClass,
    dangerouslyUseHTMLString
  ) => {
    ElMessage({
      message,
      type,
      customClass,
      duration: messageDuration,
      dangerouslyUseHTMLString,
      showClose: true,
    });
  },
  $baseConfirm: (
    content,
    title,
    callback1,
    callback2,
    confirmButtonText = "确定",
    cancelButtonText = "取消"
  ) => {
    ElMessageBox.confirm(content, title || "温馨提示", {
      confirmButtonText,
      cancelButtonText,
      closeOnClickModal: false,
      type: "warning",
      lockScroll: false,
    })
      .then(() => {
        if (callback1) {
          callback1();
        }
      })
      .catch(() => {
        if (callback2) {
          callback2();
        }
      });
  },
  $closePage: closePage,
};
