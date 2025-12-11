<template>
  <div class="p-12">
    <h2 class="text-lg font-semibold mb-3">เลือกโต๊ะ</h2>

    <div class="grid grid-cols-7 gap-24 bg-base-200 p-6 rounded-3xl">
      <div
        v-for="table in tables"
        :key="table.id"
        @click="$emit('select', table)"
        class="aspect-square mb-1 flex items-center justify-center rounded-xl border text-xl font-bold"
        :class="statusStyles[table.status]?.icon || statusStyles.default.icon"
      >
        {{ table.tableNumber }}
      </div>
    </div>
  </div>
</template>

<script setup>
import db from "@/firebase/init";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onMounted, ref } from "vue";

const tables = ref([]);

onMounted(async () => {
  const tableCollection = collection(db, "tables");
  const snapshot = await getDocs(
    query(tableCollection, orderBy("tableNumber"))
  );
  tables.value = snapshot.docs.map((e) => ({
    id: e.id,
    ...e.data(),
  }));
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
