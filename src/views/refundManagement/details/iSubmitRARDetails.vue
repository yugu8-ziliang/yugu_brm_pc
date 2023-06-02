<template>
  <Page class="page_style">
    <div style="margin-bottom:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">订单信息</font></div>
      <div class="title_layout" style="text-align:right;font-size: 14px;"><font style="color: rgba(1,6,33,0.55);">操作人:</font>{{ pageData.addByUserName }}</div>
    </div>
    <el-descriptions :column="3">
      <el-descriptions-item v-for="(item,index) in showOrderMsg.msg" :key="'ordermsg'+index" :label='getJinELabel(item)'>
        <font :style="getListFontColor(item)" v-if="item.label != '合计确认金额'">{{ item.value }}</font>
        <font :style="getListFontColor(item)" v-if="item.label == '合计确认金额' && pageData.actualRefund == 0 && pageData.confirmedAmount == 0">{{ item.value }}</font>
        <el-tooltip class="item" effect="dark" placement="bottom"  v-if="item.label == '合计确认金额' && pageData.actualRefund > 0 && pageData.confirmedAmount > 0">
          <el-link :underline="false" :style="'text-decoration:underline;'+getListFontColor(item)">{{ item.value }}</el-link>
          <div slot="content">
            <p style="font-size:14px;">实际收款:{{ currencyFormat(pageData.actualRefund) }}</p>
            <p style="font-size:12px;">线上支付:{{ currencyFormat(pageData.sellerCash) }}</p>
            <p style="font-size:12px;">线下支付（支付宝）:{{ currencyFormat(pageData.payInfo.aliPay) }}</p>
            <p style="font-size:12px;">线下支付（微信）:{{ currencyFormat(pageData.payInfo.weChat) }}</p>
            <p style="font-size:14px;">确认金额:{{ currencyFormat(pageData.confirmedAmount) }}</p>
            <p style="font-size:12px;">经营往来款抵充:{{ currencyFormat(pageData.offset) }}</p>
            <p style="font-size:12px;">预付款抵扣:{{ currencyFormat(pageData.advancePrice) }}</p>
            <p style="font-size:12px;">借款抵扣:{{ currencyFormat(pageData.loan) }}</p>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" placement="bottom"  v-if="item.label == '合计确认金额' && pageData.actualRefund > 0 && pageData.confirmedAmount == 0">
          <el-link :underline="false" :style="'text-decoration:underline;'+getListFontColor(item)">{{ item.value }}</el-link>
          <div slot="content">
            <p style="font-size:14px;">实际收款:{{ currencyFormat(pageData.actualRefund) }}</p>
            <p style="font-size:12px;">线上支付:{{ currencyFormat(pageData.sellerCash) }}</p>
            <p style="font-size:12px;">线下支付（支付宝）:{{ currencyFormat(pageData.payInfo.aliPay) }}</p>
            <p style="font-size:12px;">线下支付（微信）:{{ currencyFormat(pageData.payInfo.weChat) }}</p>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" placement="bottom"  v-if="item.label == '合计确认金额' && pageData.actualRefund == 0 && pageData.confirmedAmount > 0">
          <el-link :underline="false" :style="'text-decoration:underline;'+getListFontColor(item)">{{ item.value }}</el-link>
          <div slot="content">
            <p style="font-size:14px;">确认金额:{{ currencyFormat(pageData.confirmedAmount) }}</p>
            <p style="font-size:12px;">经营往来款抵充:{{ currencyFormat(pageData.offset) }}</p>
            <p style="font-size:12px;">预付款抵扣:{{ currencyFormat(pageData.advancePrice) }}</p>
            <p style="font-size:12px;">借款抵扣:{{ currencyFormat(pageData.loan) }}</p>
          </div>
        </el-tooltip>
      </el-descriptions-item>
    </el-descriptions>
    <div class="aboutOrder">
      <el-row>
        <el-col :span="8">关联采购单:<el-button type="text" style="color:#0BA198;">{{pageData.orderSellNo}}<i class="el-icon-arrow-right"></i></el-button></el-col>
        <el-col :span="8">采购时间:<span>{{ toDate(pageData.orderSellTime) }}</span></el-col>
      </el-row>
    </div>
    <div class="button_layout">
      <div style="width:50%;padding-left:20px;"><el-button type="text" v-if="showOrderMsg.isShowCR"   @click="collectionRecord()">收款记录</el-button></div>
      <div style="width:50%;text-align:right;">
        <el-button size="mini">打印</el-button>
        <el-button size="mini" v-for="(item,index) in showOrderMsg.button" :key="'button'+index" :type="item.type" @click="functionBtn(item.label)">{{ item.label }}</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div style="margin-bottom:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">客户信息</font></div>
    </div>
    <el-descriptions :column="3">
      <el-descriptions-item label="客户姓名">
        {{ pageData.customerName }}
        <el-tag type="info" v-if="pageData.userClass == ''">非</el-tag>
        <el-tag v-if="pageData.userClass == 3 ">供</el-tag>
        <el-tag type="danger" v-if="pageData.userClass == 1">经</el-tag>
        <el-tag type="warning" v-if="pageData.userClass == 2">采</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ pageData.customerPhone }}</el-descriptions-item>
      <el-descriptions-item label="企业名称" v-if="pageData.userClassType == 1">{{ pageData.usercompanyname }}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>
    <div style="margin-bottom:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">商品信息</font></div>
    </div>
    <div v-for="(item,index) in pageData.orderDetails" :key="'goods' + index" style="border-bottom:1px solid #E6E6E6;">
      <div class="goods_styls">
        <div class="xiangqing_layout">
          <div>{{ item.firstCategory +'-'+ item.secondCategory +'-'+ item.productName }}</div>
          <div style="text-align:right;padding-right:20px;"><el-button type="text" @click="goodsdetails(item)">详情</el-button></div>
        </div>
        <el-descriptions :column="5" style="margin-top:15px;">
          <el-descriptions-item label="品种/品牌">{{ item.variety }}</el-descriptions-item>
          <el-descriptions-item label="产地">{{ item.region }}</el-descriptions-item>
          <el-descriptions-item label="级别/规格">{{ item.spec }}</el-descriptions-item>
          <el-descriptions-item label="计算单位">{{ item.subUnit }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="5" style="margin-top:5px;">
          <el-descriptions-item label="退货数量"> 
            <span v-html="getStock(item.subUnit,item.subUnit2,item.subUnit3,item.pieceUnit,item.subUnit2Weight,item.subUnit3Weight,
                                    item.productCount,item.returnBasketCount,item.piecenumber)"></span>
          </el-descriptions-item>
          <el-descriptions-item label="退货单价">{{ item.productPrice + '元/' + item.subUnit }}</el-descriptions-item>
          <el-descriptions-item label="商品金额"><font style="color:red;">{{ item.productTotalPrice+'元' }}</font></el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="5" style="margin-top:5px;" v-if="item.returnBasketCount > 0">
          <el-descriptions-item label="筐子种类">{{ item.basketTypeCount +'种'}}</el-descriptions-item>
          <el-descriptions-item label="退回筐子">{{ item.returnBasketCount +'个'}}</el-descriptions-item>
          <el-descriptions-item label="筐子金额"><font style="color:red;">{{ item.returnBasketPrice+'元' }}</font></el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="text-align:right;padding:15px 15px;">
        金额小计:<font style="color:red;">{{ item.detailTotalPrice +'元'}}</font>
      </div>
    </div>
    <div style="margin-top:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">合计</font></div>
    </div>
    <div style="padding:15px;border-bottom:1px dashed #e6e6e6;">
      <el-descriptions :column="5" style="margin-top:5px;">
        <el-descriptions-item label="商品种类">{{ Number(pageData.productTotalCount) +'种'}}</el-descriptions-item>
        <el-descriptions-item label="商品金额"><font style="color:red;">{{ pageData.productTotalPrice+'元' }}</font></el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="5" style="margin-top:5px;" v-if="pageData.basketTotalCount > 0">
        <el-descriptions-item label="退回筐子">{{ pageData.basketTotalCount +'个'}}</el-descriptions-item>
        <el-descriptions-item label="筐子金额"><font style="color:red;">{{ pageData.basketTotalPrice+'元' }}</font></el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="text-align:right;padding:15px 15px;">
      金额合计：<font style="color:red;">{{ currencyFormat((Number(pageData.productTotalPrice) + Number(pageData.basketTotalPrice))) +'元'}}</font>
    </div>
    <div style="margin-top:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">运输信息</font></div>
    </div>
    <el-descriptions :column="5" style="margin-top:20px;">
      <el-descriptions-item label="车牌号">{{ pageData.transferArea + pageData.transferNumber }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="5" style="margin-top:5px;">
      <el-descriptions-item label="车辆照片">
        <el-image 
          style="width: 100px; height: 100px;margin-right:10px;"
          v-for="(item,index) in pageData.transferImageUrls" 
          :key="'img'+index" 
          :src="item" 
          :preview-src-list="pageData.transferImageUrls">
        </el-image>
      </el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>
    <div style="margin-top:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">备注</font></div>
    </div>
    <div v-for="(item,index) in pageData.remark" :key="'remark'+index" style="font-size:14px;margin-top:10px;">
      <div>{{ toDate(item.createtime) }}</div>
      <!-- <div v-for="(item2,index) in item.remark" :key="'remark2'+index">{{ item2 }}</div> -->
      <div>{{ item.displayName + item.remark[0] }}</div>
    </div>
    <div style="height:100px;"></div>
    <el-dialog
      title="商品详情"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose">
      <div style="height:600px;overflow-y: auto;">
        <p style="font-size:16px;">{{ dialogBasketMsg.firstCategory +'-'+ dialogBasketMsg.secondCategory +'-'+ dialogBasketMsg.productName }}</p>
        <el-descriptions :column="5" style="margin-top:15px;">
          <el-descriptions-item label="品种/品牌">{{ dialogBasketMsg.variety }}</el-descriptions-item>
          <el-descriptions-item label="产地">{{ dialogBasketMsg.region }}</el-descriptions-item>
          <el-descriptions-item label="级别/规格">{{ dialogBasketMsg.spec }}</el-descriptions-item>
          <el-descriptions-item label="计算单位">{{ dialogBasketMsg.subUnit }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="5" style="margin-top:5px;" v-if="dialogBasketMsg.isRemovePeel == 1">
          <el-descriptions-item label="商品毛重">
            <span v-html="getStock(dialogBasketMsg.subUnit,dialogBasketMsg.subUnit2,dialogBasketMsg.subUnit3,dialogBasketMsg.pieceUnit,dialogBasketMsg.subUnit2Weight,
                                  dialogBasketMsg.subUnit3Weight,
                                  dialogBasketMsg.productCount,dialogBasketMsg.returnBasketCount,dialogBasketMsg.piecenumber)"></span>
          </el-descriptions-item>
          <el-descriptions-item label="筐子重量">{{ dialogBasketMsg.basketWeight + '斤'}}</el-descriptions-item>
          <el-descriptions-item label="商品净重">{{ dialogBasketMsg.productReallyWeight + '斤' }}</el-descriptions-item>
          <el-descriptions-item label="退货单价">{{ dialogBasketMsg.productPrice + '元/斤' }}</el-descriptions-item>
          <el-descriptions-item label="商品金额"><font style="color:red;">{{ dialogBasketMsg.productTotalPrice +'元'}}</font></el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="5" style="margin-top:5px;" :colon='false' v-if="dialogBasketMsg.isRemovePeel == 0">
          <el-descriptions-item label="商品数量:">
            <span v-html="getStock(dialogBasketMsg.subUnit,dialogBasketMsg.subUnit2,dialogBasketMsg.subUnit3,dialogBasketMsg.pieceUnit,dialogBasketMsg.subUnit2Weight,
                                  dialogBasketMsg.subUnit3Weight,
                                  dialogBasketMsg.productCount,dialogBasketMsg.returnBasketCount,dialogBasketMsg.piecenumber)"></span>
          </el-descriptions-item>
          <el-descriptions-item label="退货单价:">{{ dialogBasketMsg.productPrice + '元/斤'}}</el-descriptions-item>
          <el-descriptions-item label=""></el-descriptions-item>
          <el-descriptions-item label=""></el-descriptions-item>
          <el-descriptions-item label="商品金额:"><font style="color:red;">{{ dialogBasketMsg.productTotalPrice +'元'}}</font></el-descriptions-item>
        </el-descriptions>
        <el-divider></el-divider>
        <div v-if="isShowTable.table_area_1">
          <!-- ##########################################################################################################################  载货筐 -->
          <el-table :data="basketResults.carry_basket" style="margin-bottom: 10px; border: 1px solid #e9e9e9" v-if="isShowTable.carry">
            <el-table-column width="170" label="载货筐子" :formatter='frommartter' prop="userbasketname" :render-header="renderHeader"></el-table-column>
            <el-table-column  label="颜色" prop="userbasketcolor"></el-table-column>
            <el-table-column  label="载货量" prop="basketcargo">
              <template slot-scope="scope">
                {{ Number(scope.row.basketcargo) + '斤/' }}<font style="color:#DF971A;">筐</font>
              </template>
            </el-table-column>
            <el-table-column  label="筐子过磅" prop="outreturnbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子重量" prop="basketweight" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子总重" prop="all_basket_weigh" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel != 1" label="腾空筐子" prop="basketvacatecount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="退回筐子" prop="userbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="单价" prop="userbasketprice" :formatter='frommartter'></el-table-column>
            <el-table-column  label="筐子金额" prop="userbaskettotalprice" :formatter='frommartter'></el-table-column>
          </el-table>
          <!-- ##########################################################################################################################  过磅筐 -->
          <el-table :data="basketResults.weigh_basket" style="margin-bottom: 10px; border: 1px solid #e9e9e9" v-if="isShowTable.weigh">
            <el-table-column width="170" label="过磅筐子" :formatter='frommartter' prop="userbasketname" :render-header="renderHeader"></el-table-column>
            <el-table-column  label="颜色" prop="userbasketcolor"></el-table-column>
            <el-table-column  label="载货量" prop="basketcargo">
              <template slot-scope="scope">
                {{ Number(scope.row.basketcargo) + '斤/' }}<font style="color:#DF971A;">筐</font>
              </template>
            </el-table-column>
            <el-table-column  label="筐子过磅" prop="outreturnbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子重量" prop="basketweight" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子总重" prop="all_basket_weigh" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel != 1" label="留库筐子" prop="basketvacatecount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="退回筐子" prop="userbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="单价" prop="userbasketprice" :formatter='frommartter'></el-table-column>
            <el-table-column  label="筐子金额" prop="userbaskettotalprice" :formatter='frommartter'></el-table-column>
          </el-table>
          <!-- ##########################################################################################################################  自家筐 -->
          <el-table :data="basketResults.self_basket" style="margin-bottom: 10px; border: 1px solid #e9e9e9" v-if="isShowTable.self">
            <el-table-column width="170" label="自家筐子" :formatter='frommartter' prop="userbasketname" :render-header="renderHeader"></el-table-column>
            <el-table-column  label="颜色" prop="userbasketcolor"></el-table-column>
            <el-table-column  label="载货量" prop="basketcargo">
              <template slot-scope="scope">
                {{ Number(scope.row.basketcargo) + '斤/' }}<font style="color:#DF971A;">筐</font>
              </template>
            </el-table-column>
            <el-table-column  label="筐子过磅" prop="outreturnbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子重量" prop="basketweight" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子总重" prop="all_basket_weigh" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel != 1" label="留库筐子" prop="basketvacatecount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="退回筐子" prop="userbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="单价" prop="userbasketprice" :formatter='frommartter'></el-table-column>
            <el-table-column  label="筐子金额" prop="userbaskettotalprice" :formatter='frommartter'></el-table-column>
          </el-table>
          <!-- ##########################################################################################################################  计件筐 -->
          <el-table :data="basketResults.piece_basket" style="margin-bottom: 10px; border: 1px solid #e9e9e9" v-if="isShowTable.piece">
            <el-table-column width="170" label="计件筐子" :formatter='frommartter' prop="userbasketname" :render-header="renderHeader"></el-table-column>
            <el-table-column  label="颜色" prop="userbasketcolor"></el-table-column>
            <el-table-column  label="载货量" prop="basketcargo">
              <template slot-scope="scope">
                {{ Number(scope.row.basketcargo) + '斤/' }}<font style="color:#DF971A;">筐</font>
              </template>
            </el-table-column>
            <el-table-column  label="筐子过磅" prop="outreturnbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子重量" prop="basketweight" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel == 0" label="筐子总重" prop="all_basket_weigh" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.isRemovePeel != 1" label="留库筐子" prop="basketvacatecount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="退回筐子" prop="userbasketcount" :formatter='frommartter'></el-table-column>
            <el-table-column  label="单价" prop="userbasketprice" :formatter='frommartter'></el-table-column>
            <el-table-column  label="筐子金额" prop="userbaskettotalprice" :formatter='frommartter'></el-table-column>
          </el-table>
          <div class="total_style" style="margin-bottom:15px;">
            <div class="total_styl_layout" style="font-weight: 900;color: rgba(1,6,33,0.9);">小计：</div>
            <div class="total_styl_layout" style="float:right;">筐子金额:{{dialogBasketMsg.returnBasketPrice+'元'}}</div>
            <div class="total_styl_layout" style="float:right;" v-if="dialogBasketMsg.isRemovePeel != 1">留库筐子:{{dialogBasketMsg.basketLeaveCount+'个'}}</div>
            <div class="total_styl_layout" style="float:right;">腾空筐子:{{dialogBasketMsg.basketVacateCount+'个'}}</div>
            <div class="total_styl_layout" style="float:right;">退回筐子:{{dialogBasketMsg.returnBasketCount+'个'}}</div>
            <div class="total_styl_layout" style="float:right;" v-if="dialogBasketMsg.isRemovePeel == 0">筐子总重:{{dialogBasketMsg.basketWeight+'斤'}}</div>
            <div class="total_styl_layout" style="float:right;">筐子过磅:{{dialogBasketMsg.outreturnbasketcount+'个'}}</div>
          </div>
        </div>
        <div v-if="isShowTable.table_area_2">
          <!-- ##########################################################################################################################  卖家筐 -->
          <el-table :data="basketResults.sell_basket" style="margin-bottom: 10px; border: 1px solid #e9e9e9" v-if="isShowTable.sell">
            <el-table-column width="170" label="自家筐子" :formatter='frommartter' prop="userbasketname" :render-header="renderHeader2"></el-table-column>
            <el-table-column  label="颜色" prop="userbasketcolor"></el-table-column>
            <el-table-column  label="载货量" prop="basketcargo" v-if="dialogBasketMsg.subUnit == '斤'">
              <template slot-scope="scope">
                {{ Number(scope.row.basketcargo) + '斤/' }}<font style="color:#DF971A;">筐</font>
              </template>
            </el-table-column>
            <el-table-column  label="载货量" prop="basketcargo" v-if="dialogBasketMsg.subUnit != '斤'">
              <template slot-scope="scope">
                {{ Number(scope.row.basketcargo) + dialogBasketMsg.subUnit }}
              </template>
            </el-table-column>
            <el-table-column v-if="dialogBasketMsg.subUnit == '斤'" label="筐子重量" prop="basketweight" :formatter='frommartter'></el-table-column>
            <el-table-column v-if="dialogBasketMsg.subUnit == '斤'" label="筐子总重" prop="all_basket_weigh" :formatter='frommartter'></el-table-column>
            <el-table-column  label="使用数量" prop="userbasketcount" :formatter='frommartter'></el-table-column>
          </el-table>
          <div class="total_style">
            <div class="total_styl_layout" style="font-weight: 900;color: rgba(1,6,33,0.9);">小计：</div>
            <div class="total_styl_layout" style="float:right;">使用卖家筐子:{{dialogBasketMsg.sellBasketCount+'个'}}</div>
            <!-- <div class="total_styl_layout" style="float:right;" v-if="dialogBasketMsg.subUnit == '斤'">筐子总重:{{dialogBasketMsg.basketWeight+'斤'}}</div> -->
          </div>
        </div>
        <el-divider></el-divider>
        <div>
          <div class="total_styl_layout" style="font-weight: 900;color: rgba(1,6,33,0.9);">
            共退回筐子{{ dialogBasketMsg.returnBasketCount }}个,使用卖家筐子{{ dialogBasketMsg.sellBasketCount }}个
          </div>
          <div class="total_styl_layout" style="float:right;">筐子金额:<font style="color:red;">{{dialogBasketMsg.returnBasketPrice+'元'}}</font></div>
          <div class="total_styl_layout" style="float:right;" v-if="dialogBasketMsg.isRemovePeel == 0">筐子重量:{{dialogBasketMsg.basketWeight+'斤'}}</div>
        </div>
        <el-divider></el-divider>
        <div>
          <div style="text-align:right;font-size:16px;font-weight: 900;color:#010621;">
            金额总计：<font style="color:red;">{{  dialogBasketMsg.detailTotalPrice +'元'}}</font></div>
          <div style="text-align:right;font-size:14px;color: rgba(1,6,33,0.75);">包含商品金额：{{  dialogBasketMsg.productTotalPrice +'元'}}</div>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      title="退回订单"
      :visible.sync="dialogTh"
      width="30%"
      :before-close="ThhandleClose">
    </el-dialog>
    <el-dialog
      title="退回修改"
      :visible.sync="dialogThChange"
      width="30%"
      :before-close="ThChangehandleClose">
    </el-dialog>
  </Page>
</template>
<script>
import moment  from 'moment';
import { getInfo } from '@/request/api/refundsGoods/index'
export default {
  data() {
    return{
      isShowTable:{
        carry:false,
        weigh:false,
        piece:false,
        self:false,
        sell:false,
        return:false,
        empty:false,
        table_area_1:false,
        table_area_2:false
      },
      dialogTh:false,
      dialogThChange:false,
      dialogVisible:false,
      dialogBasketMsg:{},
      basketResults:{},//筐子新信息集合
      pageData:{},
      showOrderMsg:{
        msg:[],
        button:[],
        isShowCR:false
      },
    }
  },
  methods:{
    collectionRecord() {
      this.$router.push({
        path: "refundsGoodCollectionRecord",
        query: { id: this.$route.query.id,ordertype:this.pageData.userClass.toString()==''?"2":"1" },
      });
    },
    functionBtn(val){
      if(val == '取消订单'){
        this.cancelOrder();
      }else if(val == '修改订单'){
        this.changeOrder();
      }else if(val == '撤回修改'){
        this.callBackChange();
      }else if(val == '撤回取消'){
        this.callBackCancel();
      }else if(val == '提醒对方付款'){
        this.remind();
      }else if(val == '退回订单'){
        this.dialogTh = true;
      }else if(val == '退回修改'){
        this.dialogThChange = true
      }else if(val == '确认收款'){
        this.confirmCollection();
      }
    },
    confirmCollection(){//确认收款
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的邮箱是: ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
    remind(){//提醒收款
      this.$alert('提醒成功', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `提醒成功！`
          });
        }
      });
    },
    callBackCancel(){//撤回取消
      this.$confirm('确认撤回取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    callBackChange(){//撤回修改
      this.$confirm('确认撤回修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    changeOrder(){//修改订单按钮功能
      this.$confirm('确认修改订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    cancelOrder(){//取消订单按钮功能
      this.$confirm('确认取消订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
    isShowArea(){
      if(this.isShowTable.carry == false && this.isShowTable.weigh == false && this.isShowTable.piece == false && this.isShowTable.self == false){
        this.isShowTable.table_area_1 = false;
      }else{
        this.isShowTable.table_area_1 = true;
      }
      if(this.isShowTable.sell == false){
        this.isShowTable.table_area_2 = false
      }else{
        this.isShowTable.table_area_2 = true
      }
    },
    showBasketTbale(){
      this.isShowTable.carry = this.basketResults.carry_basket.length > 0 ? true : false;
      this.isShowTable.weigh = this.basketResults.weigh_basket.length > 0 ? true : false;
      this.isShowTable.piece = this.basketResults.piece_basket.length > 0 ? true : false;
      this.isShowTable.self = this.basketResults.self_basket.length > 0 ? true : false;
      this.isShowTable.sell = this.basketResults.sell_basket.length > 0 ? true : false;
      this.isShowArea();
    },
    renderHeader2(){
      return (
        <div style="color:#0BA198;">
          卖家筐子
          </div>
      );
    },
    renderHeader(h,val){
      // console.log(val)
      let res = val.column.label
      if(this.dialogBasketMsg.isRemovePeel == 0){
        return (
          <div style="color:#0BA198;">
            {res}
            <el-button
              round
              size="mini"
              style="color:#0BA198;border:#0BA198 1px solid;padding: 3px 8px;margin-left:10px;"
            >
              不去皮
            </el-button>
          </div>
        );
      }else if(this.dialogBasketMsg.isRemovePeel == 1){
        return (
          <div style="color:#0BA198;">
          {res}
            <el-button
              round
              size="mini"
              style="color:#0BA198;border:#0BA198 1px solid;padding: 3px 8px;margin-left:10px;"
            >
              不去皮
            </el-button>
          </div>
        );
      }else{
        return (
          <div style="color:#0BA198;">
          {res}
          </div>
        );
      }
    },
    frommartter(row, column, cellValue, index){
      if(column.property == 'userbasketname'){//筐子名
        return '['+ row.name +']'+row.userbasketname
      }else if(column.property == 'outreturnbasketcount'){//筐子过磅
        return row.outreturnbasketcount+ '个'
      }else if(column.property == 'basketweight'){//筐子重量
        return Number(row.basketweight)+'斤/个'
      }else if(column.property == 'all_basket_weigh'){//筐子总重
        return row.all_basket_weigh+'斤'
      }else if(column.property == 'basketvacatecount'){//腾空筐子
        return row.basketvacatecount+'个'
      }else if(column.property == 'userbasketcount'){//退回筐子
        return row.userbasketcount+'个'
      }else if(column.property == 'userbasketprice'){//单价
        return this.currencyFormat(row.userbasketprice)+'元/个'
      }else if(column.property == 'userbaskettotalprice'){//筐子金额
        return this.currencyFormat(row.userbaskettotalprice)+'元'
      }
    },
    handleClose(){
      this.dialogVisible = false
    },
    ThhandleClose(){
      this.dialogTh = false
    },
    ThChangehandleClose(){
      this.dialogThChange = false
    },
    goodsdetails(item){
      if(item.product_baskets.have_basket == 1){
        this.dialogVisible = true
        this.dialogBasketMsg = item
        this.basketResults = this.dialogBasketMsg.product_baskets //避免层级太深 el-table 数据源报错
        // console.log(this.basketResults)
        this.showBasketTbale();
      }else{
        this.$error('无筐子信息!')
      }
    },
    getJinELabel(item){
      if(item.label != '合计确认金额'){
        return item.label
      }else{
        if(this.pageData.actualRefund > 0 && this.pageData.confirmedAmount > 0){
          return '合计确认金额'
        }else if(this.pageData.actualRefund > 0 && this.pageData.confirmedAmount == 0){
          return '实际收款'
        }else if(this.pageData.actualRefund == 0 && this.pageData.confirmedAmount > 0){
          return '确认金额'
        }else{
          return '实际收款'
        }
      }
    },
    statusIs7(){//已结清 #非平台
      let res = [{
        label:'退货退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'已结清'
      },{
        label:'退货时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      }];
      let button = [];
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = true;
    },
    statusIs6(){//未成交//未结清 # 非平台
    // this.pageData.statusName = '未结清'
      let res = []
      let button = []
      if(this.pageData.statusName == '未成交'){
        res = [{
          label:'退货退款单编号',
          value:this.pageData.orderReturnNo
        },{
          label:'订单状态',
          value:'未成交'
        },{
          label:'退货时间',
          value:this.toDate(this.pageData.timestamp)
        },{
          label:'退款金额',
          value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
        }]; 
        button = [{
          label:'取消退货单',
          type:''
        },{
          label:'修改退货单',
          type:''
        },{
          label:'添加收款',
          type:'primary'
        }]
        this.showOrderMsg.isShowCR = false;
      }else{
        res = [{
          label:'退货退款单编号',
          value:this.pageData.orderReturnNo
        },{
          label:'订单状态',
          value:'未结清'
        },{
          label:'退货时间',
          value:this.toDate(this.pageData.timestamp)
        },{
          label:'退款金额',
          value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
        },{
          label:'已收金额',
          value:this.currencyFormat(this.pageData.actualPayPrice)+'元'
        },{
          label:'剩余未收',
          value:this.currencyFormat(this.pageData.orderTotalPrice - this.pageData.actualPayPrice)+'元'
        }];
        button = [{
          label:'添加收款',
          type:'primary'
        }]
        this.showOrderMsg.isShowCR = true;
      }
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
    },
    statusIs5(){//已结清 # 平台
      let res = [{
        label:'退货退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'已结清'
      },{
        label:'退货时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      }];
      //判断是否批量
      let button = []
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = true;
    },
    statusIs4(){//未结清 # 平台
      let res = [{
        label:'退货退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'未结清'
      },{
        label:'退货时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },{
        label:'已收金额',
        value:this.currencyFormat(this.pageData.actualPayPrice)+'元'
      },{
        label:'剩余未收',
        value:this.currencyFormat(this.pageData.orderTotalPrice - this.pageData.actualPayPrice)+'元'
      }];
      //判断是否批量
      let button = [{
        label:'提醒卖家退款',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = true;
    },
    statusIs3(){//待收款 # 平台
      let res = [{
        label:'退货退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'待收款'
      },{
        label:'退货时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },{
        label:'已收金额',
        value:this.currencyFormat(this.pageData.actualPayPrice)+'元'
      },{
        label:'剩余未收',
        value:this.currencyFormat(this.pageData.orderTotalPrice - this.pageData.actualPayPrice)+'元'
      },{
        label:'本次付款时间',
        value:this.toDate(this.pageData.useTimes)
      },{
        label:'合计确认金额',
        value:this.currencyFormat(this.pageData.totalPrice)+'元'
      },];
      //判断是否批量
      let button = []
      if(this.pageData.isBatchPay == 1){
        button = [{
          label:'处理批量收款单',
          type:'primary'
        }]
      }else{
        button = [{
          label:'退回修改',
          type:''
        },{
          label:'确认收款',
          type:'primary'
        }]
      }
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = true;
    },
    statusIs2(){//待修改 # 平台
      let res = [{
        label:'退货退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'待修改'
      },{
        label:'退货时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },];
      let button = [{
        label:'取消订单',
        type:''
      },{
        label:'修改订单',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = false;
    },
    statusIs1(){//待对方付款 # 平台
      let res = [{
        label:'退货退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'待对方付款'
      },{
        label:'退货时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },];
      let button = [{
        label:'撤回取消',
        type:''
      },{
        label:'撤回修改',
        type:''
      },{
        label:'提醒对方付款',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = false;
    },
    getListFontColor(item){
      if(item.label != '订单状态'){
        return 'color:#010621;'
      }else{
        if(item.value == '已结清'){
          return 'color:#0BA198;'
        }else{
          return 'color:#DF971A;'
        }
      }
    },
    getOrderMsg(){
      // console.log(this.pageData.orderType)
      // this.pageData.isBatchPay = 1
      // this.pageData.orderType = 1
      let type = this.pageData.status;
      if(this.pageData.orderType == 1){
        if(type == 1){
          this.statusIs1()
        }else if(type == 2){
          this.statusIs2()
        }else if(type == 3){
          this.statusIs3()
        }else if(type == 4){
          this.statusIs4()
        }else if(type == 5){
          this.statusIs5()
        }
      }else{
        if(type == 4){
          this.statusIs6()
        }else{
          this.statusIs7()
        }
      }
    },
    getInfo(){
      let orderid = this.$route.query.id
      let res = {
        orderReturnId:orderid,
        is_receive:0
      }
      getInfo(res).then(resp=>{
        this.pageData = resp.data[0]
        // console.log(this.pageData)
        this.getOrderMsg()
      })
    },
    toDate(val){//时间戳格式化
      return moment(val*1000).format('YYYY-MM-DD HH:mm:ss');
    },
    currencyFormat(num){//科学记数 保留两位小数
      let a = Number(num).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
      return a 
    },
    getStock(subunit,subunit2,subunit3,pieceunit,subunit2weight,subunit3weight,stock,basket,piececount){
      let first = stock+subunit;
      let next2 = subunit2 == '' ? '' : subunit2weight+subunit2+'/'+subunit
      let next3 = subunit3 == '' ? '' : subunit3weight+subunit3+'*'
      let next4 = pieceunit == '' ? '' : '('+piececount+pieceunit+')'
      let last = basket == 0 ? '' : '|'+basket+'<font style="color:#DF971A;">筐</font>' 
      let kuohao1 = subunit2 == '' ? '' : '('
      let kuohao2 = subunit2 == '' ? '' : ')'
      return first+kuohao1+next3+next2+kuohao2+next4+last
    },
  },
  created(){
    this.getInfo()
  }
}
</script>
<style lang="scss" scoped >
.total_styl_layout{
  display: inline-block;
  margin-right: 30px;
}
.total_style{
  padding: 15px 25px;
  border:1px solid #E9E9E9;
  background: rgba(1,6,33,0.02);
}
.total_style1{
  padding: 15px 25px;
  // border:1px solid #E9E9E9;
  // background: rgba(1,6,33,0.02);
}
.xiangqing_layout div{
  display: inline-block;
  width: 50%;
}
.goods_styls{
  border-bottom: 1px dashed #E6E6E6;
  padding-bottom: 10px;
}
.el-tag{
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.button_layout{
  margin-top: 16px;
  div {
    display: inline-block;
  }
}
.page_style{
  font-family: PingFangSC-Medium, PingFang SC;
}
.title_layout{
  display: inline-block;
  width: 50%;
}
.aboutOrder{
  background: rgba(1,6,33,0.02);
  font-size: 14px;
  padding: 16px 24px;
}
</style>
