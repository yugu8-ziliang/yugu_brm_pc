export const parseTime = function (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
};

//客户列表  状态
export const isZhuangtai = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "普通";
  } else if (val == 2) {
    return "常用";
  } else if (val == 3) {
    return "已拉黑";
  } else if (val == 4) {
    return "已冻结";
  } else if (val == 5) {
    return "已逾期";
  }
};
//客户列表  类型
export const isLeixing = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "平台";
  } else if (val == 2) {
    return "非平台";
  }
};
//客户列表  角色
export const isJuese = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "经营户";
  } else if (val == 2) {
    return "采购商";
  } else if (val == 3) {
    return "供货商";
  } else {
    return "--";
  }
};

// 判断客户类型
export const isCustomerType = function (val) {
  if (val == 1) {
    return "经营户";
  } else if (val == 2) {
    return "采购商";
  } else if (val == 3) {
    return "供货商";
  } else if (val == 4) {
    return "非平台";
  } else if (val == 5) {
    return "散户";
  }
};
// 交易订单状态
//商品销售单 发出的退货退款单 发出的退货退款单
export const isOrderStatus1 = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "待对方确认";
  } else if (val == 2) {
    return "待修改";
  } else if (val == 3) {
    return "待收款";
  } else if (val == 4) {
    return "未结清";
  } else if (val == 5) {
    return "已结清";
  } else if (val == 7) {
    return "未成交";
  } else {
    return "--";
  }
};
//商品采购单 收到的退货退款单 收到的退还筐子单
export const isOrderStatus2 = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "待确认";
  } else if (val == 3) {
    return "待对方收款";
  } else if (val == 4) {
    return "未结清";
  } else if (val == 5) {
    return "已结清";
  } else if (val == 7) {
    return "未成交";
  } else {
    return "--";
  }
};
// 记账货款、筐子款（未收、未付） 记账未收货款 记账未付货款 记账未收筐子款 记账未付筐子款
export const isOrderStatus3 = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "待对方确认";
  } else if (val == 2) {
    return "待确认";
  } else if (val == 3) {
    return "已成交";
  }
};
// 筐子购入单
export const isOrderStatus4 = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 3) {
    return "待确认";
  } else if (val == 4) {
    return "待收款";
  } else if (val == 5) {
    return "未结清";
  } else if (val == 6) {
    return "已结清";
  }
};
// 筐子售出单
export const isOrderStatus5 = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "待修改";
  } else if (val == 3) {
    return "待对方付款";
  } else if (val == 4) {
    return "待收款";
  } else if (val == 5) {
    return "未结清";
  } else if (val == 6) {
    return "已结清";
  }
};
// 筐子自购单  筐子报废单
export const isOrderStatus6 = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 4) {
    return "未结清";
  } else if (val == 5) {
    return "已结清";
  }
};
// 订单类型
export const isOrderType = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "商品销售单";
  } else if (val == 2) {
    return "发出的商品退货退款";
  } else if (val == 3) {
    return "发出的筐子退筐退款";
  } else if (val == 4) {
    return "筐子售出单";
  } else {
    return "";
  }
};
// 转/记账单类型
export const isAdvanceOrderType = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "记账";
  } else if (val == 2) {
    return "转账";
  } else {
    return "";
  }
};
// 转/记账单状态
export const isAdvanceOrderStatus = function (val) {
  if (val == 0) {
    return "全部";
  } else if (val == 1) {
    return "待对方确认";
  } else if (val == 2) {
    return "待对方收款";
  } else if (val == 3) {
    return "已确认";
  } else if (val == 4) {
    return "已付款";
  } else {
    return "";
  }
};

// 订单类型--筐子进出明细
// 0 筐子报废单(进当前库存)  1 筐子报失单(进当前库存) 2 筐子自购单(进当前库存)  3 筐子购入单 4 商品采购单 5 筐子售出单 6 商品销售单 7 发起的退货退款(出库)  9 筐子报溢单 10 筐子腾空单  11 收到的退货退款(入库)  15 添加商品/添加入库 13.退入筐子 14.退还筐子
// 16 商品报溢单  18  自家已有入库自购  19 销售记账单出库 20 随配送退筐单退入 21 随配送退货单退入 22 随配送售出
// 23 销售记账退入 24 装筐  25 报废(客户筐子) 26 报失(客户筐子)  27 收到的退货退款(购入) 28 发起的退货退款(售出)  29 腾空商品
export const basketOrderType = function (val) {
  if (val == 0) {
    return "筐子报废单(进当前库存)";
  } else if (val == 1) {
    return "筐子报失单(进当前库存)";
  } else if (val == 2) {
    return "筐子自购单(进当前库存)";
  } else if (val == 3) {
    return "筐子购入单";
  } else if (val == 4) {
    return "商品采购单";
  } else if (val == 5) {
    return "筐子售出单";
  } else if (val == 6) {
    return "商品销售单";
  } else if (val == 7) {
    return "发起的退货退款";
  } else if (val == 9) {
    return "筐子报溢单";
  } else if (val == 10) {
    return "筐子腾空单";
  } else if (val == 11) {
    return "收到的退货退款";
  } else if (val == 13) {
    return "处理的退筐退款单";
  } else if (val == 14) {
    return "发起的退筐退款单";
  } else if (val == 15) {
    return "商品采购单";
  } else if (val == 16) {
    return "商品报溢单";
  } else if (val == 18) {
    return "自家已有单";
  } else if (val == 19) {
    return "销售记账单";
  } else if (val == 20) {
    return "配送退筐单";
  } else if (val == 21) {
    return "配送退货单";
  } else if (val == 22) {
    return "配送单";
  } else if (val == 23) {
    return "销售记账单";
  } else if (val == 24) {
    return "装筐单";
  } else if (val == 25) {
    return "筐子报废(客户筐子)";
  } else if (val == 26) {
    return "筐子报失(客户筐子)";
  } else if (val == 27) {
    return "收到的退货退款";
  } else if (val == 28) {
    return "发起的退货退款";
  } else {
    return "";
  }
};

export const basketCurrentType = function (val) {
  let array = [
    {
      id: 0,
      typeName: "筐子报废单",
      name: "报废给##**",
    }, // 报废给xx
    {
      id: 1,
      typeName: "筐子报失单",
      name: "报失",
    }, // 报失
    {
      id: 2,
      typeName: "筐子自购单",
      name: "从##自购**",
    }, // 从xx自购
    {
      id: 3,
      typeName: "筐子购入单",
      name: "从##**购入",
    }, // 从xx i 购入
    {
      id: 4,
      typeName: "商品采购单",
      name: "从##**购入",
    },
    {
      id: 5,
      typeName: "筐子售出单",
      name: "售出给##**",
    },
    {
      id: 6,
      typeName: "商品销售单",
      name: "售出给##**",
    }, // 商品售出单
    {
      id: 7,
      typeName: "发出的退货退款单",
      name: "退货退筐给##**",
    }, // 发起的退货退款
    {
      id: 9,
      typeName: "筐子报溢单",
      name: "报溢",
    }, // 筐子报溢单
    {
      id: 10,
      typeName: "筐子腾空单",
      name: "腾空",
    },
    {
      id: 11,
      typeName: "收到的退货退款单",
      name: "##**退货退筐给我",
    }, // 收到的退货退款
    {
      id: 15,
      typeName: "添加自有筐子",
      name: "添加自有筐子",
    }, // 添加商品/添加入库
    {
      id: 13,
      typeName: "退入筐子单",
      name: "退筐给##**",
    }, // 退入筐子
    {
      id: 14,
      typeName: "退入筐子单",
      name: "##**退筐给我",
    }, // 退还筐子
    {
      id: 16,
      typeName: "商品报溢单",
      name: "报溢",
    },
    {
      id: 17,
      typeName: "商品腾空筐子",
      name: "商品腾空筐子",
    }, //
    {
      id: 18,
      typeName: "自有筐子单",
      name: "自家已有筐子",
    }, // 自有筐子单
    {
      id: 20,
      typeName: "配送退筐单",
      name: "配送点##退筐给我",
    }, // 配送退筐单
    {
      id: 21,
      typeName: "配送退款单",
      name: "配送单##退筐给我",
    }, // 配送退款单
    {
      id: 22,
      typeName: "配送单",
      name: "配送给##",
    }, //配送单
    {
      id: 19,
      typeName: "销售记账单",
      name: "销售记账售出",
    }, // 销售记账单 销售记账售出
    {
      id: 23,
      typeName: "销售记账单",
      name: "销售记账退入",
    }, // 销售记账单 销售记账退入
    {
      id: 24,
      typeName: "装筐单",
      name: "装筐",
    }, // 装筐
  ];
  let data = array.filter((item) => item.id == val);
  return data;
};

export const basketExplainType = function (val) {
  let filterName = basketCurrentType(val.type)[0];
  var strName = filterName.name.replace("##", val.fromUserName);
  let elTage = "";
  if (val.typeId == 0) {
    elTage =
      "<span class='elTagbg4 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>非</span>";
  } else if (val.typeId == 3 || val.typeId == 4) {
    elTage =
      "<span class='elTagbg2 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>采</span>";
  } else if (val.typeId == 6 || val.typeId == 7) {
    elTage =
      "<span class='elTagbg1 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>经</span>";
  } else if (val.typeId == 10 || val.typeId == 11) {
    elTage =
      "<span class='elTagbg3 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>供</span>";
  }
  var strName1 = strName.replace("**", elTage);
  return strName1;
};

export const basketActionCode = function (val) {
  let array = [
    {
      id: 1,
      typeName: "筐子自购单",
      name: "从##自购",
    },
    {
      id: 2,
      typeName: "筐子报废单",
      name: "报废给##**",
    },
    {
      id: 3,
      typeName: "筐子报失单",
      name: "报失",
    },
  ];
  let data = array.filter((item) => item.id == val);
  return data;
};
export const basketActionCodeType = function (val) {
  let filterName = basketActionCode(val.actionCode)[0];
  var strName = filterName.name.replace("##", val.cusName);
  let elTage = "";
  if (val.typeId == 0) {
    elTage =
      "<span class='elTagbg4 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>非</span>";
  } else if (val.typeId == 3 || val.typeId == 4) {
    elTage =
      "<span class='elTagbg2 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>采</span>";
  } else if (val.typeId == 6 || val.typeId == 7) {
    elTage =
      "<span class='elTagbg1 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>经</span>";
  } else if (val.typeId == 10 || val.typeId == 11) {
    elTage =
      "<span class='elTagbg3 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>供</span>";
  }
  var strName1 = strName.replace("**", "");
  return strName1;
};

// 金额三位间隔
export const intervalFormat = function (key, isZero) {
  key += "";
  let x = key.split(".");
  let x1 = x[0];
  let x2 = x.length > 1 ? "." + x[1] : "";
  let reg = /(\d+)(\d{3})/;
  while (reg.test(x1)) {
    x1 = x1.replace(reg, "$1" + "," + "$2");
    // x2 = x2.replace(reg, '$1' + ',' + '$2');
  }
  let nums = x1 + x2;
  if (nums == "undefined" || !nums) {
    nums = 0;
  }

  if (isZero) {
    return nums;
  }

  var s = nums.toString().split(".");
  if (s.length == 1) {
    nums = nums.toString() + ".00";
    return nums;
  }
  if (s.length > 1) {
    if (s[1].length < 2) {
      nums = nums.toString() + "0";
    }
    return nums;
  }
};
