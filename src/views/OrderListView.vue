<script setup>
import OrderCard from "@/components/OrderCard.vue";
import db from "@/firebase/init";
import {
  and,
  collection,
  count,
  getAggregateFromServer,
  onSnapshot,
  orderBy,
  query,
  sum,
  Timestamp,
  where,
} from "firebase/firestore";
import { onMounted, ref } from "vue";

const countOrder = ref(0);
const sumIncome = ref(0);
const orders = ref([]);
const statusList = [
  "Open",
  "Paid",
  "Waiting_for_Service",
  "Ready_for_Billing",
  "Canceled",
];

function getDayRange(offsetStart = 0, offsetEnd = 0) {
  const start = new Date();
  start.setDate(start.getDate() - offsetStart);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() - offsetEnd);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

const last7Day = getDayRange(7, 0);

onMounted(async () => {
  const orderCollection = collection(db, "orders");
  const countSnapshot = await getAggregateFromServer(
    query(
      orderCollection,
      where("createdAt", ">=", Timestamp.fromDate(last7Day.start)),
      where("createdAt", "<=", Timestamp.fromDate(last7Day.end))
    ),
    {
      countOrder: count("id"),
    }
  );
  countOrder.value = countSnapshot.data().countOrder;

  const sumIncomeSnapshot = await getAggregateFromServer(
    query(
      orderCollection,
      and(
        where("isPaid", "==", true),
        where("createdAt", ">=", Timestamp.fromDate(last7Day.start)),
        where("createdAt", "<=", Timestamp.fromDate(last7Day.end))
      )
    ),
    {
      sumIncome: sum("totalPrice"),
    }
  );
  sumIncome.value = sumIncomeSnapshot.data().sumIncome;
  
  onSnapshot(
    query(
      orderCollection,
      where("createdAt", ">=", Timestamp.fromDate(last7Day.start)),
      where("createdAt", "<=", Timestamp.fromDate(last7Day.end))
    ),
    (orderSnapshot) => {
      orders.value = orderSnapshot.docs.map((e) => ({
        id: e.id,
        ...e.data(),
      }));
    }
  );
});

const statusBtn = {
  Open: "btn-neutral",
  Waiting_for_Service: "btn-info",
  Ready_for_Billing: "btn-warning",
  Paid: "btn-success",
  Canceled: "btn-error",
};

const filterOrder = async (statusOrder) => {
  const orderCollection = collection(db, "orders");
  if (statusOrder) {
    onSnapshot(
      query(
        orderCollection,
        and(
          where("status", "==", statusOrder),
          where("createdAt", ">=", Timestamp.fromDate(last7Day.start)),
          where("createdAt", "<=", Timestamp.fromDate(last7Day.end))
        ),
        orderBy("createdAt", "desc")
      ),
      (orderSnapshot) => {
        orders.value = orderSnapshot.docs.map((e) => ({
          id: e.id,
          ...e.data(),
        }));
      }
    );
  } else {
    onSnapshot(
      query(orderCollection, and(
          where("createdAt", ">=", Timestamp.fromDate(last7Day.start)),
          where("createdAt", "<=", Timestamp.fromDate(last7Day.end))
        ),orderBy("createdAt", "desc")),
      (orderSnapshot) => {
        orders.value = orderSnapshot.docs.map((e) => ({
          id: e.id,
          ...e.data(),
        }));
      }
    );
  }
};
</script>
<template>
  <div class="p-4 flex flex-col gap-6">
    <div>
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">ออเดอร์  7 วันล่าสุด</div>
          <div class="stat-value">{{ countOrder }} รายการ</div>
        </div>
      </div>
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">ยอดขาย 7 วันล่าสุด</div>
          <div class="stat-value">{{ sumIncome }} บาท</div>
        </div>
      </div>
    </div>
    <div class="flex gap-4">
      <input
        class="btn btn-soft rounded-2xl"
        type="radio"
        name="frameworks"
        aria-label="All"
        @change="filterOrder()"
        checked
      />
      <input
        v-for="(s, __) in statusList"
        class="btn btn-soft rounded-2xl"
        :class="statusBtn[s]"
        type="radio"
        name="frameworks"
        @change="filterOrder(s)"
        :aria-label="s"
      />
    </div>
    <div class="columns-6 gap-5">
      <OrderCard v-for="(order, i) in orders" :key="i" :order="order">
        <template #default>
          <div v-for="item in order.items" class="flex justify-between text-xs">
            <p>{{ item?.menuName }}</p>
            <p class="text-right font-semibold">
              {{ item?.pricePerUnit || 0 }}.-
            </p>
          </div>
        </template>
      </OrderCard>
    </div>
  </div>
</template>
<style scoped></style>
