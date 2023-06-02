<template>
  <Page v-loading="loading" :title="title">
    <div v-if="editDialog == false">
      <h4>商品信息</h4>
      <el-row class="layout_styl_1">
        <el-col :span="20">
          {{ goodMsg.name }}
        </el-col>
      </el-row>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="4">
          产地:{{ goodMsg.regionName }}
        </el-col>
        <el-col :span="4">
          级别/规格:{{ goodMsg.spec }}
        </el-col>
        <el-col :span="4">
          当前库存:
          {{goodMsg.batchNumber+goodMsg.subUnit }}
          {{goodMsg.subUnit2 != '' ? '(':'' }}
          {{goodMsg.subUnit3Weight==0 ? '' :goodMsg.subUnit3Weight +goodMsg.subUnit3}}
          {{goodMsg.subUnit3 !='' ? '*' : '' }}
          {{goodMsg.subUnit2Weight==0 ? '' : goodMsg.subUnit2Weight +goodMsg.subUnit2}}
          {{goodMsg.subUnit2 != '' ? '/'+goodMsg.subUnit : ''}}
          {{goodMsg.subUnit2 != '' ? ')':'' }}
          {{goodMsg.pieceUnit != '' &&goodMsg.pieceUnit != '筐(一次性)'? '('+goodMsg.pieceNumber+goodMsg.pieceUnit+')' : '('+goodMsg.pieceNumber+'筐)' }}
          {{goodMsg.basketNumber !=0 ? '|'+goodMsg.basketNumber : ''}}<font v-if="goodMsg.basketNumber !=0" style="color:#DF971A;">筐</font>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <h4>批次列表&nbsp;&nbsp;&nbsp;&nbsp;<el-button style="color:#FFF;background:#0BA198;" size="mini" @click="openBatchSelect">+ 选择批次</el-button></h4>
      <el-row v-if="tableData.length > 0" class="layout_styl_1">
        <el-col :span="23">
          <el-table :data="tableData" height="300px" style="border:1px solid #E9E9E9;">
            <el-table-column label="编号" type="index"  width="50"></el-table-column>
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
            <el-table-column label="当前库存">
              <template slot-scope="scope">
                {{scope.row.batchnumber+goodMsg.subUnit }}
                {{goodMsg.subUnit2 != '' ? '(':'' }}
                {{goodMsg.subUnit3Weight==0 ? '' :goodMsg.subUnit3Weight +goodMsg.subUnit3}}
                {{goodMsg.subUnit3 !='' ? '*' : '' }}
                {{goodMsg.subUnit2Weight==0 ? '' : goodMsg.subUnit2Weight +goodMsg.subUnit2}}
                {{goodMsg.subUnit2 != '' ? '/'+goodMsg.subUnit : ''}}
                {{goodMsg.subUnit2 != '' ? ')':'' }}
                {{goodMsg.pieceUnit != '' &&goodMsg.pieceUnit != '筐(一次性)'? '('+scope.row.piecenumber+goodMsg.pieceUnit+')' : '('+scope.row.piecenumber+'筐)' }}
                {{scope.row.basketnumber !=0 ? '|'+scope.row.basketnumber : ''}}<font v-if="scope.row.basketnumber !=0" style="color:#DF971A;">筐</font>
              </template>
            </el-table-column>
            <el-table-column label="报溢数量" prop="overflowcount"></el-table-column>
            <el-table-column label="报溢筐子" prop="overflowbasket">
              <template slot-scope="scope">
                <el-button type="text" @click="openBasketDialog(scope.row)">{{ scope.row.overflowbasket }}<span v-if="scope.row.overflowbasket">个</span></el-button>
              </template>
            </el-table-column>
            <el-table-column label="使用自家筐子" prop="mybasket">
              <template slot-scope="scope">
                <el-button type="text" @click="openBasketDialog(scope.row)">{{ scope.row.mybasket }}<span v-if="scope.row.mybasket">个</span></el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="del(scope.row.batchid)">移除</el-button>
                <el-button type="text" @click="handelEdit(scope.row,scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table_count_styl">
            <span style="float:left;">合计</span>
            <span style="margin-right:20px;">批次数量:{{ tableData.length }}个</span>
            <span style="margin-right:20px;">
              报溢总量:{{  sumoverflowcount + goodMsg.subUnit }}
              {{goodMsg.subUnit2 != '' ? '(':'' }}
              {{goodMsg.subUnit3Weight==0 ? '' :goodMsg.subUnit3Weight +goodMsg.subUnit3}}
              {{goodMsg.subUnit3 !='' ? '*' : '' }}
              {{goodMsg.subUnit2Weight==0 ? '' : goodMsg.subUnit2Weight +goodMsg.subUnit2}}
              {{goodMsg.subUnit2 != '' ? '/'+goodMsg.subUnit : ''}}
              {{goodMsg.subUnit2 != '' ? ')':'' }}
              {{goodMsg.pieceUnit != '' &&goodMsg.pieceUnit != '筐(一次性)'? '('+goodMsg.pieceNumber+goodMsg.pieceUnit+')' : '('+goodMsg.pieceNumber+'筐)' }}
              {{goodMsg.basketNumber !=0 ? '|'+goodMsg.basketNumber : ''}}<font v-if="goodMsg.basketNumber !=0" style="color:#DF971A;">筐</font>
            </span>
            <span style="margin-right:20px;">报溢筐子:{{ sumbaksetover }}个</span>
            <span style="margin-right:20px;">使用自家筐子:{{ sumbasketown }}个</span>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <h4 class="layout_styl_1">报溢原因</h4>
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
        <el-button type="primary" size="mini" @click="submit(1)" :disabled="editmsg.length == 0">确认并查看</el-button>
        <el-button type="primary" size="mini" @click="submit(2)" :disabled="editmsg.length == 0">确认并返回</el-button>
      </div>
    </div>
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************************* -->
    <div v-if="editDialog">
      <h3>商品信息</h3>
      <el-row class="layout_styl_1">
        <el-col :span="20">
          {{ goodMsg.name }}
        </el-col>
      </el-row>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="4">
          产地:{{ goodMsg.regionName }}
        </el-col>
        <el-col :span="4">
          级别/规格:{{ goodMsg.spec }}
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <h3>批次信息</h3>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">
          入库时间:{{ toDate(editBatchMsg.timestamp) }}
        </el-col>
        <el-col :span="6">
          入库类型:<em style="color:#1A7FD9" @click="toPageType(editBatchMsg.batchsourcename)" type="text">{{ editBatchMsg.batchsourcename }}</em>
        </el-col>
        <el-col :span="6">
          当前库存:
          {{editBatchMsg.batchnumber+goodMsg.subUnit }}
          {{goodMsg.subUnit2 != '' ? '(':'' }}
          {{goodMsg.subUnit3Weight==0 ? '' :goodMsg.subUnit3Weight +goodMsg.subUnit3}}
          {{goodMsg.subUnit3 !='' ? '*' : '' }}
          {{goodMsg.subUnit2Weight==0 ? '' : goodMsg.subUnit2Weight +goodMsg.subUnit2}}
          {{goodMsg.subUnit2 != '' ? '/'+goodMsg.subUnit : ''}}
          {{goodMsg.subUnit2 != '' ? ')':'' }}
          {{goodMsg.pieceUnit != '' &&goodMsg.pieceUnit != '筐(一次性)'? '('+editBatchMsg.piecenumber+goodMsg.pieceUnit+')' : '('+editBatchMsg.piecenumber+'筐)' }}
          {{editBatchMsg.basketnumber !=0 ? '|'+editBatchMsg.basketnumber : ''}}<font v-if="editBatchMsg.basketnumber !=0" style="color:#DF971A;">筐</font>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <h3 v-if="batchGetBasket.length > 0">载货筐子</h3>
      <el-row v-if="batchGetBasket.length > 0" class="layout_styl_1 font_styl_1">
        <el-col :span="5" v-for="(item,index) in batchGetBasket" :key="'batchGetBasket' + index">
          <span>【{{ item.basketType }}】</span><span>{{ item.basketName }}</span><span style="margin-right:10px;">[{{ item.basketColor }}]</span>
          <span>{{ item.nums }}个</span>
        </el-col>
      </el-row>
      <el-divider v-if="batchGetBasket.length > 0"></el-divider>
      <h3>报溢信息填写：</h3>
      <el-form :model="form" :rules="rules" inline label-width="100%" label-position="left" ref="form">
        <el-row>
          <el-col :span="6">
            <el-form-item label="选择计件单位：" prop="pieceUnit">
              <el-select v-model="form.pieceUnit" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in pieceUnitoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"  style="position: relative;">
            <el-form-item label="报溢数量" prop="theOverflowNums">
              <el-input v-model.number="form.theOverflowNums" size="mini">
                <i slot="suffix" style="color:#010621;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;">{{ goodMsg.subUnit }}</i>
              </el-input>
              <el-button 
              @click="batchWeight"
              type="text" 
              style="position:absolute;" 
              v-if="goodMsg.subUnit == '斤' || goodMsg.subUnit == '公斤' || goodMsg.subUnit == 'g'">
              批量过磅
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="form.pieceUnit != '无'">
            <el-form-item label="报溢件数" prop="theOverflowPieceNums">
              <el-input v-model.number="form.theOverflowPieceNums" size="mini">
                <i slot="suffix" :class="{font_styl2:form.pieceUnit == '筐(周转筐)'}">
                  {{ form.pieceUnit == '筐(周转筐)' || '筐(一次性)' ? '筐' : form.pieceUnit }}</i>
              </el-input> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="position: relative;">
            <el-form-item label="是否去皮" prop="isQp" v-if="goodMsg.subUnit == '斤' || goodMsg.subUnit == '公斤' || goodMsg.subUnit == 'g'">
              <el-radio-group v-model="form.isQp" size="mini" @change="cutIsQp">
                <el-radio-button label="去皮"></el-radio-button>
                <el-radio-button label="不去皮"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="btn_opsition">
              <el-button size="mini" class="btn_style" @click="getOverFlowBasket">+ 报溢筐子</el-button>
              <el-button size="mini" class="btn_style" @click="getOwnBasket">+ 添加自家筐子</el-button>
            </div>
          </el-col>
        </el-row>
        <div style="box-shadow: 0px 6px 16px 0px rgba(0,0,0,0.0800), 0px 3px 6px -4px rgba(0,0,0,0.1200);border-radius: 8px;padding:15px 15px;" 
        v-if="form.modellist.overflowbasker.length>0 || form.modellist.ownbasket.length > 0">
          <div v-if="form.modellist.overflowbasker.length>0">
            <div v-for="(overflowitem,overflowindex) in form.modellist.overflowbasker" :key="'overflow'+overflowindex"
            style="border-bottom:1px solid #E6E6E6;padding-bottom:15px;">
              <p>【{{overflowitem.basketType}}】{{overflowitem.basektName}}<el-button plain type="danger" size="mini" class="btn_styl2">报溢筐子</el-button></p>
              <div v-for="(overflowcoloritem,overflowcolorindex) in overflowitem.modellist" :key="'overflowcolor'+overflowcolorindex" 
              style="margin-top:15px;">
                <span style="color:#00A499;">[{{overflowcoloritem.color}}]</span>
                <el-button type="text" style="color:red;" @click="basketDel(1,overflowindex,overflowcolorindex)">移除</el-button>
                <br>
                <el-form-item label="报溢:" :prop="'modellist.overflowbasker.'+overflowindex+'.modellist.'+ overflowcolorindex + '.nums'"
                :rules="rules.nums"
                >
                  <el-input v-model.number="overflowcoloritem.nums" size="mini">  
                    <i slot="suffix" style="color:#010621;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;">个</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="重量:" :prop="'modellist.overflowbasker.'+overflowindex+'.modellist.'+ overflowcolorindex + '.weight'" v-if="form.isQp == '去皮'"
                :rules="rules.weight"
                >
                  <el-input v-model.number="overflowcoloritem.weight" size="mini">
                    <i slot="suffix" style="color:#010621;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;">个/斤</i>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div v-if="form.modellist.ownbasket.length>0">
            <div v-for="(ownitem,ownindex) in form.modellist.ownbasket" :key="'own'+ownindex" 
            style="border-bottom:1px solid #E6E6E6;padding:15px 0;">
              <p>
                【{{ownitem.basketType}}】{{ownitem.basektName}}<el-button type="warning" plain size="mini">自家筐子</el-button>
                空置数量：{{ ownitem.nums }}个
              </p>
              <div v-for="(owncoloritem,owncolorindex) in ownitem.modellist" :key="'owncolor'+owncolorindex" style="margin-top:15px;">
                <span style="color:#00A499;">[{{owncoloritem.color}}]</span>
                空置数量：{{ owncoloritem.nullvalue }}个
                <el-button type="text" style="color:red;" @click="basketDel(2,ownindex,owncolorindex)">移除</el-button>
                <br>
                <el-form-item label="使用:" :prop="'modellist.ownbasket.'+ownindex+'.modellist.'+owncolorindex+'.nums'" :rules="rules.nums">
                  <el-input v-model.number="owncoloritem.nums" size="mini">  
                    <i slot="suffix" style="color:#010621;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;">个</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="重量:" :prop="'modellist.ownbasket.'+ownindex+'.modellist.'+owncolorindex+'.weight'" v-if="form.isQp == '去皮'" :rules="rules.weight">
                  <el-input v-model.number="owncoloritem.weight" size="mini">
                    <i slot="suffix" style="color:#010621;font-size: 14px;font-family: PingFangSC-Regular, PingFang SC;">个/斤</i>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div style="text-align:right;padding:10px,10px;margin-top:15px;">
            <span v-if="form.modellist.overflowbasker.length > 0" style="margin-right:20px;">报溢筐子{{ getsumoverflow }}个</span>
            <span v-if="form.modellist.ownbasket.length > 0" style="margin-right:20px;">使用自家筐子{{ getsumown }}个</span>
            <span v-if="form.isQp == '去皮'" style="margin-right:20px;">总重{{ getsumweight }}斤</span>
          </div>
        </div>
      </el-form>
      <h4 style="margin-top:25px;">合计</h4>
      <p style="margin-top:15px;" v-if="form.isQp == '去皮'">报溢毛重:{{ form.theOverflowNums }}{{ goodMsg.subUnit }}</p>
      <p style="margin-top:15px;" v-if="form.isQp == '去皮'">筐子重量:{{ getsumweight }}斤</p>
      <p style="margin-top:15px;" v-if="form.isQp == '去皮'">报溢净重:{{ form.theOverflowNums-getsumweight }}斤</p>
      <el-divider  v-if="form.isQp == '去皮'"></el-divider>
      <el-row  style="margin-top:15px;">
        <el-col :span="4">报溢筐子种类：{{ form.modellist.overflowbasker.length }}种</el-col>
        <el-col :span="4">报溢筐子：{{ getsumoverflow }}个</el-col>
      </el-row>
      <el-row  style="margin-top:15px;">
        <el-col :span="4">自家筐子种类：{{ form.modellist.ownbasket.length }}种</el-col>
        <el-col :span="4">使用自家筐子：{{ getsumown }}个</el-col>
      </el-row>
      <div style="height:100px;"></div>
      <div class="page_footer">
        <el-button size="mini" @click="editDialog = false">取消</el-button>
        <el-button type="primary" size="mini" @click="goback">提交</el-button>
      </div>
    </div>
    <el-dialog
      title="选择批次"
      :visible.sync="selectBatchDialog"
      width="1100px"
      :before-close="selectBatchDialogClose"
    >
      <el-row class="font_styl_2">
        <el-col :span="24">{{ goodMsg.name }}</el-col>
      </el-row>
      <el-row class="layout_styl_1">
        <el-col :span="6">产地:{{ goodMsg.name }}</el-col>
        <el-col :span="6">级别/规格:{{ goodMsg.regionName }}</el-col>
        <el-col :span="6">当前库存:
          {{goodMsg.batchNumber+goodMsg.subUnit }}
          {{goodMsg.subUnit2 != '' ? '(':'' }}
          {{goodMsg.subUnit3Weight==0 ? '' :goodMsg.subUnit3Weight +goodMsg.subUnit3}}
          {{goodMsg.subUnit3 !='' ? '*' : '' }}
          {{goodMsg.subUnit2Weight==0 ? '' : goodMsg.subUnit2Weight +goodMsg.subUnit2}}
          {{goodMsg.subUnit2 != '' ? '/'+goodMsg.subUnit : ''}}
          {{goodMsg.subUnit2 != '' ? ')':'' }}
          {{goodMsg.pieceUnit != '' &&goodMsg.pieceUnit != '筐(一次性)'? '('+goodMsg.pieceNumber+goodMsg.pieceUnit+')' : '('+goodMsg.pieceNumber+'筐)' }}
          {{goodMsg.basketNumber !=0 ? '|'+goodMsg.basketNumber : ''}}<font v-if="goodMsg.basketNumber !=0" style="color:#DF971A;">筐</font>
        </el-col>
      </el-row>
      <el-table ref="batchTable" :data="dialogTableData.modelList" height="300px" style='border:1px solid #E9E9E9;' 
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
            {{scope.row.inCount+dialogTableData.subunit }}
            {{dialogTableData.subUnit2 != '' ? '(':'' }}
            {{dialogTableData.subUnit3Weight==0 ? '' :dialogTableData.subUnit3Weight +dialogTableData.subUnit3}}
            {{dialogTableData.subUnit3 !='' ? '*' : '' }}
            {{dialogTableData.subUnit2Weight==0 ? '' : dialogTableData.subUnit2Weight +dialogTableData.subUnit2}}
            {{dialogTableData.subUnit2 != '' ? '/'+dialogTableData.subUnit : ''}}
            {{dialogTableData.subUnit2 != '' ? ')':'' }}
            {{dialogTableData.pieceunit != '' && dialogTableData.pieceunit != '筐(一次性)'?
            '('+scope.row.inPieceCount+dialogTableData.pieceunit+')' : '('+scope.row.inPieceCount+'筐)' }}
            {{scope.row.inBasketCount !=0 ? '|'+scope.row.inBasketCount : ''}}<font v-if="scope.row.inBasketCount !=0" style="color:#DF971A;">筐</font>
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
            {{scope.row.batchnumber+dialogTableData.subunit }}
            {{dialogTableData.subUnit2 != '' ? '(':'' }}
            {{dialogTableData.subUnit3Weight==0 ? '' :dialogTableData.subUnit3Weight +dialogTableData.subUnit3}}
            {{dialogTableData.subUnit3 !='' ? '*' : '' }}
            {{dialogTableData.subUnit2Weight==0 ? '' : dialogTableData.subUnit2Weight +dialogTableData.subUnit2}}
            {{dialogTableData.subUnit2 != '' ? '/'+dialogTableData.subUnit : ''}}
            {{dialogTableData.subUnit2 != '' ? ')':'' }}
            {{dialogTableData.pieceunit != '' && dialogTableData.pieceunit != '筐(一次性)'?
            '('+scope.row.piecenumber+dialogTableData.pieceunit+')' : '('+scope.row.piecenumber+'筐)' }}
            {{scope.row.basketnumber !=0 ? '|'+scope.row.basketnumber : ''}}<font v-if="scope.row.basketnumber !=0" style="color:#DF971A;">筐</font>
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
        <div style="margin-top:15px;">
          <el-button size="mini" @click="toAddBasket(1)">+ 购入筐子</el-button>
          <el-button size="mini" @click="toAddBasket(2)">+ 添加筐子</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ownBasketClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="ownBasketSubmit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择报溢筐子"
      :visible.sync="overFlowBasketDialog"
      width="30%"
      :before-close="overFlowBasketClose"
    >
      <div style="height:400px;overflow-y:scroll;">
        <div v-for="(item,index) in overFlowBasket" :key="'overflow' + index" style="margin-bottom:15px">
          <el-checkbox
            :indeterminate='item.isIndeterminate'
            v-model="item.checkAll"
            @change="overFlowBasketCheckAllChange(item.checkAll,index)">【{{ item.basketType }}】{{ item.basektName }}</el-checkbox>
          <div style="margin: 10px 0;"></div>
          <el-checkbox-group v-model="item.checkedBasket" @change="handleCheckedOverflowChange(item.checkedBasket,index)">
            <el-checkbox v-for="(coloritem,index) in item.basketColor" 
            :label="coloritem.color" :key="'color' + index">{{coloritem.color}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="overFlowBasketClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="overFlowBasketSubmit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="使用筐子"
      :visible.sync="showCheckedBasketDialog"
      width="50%"
      :before-close="showCheckedBasketDialogClose"
    >
      <div style="height:400px;overflow-y:scroll;">
        <h4>{{ goodMsg.name }}</h4>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="8">产地：{{ goodMsg.regionName }}</el-col>
          <el-col :span="8">级别/规格：{{ goodMsg.spec }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="8">入库时间：{{ toDate(showCheckedBasket.timestamp)}}</el-col>
          <el-col :span="8">入库类型：
            <em @click="toPageType(showCheckedBasket.batchsourcename)" type="text" size="mini" style="color:#1A7FD9;">
              {{showCheckedBasket.batchsourcename}}
            </em>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <h3>{{ showBasket.isQp }}&nbsp;&nbsp;&nbsp;筐子总数量：{{ sumbasketnums }}个</h3>
        <h4 style="margin-top:15px;">报溢筐子{{ sumoverflowtypenums }}种&nbsp;&nbsp;&nbsp;数量{{ sumoverflownums }}个</h4>
        <div v-for="(item,index) in over" :key="'showBasket1'+index" style="margin-top:15px;">
          <p>【{{item.basketType}}】{{item.basektName}}</p>
          <el-row style="margin-top:10px;margin-left:10px;" >
            <el-col :span="10" v-for="(coloritem,indexitem) in item.modellist" :key="'color1'+indexitem">
              [{{ coloritem.color }}]&nbsp;&nbsp;&nbsp;数量:{{coloritem.nums}}个
            </el-col>
          </el-row>
        </div>
        <h4 style="margin-top:15px;">使用自家筐子{{ sumowntypenums }}种&nbsp;&nbsp;&nbsp;数量{{ sumownnums }}个</h4>
        <div v-for="(item,index) in own" :key="'showBasket2'+index" style="margin-top:15px;">
          <p>【{{item.basketType}}】{{item.basektName}}</p>
          <el-row style="margin-top:10px;margin-left:10px;">
            <el-col :span="10" v-for="(coloritem,indexitem) in item.modellist" :key="'color2'+indexitem">
              [{{ coloritem.color }}]&nbsp;&nbsp;&nbsp;数量:{{coloritem.nums}}个
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="form.subUnit != '斤' && form.subUnit != '公斤' && form.subUnit != 'g' ? '批量计件' : '批量过磅'"
      :visible.sync="batchWeightDialog"
      width="50%"
      :before-close="batchWeightDialogClose"
    >
      <div style="height:400px;overflow-y:scroll;">
        <h3>{{ goodMsg.name }}</h3>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
          <el-col :span="6">级别/规格：{{ goodMsg.spec }}</el-col>
          <el-col :span="6">计算单位：{{ goodMsg.subUnit }}</el-col>
        </el-row>
        <el-row style="margin:10px 0px;" v-for="(item,index) in batchWeightArr" :key="'weight'+index" :gutter="30">
          <el-col :span="3" style="padding-top:5px;">计数{{ index+1 }}:</el-col>
          <el-col :span="6">
            <el-input v-model.number="item.num1" size="mini">
              <template slot="append">{{ goodMsg.subUnit }}</template>
            </el-input>
          </el-col>
          <el-col :span="6" v-if="form.pieceUnit != '无'">
            <el-input v-model.number="item.num2" size="mini">
              <template slot="append" :class="{font_styl2:form.pieceUnit == '筐(周转筐)'}">
                {{ form.pieceUnit == '筐(周转筐)' || '筐(一次性)' ? '筐' : form.pieceUnit }}
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="text" style="color:red;" @click="delbatchWeight(index)">移除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-button @click="addCount" size="mini">添加计数</el-button>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <span>
          {{ form.subUnit != '斤' && form.subUnit != '公斤' && form.subUnit != 'g' ? '计件总数:' : '过磅总数:'}}
          {{ getBatchWeightCount }}
          {{goodMsg.subUnit}}
        </span>
        <span v-if="form.pieceUnit != '无'" style="margin-right:15px;">({{getBatchWeightCount2}}{{ form.pieceUnit == '筐(周转筐)' || '筐(一次性)' ? '筐' : form.pieceUnit }})</span>
        <el-button @click="batchWeightDialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="batchWeightSubmit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </Page>
</template>
<script>
import moment  from 'moment';
import { getInfo } from '@/request/api/commodityDetail/index'
import { getBatch,getCarryBasket,getOverFlowBasket,getOwnBasket,submitOverFlow } from '@/request/api/theOverflow/index'
export default {
  name:'theOverflow',
  computed:{
    getBatchWeightCount(){
      let res = 0;
      for(let i=0;i<this.batchWeightArr.length;i++){
        res += this.batchWeightArr[i].num1
      }
      return res;
    },
    getBatchWeightCount2(){
      let res = 0;
      for(let i=0;i<this.batchWeightArr.length;i++){
        res += this.batchWeightArr[i].num2
      }
      return res;
    },
    getsumoverflow(){
      let res = 0
      for(let i=0;i<this.form.modellist.overflowbasker.length;i++){
        for(let j=0;j<this.form.modellist.overflowbasker[i].modellist.length;j++){
          res += this.form.modellist.overflowbasker[i].modellist[j].nums
        }
      }
      return res;
    },
    getsumown(){
      let res =0;
      for(let i=0;i<this.form.modellist.ownbasket.length;i++){
        for(let j=0;j<this.form.modellist.ownbasket[i].modellist.length;j++){
          res += this.form.modellist.ownbasket[i].modellist[j].nums
        }
      }
      return res;
    },
    getsumweight(){
      let overflow = 0;
      let own = 0;
      let res = 0;
      for(let i=0;i<this.form.modellist.overflowbasker.length;i++){
        for(let j=0;j<this.form.modellist.overflowbasker[i].modellist.length;j++){
          overflow += this.form.modellist.overflowbasker[i].modellist[j].weight * this.form.modellist.overflowbasker[i].modellist[j].nums;
        }
      }
      for(let i=0;i<this.form.modellist.ownbasket.length;i++){
        for(let j=0;j<this.form.modellist.ownbasket[i].modellist.length;j++){
          own += this.form.modellist.ownbasket[i].modellist[j].weight * this.form.modellist.ownbasket[i].modellist[j].nums;
        }
      }
      res = overflow + own
      return res;
    },
  },
  data() {
    var theOverflowPieceNums = (rule, value, callback)=>{
      if(this.form.pieceUnit == '筐(周转筐)'){
        if(value <= 0){
          callback(new Error('计件单位为筐(周转筐)时，报溢件数不能为0！'));
        }else{
          callback();
        }
      }
    };
    var validminnum = (rule, value, callback)=>{
      if(value <= 0){
        callback(new Error('数量不能为0！'));
      }else{
        callback();
      }
    };
    var validminweight = (rule, value, callback)=>{
      if(value <= 0){
        callback(new Error('重量不能为0！'));
      }else{
        callback();
      }
    };
    return{
      title:'商品报溢',
      overFlowBasket:[],
      ownBasket:[],
      ownBasketDialog:false,
      overFlowBasketDialog:false,
      pieceUnitoptions:[],
      form:{
        id:'',
        pieceUnit:'',
        theOverflowNums:0,
        theOverflowPieceNums:0,
        isQp:'去皮',
        modellist:{
          overflowbasker:[],
          ownbasket:[]
        },
      },
      rules:{
        pieceUnit:[{ required: true, message: '请选择计件单位！', trigger: 'change' },],
        theOverflowNums:[{ required: true, message: '请填写报溢数量！', trigger: 'blur' },],
        theOverflowPieceNums:[{ required: true, message: '请填写报溢件数！', trigger: 'blur' },{validator: theOverflowPieceNums,trigger:'blur'}],
        isQp:[{ required: true, message: '请选择是否去皮！', trigger: 'change' },],
        nums:[{ required: true, message: '请填写数量！', trigger: 'blur' },{validator: validminnum, trigger: 'blur'}],
        weight:[{ required: true, message: '请填写重量！', trigger: 'blur' },{validator: validminweight, trigger: 'blur'}]
      },
      editBatchMsg:{},
      editDialog:false,
      dialogTableData:{},
      dialogqueryData:{
        productId:this.$route.query.id,
        type:0,
        pageindex:1,
        pagesize:10,
        total:0
      },
      selectBatchDialog:false,
      remark:'',
      loading:true,
      checkedBatch:[],
      tableData:[],
      entrance:this.$route.type,
      goodMsg:{},
      editmsg:[],
      sumoverflowcount:0,
      sumbaksetover:0,
      sumbasketown:0,
      batchGetBasket:[],
      showCheckedBasket:{},
      showCheckedBasketDialog:false,
      showBasket:{},
      sumbasketnums:0,
      sumoverflowtypenums:0,
      sumoverflownums:0,
      sumowntypenums:0,
      sumownnums:0,
      over:[],
      own:[],
      batchWeightDialog:false,
      batchWeightArr:[]
    }
  },
  methods:{
    toPageType(type){
      this.$error('暂无该功能！')
    },
    toAddBasket(type){
      if(type == 1){
        this.$router.push({path:'/orderManagement/BasketBuyAdd'})
        this.ownBasketClose()
      }else{
        this.$router.push({path:'/frameManage/addSelfPurchaseBasket'})
        this.ownBasketClose()
      }
    },
    delbatchWeight(index){
      this.batchWeightArr.splice(index,1)
    },
    batchWeightSubmit(){
      this.form.theOverflowNums = this.getBatchWeightCount
      this.form.theOverflowPieceNums = this.getBatchWeightCount2
      this.batchWeightDialogClose();
    },
    addCount(){
      this.batchWeightArr.push({
        num1:0,
        num2:0
      })
    },
    batchWeightDialogClose(){
      this.batchWeightDialog = false;
      this.batchWeightArr=[];
    },
    batchWeight(){
      this.batchWeightDialog = true;
      this.batchWeightArr.push({
        num1:this.form.theOverflowNums,
        num2:this.form.theOverflowPieceNums
      })
    },
    getCheckRowBasketNum(val){
      let overflow = val.modellist.overflowbasker;
      let own = val.modellist.ownbasket;
      let sum1 = 0;
      let sum2 = 0;
      for(let i=0;i<overflow.length;i++){
        for(let j=0;j<overflow[i].modellist.length;j++){
          sum1 += overflow[i].modellist[j].nums
        }
      }
      for(let i=0;i<own.length;i++){
        for(let j=0;j<own[i].modellist.length;j++){
          sum2 += own[i].modellist[j].nums
        }
      }
      this.sumbasketnums = sum1 + sum2;
      this.sumoverflownums = sum1;
      this.sumoverflowtypenums = overflow.length;
      this.sumowntypenums = own.length;
      this.sumownnums = sum2;
    },
    showCheckedBasketDialogClose(){
      this.showCheckedBasketDialog = false;
    },
    openBasketDialog(row){
      this.showCheckedBasketDialog = true;
      this.showCheckedBasket = row
      for(let i=0;i<this.editmsg.length;i++){
        if(row.batchid == this.editmsg[i].id){
          this.showBasket = this.editmsg[i]
        }
      }
      this.getCheckRowBasketNum(this.showBasket);
      console.log(this.showBasket)
      this.over = this.showBasket.modellist.overflowbasker
      this.own = this.showBasket.modellist.ownbasket
    },
    cutIsQp(){
      // console.log(this.form)
      for(let i=0;i<this.form.modellist.overflowbasker.length;i++){
        for(let j=0;j<this.form.modellist.overflowbasker[i].modellist.length;j++){
          this.form.modellist.overflowbasker[i].modellist[j].weight = 0
        }
      }
      for(let i=0;i<this.form.modellist.ownbasket.length;i++){
        for(let j=0;j<this.form.modellist.ownbasket[i].modellist.length;j++){
          this.form.modellist.ownbasket[i].modellist[j].weight = 0
        }
      }
    },
    getSumTableData(val){
      let res = 0;
      let obj =0;
      let own = 0;
      for(let i=0;i<val.length;i++){
        if(val[i].overflowcount){
          res += val[i].overflowcount
        }
        if(val[i].overflowbasket){
          obj += val[i].overflowbasket
        }
        if(val[i].mybasket){
          own += val[i].mybasket
        }
      }
      this.sumoverflowcount = res;
      this.sumbaksetover = obj;
      this.sumbasketown = own;
    },
    basketDel(type,index1,index2){
      console.log(type,index1,index2)
      if(type == 1){
        console.log(this.form.modellist.overflowbasker[index1].modellist.length)
        if(this.form.modellist.overflowbasker[index1].modellist.length == 1){
          this.form.modellist.overflowbasker.splice(index1,1)
        }else{
          this.form.modellist.overflowbasker[index1].modellist.splice(index2,1)
        }
      }else{
        if(this.form.modellist.ownbasket[index1].modellist.length == 1){
          this.form.modellist.ownbasket.splice(index1,1)
        }else{
          this.form.modellist.ownbasket[index1].modellist.splice(index2,1)
        }
      }
    },
    goback(){
      // console.log(this.form.theOverflowNums - this.getsumweight)
      if(this.form.theOverflowNums - this.getsumweight > 0){
        this.loading = true;
        this.title = '商品报溢';
        this.editDialog = false;
        if(this.editmsg.length == 0){
          this.editmsg.push(this.form)
        }else{
          for(let i=0;i<this.editmsg.length;i++){
            if(this.form.id == this.editmsg[i].id){
              this.editmsg[i] = this.form
              break
            }
          }
        }
        let obj = this.editmsg.map(item=>{
          return item.id
        })
        if(obj.indexOf(this.form.id) == -1){
          this.editmsg.push(this.form)
        }
        console.log(this.editmsg)
        for(let i=0;i<this.tableData.length;i++){
          if(this.form.id == this.tableData[i].batchid){
            this.tableData[i].overflowcount = this.form.theOverflowNums
            this.tableData[i].overflowbasket = this.getsumoverflow
            this.tableData[i].mybasket = this.getsumown
          }
        }
        this.getSumTableData(this.tableData);
        console.log(this.tableData)
        this.form = {
          id:'',
          pieceUnit:'',
          theOverflowNums:0,
          theOverflowPieceNums:0,
          isQp:'去皮',
          modellist:{
            overflowbasker:[],
            ownbasket:[]
          },
        },
        this.overFlowBasket=[],
        this.ownBasket=[],
        setTimeout(()=>{this.loading = false},1000)
      }else{
        this.$error('报溢净重必须大于0！(去皮情况下 报溢数量 - 筐子总重量 必须大于0！)请修改 报溢数量 或 筐子重量 使其符合要求！')
      }
    },
    submit(type){
      let isSubmit = false;
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].overflowcount){
          isSubmit = true
        }else{
          isSubmit = false;
          this.$error('所选批次（编号'+  (i+1)  +'）尚未编辑，请编辑后提交')
        }
      }
      if(isSubmit){
        let res = {
          remark:this.remark,
          DamagedLsit:[]
        }
        console.log(this.editmsg)
        for(let i=0;i<this.editmsg.length;i++){
          res.DamagedLsit.push({
            overflowcount:this.editmsg[i].theOverflowNums,
            productbatchid:this.editmsg[i].id,
            pieceNumber:this.editmsg[i].theOverflowPieceNums,
            isPell:this.editmsg[i].isQp == '去皮' ? 1 : 2,
            modellist:[],
          })
          for(let j=0;j<this.editmsg[i].modellist.overflowbasker.length;j++){
            for(let k=0;k<this.editmsg[i].modellist.overflowbasker[j].modellist.length;k++){
              res.DamagedLsit[i].modellist.push({
                name:this.editmsg[i].modellist.overflowbasker[j].basketType,
                userBasketName:this.editmsg[i].modellist.overflowbasker[j].basektName,
                userbasketid:this.editmsg[i].modellist.overflowbasker[j].basketId,
                type:3,
                basketWeight:this.editmsg[i].modellist.overflowbasker[j].modellist[k].weight,
                overflownumber:this.editmsg[i].modellist.overflowbasker[j].modellist[k].nums,
                userBasketColor:this.editmsg[i].modellist.overflowbasker[j].modellist[k].color
              })
            }
          }
          for(let j=0;j<this.editmsg[i].modellist.ownbasket.length;j++){
            for(let k=0;k<this.editmsg[i].modellist.ownbasket[j].modellist.length;k++){
              res.DamagedLsit[i].modellist.push({
                name:this.editmsg[i].modellist.ownbasket[j].basketType,
                userBasketName:this.editmsg[i].modellist.ownbasket[j].basektName,
                userbasketid:this.editmsg[i].modellist.ownbasket[j].basketId,
                type:1,
                basketWeight:this.editmsg[i].modellist.ownbasket[j].modellist[k].weight,
                overflownumber:this.editmsg[i].modellist.ownbasket[j].modellist[k].nums,
                userBasketColor:this.editmsg[i].modellist.ownbasket[j].modellist[k].color
              })
            }
          }
        }
        submitOverFlow(res).then(resp=>{
          if(resp.status == 200){
            this.$success('报溢成功！')
            if(type == 1){
              this.$router.push({path:'overstatementDetails',query:{id:this.$route.query.id}})
              this.$closePage();
            }else{
              this.$closePage();
              this.$router.push({path:'commodityList'})
            }
          }else if(resp.status == -6){
            
          }
        })
      }
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
      this.form.modellist.ownbasket = res;
      this.ownBasketClose();
    },
    overFlowBasketSubmit(){
      let res = []
      for(let i=0;i<this.overFlowBasket.length;i++){
        if(this.overFlowBasket[i].checkedBasket.length>0){
          res.push({
            basektName:this.overFlowBasket[i].basektName,
            basketColor:this.overFlowBasket[i].basketColor,
            basketId:this.overFlowBasket[i].basketId,
            basketType:this.overFlowBasket[i].basketType,
            checkAll:this.overFlowBasket[i].checkAll,
            checkedBasket:this.overFlowBasket[i].checkedBasket,
            isIndeterminate:this.overFlowBasket[i].isIndeterminate,
            modellist:[]
          })
        }
      }
      for(let i=0;i<res.length;i++){
        for(let j=0;j<res[i].checkedBasket.length;j++){
          res[i].modellist.push({
            color:res[i].checkedBasket[j],
            nums:0,
            weight:0
          })
        }
      }
      console.log(res)
      this.form.modellist.overflowbasker = res;
      this.overFlowBasketClose();
    },
    ownBasketCheckAllChange(val,index){
      this.ownBasket[index].checkedBasket = val ? this.ownBasket[index].basketColor.map(item=>{return item.basketcolor}) : [];
      this.ownBasket[index].isIndeterminate = false;
    },
    handleCheckedOwnChange(val,index){
      let checkedCount = val.length;
      this.ownBasket[index].checkAll = checkedCount === this.ownBasket[index].basketColor.length;
      this.ownBasket[index].isIndeterminate = checkedCount > 0 && checkedCount < this.ownBasket[index].basketColor.length;
    },
    overFlowBasketCheckAllChange(val,index){
      this.overFlowBasket[index].checkedBasket = val ? this.overFlowBasket[index].basketColor.map(item=>{return item.color}) : [];
      this.overFlowBasket[index].isIndeterminate = false;
    },
    handleCheckedOverflowChange(val,index){
      let checkedCount = val.length;
      this.overFlowBasket[index].checkAll = checkedCount === this.overFlowBasket[index].basketColor.length;
      this.overFlowBasket[index].isIndeterminate = checkedCount > 0 && checkedCount < this.overFlowBasket[index].basketColor.length;
    },
    overFlowBasketClose(){
      this.overFlowBasketDialog = false;
    },
    ownBasketClose(){
      this.ownBasketDialog = false;
    },
    getOverFlowBasket(){
      this.overFlowBasketDialog = true;
      let res = { categoryId:this.goodMsg.categoryThird }
      getOverFlowBasket(res).then(resp=>{
        // this.overFlowBasket = resp.data
        let obj = resp.data
        if(obj.length != this.overFlowBasket.length){
          this.overFlowBasket = [];
          for(let i=0;i<obj.length;i++){
            this.overFlowBasket.push({
              basketId:obj[i].basketId,
              basketType:obj[i].basketType,
              basektName:obj[i].basektName,
              basketColor:[],
              checkAll:false,
              isIndeterminate:true,
              checkedBasket:[]
            })
            for(let j=0;j<obj[i].basketColor.length;j++){
              this.overFlowBasket[i].basketColor.push({
                color:obj[i].basketColor[j],
                id:obj[i].basketId+obj[i].basketColor[j]
              })
            }
          }
        }
      })
    },
    getOwnBasket(){
      this.ownBasketDialog = true;
      let res = { categoryname:this.goodMsg.categoryThird }
      getOwnBasket(res).then(resp=>{
        // this.ownBasket = resp.data
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
    handelEdit(val,index){
      this.loading = true;
      let batchGetBasket = { productId:this.$route.query.id,batchId:[this.editBatchMsg.batchid] }
      getCarryBasket(batchGetBasket).then(resp=>{
        this.batchGetBasket = resp.data
      })
      this.title = '编辑批次'+(index+1)
      this.editBatchMsg = val;
      this.form.id = this.editBatchMsg.batchid;
      this.editDialog = true;
      this.pieceUnitoptions = [];
      this.pieceUnitoptions = [{value:'筐(周转筐)',label:'筐(周转筐)'}]
      if(this.goodMsg.pieceUnit == ''){
        this.pieceUnitoptions.push({value:'无',label:'无'})
      }else{
        this.pieceUnitoptions.push({value:this.goodMsg.pieceUnit,label:this.goodMsg.pieceUnit})
      }
      this.form.pieceUnit = this.goodMsg.pieceUnit == '' ? '无' : this.goodMsg.pieceUnit;
      if(this.editmsg.length > 0){
        for(let i=0;i<this.editmsg.length;i++){
          // console.log(this.form.id,'++++'+this.editmsg[i].id,this.editmsg)
          if(this.form.id == this.editmsg[i].id){
            this.form = this.editmsg[i]
          }
        }
      }
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    del(id){
      for(let i=0;i<this.tableData.length;i++){
        if(this.tableData[i].batchid == id){
          this.tableData.splice(i,1);
          this.editmsg.splice(i,1);
        }
      }
    },
    getRowKeys(row){
      return row.batchid;
    },
    confirmChecked(){
      this.tableData = this.checkedBatch
      this.selectBatchDialogClose()
    },
    handleSizeChange(){},
    handleCurrentChange(val){
      this.dialogqueryData.pageindex = val; 
      this.getBatchMsg();
    },
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
    toDate(val){
      return moment(val*1000).format('YYYY-MM-DD HH:mm:ss');
    },
    getBatchMsg(){
      getBatch(this.dialogqueryData).then(resp=>{
        // console.log(resp.data[0])
        this.dialogTableData = resp.data[0];
        this.dialogqueryData.total = resp.data[0].sumCount;
        this.checkedBatch = this.tableData;
        if(this.tableData.length > 0){
          // console.log(this.tableData)
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
    selectBatchDialogClose(){
      this.selectBatchDialog = false;
      this.checkedBatch = [];
      setTimeout(()=>{this.dialogTableData= [];},1000)
      this.$refs.batchTable.clearSelection()
      // this.$router.push({path:'commodityList'})
    },
    getTableData(){
      if(this.entrance == '商品列表'){
        this.tableData = []
      }
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    getgoods(){
      if(this.$route.query.type == '批次详情'){
        getBatch(this.dialogqueryData).then(resp=>{
          let res = resp.data[0].modelList
          for(let i=0;i<res.length;i++){
            if(res[i].batchid == this.$route.query.id2){
              this.tableData[0] = res[i]
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
        this.goodMsg = resp.data[0]
      })
      this.getTableData();
    }
  },
  created(){
    this.getgoods();
  },
}
</script>
<style scoped lang='scss'>
.btn_style{
  border: 1px solid #0BA198;
  color:#0BA198;
}
.btn_opsition{
  position: absolute;
  right:0px;
  top:42px;
}
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
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0,0,0,0.8500);
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
.btn_styl2{
  border:1px solid rgba(101,85,183,0.5000);
  color: #6555B7;
  background-color:#EDE9F7;
}
.font_styl2{
  color:red;
}
</style>