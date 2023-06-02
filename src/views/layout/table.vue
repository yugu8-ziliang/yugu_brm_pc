<template>
  <TableContainer
    :page-size="pageSize"
    :total="total"
    :page-num="pageNum"
    @pagination="handlePagination"
    @search="handleSearch"
    @reset="handleReset"
  >
    <template slot="search">
      <el-form inline :model="queryData" label-width="80px" ref="search-form">
        <el-form-item label="姓名">
          <el-input v-model.trim="queryData.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.trim="queryData.tel"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="正常" value></el-option>
            <el-option label="冻结" value></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" v-if="isOpen">
          <el-date-picker
            v-model="queryData.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="search-action">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset"
          >重置</el-button
        >
        <el-button
          type="text"
          :icon="`el-icon-arrow-${isOpen ? 'up' : 'down'}`"
          @click="openSearch"
          >{{ isOpen ? "收起" : "展开" }}</el-button
        >
      </div>
    </template>
    <template slot="action-bar">
      <el-button type="primary" @click="toPage('add')">新增</el-button>
      <el-button type="success">成功</el-button>
      <el-button type="danger">删除</el-button>
      <el-button type="warning">警告</el-button>
      <el-button type="info">信息</el-button>
    </template>
    <el-table :data="tableData" border height="100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="text" @click="toPage('edit')">编辑</el-button>
          <el-button type="text" @click="toPage('view')">查看</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </TableContainer>
</template>

<script>
import { parseTime } from "@/utils/common";
export default {
  name: "Table-layout",
  data() {
    return {
      queryData: {},
      pageNum: 1,
      pageSize: 20,
      total: 100,
      isOpen: false,
    };
  },
  computed: {
    tableData() {
      let data = [],
        date = parseTime(new Date(), "{y}-{m}-{d}");
      for (let i = 0; i < 20; i++) {
        data.push({
          id: i,
          date: date,
          name: "姓名" + i,
          address: "上海市xx区xx路xx号xxx室",
        });
      }
      return data;
    },
  },
  methods: {
    handlePagination(e) {
      this.$info(`当前页：${e.pageNum}；每页条数：${e.pageSize}`);
    },
    handleSearch(e) {
      this.$info(`触发搜索方法`);
    },
    handleReset(e) {
      this.$info(`触发重置方法`);
    },
    toPage(type) {
      this.$router.push(`/table/add?type=${type}`);
    },
    openSearch() {
      this.isOpen = !this.isOpen;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
