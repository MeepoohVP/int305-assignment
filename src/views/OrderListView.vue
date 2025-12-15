<script setup>
import OrderCard from "@/components/OrderCard.vue";
import db from "@/firebase/init";
import {
  collection,
  count,
  getAggregateFromServer,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { onMounted, ref } from "vue";

const countOrder = ref(0);

const start = new Date();
start.setHours(0, 0, 0, 0);

const end = new Date();
end.setHours(23, 59, 59, 999);

onMounted(async () => {
  const countSnapshot = await getAggregateFromServer(
    query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end))
    ),
    {
      countOrder: count("id"),
    }
  );
  countOrder.value = countSnapshot.data().countOrder;
});
</script>
<template>
  <div class="p-4">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title">ออเดอร์วันนี้</div>
        <div class="stat-value">{{ countOrder }} รายการ</div>
        <!-- <div class="stat-desc">21% more than last month</div> -->
      </div>
    </div>
    <div class="grid grid-cols-5">
        <OrderCard/>
    </div>
  </div>
</template>
<style scoped></style>
