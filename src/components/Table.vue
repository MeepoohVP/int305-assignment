<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-3">
      เลือกโต๊ะ
    </h2>

    <div class="grid grid-cols-3 gap-4">
      <button
        v-for="table in tables"
        :key="table.id"
        @click="$emit('select', table)"
        class="flex flex-col items-center justify-center rounded-2xl border p-3
               shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5
               focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="statusStyles[table.status]?.container || statusStyles.default.container"
      >
        <!-- ไอคอนโต๊ะแบบกลาง ๆ (ไม่ผูกธีม) -->
        <div class="w-10 h-10 mb-1 flex items-center justify-center">
          <div
            class="w-9 h-5 rounded-md border"
            :class="statusStyles[table.status]?.icon || statusStyles.default.icon"
          >
            <!-- เส้นด้านในให้เหมือน top โต๊ะ -->
            <div class="w-full h-[2px] mt-[2px] opacity-60"></div>
          </div>
        </div>

        <!-- label โต๊ะ -->
        <span class="text-[11px] text-gray-600">
          โต๊ะ
        </span>

        <!-- หมายเลขโต๊ะ -->
        <span class="text-lg font-bold">
          {{ table.tableNumber }}
        </span>

        <!-- สถานะ -->
        <span
          class="mt-1 text-[11px]"
          :class="statusStyles[table.status]?.text || statusStyles.default.text"
        >
          {{ statusLabel(table.status) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tables: {
    type: Array,
    default: () => [],
  },
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
