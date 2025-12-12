<template>
  <div class="py-12 px-24 grid grid-cols-[70%_30%] gap-4">
    <h2 class="text-lg font-semibold mb-3 col-span-2">เลือกโต๊ะ</h2>
    <div>
      <div class="grid grid-cols-7 gap-8 bg-base-200 p-6 rounded-3xl">
        <Table
          v-for="table in tables"
          :key="table.id"
          :class="statusStyles[table.status]?.icon || statusStyles.default.icon"
          :table-code="table.tableCode"
        />
      </div>
    </div>
    <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Card title!</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Table from "@/components/Table.vue";
import db from "@/firebase/init";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { onMounted, ref } from "vue";

const tables = ref([]);

onMounted(async () => {
  const tableCollection = collection(db, "tables");
  onSnapshot(query(tableCollection, where('isActive', '==', true), orderBy("tableCode")), (snapshot) => {
    tables.value = snapshot.docs.map((e) => ({
      id: e.id,
      ...e.data(),
    }));
  });
  console.log(tables.value);
});

// ---- config สี/สไตล์ต่อสถานะ (ถ้าเปลี่ยนธีมก็มาแก้แค่ตรงนี้) ----
const statusStyles = {
  Empty: {
    container: "bg-white border-gray-200 focus:ring-emerald-300",
    icon: "border-gray-400 bg-gray-50",
    text: "text-emerald-700",
  },
  Occupied: {
    container: "bg-sky-50 border-sky-300 focus:ring-sky-300",
    icon: "border-sky-500 bg-white",
    text: "text-sky-700",
  },
  Waiting_for_Billing: {
    container: "bg-amber-50 border-amber-300 focus:ring-amber-300",
    icon: "border-amber-500 bg-white",
    text: "text-amber-700",
  },
  Reserved: {
    container: "bg-gray-100 border-gray-300 opacity-80 focus:ring-gray-300",
    icon: "border-gray-500 bg-gray-50",
    text: "text-gray-600",
  },
  default: {
    container: "bg-white border-gray-200 focus:ring-gray-300",
    icon: "border-gray-400 bg-gray-50",
    text: "text-gray-600",
  },
};

const statusLabel = (status) => {
  switch (status) {
    case "Empty":
      return "ว่าง";
    case "Occupied":
      return "มีลูกค้า";
    case "Waiting_for_Billing":
      return "รอคิดเงิน";
    case "Reserved":
      return "จองแล้ว";
    default:
      return "ไม่ทราบสถานะ";
  }
};
</script>
