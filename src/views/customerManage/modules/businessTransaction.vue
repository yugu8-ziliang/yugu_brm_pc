<template>
  <!-- 经营交易 -->
  <el-scrollbar style="height: 100%" class="businessTransactionModel">
    <el-collapse v-model="activeName" :accordion="false">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="flex_dom flex_item_mid">
            <div class="collTitle">今日交易</div>
            <div class="collTitleLeft ml76">
              <div class="collTitle1">今日采购款</div>
              <div class="collTitle2">
                {{ tableData.amountPurchaseToday | intervalFormat(true)
                }}<span class="collTitle3">万</span>
              </div>
            </div>

            <div class="collTitleLeft1 ml15">
              <div>
                <span class="collTitle4 collColorR">商品采购款</span
                ><span class="collTitle4 collColorR" style="margin-left: 15px"
                  >{{ tableData.todayBuyGoods | intervalFormat(true) }}万</span
                >
              </div>
              <div>
                <span class="collTitle4 collColorR">筐子采购款</span
                ><span class="collTitle4 collColorR" style="margin-left: 15px"
                  >{{ tableData.todayBuyBasket | intervalFormat(true) }}万</span
                >
              </div>
            </div>

            <div class="lineH"></div>

            <div class="collTitleLeft">
              <div class="collTitle1">今日销售款</div>
              <div class="collTitle2">
                {{ tableData.amountSaleToday | intervalFormat(true)
                }}<span class="collTitle3">元</span>
              </div>
            </div>

            <div class="collTitleLeft1 ml15">
              <div>
                <span class="collTitle4 collColorB">商品销售款</span
                ><span class="collTitle4 collColorB" style="margin-left: 15px"
                  >{{ tableData.todaySaleGoods | intervalFormat(true) }}万</span
                >
              </div>
              <div>
                <span class="collTitle4 collColorB">筐子销售款</span
                ><span class="collTitle4 collColorB" style="margin-left: 15px"
                  >{{
                    tableData.todaySaleBasket | intervalFormat(true)
                  }}万</span
                >
              </div>
            </div>

            <div class="lineH"></div>

            <div class="collTitleLeft">
              <div class="collTitle1">今日商品利润</div>
              <div class="collTitle2">
                {{ tableData.todayGoodsProfit | intervalFormat(true)
                }}<span class="collTitle3">元</span>
              </div>
            </div>

            <div class="collTitleLeft1 ml15">
              <div>
                <span class="collTitle4 collColorB">商品成本</span
                ><span class="collTitle4 collColorB" style="margin-left: 15px"
                  >{{ tableData.todayGoodsCost | intervalFormat(true) }}万</span
                >
              </div>
              <div>
                <span class="collTitle4 collColorB"> </span
                ><span class="collTitle4 collColorB" style="margin-left: 15px">
                </span>
              </div>
            </div>
          </div>
        </template>
        <div class="collContent flex_dom flex_item_mid">
          <div class="collContentRadio"></div>
          <div class="collContentTitle1">采购</div>
          <div class="ml100 collContentWidth">
            <div class="collContentTitle2">商品采购款</div>
            <div class="collContentTitle3">
              {{ tableData.todayBuyGoods | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>

          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">载货筐子购入款</div>
            <div class="collContentTitle3">
              {{ tableData.todayBuyCarryingBasket | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">空筐购入款</div>
            <div class="collContentTitle3">
              {{ tableData.todayBuyEmptyBasket | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未付货款</div>
            <div class="collContentTitle3">
              {{ tableData.todayTransforNoteBuyGoods | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未付筐子款</div>
            <div class="collContentTitle3">
              {{
                tableData.todayTransferNoteBuyEmptyBasket
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
        </div>
        <div
          class="collContent flex_dom flex_item_mid"
          style="border-bottom: none"
        >
          <div class="collContentRadio"></div>
          <div class="collContentTitle1">销售</div>
          <div class="ml100 collContentWidth">
            <div class="collContentTitle2">商品销售款</div>
            <div class="collContentTitle3">
              {{ tableData.todaySaleGoods | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>

          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">载货筐子售出款</div>
            <div class="collContentTitle3">
              {{ tableData.todaySaleCarryingBasket | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">空筐售出款</div>
            <div class="collContentTitle3">
              {{ tableData.todaySaleEmptyBasket | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未收货款</div>
            <div class="collContentTitle3">
              {{ tableData.todayTransferNoteSaleGoods | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未收筐子款</div>
            <div class="collContentTitle3">
              {{
                tableData.todayTransferNoteSaleEmptyBasket
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="flex_dom flex_item_mid">
            <div class="collTitle">全部交易</div>

            <div class="collTitleLeft1 ml76">
              <div>
                <span class="collTitle4 collColorR">全部采购款</span
                ><span class="collTitle4 collColorR" style="margin-left: 15px"
                  >{{
                    tableData.amountPurchaseAll | intervalFormat(true)
                  }}万</span
                >
              </div>
            </div>

            <div class="collTitleLeft1 ml40">
              <div>
                <span class="collTitle4 collColorB">全部销售款</span
                ><span class="collTitle4 collColorB" style="margin-left: 15px"
                  >{{ tableData.amountSaleAll | intervalFormat(true) }}万</span
                >
              </div>
            </div>
            <div class="collTitleLeft1 ml40">
              <div>
                <span class="collTitle4 collColorB">商品利润</span
                ><span class="collTitle4 collColorB" style="margin-left: 15px"
                  >{{ tableData.allGoodsProfit | intervalFormat(true) }}万</span
                >
              </div>
            </div>
          </div>
        </template>
        <div class="collContent flex_dom flex_item_mid">
          <div class="collContentRadio"></div>
          <div class="collContentTitle1">采购</div>
          <div class="ml100 collContentWidth">
            <div class="collContentTitle2">商品采购款</div>
            <div class="collContentTitle3">
              {{ tableData.allBuyGoods | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>

          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">载货筐子购入款</div>
            <div class="collContentTitle3">
              {{ tableData.allBuyCarryingBasket | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">空筐购入款</div>
            <div class="collContentTitle3">
              {{ tableData.allBuyEmptyBasket | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未付货款</div>
            <div class="collContentTitle3">
              {{ tableData.allTransforNoteBuyGoods | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未付筐子款</div>
            <div class="collContentTitle3">
              {{ tableData.allTransferNoteBuyEmptyBasket | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
        </div>
        <div
          class="collContent flex_dom flex_item_mid"
          style="border-bottom: none"
        >
          <div class="collContentRadio"></div>
          <div class="collContentTitle1">销售</div>
          <div class="ml100 collContentWidth">
            <div class="collContentTitle2">商品销售款</div>
            <div class="collContentTitle3">
              {{ tableData.allSaleGoods | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>

          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">载货筐子售出款</div>
            <div class="collContentTitle3">
              {{ tableData.allSaleCarryingBasket | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">空筐售出款</div>
            <div class="collContentTitle3">
              {{ tableData.allSaleEmptyBasket | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未收货款</div>
            <div class="collContentTitle3">
              {{ tableData.allTransferNoteSaleGoods | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">历史记账未收筐子款</div>
            <div class="collContentTitle3">
              {{
                tableData.allTransferNoteSaleEmptyBasket | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
        </div>

        <div
          class="collContent flex_dom flex_item_mid"
          style="border-bottom: none"
        >
          <div class="collContentRadio"></div>
          <div class="collContentTitle1">商品利润</div>
          <div class="ml60 collContentWidth">
            <div class="collContentTitle2">商品成本</div>
            <div class="collContentTitle3">
              {{ tableData.allGoodsCost | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>

          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">商品利润</div>
            <div class="collContentTitle3">
              {{ tableData.allGoodsProfit | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency">
        <template slot="title">
          <div class="flex_dom flex_item_mid">
            <div class="collTitle">
              赊账授信
              <i
                @click.stop="handleShow"
                class="el-icon-s-operation"
                style="color: #00a499; font-size: 17px"
              ></i>
            </div>

            <div class="collTitleLeft1 ml54">
              <div>
                <span class="collTitle4 collColorR">已用授信</span
                ><span class="collTitle4 collColorR" style="margin-left: 15px"
                  >{{
                    tableData.amountCreditUsed | intervalFormat(true)
                  }}万</span
                >
              </div>
            </div>

            <div class="collTitleLeft1 ml40">
              <div>
                <span class="collTitle4 collColorB">授信逾期金额</span
                ><span class="collTitle4 collColorB" style="margin-left: 15px"
                  >{{ tableData.overdueMoney | intervalFormat(true) }}万</span
                >
              </div>
            </div>
          </div>
        </template>
        <div class="collContent flex_dom flex_item_mid">
          <div class="collContentWidth">
            <div class="collContentTitle2">赊账授信</div>
            <div class="collContentTitle3">
              {{ tableData.amountCredit | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
          </div>

          <div class="lineH"></div>

          <div class="collContentWidth">
            <div class="collContentTitle2">已用授信</div>
            <div class="collContentTitle3">
              {{ tableData.amountCreditUsed | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">剩余授信</div>
            <div class="collContentTitle3">
              {{ tableData.amountCreditSurplus | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">单笔授信</div>
            <div class="collContentTitle3">
              {{ tableData.onceCredit | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">单笔授信账期</div>
            <div class="collContentTitle3">
              {{ tableData.dateCreditSurplus
              }}<span class="collContentTitle4">天</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">3天内授信到期金额</div>
            <div class="collContentTitle3">
              {{ tableData.expireMoney | intervalFormat(true)
              }}<span class="collContentTitle4">万</span>
            </div>
          </div>
          <div class="lineH"></div>
          <div class="">
            <div class="collContentTitle2 collContentTitleColorR">
              逾期授信金额
            </div>
            <div class="collContentTitle3 collContentTitleColorR">
              {{ tableData.overdueMoney | intervalFormat(true)
              }}<span class="collContentTitle4 collContentTitleColorR">万</span
              ><span
                ><i class="el-icon-arrow-right" style="font-size: 16px"></i
              ></span>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability">
        <template slot="title">
          <div class="flex_dom flex_item_mid">
            <div class="collTitle">往来款</div>

            <div class="collTitleLeft1 ml97">
              <div>
                <span class="collTitle4 collColorR">往来款余额</span
                ><span class="collTitle4 collColorR" style="margin-left: 15px"
                  >{{
                    tableData.conmeInBalanceInfo.comeInBalance
                      | intervalFormat(true)
                  }}万</span
                >
              </div>
            </div>

            <div class="collTitleLeft1 ml40">
              <div>
                <span class="collTitle4 collColorB">经营往来款余额</span
                ><span class="collTitle4 collColorB" style="margin-left: 15px"
                  >{{
                    tableData.BussinessConmeInBalanceInfo.comeInBalance
                      | intervalFormat(true)
                  }}万</span
                >
              </div>
            </div>
          </div>
        </template>
        <div class="collContent flex_dom">
          <div class="collContentRadio" style="margin-top: 24px"></div>
          <div class="collContentTitle1" style="margin-top: 12px">收入</div>

          <div class="ml100 collContentWidth">
            <div class="collContentTitle2">总应收(销售款)</div>
            <div class="collContentTitle3">
              {{
                tableData.conmeInBalanceInfo.receivedInfo.allShouldReceive
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>

            <div class="collContentTitle2">
              剩余应收货款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.receivedInfo.allUnReceiveProduct
                    | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              剩余应收筐子款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.receivedInfo.allUnReceiveBasket
                    | intervalFormat(true)
                }}元</span
              >
            </div>
          </div>

          <div class="lineH" style="margin-top: 14px"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">总收入</div>
            <div class="collContentTitle3">
              {{
                tableData.conmeInBalanceInfo.receivedInfo.receiveAmount
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
            <div class="collContentTitle2">
              已收货款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.receivedInfo.receiveAmountProduct
                    | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              已收筐子款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.receivedInfo.receiveAmountBasket
                    | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              已收其他
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.receivedInfo.otherAmount
                    | intervalFormat(true)
                }}元</span
              >

              <el-tooltip placement="top">
                <div slot="content">
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已收预付款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.receivedInfo.otherInfo
                          .advanceAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已收借款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.receivedInfo.otherInfo
                          .borrowAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已收其他
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.receivedInfo.otherInfo
                          .otherAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已收归还预付款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.receivedInfo.otherInfo
                          .returnAdvanceAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已收归还借款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.receivedInfo.otherInfo
                          .returnBorrowAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                </div>
                <i
                  class="el-icon-info"
                  style="color: #00a499; margin-left: 5px"
                ></i>
              </el-tooltip>
            </div>
          </div>
          <div class="lineH" style="margin-top: 14px"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">经营往来款余额</div>
            <div class="collContentTitle3">
              {{
                tableData.BussinessConmeInBalanceInfo.comeInBalance
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>

            <div class="collContentTitle2">
              未收销售款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.receivedInfo
                    .allShouldReceive | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              已收货款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.receivedInfo
                    .receiveAmountProduct | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              未付采购款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.payInfo.allUnPay
                    | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              已付货款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.payInfo.payAmountProduct
                    | intervalFormat(true)
                }}元</span
              >
            </div>
          </div>
          <div class="lineH" style="margin-top: 14px"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">我转出的</div>
            <div class="collContentTitle3">
              {{
                tableData.BussinessConmeInBalanceInfo.receivedInfo.otherAmount
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
            <div class="collContentTitle2">
              预付款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.receivedInfo.otherInfo
                    .advanceAmount | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              借款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.receivedInfo.otherInfo
                    .borrowAmount | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              其他
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.receivedInfo.otherInfo
                    .otherAmount | intervalFormat(true)
                }}元</span
              >
            </div>
          </div>
        </div>

        <div class="collContent flex_dom">
          <div class="collContentRadio" style="margin-top: 24px"></div>
          <div class="collContentTitle1" style="margin-top: 12px">支出</div>

          <div class="ml100 collContentWidth">
            <div class="collContentTitle2">总应付(采购款)</div>
            <div class="collContentTitle3">
              {{
                tableData.conmeInBalanceInfo.payInfo.allShouldPay
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>

            <div class="collContentTitle2">
              剩余应付货款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.payInfo.allUnPayProduct
                    | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              剩余应付筐子款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.payInfo.allUnPayBasket
                    | intervalFormat(true)
                }}元</span
              >
            </div>
          </div>

          <div class="lineH" style="margin-top: 14px"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">总支出</div>
            <div class="collContentTitle3">
              {{
                tableData.conmeInBalanceInfo.payInfo.payAmount
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>
            <div class="collContentTitle2">
              已付货款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.payInfo.payAmountProduct
                    | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              已付筐子款
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.payInfo.payAmountBasket
                    | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              已付其他
              <span class="ml10"
                >{{
                  tableData.conmeInBalanceInfo.payInfo.otherAmount
                    | intervalFormat(true)
                }}元</span
              >
              <el-tooltip placement="top">
                <div slot="content">
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已付预付款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.payInfo.otherInfo
                          .advanceAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已付借款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.payInfo.otherInfo
                          .borrowAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已付其他
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.payInfo.otherInfo
                          .otherAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已付归还预付款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.payInfo.otherInfo
                          .returnAdvanceAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                  <div style="font-size: 14px; margin-bottom: 5px">
                    已付归还借款
                    <span style="margin-left: 16px"
                      >{{
                        tableData.conmeInBalanceInfo.payInfo.otherInfo
                          .returnBorrowAmount | intervalFormat(true)
                      }}元</span
                    >
                  </div>
                </div>
                <i
                  class="el-icon-info"
                  style="color: #00a499; margin-left: 5px"
                ></i>
              </el-tooltip>
            </div>
          </div>
          <div class="lineH" style="margin-top: 14px"></div>
          <div class="collContentWidth">
            <div class="collContentTitle2">我收到的</div>
            <div class="collContentTitle3">
              {{
                tableData.BussinessConmeInBalanceInfo.payInfo.otherAmount
                  | intervalFormat(true)
              }}<span class="collContentTitle4">元</span>
            </div>

            <div class="collContentTitle2">
              预付款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.payInfo.otherInfo
                    .advanceAmount | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              借款
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.payInfo.otherInfo
                    .borrowAmount | intervalFormat(true)
                }}元</span
              >
            </div>
            <div class="collContentTitle2">
              其他
              <span class="ml10"
                >{{
                  tableData.BussinessConmeInBalanceInfo.payInfo.otherInfo
                    .otherAmount | intervalFormat(true)
                }}元</span
              >
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <creditLine ref="creditLine"></creditLine>
  </el-scrollbar>
</template>

<script>
import creditLine from "../dialogmod/creditLine.vue";
import { custmorinfo } from "@/request/api/customerManage/customer";
export default {
  name: "businessTransaction",
  components: {
    creditLine,
  },
  props: {
    toUserId: {
      type: String,
    },
    currentView: {
      type: String,
    },
  },
  data() {
    return {
      activeName: "1",
      tableData: {
        conmeInBalanceInfo: {
          comeInBalance: 0,
          receivedInfo: {
            allShouldReceive: 0,
            allUnReceiveProduct: 0,
            allUnReceiveBasket: 0,
            receiveAmount: 0,
            receiveAmountProduct: 0,
            receiveAmountBasket: 0,
            otherAmount: 0,
            otherInfo: {
              advanceAmount: 0,
              borrowAmount: 0,
              otherAmount: 0,
              returnAdvanceAmount: 0,
              returnBorrowAmount: 0,
            },
          },
          payInfo: {
            allShouldPay: 0,
            allUnPayProduct: 0,
            allUnPayBasket: 0,
            payAmount: 0,
            payAmountProduct: 0,
            payAmountBasket: 0,
            otherAmount: 0,
            otherInfo: {
              advanceAmount: 0,
              borrowAmount: 0,
              otherAmount: 0,
              returnAdvanceAmount: 0,
              returnBorrowAmount: 0,
            },
          },
        },
        BussinessConmeInBalanceInfo: {
          comeInBalance: 0,
          receivedInfo: {
            allShouldReceive: 0,
            receiveAmountProduct: 0,
            otherAmount: 0,
            otherInfo: {
              advanceAmount: 0,
              borrowAmount: 0,
              otherAmount: 0,
            },
          },
          payInfo: {
            allUnPay: 0,
            payAmountProduct: 0,
            otherInfo: {
              advanceAmount: 0,
              borrowAmount: 0,
              otherAmount: 0,
            },
          },
        },
      },
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  methods: {
    getList(arg) {
      custmorinfo({
        custmorUserId: this.toUserId,
      }).then((res) => {
        if (res.status == 200) {
          this.$nextTick(function () {
            this.tableData = res.data[0];

            // console.log(this.tableData);
          });
        }
      });
    },
    handleShow() {
      this.$refs.creditLine.edit({ custmorId: this.toUserId });
      this.$refs.creditLine.title = "赊账授信";
      this.$refs.creditLine.disableSubmit = false;
      this.$refs.creditLine.isVisiable = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.businessTransactionModel {
  .collTitle {
    font-size: 20px;
    color: rgba(1, 6, 33, 0.9);
  }

  .ml100 {
    margin-left: 100px;
  }

  .ml97 {
    margin-left: 97px;
  }

  .ml76 {
    margin-left: 76px;
  }

  .ml64 {
    margin-left: 64px;
  }

  .ml60 {
    margin-left: 60px;
  }
  .ml54 {
    margin-left: 54px;
  }
  .ml40 {
    margin-left: 40px;
  }

  .ml15 {
    margin-left: 15px;
  }

  .ml10 {
    margin-left: 10px;
  }

  .collTitleLeft {
    min-width: 145px;
    // margin-left: 76px;
    .collTitle1 {
      font-size: 16px;
      color: rgba(1, 6, 33, 0.55);
    }

    .collTitle2 {
      font-size: 24px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collTitle3 {
      font-size: 16px;
      color: rgba(1, 6, 33, 0.9);
    }
  }

  .collTitleLeft1 {
    min-width: 145px;
    .collTitle4 {
      font-size: 13px;
    }

    .collColorR {
      color: rgba(221, 76, 77, 1);
    }

    .collColorB {
      color: rgba(26, 127, 217, 1);
    }
  }

  ::v-deep .el-collapse-item__header {
    background: rgba(0, 0, 0, 0.04) !important;
    border: 1px solid rgba(0, 0, 0, 0.04);
    height: 80px;
    line-height: 30px;
    padding: 5px 0px 5px 24px;
  }

  ::v-deep .el-collapse-item {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0px;
    }
  }

  ::v-deep .el-collapse {
    padding-right: 5px;
    border: none;
  }

  ::v-deep .el-collapse-item__wrap {
    // border: none;
    border-left: 1px solid rgba(0, 0, 0, 0.04);
    border-right: 1px solid rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  ::v-deep .el-collapse-item__content {
    padding-bottom: 0px;
  }

  .collContent {
    padding: 15px 24px 15px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);

    .collContentWidth {
      min-width: 150px;
    }

    .collContentRadio {
      width: 8px;
      height: 8px;
      background: rgba(0, 164, 153, 1);
      border-radius: 50%;
    }

    .collContentTitle1 {
      margin-left: 8px;
      font-size: 20px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collContentTitle2 {
      font-size: 14px;
      color: rgba(1, 6, 33, 0.55);
    }

    .collContentTitle3 {
      font-size: 24px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collContentTitle4 {
      font-size: 16px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collContentTitleColorR {
      color: rgba(221, 76, 77, 1);
    }
  }

  .lineH {
    width: 1px;
    height: 32px;
    border-right: 1px solid rgba(1, 6, 33, 0.35);
    overflow: hidden;
    box-shadow: none;
    margin: 0px 20px;
  }
}
</style>