<template>
  <Page v-loading="loading">
    <div v-if="editPage" style="padding:15px;">
      <h3 style="margin-bottom:15px;">客户信息</h3>
      <el-radio-group v-model="userType" @change="checkUserType" style="margin-bottom:15px;">
        <el-radio :label="1">平台</el-radio>
        <el-radio :label="2">非平台</el-radio>
      </el-radio-group>
      <el-form :model="form" :rules="rules" ref="form" inline label-position="left">
        <el-form-item label="客户姓名" prop="toUserName" label-width="30%">
          <el-select
            v-if="userType == 1"
            v-model="form.toUserName" 
            placeholder="请选择或输入" 
            @change="getPhone"
            clearable 
            filterable 
            @blur="selectnameBlur">
            <el-option
              v-for="item in userMsgOptions"
              :key="item.userId"
              :label="item.personName"
              :value="item.userId">
              <span style="float: left">{{ item.personName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phoneNumber }}</span>
            </el-option>
          </el-select>
          <el-select
            v-if="userType == 2"
            v-model="form.toUserName" 
            placeholder="请选择或输入" 
            @change="getPhone" 
            clearable 
            filterable 
            @blur="selectnameBlur">
            <el-option
              v-for="(item,index) in userMsgOptions"
              :key="index"
              :label="item.cusname"
              :value="item.phonenumber">
              <span style="float: left">{{ item.cusname }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phonenumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="toUserPhone" label-width="30%" v-if="isShowPhone(form.toUserPhone)">
          <el-input v-model="form.toUserPhone"></el-input>
        </el-form-item>
        <el-form-item label="售出时间" prop="timestamp" label-width="30%" v-if="userType == 2">
          <el-date-picker
            v-model="form.timestamp"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <h3>筐子信息</h3>
        <div v-for="(basketitem,nums) in form.basket" :key="'basketEdit' + nums"
          style="margin-bottom: 20px;"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="种类" label-width="100%">
                {{basketitem.name}}
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="颜色" label-width="100%">
                {{basketitem.color}}
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button type="text" style="color:red;" @click="delbasketMsg(nums)">移除</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="数量" label-width="100%"
                :prop="'basket.' + nums  + '.count'"
                :rules="[{required: true, message: '请输入', trigger: 'blur'}]"
              >
                <el-input style="width:80%" v-model="basketitem.count" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
                  <template slot="append">个</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价格" label-width="100%" 
                :prop="'basket.' + nums  + '.price'"
                :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
                <el-input v-model="basketitem.price"  style="width:80%"
                onkeyup="this.value=this.value.match(/\d+\.?\d{0,2}/);this.dispatchEvent(new Event('input'))"
                >
                  <template slot="append">元/个</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="金额小计" label-width="100%">
                {{basketitem.count * basketitem.price}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-button style="background-color:#0BA198;color:#fff;" @click="addBasketBtn">+ 添加筐子</el-button>
        <el-dialog
          title="添加筐子"
          :visible.sync="addBasketDialog"
          width="30%"
          :before-close="handleClose"
        >
          <div style="height:400px;overflow-y:scroll;">
            <div v-for="(item,index) in basketMsg" :key="'basket' + index" style="margin-bottom:15px">
              <el-checkbox 
              :indeterminate="item.isIndeterminate" 
              v-model="item.checkAll" 
              @change="handleCheckAllChange(item.checkAll,index)">{{item.name}}</el-checkbox>
              <div style="margin: 10px 0;"></div>
              <el-checkbox-group v-model="item.checkedBasket" @change="handleCheckedCitiesChange(item.checkedBasket,index)">
                <el-checkbox v-for="(coloritem,index) in item.color" 
                :label="coloritem" :key="'color' + index">{{coloritem}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addBasketDialog = false">取 消</el-button>
            <el-button type="primary" @click="selectBasketSubmit">确 定</el-button>
          </span>
        </el-dialog>
      </el-form>
      <h3 style="margin-top:15px;margin-bottom:15px;">备注信息</h3>
      <el-input type="textarea" placeholder="请输入" v-model="form.remark" resize="none" :autosize="minMax"></el-input>
      <div style="height:100px;"></div>
      <div class="page_footer">
        金额总计: <span style="color:red;font-size: 20px;font-weight: 600;">{{ getprice }}元</span>
        <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" @click="submit">提交订单</el-button>
      </div>
    </div>
    <!-- #################################################################################################### -->
    <div v-if="checkPage">
      <h3 style="margin-bottom:15px;">客户信息</h3>
      <el-row>
        <el-col :span="7">
          客户姓名:{{ form.toUserName }}
          <el-tag type="success" v-if="userType == 1">平</el-tag>
          <el-tag type="danger" v-if="userType == 2">非</el-tag>
        </el-col>
        <el-col :span="7">
          客户电话:{{ form.toUserPhone }}
        </el-col>
        <el-col :span="7" v-if="userType == 2">
          售出时间:{{ toDate(form.timestamp) }}
        </el-col>
        <el-col :span="3"><el-button @click="back">返回</el-button></el-col>
      </el-row>
      <h3>筐子信息</h3>
      <el-table :data="form.basket" border :span-method="objectSpanMethod">
        <el-table-column label="筐子种类" prop="name"></el-table-column>
        <el-table-column label="颜色" prop="color"></el-table-column>
        <el-table-column label="单价（元/个）" prop="price"></el-table-column>
        <el-table-column label="数量（个）" prop="count"></el-table-column>
        <el-table-column label="金额（元）">
          <template slot-scope="scope">
            {{scope.row.count * scope.row.price}}
          </template>
        </el-table-column>
      </el-table>
      <div style="border:1px solid #E4E7ED;padding: 10px;margin-bottom: 15px;">
        <el-row>
          <el-col :span="14">
            <span>总计:{{ getTypeNum() }}种</span>
          </el-col>
          <el-col :span="5" style="text-align:right;">
            <span>{{ count }}</span>
          </el-col>
          <el-col :span="5" style="text-align:right;color:red;">
            <span>{{ getprice }}</span>
          </el-col>
        </el-row>
      </div>
      备注:{{ form.remark }}
      <div style="height:100px;"></div>
      <div class="page_footer">
        金额总计: <span style="color:red;font-size: 20px;font-weight: 600;">{{ getprice }}元</span>
        <el-button style="border:1px solid #0BA198;color:#0BA198;margin-left: 15px;">确认并付款</el-button>
        <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" @click="summitBack">确认并返回</el-button>
      </div>
    </div>
  </Page>
</template>
<script>
import moment  from 'moment';
import { getUser,getFUser } from '@/request/api/basketSold/index.js'
import { getBasket,getAdd } from '@/request/api/basketBuy/index.js'
export default{
  computed:{
    getprice(){
      let obj = this.form.basket;
      let res = 0;
      for(let i=0;i<obj.length;i++){
        res += Number(obj[i].price) * Number(obj[i].count)
      }
      return  res ? res : 0;
    },
  },
  data(){
    return{
      count:0,
      minMax:{ minRows: 3, maxRows: 6},
      basketMsgShow:[],
      basketMsg:[],
      addBasketDialog:false,
      loading:false,
      userMsgOptions:[],
      userType:1,
      editPage:true,
      checkPage:false,
      form:{
        type: 2, 
        toUserId:'',
        toUserName:'',
        toUserPhone:'',
        timestamp:'',
        basket:[],
        remark:''
      },
      rules:{
        toUserName:[{required: true, message: ' ', trigger: 'blur'}],
        toUserPhone:[{required: true, message: ' ', trigger: 'blur'}],
        timestamp:[{required: true, message: ' ', trigger: 'blur'}]
      }
    }
  },
  methods:{
    isShowPhone(val){
      //10000000000
      if(val == '10000000000'){
        return false;
      }else{
        return true;
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
     // 判断哪一列 如果需要处理多了 使用 || 进行处理即可
      if (columnIndex === 0) {
        const _row = this.flitterData(this.form.basket).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    flitterData(arr) {
      let spanOneArr = [];
      let concatOne = 0;
      arr.forEach((item, index) => {
        // console.log(item, index);
        if (index === 0) {
          spanOneArr.push(1);
        } else {
        //注意这里的data是表格绑定的字段，根据自己的需求来改
          if (item.basketId === arr[index - 1].basketId) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
      };
    },
    summitBack(){
      this.$confirm('是否确认此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getAdd(this.form).then(resp=>{
          if(resp.status == 200){
              this.$router.push({path:'basketBuy'});
              this.$closePage();
              this.$success('新建成功！')
          }else if(resp.status == -6){
            this.$error('库存不足！')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      })
    },
    getCount(){
      let obj = this.form.basket;
      let res = 0;
      // console.log(obj)
      for(let i=0;i<obj.length;i++){
        res += Number(obj[i].count) 
      }
      // console.log(res)
      this.count = res
    },
    getTypeNum(){
      let obj = this.form.basket
      let res = []
      for(let i=0;i<obj.length;i++){
        // console.log(obj[i].name)
        res.push(obj[i].name)
      }
      // console.log(res);
      let num = [...new Set(res)]
      return num.length;
    },
    toDate(val){
      return moment(val).format('YYYY-MM-DD')
    },
    back(){
      this.editPage = true;
      this.checkPage = false;
    },
    submit(){
      console.log(this.form);
      if(this.form.basket.length > 0){
        this.$refs.form.validate((valid)=>{
          if(valid){
            this.editPage = false;
            this.checkPage = true;
            this.getTypeNum();
            this.getCount();
            if(this.userType == 1){
              for(let i=0;i<this.userMsgOptions.length;i++){
                if(this.userMsgOptions[i].userId == this.form.toUserId){
                  this.form.toUserName = this.userMsgOptions[i].personName
                }
              }
            }else{
              for(let i=0;i<this.userMsgOptions.length;i++){
                if(this.userMsgOptions[i].phonenumber == this.form.toUserPhone){
                  this.form.toUserName = this.userMsgOptions[i].cusname
                }
              }
            }
          }
        })
      }else{
        this.$error('请选择筐子')
      }
    },
    delbasketMsg(index){
      this.form.basket.splice(index,1);
    },
    handleCheckedCitiesChange(val,index){
      let checkedCount = val.length;
      this.basketMsg[index].checkAll = checkedCount === this.basketMsg[index].color.length;
      this.basketMsg[index].isIndeterminate = checkedCount > 0 && checkedCount < this.basketMsg[index].color.length;
    },
    handleCheckAllChange(val,index){
      this.basketMsg[index].checkedBasket = val ? this.basketMsg[index].color : [];
      this.basketMsg[index].isIndeterminate = false;
    },
    selectBasketSubmit(){
      // this.handleClose();
      // console.log(this.basketMsg)
      let res = []
      for(let i=0;i<this.basketMsg.length;i++){
        if(this.basketMsg[i].checkedBasket.length > 0){
          // console.log(this.basketMsg[i].name,this.basketMsg[i].checkedBasket)
          for(let j=0;j<this.basketMsg[i].checkedBasket.length;j++){
            // console.log(this.basketMsg[i])
            res.push({
              basketId:this.basketMsg[i].basketId,
              name:this.basketMsg[i].name,
              price:this.basketMsg[i].price,
              count:this.basketMsg[i].count,
              color:this.basketMsg[i].checkedBasket[j]
            })
          }
        }
      }
      // console.log(res)
      this.form.basket = res;
      this.handleClose();
    },
    handleClose(){
      this.addBasketDialog = false
    },
    addBasketBtn(){
      this.basketMsg = [];
      this.addBasketDialog = true
      let res = {type:'0',pagesize:0,pageindex:0}
      getBasket(res).then(resp=>{
        // console.log(resp.data[0].basketList)
        let obj = resp.data[0].basketList
        for(let i=0;i<obj.length;i++){
          this.basketMsg.push({
            basketId:obj[i].systeambasketId,
            name:obj[i].typeName,
            price:null,
            count:null,
            color:obj[i].applytoColor,
            checkAll:false,
            isIndeterminate:true,
            checkedBasket:[],
          })
        }
        for(let j=0;j<this.basketMsg.length;j++){
          this.basketMsg[j].color = this.basketMsg[j].color.split('、')
        }
        // console.log(this.basketMsg)
      })
    },
    checkUserType(){
      this.loading = true;
      console.log(this.userType)
      this.form.toUserName = '';
      this.form.toUserId = '';
      this.form.toUserPhone = '';
      this.form.timestamp = '';
      this.userMsgOptions = [];
      this.getUserMsg();
      this.loading = false;
    },
    getPhone(val){
      if(this.userType == 1){
        this.form.toUserId = val;
        this.form.toUserPhone = ''
        for(let i=0;i<this.userMsgOptions.length;i++){
          if(this.form.toUserId == this.userMsgOptions[i].userId){
            this.form.toUserPhone = this.userMsgOptions[i].phoneNumber
          }
        }
      }else{
        this.form.toUserId = '';
        this.form.toUserPhone = val;
        // for(let i=0;i<this.userMsgOptions.length;i++){
        //   if(this.form.toUserName == this.userMsgOptions[i].cusname){
        //     this.form.toUserPhone = this.userMsgOptions[i].phonenumber
        //   }
        // }
      }
    },
    
    selectnameBlur(e){
      this.form.toUserName = e.target.value
    },
    getUserMsg(){
      if(this.userType == 1){
        let res = {search:'',modelType:1,pageindex:0,pagesize:0}
        getUser(res).then(resp=>{
          // console.log(resp)
          this.userMsgOptions = resp.data
          // console.log(this.userMsgOptions)
        })
      }else{
        let res = {cusName:'',phoneNumber:'',modelType:1}
        getFUser(res).then(resp=>{
          console.log(resp.data)
          this.userMsgOptions = resp.data
        })
      }
    },
  },
  created(){
    this.getUserMsg();
  },
}
</script>
<style lang="scss" scoped>
.page_footer{
  width: 100%;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #E4E7ED;
  // height: 20px;
  position:fixed;
  bottom: 13px;
  padding:15px;
  right:20px;
}
</style>