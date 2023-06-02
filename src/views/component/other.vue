<!-- <template>
    <Page>
        <div class="other-main">
            <div class="item">
                <div class="header">Drawer二次封装</div>
                <el-button @click="visible = true">打开抽屉</el-button>
            </div>
            <div class="item">
                <div class="header">Dialog二次封装</div>
                <el-button @click="visible2 = true">打开Dialog</el-button>
            </div>
            <div class="item">
                <div class="header">复制clipboard</div>
                <el-input
                    v-model="value"
                    placeholder="请输入内容"
                    style="width: 300px"
                >
                    <el-button
                        type="primary"
                        slot="append"
                        @click="copy($event)"
                        >复制</el-button
                    >
                </el-input>
            </div>
            <div class="item">
                <div class="header">省市区</div>
                <Provinces v-model="provinces" ref="provinces"></Provinces>
                <el-button @click="getLabels">获取label</el-button>
                <div class="result">
                    {{ !areaLables ? "请选择省市区" : areaLables }}
                </div>
            </div>
            <div class="item">
                <div class="header">tree样式重写</div>
                <el-tree
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :props="defaultProps"
                    default-expand-all
                    class="tree"
                >
                </el-tree>
                <div class="result">添加class="tree"</div>
            </div>
        </div>
        <Drawer
            :visible.sync="visible"
            v-loading="loading"
            element-loading-text="拼命加载中"
            title="抽屉"
            :before-close="beforeClose"
            @confirm="confirm"
        ></Drawer>
        <Dialog
            :visible.sync="visible2"
            title="Dialog"
            v-loading="loading2"
            element-loading-text="拼命加载中"
            :before-close="beforeClose2"
            @confirm="confirm2"
        >
        </Dialog>
    </Page>
</template>

<script>
import clipboard from "@/utils/clipboard";
import Provinces from "@/components/Provinces";
export default {
    name: "other",
    data() {
        return {
            visible: false,
            visible2: false,
            loading: false,
            loading2: false,
            value: "",
            provinces: [],
            areaLables: undefined,
            data: [
                {
                    id: 1,
                    label: "一级 1",
                    children: [
                        {
                            id: 4,
                            label: "二级 1-1",
                            children: [
                                {
                                    id: 9,
                                    label: "三级 1-1-1",
                                },
                                {
                                    id: 10,
                                    label: "三级 1-1-2",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    label: "一级 2",
                    children: [
                        {
                            id: 5,
                            label: "二级 2-1",
                        },
                        {
                            id: 6,
                            label: "二级 2-2",
                        },
                    ],
                },
                {
                    id: 3,
                    label: "一级 3",
                    children: [
                        {
                            id: 7,
                            label: "二级 3-1",
                        },
                        {
                            id: 8,
                            label: "二级 3-2",
                        },
                    ],
                },
            ],
            defaultProps: {
                children: "children",
                label: "label",
            },
        };
    },
    components: {
        Provinces,
    },
    methods: {
        beforeClose(done) {
            this.$confirm("是否关闭?", "关闭抽屉回调", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$success(`关闭弹窗！`);
                    done();
                })
                .catch(() => {
                    this.$info(`已取消关闭`);
                });
        },
        beforeClose2(done) {
            this.$confirm("是否关闭?", "关闭Dialog回调", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$success(`关闭弹窗！`);
                    done();
                })
                .catch(() => {
                    this.$info(`已取消关闭`);
                });
        },
        confirm() {
            let self = this;
            self.loading = true;
            self.$success(`触发确定按钮方法`);
            setTimeout(() => {
                self.loading = false;
                self.visible = false;
                self.$success(`操作成功！`);
            }, 3000);
        },
        confirm2() {
            let self = this;
            self.loading2 = true;
            self.$success(`触发确定按钮方法`);
            setTimeout(() => {
                self.loading2 = false;
                self.visible2 = false;
                self.$success(`操作成功！`);
            }, 3000);
        },
        copy(event) {
            clipboard(this.value, event);
        },
        getLabels() {
            this.areaLables = this.$refs["provinces"].getLabels();
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.other-main {
    .item {
        margin-bottom: 20px;
        .header {
            height: 60px;
            display: flex;
            align-items: center;
            font-size: 22px;
            color: #1f2f3d;
        }
        .result {
            height: 100px;
            background-color: #f5f5f5;
            margin-top: 20px;
            width: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
        }
    }
}
</style> -->

<template>
    <div id="payPwd">
    <div style="text-align: center">
      支付密码设置
    </div>
    <input ref="pwd" type="password" maxlength="6" v-model="msg"  style="position: absolute;z-index: -1;left:-100%;opacity: 0"/>
    <ul class="pwd-wrap" @click="focus">
      <li><i v-if="msgLength > 0"></i></li>
      <li><i v-if="msgLength > 1"></i></li>
      <li><i v-if="msgLength > 2"></i></li>
      <li><i v-if="msgLength > 3"></i></li>
      <li><i v-if="msgLength > 4"></i></li>
      <li><i v-if="msgLength > 5"></i></li>
    </ul>
  </div>
</template>

<script>
 export default {
    components: {
    },
    data () {
      return {
        msg:'',
        msgLength:0,
      }
    },
    created() {
    },
    computed: {
    },
    watch:{
      msg(curVal){
        if(/[^\d]/g.test(curVal)){
          this.msg = this.msg.replace(/[^\d]/g,'');
        }else{
            this.msgLength = curVal.length;
        }
      },
    },
    methods: {
      focus(){
          this.$refs.pwd.focus();
      },
    }
  }
</script>

<style lang="scss">
#payPwd .pwd-wrap{
    width: 90%;
    height: 44px;
    padding-bottom: 1px;
    margin: 0 auto;
    background: #fff;
    border:1px solid #ddd;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    cursor: pointer;
  }
  .pwd-wrap li{
    list-style-type:none;
    text-align: center;
    line-height: 44px;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-flex: 1;
    border-right:1px solid #ddd ;
  }
  .pwd-wrap li:last-child{
    border-right: 0;
  }
  .pwd-wrap li i{
    height: 10px;
    width: 10px;
    border-radius:50% ;
    background: #000;
    display: inline-block;
  }
</style>