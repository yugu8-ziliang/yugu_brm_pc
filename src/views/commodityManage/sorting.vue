<template>
  <Page v-loading='loading'>
    <div v-if="isShowEditGood == false">
      <h4>商品信息</h4>
      <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">产地:{{ goodMsg.regionName }}</el-col>
        <el-col :span="6">级别/规格:{{ goodMsg.spec }}</el-col>
        <el-col :span="6">当前库存:
          <span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
          goodMsg.subUnit3Weight,goodMsg.batchNumber,goodMsg.basketNumber,goodMsg.pieceNumber)"></span></el-col>
      </el-row>
      <el-divider></el-divider>
      <h4>批次列表&nbsp;&nbsp;&nbsp;&nbsp;<el-button style="color:#FFF;background:#0BA198;" size="mini" @click="openBatchSelect">+ 选择批次</el-button></h4>
      <el-row v-if="tableData.length > 0" class="layout_styl_1">
        <el-col :span="23">
          <el-table :data="tableData" height="300px" style="border:1px solid #E9E9E9;">
            <el-table-column label="编号" type="index"  width="50"></el-table-column>
            <el-table-column label="入库时间">
              <template slot-scope="scope">
                {{ toDate(scope.row.timestamp) }}
              </template>
            </el-table-column>
            <el-table-column label="入库类型" prop="">
              <template slot-scope="scope">
                <el-button @click="toPageType(scope.row.batchsourcename)" type="text">{{scope.row.batchsourcename}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="当前库存" prop="">
              <template slot-scope="scope">
                <span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                  goodMsg.subUnit3Weight,scope.row.batchnumber,scope.row.basketnumber,scope.row.piecenumber)"></span>
              </template>
            </el-table-column>
            <el-table-column label="入库成本单价" prop="costPrice">
              <template slot-scope="scope">
                {{ scope.row.costPrice + '元/' + goodMsg.subUnit }}
              </template>
            </el-table-column>
            <el-table-column label="分拣数量" prop="sortingNumber"></el-table-column>
            <el-table-column label="分拣成本" prop="sortingCost"></el-table-column>
            <el-table-column label="腾空筐子" prop="sumSoar">
              <template slot-scope="scope">
                <el-button type="text" @click="openBasketMsg(scope.row)">{{scope.row.sumSoar}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="tableDataDel(scope.row.batchid)">移除</el-button>
                <el-button type="text" @click="tableDataEdit(scope.row,scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table_count_styl">
            <span style="float:left;">合计</span>
            <span style="margin-right:20px;">批次数量:{{ tableData.length }}个</span>
            <span style="margin-right:20px;">分拣总量:{{ getZongliang }}{{ goodMsg.subUnit }}</span>
            <span style="margin-right:20px;">分拣成本总额:{{ getChengben }}元</span>
            <span style="margin-right:20px;">腾空筐子:{{ getCountSoar }}个</span>
          </div>
          <h4 v-if="tableData.length > 0" style="margin-top:15px;">新商品信息<el-button type="text" @click="handelEditGoods">编辑</el-button></h4>
          <h4 v-if="tableData.length > 0" >{{ goodMsg.name }}</h4>
          <el-row class="font_styl_1" v-if="tableData.length > 0">
            <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
            <el-col :span="6">级别/规格：{{ goodMsg.spec }}</el-col>
            <el-col :span="6">计算单位：{{ goodMsg.subUnit }}</el-col>
          </el-row>
          <el-row class="layout_styl_1 font_styl_2" v-if="tableData.length > 0">
            <el-col :span="6">入库成本总额：{{ rukuchengbenzonge }}元</el-col>
            <el-col :span="6">入库数量：{{ rukushuliang }}</el-col>
            <el-col :span="6">入库成本单价：{{ rukuchengbendanjia}}{{ goodMsg.subUnit }}</el-col>
          </el-row>
          <h4 style="margin-top:15px;">分拣原因</h4>
          <el-input
            style="width:30%"
            class="layout_styl_1"
            type="textarea"
            placeholder="请输入"
            v-model="remark"
            maxlength="200"
            show-word-limit
            rows='4'
            resize="none"
          >
          </el-input>
          <div style="height:100px;"></div>
          <div class="page_footer">
            <el-button size="mini" @click="submit(1)">确认并查看</el-button>
            <el-button type="primary" size="mini" @click="submit(2)">确认并返回</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <div v-if="isShowEditGood">
      <h4>商品信息</h4>
      <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
        <el-col :span="6">级别/规格：{{ goodMsg.spec }}</el-col>
      </el-row>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">转换总量：{{ getZongliang }}{{ goodMsg.subUnit }}</el-col>
        <el-col :span="6">转换总件数：{{ getJianshu }}{{ goodMsg.pieceUnit == '筐(一次性)' ? '筐' : goodMsg.pieceUnit }}</el-col>
        <el-col :span="6" class="font_styl_2">转换成本总额：{{ getChengben }}元</el-col>
      </el-row>
      <el-divider></el-divider>
      <el-form :model="editGoodsMsg" :rules="rules" ref="editGoodsform" label-position="left" style="margin-top:15px;">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="pieceUnit" label="选择计件单位">
              <br>
              <el-select v-model="editGoodsMsg.pieceUnit" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in pieceUnitoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="添加数量" prop="nums1">
              <br>
              <el-input v-model.number="editGoodsMsg.nums1" size="mini" style="width:50%;">
                <template slot="append">{{goodMsg.subUnit}}</template>
              </el-input>
              <el-button type="text" @click="openBatchWeigh('商品')">{{ '批量过磅' }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="editGoodsMsg.pieceUnit != '无'">
            <el-form-item label="添加件数" prop="nums2">
              <br>
              <el-input v-model.number="editGoodsMsg.nums2" size="mini" style="width:50%;">
                <template slot="append">{{goodMsg.pieceUnit== '筐(一次性)' ? '筐' : goodMsg.pieceUnit}}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="添加成本">
              <el-tooltip class="item" effect="dark" content="添加成本包含实际分拣费、人工费、包装材料费等" placement="top">
                <img style="width:13px;height:13px;margin-left:-10px;" src="@/assets/image/imgs/question-circle@2x.png" alt="">
              </el-tooltip>
              <br>
              <el-input v-model.number="editGoodsMsg.chengben" size="mini" style="width:50%;">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="入库成本单价">
              <br>
              {{ getChengbenDanjia + '元' }}{{ goodMsg.subUnit == '' ? '' : '/'+goodMsg.subUnit}} 
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="入库成本总额">
              <el-tooltip class="item" effect="dark" content="添加成本包含实际分拣费、人工费、包装材料费等" placement="top">
                <img style="width:13px;height:13px;margin-left:-10px;" src="@/assets/image/imgs/question-circle@2x.png" alt="">
              </el-tooltip>
              <br>
              {{ (getChengben+editGoodsMsg.chengben) + '元'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="是否去皮" prop="isQp">
              <el-radio-group v-model="editGoodsMsg.isQp"  @change="cutIsQp">
                <el-radio label="1">去皮</el-radio>
                <el-radio label="2">不去皮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button style="border:1px solid #0BA198;color:#0BA198;" size="mini" @click="getOwnBasket">+ 添加筐子(周转筐)</el-button>
          </el-col>
        </el-row>
        <div v-if="editGoodsMsg.ownbasket.length > 0">
          <div v-for="(ownitem,ownindex) in editGoodsMsg.ownbasket" :key="'own'+ownindex" style="border-bottom:1px solid #E6E6E6;padding:15px 0;">
            <p>【{{ownitem.basketType}}】{{ownitem.basektName}}空置数量：{{ ownitem.nums }}个</p>
            <div v-for="(owncoloritem,owncolorindex) in ownitem.modellist" :key="'owncolor'+owncolorindex" style="margin-top:15px;">
              <span style="color:#00A499;">[{{owncoloritem.color}}]</span>
              空置数量：{{ owncoloritem.nullvalue }}个
              <el-button type="text" style="color:red;" @click="basketDel(2,ownindex,owncolorindex)">移除</el-button>
              <br>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="使用:" :prop="'ownbasket.'+ownindex+'.modellist.'+owncolorindex+'.nums'" :rules="rules.nums">
                    <el-input v-model.number="owncoloritem.nums" size="mini" style="width:50%;">  
                      <i slot="suffix" style="color:#010621;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;">个</i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="重量:" :prop="'ownbasket.'+ownindex+'.modellist.'+owncolorindex+'.weight'" v-if="editGoodsMsg.isQp == '1'" :rules="rules.weight">
                    <el-input v-model.number="owncoloritem.weight" size="mini" style="width:50%;">
                      <i slot="suffix" style="color:#010621;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;">个/斤</i>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div style="text-align:right;padding:10px,10px;margin-top:15px;">
              <span v-if="editGoodsMsg.ownbasket.length > 0" style="margin-right:20px;">使用自家筐子{{ getsumown }}个</span>
              <span v-if="editGoodsMsg.isQp == '1'" style="margin-right:20px;">总重{{ getsumweight }}斤</span>
            </div>
          </div>
          <h4 style="margin-top:15px;">合计:</h4>
          <div>
            <el-row v-if="editGoodsMsg.isQp == '1'" style="margin-top:15px">
              <el-col :span="24">商品毛重:
                {{(editGoodsMsg.nums1 + getsumweight)+goodMsg.subUnit }}
                {{goodMsg.subUnit2 != '' ? '(':'' }}
                {{goodMsg.subUnit3Weight==0 ? '' :goodMsg.subUnit3Weight +goodMsg.subUnit3}}
                {{goodMsg.subUnit3 !='' ? '*' : '' }}
                {{goodMsg.subUnit2Weight==0 ? '' : goodMsg.subUnit2Weight +goodMsg.subUnit2}}
                {{goodMsg.subUnit2 != '' ? '/'+goodMsg.subUnit : ''}}
                {{goodMsg.subUnit2 != '' ? ')':'' }}
                {{editGoodsMsg.pieceUnit != '' &&editGoodsMsg.pieceUnit != '筐(一次性)'? '('+goodMsg.pieceNumber+editGoodsMsg.pieceUnit+')' : '('+goodMsg.pieceNumber+'筐)' }}
                {{goodMsg.basketNumber !=0 ? '|'+goodMsg.basketNumber : ''}}<font v-if="goodMsg.basketNumber !=0" style="color:#DF971A;">筐</font>
              </el-col>
              <el-col :span="24">筐子重量:{{ getsumweight }}斤</el-col>
              <el-col :span="24">商品净重:{{ editGoodsMsg.nums1 }}{{goodMsg.subUnit}}</el-col>
            </el-row>
            <el-row v-if="editGoodsMsg.isQp != '1'" style="margin-top:15px">
              <el-col :span="24">商品数量:
                {{editGoodsMsg.nums1+goodMsg.subUnit }}
                {{goodMsg.subUnit2 != '' ? '(':'' }}
                {{goodMsg.subUnit3Weight==0 ? '' :goodMsg.subUnit3Weight +goodMsg.subUnit3}}
                {{goodMsg.subUnit3 !='' ? '*' : '' }}
                {{goodMsg.subUnit2Weight==0 ? '' : goodMsg.subUnit2Weight +goodMsg.subUnit2}}
                {{goodMsg.subUnit2 != '' ? '/'+goodMsg.subUnit : ''}}
                {{goodMsg.subUnit2 != '' ? ')':'' }}
                {{editGoodsMsg.pieceUnit != '' &&editGoodsMsg.pieceUnit != '筐(一次性)'? '('+goodMsg.pieceNumber+editGoodsMsg.pieceUnit+')' : '('+goodMsg.pieceNumber+'筐)' }}
                {{goodMsg.basketNumber !=0 ? '|'+goodMsg.basketNumber : ''}}<font v-if="goodMsg.basketNumber !=0" style="color:#DF971A;">筐</font>
              </el-col>
            </el-row>
          </div>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="6">自家筐子种类:{{ editGoodsMsg.ownbasket.length }}种</el-col>
            <el-col :span="6">使用自家筐子:{{ getsumown }}个</el-col>
          </el-row>
        </div>
      </el-form>
      <div style="height:100px;"></div>
      <div class="page_footer">
        <el-button  size="mini" @click="isShowEditGood = false">取消</el-button>
        <el-button type="primary" size="mini" @click="goodsSubmit">提交</el-button>
      </div>
    </div>
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <el-dialog
      title="腾空筐子"
      :visible.sync="showBasketMsgDialog"
      width="30%"
      :before-close="openBasketMsgClose"
    >
      <div>
        <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="8">产地：{{ goodMsg.regionName }}</el-col>
          <el-col :span="8">级别/规格:{{ goodMsg.spec }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="12">入库时间:{{ toDate(showBasketData.timestamp) }}</el-col>
          <el-col :span="8">入库类型: <em style="color:#1A7FD9;" @click="toPageType(showBasketData.batchsourcename)">{{ showBasketData.batchsourcename }}</em></el-col>
        </el-row>
        <el-divider></el-divider>
        <h4>腾空筐子数量{{showBasketData.sumSoar}}个</h4>
        <el-row v-for="(item,index) in showBasketData.batchGetBasket" :key="'basket' + index" style="margin-bottom:20px;">
          <el-col :span="24">
            【{{item.basketType}}】{{item.basketName}}
          </el-col>
          <el-col v-for="(coloritem,colorindex) in item.info" :key="'color'+colorindex" :span="10" style="margin-left:8px;margin-top:10px;">
            [{{coloritem.color}}]数量:{{ coloritem.soar }}个
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog
      :title="batchweightitle"
      :visible.sync="batchweightdialog"
      width="50%"
      :before-close="batchweightdialogClose"
    >
      <div>
        <h3>{{ goodMsg.name }}</h3>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="6">
            产地:{{ goodMsg.regionName }}
          </el-col>
          <el-col :span="6">
            规格:{{ goodMsg.spec }}
          </el-col>
          <el-col :span="6">
            计算单位:{{ goodMsg.subUnit }}
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row v-for="(item,index) in batchweighData" :key="'aa'+index" style="margin-bottom:10px;">
          <el-col :span="3">{{ '计数'+(index+1)+':' }}</el-col>
          <el-col :span="6">
            <el-input v-model.number="item.num1" size="mini" style="width:70%">
              <template slot="append">{{  judgebatchweig == '批次' ? goodMsg.subUnit : goodMsg.subUnit }}</template>
            </el-input>
          </el-col>
          <el-col :span="6" v-if="goodMsg.subUnit !='斤' || goodMsg.subUnit !='公斤' || goodMsg.subUnit !='g'">
            <el-input v-model.number="item.num2" size="mini" style="width:70%">
              <template slot="append">{{ (judgebatchweig == '批次'  ? goodMsg.pieceUnit : editGoodsMsg.pieceUnit) == '筐(一次性)' 
                ? '筐' :(judgebatchweig == '批次'  ? goodMsg.pieceUnit : editGoodsMsg.pieceUnit)}}</template>
            </el-input>
          </el-col>
        </el-row>
        <el-button @click="addjishu" size="mini">添加计数</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        {{ batchweightitle == '批量过磅' ? '过磅总数' : '计件总数' }}
        {{ getBatchWeightCount }}
        {{ judgebatchweig == '批次' ? goodMsg.subUnit : editGoodsMsg.subUnit }}
        <el-button @click="batchweightdialogClose" size="mini">取消</el-button>
        <el-button type="primary" @click="guobangSubmit(judgebatchweig)" size="mini">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择自家筐子"
      :visible.sync="ownBasketDialog"
      width="30%"
      :before-close="ownBasketClose"
    >
      <div style="height:400px;overflow-y:scroll;">
        <div v-for="(item,index) in ownBasket" :key="'overflow' + index" style="margin-bottom:15px">
          <el-checkbox
            :indeterminate='item.isIndeterminate'
            v-model="item.checkAll"
            @change="ownBasketCheckAllChange(item.checkAll,index)">【{{ item.basketType }}】{{ item.basektName }}</el-checkbox>
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group v-model="item.checkedBasket" @change="handleCheckedOwnChange(item.checkedBasket,index)">
            <el-checkbox v-for="(coloritem,index) in item.basketColor" 
            :label="coloritem.basketcolor" :key="'color' + index">[{{coloritem.basketcolor}}]
              &nbsp;&nbsp;&nbsp;&nbsp;
            {{'空置数量'+coloritem.nums+'个'}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- <div style="margin-top:15px;">
          <el-button size="mini" @click="toAddBasket(1)">+ 购入筐子</el-button>
          <el-button size="mini" @click="toAddBasket(2)">+ 添加筐子</el-button>
        </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ownBasketClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="ownBasketSubmit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑批次"
      :visible.sync="editBatchDialog"
      width="60%"
      :before-close="editBatchDialogClose"
    >
      <h4>{{ goodMsg.name }}</h4>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
        <el-col :span="6">级别/规格：{{ goodMsg.spec }}</el-col>
      </el-row>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">入库时间：{{ toDate(editBatchMsg.timestamp)  }}</el-col>
        <el-col :span="5">入库类型：<em style="color:#1A7FD9;" @click="toPageType(editBatchMsg.batchsourcename)">{{ editBatchMsg.batchsourcename }}</em></el-col>
        <el-col :span="5">当前库存：
          <span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                  goodMsg.subUnit3Weight,editBatchMsg.batchnumber,editBatchMsg.basketnumber,editBatchMsg.piecenumber)"></span>
        </el-col>
        <el-col :span="5">入库成本单价： {{ editBatchMsg.costPrice + '元/' + goodMsg.subUnit }}</el-col>
      </el-row>
      <el-divider></el-divider>
      <el-form :model="form" ref="form" :rules="rules" inline label-position="left" style="margin-top:15px;">
        <el-form-item label="分拣数量" prop="sortingNumber">
          <el-input v-model.number="form.sortingNumber" size="mini" style="margin-top:5px;">
            <template slot="append">{{ goodMsg.subUnit }}</template>
          </el-input>
        </el-form-item>
        <el-button type="text" style="margin:0px 10px;" @click="openBatchWeigh('批次')">
          {{ goodMsg.subUnit =='斤' || goodMsg.subUnit =='公斤' || goodMsg.subUnit =='g' ?'批量过磅':'批量计件'}}
        </el-button>
        <el-form-item label="分拣件数" prop="sortingPiece" v-if="goodMsg.subUnit !='斤' && goodMsg.subUnit !='公斤' && goodMsg.subUnit !='g'">
          <el-input v-model.number="form.sortingPiece" size="mini" style="margin-top:5px;">
            <template slot="append">{{ goodMsg.pieceUnit == '筐(一次性)' ? '筐' : goodMsg.pieceUnit }}</template>
          </el-input>
        </el-form-item>
        <span>分拣成本
          <el-tooltip class="item" effect="dark" content="分拣成本包含报溢商品批次报溢商品批次成本为0" placement="top">
            <i class="el-icon-question" style="color:#0BA198;"></i> 
          </el-tooltip>
          :{{ getCost }}元</span>
        <div style="border-top:1px solid #E9E9E9;padding:10px 10px;" v-if="form.batchGetBasket.length > 0">
          <h4 style="margin-bottom:15px;">周转筐信息</h4>
          <div v-for="(item,index) in form.batchGetBasket" :key="'basket'+ index" style="border-bottom:1px solid #E9E9E9;">
            <p>【{{item.basketType}}】{{item.basketName}}</p>
            <el-row v-for="(coloritem,colorindex) in item.info" :key="'color' + colorindex">
              <el-col :span="5" style="margin-top:10px;margin-left:10px;"><span style="color:#0BA198;">[{{coloritem.color}}]</span>载货:{{coloritem.nums}}个</el-col>
              <el-col :span="7">
                <el-form-item 
                :prop="'batchGetBasket.'+index+'.info.'+colorindex+'.soar'" 
                label="腾空："
                :rules="[{required: true, message: '请填写腾空数量', trigger: 'blur'}]">
                  <el-input v-model.number="coloritem.soar" size="mini" @change="inputLimits(coloritem.soar,coloritem.nums,index,colorindex)" style="width:50%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <p style="text-align:right;margin:10px 10px;">
            共腾空{{ sumSoar }}个筐子
          </p>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBatchDialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="editBatchSubmit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择批次"
      :visible.sync="selectBatchDialog"
      width="60%"
      :before-close="selectBatchClose"
    >
      <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
        <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
        <el-col :span="6">级别/规格：级别/规格:{{ goodMsg.spec }}</el-col>
        <el-col :span="6">当前库存：<span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
          goodMsg.subUnit3Weight,goodMsg.batchNumber,goodMsg.basketNumber,goodMsg.pieceNumber)"></span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-table :data="dialogTableData.modelList" height="300px" style='border:1px solid #E9E9E9;' ref="batchTable"  
      @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column type="selection" :selectable="selectable" :reserve-selection='true'></el-table-column>
        <el-table-column label="入库时间" prop="timestamp">
            <template slot-scope="scope">
              {{ toDate(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column label="入库类型" prop="batchsourcename">
            <template slot-scope="scope">
              <el-button @click="toPageType(scope.row.batchsourcename)" type="text">{{scope.row.batchsourcename}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="入库数量" prop="inCount">
            <template slot-scope="scope">
              <span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                                      goodMsg.subUnit3Weight,scope.row.inCount,scope.row.basketnumber,scope.row.piecenumber)"></span>
            </template>
          </el-table-column>
          <el-table-column label="入库来源">
            <template slot-scope="scope">
              <span v-if="scope.row.custmorName == ''">--</span>
              <span v-if="scope.row.custmorName != ''">
                {{scope.row.custmorName}}
                <el-tag type="info" v-if="scope.row.custmorType == 0">非</el-tag>
                <el-tag v-if="scope.row.custmorType == 11 || scope.row.custmorType == 10">供</el-tag>
                <el-tag type="danger" v-if="scope.row.custmorType == 11 || scope.row.custmorType == 7">经</el-tag>
                <el-tag type="warning" v-if="scope.row.custmorType == 3 || scope.row.custmorType == 4">采</el-tag>
              </span>
              <span v-if="scope.row.custmorPhone != ''">{{ '-'+ scope.row.custmorPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前库存">
            <template slot-scope="scope">
              <span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                                      goodMsg.subUnit3Weight,scope.row.batchnumber,scope.row.basketnumber,scope.row.piecenumber)"></span>
            </template>
          </el-table-column>
          <el-table-column label="最近变动时间">
            <template slot-scope="scope">
              {{ toDate(scope.row.lastlyDate) }}
            </template>
          </el-table-column>
      </el-table>
      <div style="text-align:right;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dialogqueryData.pageindex"
          :page-sizes="[10]"
          :page-size="dialogqueryData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dialogqueryData.total">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectBatchDialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmChecked" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </Page>
</template>
<script>
import moment  from 'moment';
import { getInfo } from '@/request/api/commodityDetail/index'
import { getBatch,getCarryBasket,getOwnBasket,getSorting } from '@/request/api/theOverflow/index'
export default {
  data() {
    var validminweight = (rule, value, callback)=>{
      if(value <= 0){
        callback(new Error('重量不能为0！'));
      }else{
        callback();
      }
    };
    var validminnum = (rule, value, callback)=>{
      if(value <= 0){
        callback(new Error('数量不能为0！'));
      }else{
        callback();
      }
    };
    var isExceed = (rule, value, callback) => {
      if(value > this.editBatchMsg.batchnumber){
        return callback(new Error('转换数量不能大于当前批次库存！'));
      }else if(value == 0){
        return callback(new Error('请填写要转换的数量！'));
      }else{
        callback();
      }
    };
    return{
      showBasketMsgDialog:false,
      showBasketData:{},
      submitBasketMsg:[],
      ownBasket:[],
      ownBasketDialog:false,
      pieceUnitoptions:[],
      editGoodsMsg:{
        pieceUnit:'',
        nums1:0,
        nums2:0,
        chengben:0,
        isQp:'1',
        ownbasket:[],
        subUnitFocus:'',
      },
      rukuchengbenzonge:0,
      rukushuliang:0,
      rukuchengbendanjia:0,
      remark:'',
      batchweighData:[],
      batchweightdialog:false,
      batchweightitle:'批量过磅',
      judgebatchweig:'',
      form:{
        sortingNumber:0,
        sortingPiece:0,
        batchGetBasket:[],
      },
      rules:{
        sortingNumber:[{required: true, message: '请填写分拣数量', trigger: 'blur' },{ validator:isExceed, trigger: 'blur'}],
        sortingPiece:[{required: true, message: '请填写分拣件数', trigger: 'blur'}],
        pieceUnit:[{required: true, message: '请选择计件单位', trigger: 'change'}],
        nums1:[{required: true, message: '请填写添加数量', trigger: 'blur'}],
        nums2:[{required: true, message: '请填写添加件数', trigger: 'blur'}],
        isQp:[{required: true, message: '请选择去皮不去皮', trigger: 'blur'}],
        nums:[{ required: true, message: '请填写数量！', trigger: 'blur' },{validator: validminnum, trigger: 'blur'}],
        weight:[{ required: true, message: '请填写重量！', trigger: 'blur' },{validator: validminweight, trigger: 'blur'}]
      },
      editBatchMsg:{},
      editBatchDialog:false,
      tableData:[],
      dialogTableData:[],
      dialogqueryData:{
        productId:this.$route.query.id,
        type:4,
        pageindex:1,
        pagesize:10,
        total:0
      },
      selectBatchDialog:false,
      checkedBatch:[],
      goodMsg:{},
      isShowEditGood:false,
      loading:true
    }
  },
  computed:{
    getBatchWeightCount(){
      let res = 0;
      for(let i=0;i<this.batchweighData.length;i++){
        res += this.batchweighData[i].num1
      }
      return res;
    },
    getsumweight(){
      let own = 0;
      let res = 0;
      for(let i=0;i<this.editGoodsMsg.ownbasket.length;i++){
        for(let j=0;j<this.editGoodsMsg.ownbasket[i].modellist.length;j++){
          own += this.editGoodsMsg.ownbasket[i].modellist[j].weight * this.editGoodsMsg.ownbasket[i].modellist[j].nums;
        }
      }
      res =  own
      return res;
    },
    getsumown(){
      let res =0;
      for(let i=0;i<this.editGoodsMsg.ownbasket.length;i++){
        for(let j=0;j<this.editGoodsMsg.ownbasket[i].modellist.length;j++){
          res += this.editGoodsMsg.ownbasket[i].modellist[j].nums
        }
      }
      return res;
    },
    getChengbenDanjia(){
      // (getChengben+editGoodsMsg.chengben)/editGoodsMsg.nums1
      let res = (this.getChengben+this.editGoodsMsg.chengben)/this.editGoodsMsg.nums1
      return res && res != Infinity ? res : 0;
    },
    getJianshu(){
      let res = 0
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].transitionPiece){
          res += this.tableData[i].transitionPiece
        }
      }
      return res;
    },
    getCountSoar(){
      let res = 0
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].sumSoar){
          res += this.tableData[i].sumSoar
        }
      }
      return res;
    },
    getChengben(){
      let res = 0
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].sortingCost){
          res += this.tableData[i].sortingCost
        }
      }
      return res;
    },
    getZongliang(){//sumSoar
      let res = 0
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].sortingNumber){
          res += this.tableData[i].sortingNumber
        }
      }
      return res;
    },
    sumSoar(){
      let res = 0;
      for(let i=0;i<this.form.batchGetBasket.length;i++){
        for(let j=0;j<this.form.batchGetBasket[i].info.length;j++){
          res += this.form.batchGetBasket[i].info[j].soar
        }
      }
      return res;
    },
    getCost(){
      if(this.editBatchMsg.remainCount >= this.form.sortingNumber){
        return this.form.sortingNumber * this.editBatchMsg.costPrice
      }else{
        return this.editBatchMsg.remainCount * this.editBatchMsg.costPrice
      }
    },
  },
  methods:{
    toPageType(type){
      this.$error('暂无该功能！')
    },
    openBasketMsgClose(){
      this.showBasketMsgDialog = false;
    },
    openBasketMsg(row){
      this.showBasketMsgDialog = true
      this.showBasketData = row
      console.log(this.showBasketData)
    },
    basketDel(type,index1,index2){
      if(type == 1){
        if(this.form.modellist.overflowbasker[index1].modellist.length == 1){
          this.form.modellist.overflowbasker.splice(index1,1)
        }else{
          this.form.modellist.overflowbasker[index1].modellist.splice(index2,1)
        }
      }else{
        if(this.editGoodsMsg.ownbasket[index1].modellist.length == 1){
          this.editGoodsMsg.ownbasket.splice(index1,1)
        }else{
          this.editGoodsMsg.ownbasket[index1].modellist.splice(index2,1)
        }
      }
    },
    goodsSubmit(){
      this.$refs.editGoodsform.validate((valid)=>{
        if(valid){
          this.rukuchengbendanjia = this.getChengbenDanjia
          this.rukushuliang = this.editGoodsMsg.nums1
          this.rukuchengbenzonge = this.getChengben+this.editGoodsMsg.chengben
          this.submitBasketMsg = this.editGoodsMsg.ownbasket
          this.isShowEditGood = false;
        }
      })
    },
    handleCheckedOwnChange(val,index){
      let checkedCount = val.length;
      this.ownBasket[index].checkAll = checkedCount === this.ownBasket[index].basketColor.length;
      this.ownBasket[index].isIndeterminate = checkedCount > 0 && checkedCount < this.ownBasket[index].basketColor.length;
    },
    ownBasketCheckAllChange(val,index){
      this.ownBasket[index].checkedBasket = val ? this.ownBasket[index].basketColor.map(item=>{return item.basketcolor}) : [];
      this.ownBasket[index].isIndeterminate = false;
    },
    ownBasketSubmit(){
      let res = [];
      for(let i=0;i<this.ownBasket.length;i++){
        if(this.ownBasket[i].checkedBasket.length > 0){
          res.push({
            basektName:this.ownBasket[i].basektName,
            basketColor:this.ownBasket[i].basketColor,
            basketId:this.ownBasket[i].basketId,
            basketType:this.ownBasket[i].basketType,
            checkAll:this.ownBasket[i].checkAll,
            checkedBasket:this.ownBasket[i].checkedBasket,
            isIndeterminate:this.ownBasket[i].isIndeterminate,
            nums:this.ownBasket[i].nums,
            modellist:[]
          })
        }
      }
      for(let i=0;i<res.length;i++){
        for(let j=0;j<res[i].checkedBasket.length;j++){
          for(let k=0;k<res[i].basketColor.length;k++){
            if(res[i].checkedBasket[j] == res[i].basketColor[j].basketcolor){
              // console.log(res[i].basketColor[j].nums,)
              res[i].modellist.push({
                color:res[i].basketColor[j].basketcolor,
                nullvalue:res[i].basketColor[j].nums,
                nums:0,
                weight:0
              })
              let map = new Map();
              for (let item of res[i].modellist) {
                  map.set(item.color, item);
              }
              res[i].modellist = [...map.values()]
            }
          }
        }
      }
      this.editGoodsMsg.ownbasket = res;
      this.ownBasketClose();
    },
    ownBasketClose(){
      this.ownBasketDialog = false;
    },
    getOwnBasket(){
      this.ownBasketDialog = true;
      let res = { categoryname:this.goodMsg.categoryThird };
      getOwnBasket(res).then(resp=>{  
        let obj = resp.data
        if(obj.length != this.ownBasket.length){
          this.ownBasket = [];
          for(let i=0;i<obj.length;i++){
            this.ownBasket.push({
              basketId:obj[i].basketid,
              basketType:obj[i].basketType,
              basektName:obj[i].basketname,
              basketColor:obj[i].basketinfo,
              checkAll:false,
              isIndeterminate:true,
              checkedBasket:[],
              nums:obj[i].nums
            })
          }
        }
        console.log(this.ownBasket)
      })
    },
    cutIsQp(){
      for(let i=0;i<this.editGoodsMsg.ownbasket.length;i++){
        for(let j=0;j<this.editGoodsMsg.ownbasket[i].modellist.length;j++){
          this.editGoodsMsg.ownbasket[i].modellist[j].weight = 0
        }
      }
    },
    handelEditGoods(){
      this.isShowEditGood = true;
      this.pieceUnitoptions = [{label:'无',value:'无'},{label:'箱',value:'箱'},{label:'袋',value:'袋'},{label:'盒',value:'盒'},
      {label:'件',value:'件'},{label:'筐(一次性)',value:'筐(一次性)'},{label:'筐(周转筐)',value:'筐(周转筐)'},]
    },
    submit(type){
      // getSorting
      let issubmit = true;
      for(let i=0;i<this.tableData.length;i++){
        if(!this.tableData[i].sortingNumber){
          this.$error('编号'+ (i+1) + '的批次没有被编辑，请移除或编辑后再做提交！');
          issubmit = false;
        }
      }
      if(this.rukushuliang == 0){
        this.$error('请编辑新商品信息！')
        issubmit = false
      }
      if(issubmit){
        let res = {
          productId:this.goodMsg.productId,
          productBatchCount:this.tableData.length,
          productTotalCount:this.getZongliang,
          emptyBasketCount:this.getCountSoar,
          sortProductCost:this.getChengben,
          sortAddCost:this.rukuchengbenzonge,
          isRemovePeel:this.editGoodsMsg.isQp,
          remark:this.remark,
          batchSortInfo:[],
          newProductBasketInfo:[],
          newProductCount:this.editGoodsMsg.nums1,
          newProductCost:this.rukuchengbendanjia,
          newProductBasketCount:this.getsumown,
          pieceNumber:this.editGoodsMsg.nums2,
          pieceUnit:this.editGoodsMsg.pieceUnit
        }
        for(let i=0;i<this.submitBasketMsg.length;i++){
          for(let j=0;j<this.submitBasketMsg[i].modellist.length;j++){
            res.newProductBasketInfo.push({
              userBasketName:this.submitBasketMsg[i].basektName,
              userBasketId:this.submitBasketMsg[i].basketId,
              userBasketColor:this.submitBasketMsg[i].modellist[j].color,
              userBasketCount:this.submitBasketMsg[i].modellist[j].nums,
              userBasketWeight:this.submitBasketMsg[i].modellist[j].weight
            })
          }
        }
        for(let i=0;i<this.tableData.length;i++){
          res.batchSortInfo.push({
            productIdBatchId:this.tableData[i].batchid,
            productIdBatchName:this.toDate(this.tableData[i].timestamp),
            productIdBatchType:this.tableData[i].batchsourcename,
            productIdBatchSource:this.tableData[i].custmorName+'['+ this.tableData[i].custmorPhone +']',
            beforeProductCount:this.tableData[i].batchnumber,
            afterProductCount:this.tableData[i].batchnumber - this.tableData[i].sortingNumber,
            sortProductCount:this.tableData[i].sortingNumber,
            sortProductCost:this.tableData[i].costPrice,
            sortProductTotalCost:this.tableData[i].costPrice * this.tableData[i].sortingNumber,
            beforeBasketCount:this.tableData[i].basketnumber,
            afterBasketCount:this.tableData[i].basketnumber - this.tableData[i].sumSoar,
            sortBasketCount:this.tableData[i].sumSoar,
            beforeUnitCount:this.tableData[i].piecenumber,
            afterUnitCount:this.tableData[i].piecenumber - this.tableData[i].sortingPiece,
            sortUnitCount:this.tableData[i].sortingPiece,
            basketInfo:[]
          })
          for(let j=0;j<this.tableData[i].batchGetBasket.length;j++){
            for(let k=0;k<this.tableData[i].batchGetBasket[j].info.length;k++){
              res.batchSortInfo[i].basketInfo.push({
                userBasketId:this.tableData[i].batchGetBasket[j].basketId,
                userBasketName:this.tableData[i].batchGetBasket[j].basketName,
                userBasketColor:this.tableData[i].batchGetBasket[j].info[k].color,
                userBasketCount:this.tableData[i].batchGetBasket[j].info[k].soar
            })
            }
          }
        }
        getSorting(res).then(resp=>{
          console.log(resp)
          if(resp.status == 200){
            this.$success('转换成功！')
            if(type == 1){
              this.$router.push({path:'unitConversionDetail',query:{id:resp.data[0]}})
              this.$closePage();
            }else{
              if(this.$route.query.type == '商品列表'){
                this.$router.push({path:'commodityList'})
              }else{
                this.$router.push({path:'commodityDetail'})
              }
              this.$closePage();
            }
          }
        })
      }
    },
    editBatchSubmit(){
      this.loading = true;
      this.$refs.form.validate((valid)=>{
        if(valid){
          for(let i=0;i<this.tableData.length;i++){
            if(this.tableData[i].batchid == this.editBatchMsg.batchid){
              this.$set(this.tableData[i],'sortingNumber',this.form.sortingNumber);
              this.$set(this.tableData[i],'sortingPiece',this.form.sortingPiece);
              // this.$set(this.tableData[i],'batchGetBasket',this.form.batchGetBasket);
              this.tableData[i].batchGetBasket = JSON.parse(JSON.stringify(this.form.batchGetBasket))
              this.$set(this.tableData[i],'sumSoar',this.sumSoar);
              this.$set(this.tableData[i],'sortingCost',this.getCost);
            }
          }
          // console.log(this.tableData)
          this.editBatchDialogClose();
          this.loading = false;
        }
      })
    },
    inputLimits(val1,val2,index1,index2){
      if(val2 < val1){
        this.$error('腾空筐子数不能大于载货筐子数！');
        this.form.batchGetBasket[index1].info[index2].soar = val2
      }
    },
    guobangSubmit(type){
      // console.log(type)
      let sum1 = 0;
      let sum2 = 0;
      for(let i=0;i<this.batchweighData.length;i++){
        sum1 += this.batchweighData[i].num1;
        sum2 += this.batchweighData[i].num2;
      }
      if(type == '批次'){
        this.form.sortingNumber = sum1;
        this.form.sortingPiece = sum2;
      }else{
        this.editGoodsMsg.nums1 = sum1;
        this.editGoodsMsg.nums2 = sum2;
      }
      this.batchweightdialogClose();
    },
    batchweightdialogClose(){
      this.batchweightdialog = false;
      this.batchweighData = []
    },
    addjishu(){
      this.batchweighData.push({
        num1:0,
        num2:0,
      })
    },
    openBatchWeigh(type){
      this.judgebatchweig = type;
      if(type == '批次'){
        if(this.goodMsg.subUnit !='斤' && this.goodMsg.subUnit !='公斤' && this.goodMsg.subUnit !='g'){
          this.batchweightitle = '批量计件'
        }else{
          this.batchweightitle = '批量过磅'
        }
      }else{
        if(this.editGoodsMsg.subUnit !='斤' && this.editGoodsMsg.subUnit !='公斤' && this.editGoodsMsg.subUnit !='g'){
          this.batchweightitle = '批量计件'
        }else{
          this.batchweightitle = '批量过磅'
        }
      }
      this.batchweightdialog = true;
      this.addjishu();
    },
    editBatchDialogClose(){
      this.editBatchDialog = false;
      this.$refs.form.resetFields()
    },
    tableDataEdit(row,index){
      this.editBatchDialog = true;
      if(row.batchGetBasket){
        this.form.sortingNumber = row.sortingNumber
        this.form.sortingPiece = row.sortingPiece
        this.form.batchGetBasket = JSON.parse(JSON.stringify(row.batchGetBasket)) 
        // console.log(row.batchGetBasket)
      }
      // this.title = this.title + (index + 1)
      this.editBatchMsg = row;
      let batchGetBasket = { productId:this.$route.query.id,batchId:[this.editBatchMsg.batchid] }
      if(!row.batchGetBasket){
        getCarryBasket(batchGetBasket).then(resp=>{
          let res = resp.data
          for(let i=0;i<res.length;i++){
            res[i].info=[]
          }
          for(let i=0;i<res.length;i++){
            for(let j=0;j<res.length;j++){
              if(res[i].basketId == res[j].basketId){
                res[i].info.push({
                  color:res[j].basketColor,
                  nums:res[j].nums,
                  soar:0
                })
              }
            }
          }
          let map = new Map();
          for (let item of res) {
              map.set(item.basketId, item);
          }
          res = [...map.values()]
          this.form.batchGetBasket = res
        })
      }
    },
    tableDataDel(id){
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].batchid == id){
          this.tableData.splice(i,1);
        }
      }
    },
    confirmChecked(){
      // this.tableData = this.checkedBatch
      let obj = this.tableData.map(item=>{return item.batchid})
      // console.log(obj)
      for(let i=0;i<this.checkedBatch.length;i++){
        if(obj.indexOf(this.checkedBatch[i].batchid) == -1){
          this.tableData.push(this.checkedBatch[i])
        }
      }
      this.selectBatchDialogClose()
    },
    selectBatchDialogClose(){
      this.selectBatchDialog = false;
      this.checkedBatch = [];
      setTimeout(()=>{this.dialogTableData= [];},1000)
      this.$refs.batchTable.clearSelection()
    },
    handleCurrentChange(val){
      this.dialogqueryData.pageindex = val; 
      this.getBatchMsg();
    },
    handleSizeChange(){},
    selectable(row,index){
      let obj = this.tableData.map(item=>{
        return item.batchid
      })
      if(obj.indexOf(row.batchid) > -1){
        return false;
      }else{
        return true;
      }
    },
    handleSelectionChange(val){
      this.checkedBatch = val
    },
    getRowKeys(row){
      return row.batchid;
    },
    selectBatchClose(){
      this.selectBatchDialog = false;
    },
    getBatchMsg(){
      getBatch(this.dialogqueryData).then(resp=>{
        console.log(resp)
        this.dialogTableData = resp.data[0];
        this.dialogqueryData.total = resp.data[0].sumCount;
        this.checkedBatch = this.tableData;
        if(this.tableData.length > 0){
          this.$nextTick(()=>{
            this.dialogTableData.modelList.forEach(row =>{
              for(let i=0;i<this.tableData.length;i++){
                if(this.tableData[i].batchid == row.batchid){
                  this.$refs.batchTable.toggleRowSelection(row,true)
                }
              }
            })
          })
        }
      })
    },
    openBatchSelect(){
      this.checkedBatch = this.tableData;
      this.selectBatchDialog = true;
      this.getBatchMsg();
    },
    getStock(subunit,subunit2,subunit3,pieceunit,subunit2weight,subunit3weight,stock,basket,piececount){
      let first = stock+subunit;
      let next2 = subunit2 == '' ? '' : subunit2weight+subunit2+'/'+subunit
      let next3 = subunit3 == '' ? '' : subunit3weight+subunit3+'*'
      let next4 = pieceunit == '' ? '' : '('+piececount+(pieceunit=='筐(一次性)' ? '筐' : pieceunit)+')'
      let last = basket == 0 ? '' : '|'+basket+'<font style="color:#DF971A;">筐</font>' 
      let kuohao1 = subunit2 == '' ? '' : '('
      let kuohao2 = subunit2 == '' ? '' : ')'
      return first+kuohao1+next3+next2+kuohao2+next4+last
    },
    getgoods(){
      if(this.$route.query.type == '批次详情'){
        getBatch(this.dialogqueryData).then(resp=>{
          let res = resp.data[0].modelList
          for(let i=0;i<res.length;i++){
            if(res[i].batchid == this.$route.query.id2){
              this.tableData.push(res[i])
            }
          }
        })
      }
      let res = {
        productId:this.$route.query.id,
        type:1,
        pageindex:1,
        pagesize:10,
      }
      getInfo(res).then(resp=>{
        this.goodMsg = resp.data[0];
        this.loading = false;
      })
    },
    toDate(val){
      return moment(val*1000).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  created(){
    this.getgoods();
  }
}
</script>
<style scoped lang="scss">
.layout_styl_1{
  margin-top: 15px;
}
.font_styl_1{
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1,6,33,0.5500);
}
.font_styl_2{
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: normal;
  color: rgba(1,6,33,0.9000);
}
.el-tag{
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.table_count_styl{
  padding:12px;
  font-size: 16px;
  text-align: right;
  background-color: rgba(1,6,33,0.0200);
  border: 1px solid #E9E9E9;
  border-top: 0px;
}
.page_footer{
  width: 100%;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #E4E7ED;
  // height: 20px;
  position:fixed;
  bottom: 0px;
  padding:15px;
  right:20px;
}
</style>