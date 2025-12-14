<template>
  <div class="py-12 px-24 grid grid-cols-[70%_30%] gap-4">
    <div class="flex col-span-2 gap-4 text-sm justify-end">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-black"></span>
        <span>ว่าง</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-primary"></span>
        <span>มีลูกค้า</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-warning"></span>
        <span>รอคิดเงิน</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-secondary"></span>
        <span>จอง</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="relative flex w-3 h-3">
          <span
            class="absolute inline-flex h-full w-full rounded-full bg-error opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-error"
          ></span>
        </span>
        <span>ลูกค้าเรียก</span>
      </div>
    </div>

    <h2 class="text-lg font-semibold mb-3 col-span-2">Table</h2>
    <div>
      <div class="grid grid-cols-7 gap-8 card shadow-sm p-6 rounded-3xl bg-base-100">
        <Table
          v-for="t in tables"
          @tableDetail="tableDetail(t.id)"
          :key="t.id"
          :class="`${
            statusStyles[t.status]?.container || statusStyles.default.container
          } ${t.isActive ? '' : 'btn-disabled'}`"
          :table-code="t.tableCode"
          :have-notification="t.status === 'Need_Help'"
          :id="t.id"
        />
      </div>
    </div>
    <div class="card bg-base-100 shadow-sm rounded-3xl">
      <div class="card-body">
        <h2 class="card-title">{{ table?.tableCode }}</h2>
        <ul class="">
          <li><b class="font-medium">Status:</b> {{ table?.status }}</li>
          <li>
            <b class="font-medium">Last Activity:</b>
            {{ timeAgo(table?.lastActivity) }}
          </li>
          <li>
            <b class="font-medium">Current Order:</b>
            <span v-if="!currentOrder">-</span>
            <div v-else class="card card-border round-sm">
              <div class="card-body">
                <ul>
                  <li>
                    <b class="font-medium">Order ID:</b> {{ currentOrder.id }}
                  </li>
                  <li>
                    <b class="font-medium">Order Status:</b>
                    {{ currentOrder.status }}
                  </li>
                  <li class="mt-2">
                    <div
                      class="grid grid-cols-[8%_42%_10%_18%_22%] font-semibold"
                    >
                      <div>Sr.</div>
                      <div>Description</div>
                      <div class="text-right">Qty</div>
                      <div class="text-right">Rate</div>
                      <div class="text-right">Amount</div>
                    </div>
                    <div
                      v-for="(item, i) in currentOrder.items"
                      :key="i"
                      class="grid grid-cols-[8%_42%_10%_18%_22%]"
                    >
                      <div>{{ i + 1 }}</div>
                      <div>{{ item.menuName }}</div>
                      <div class="text-right">{{ item.quantity }}</div>
                      <div class="text-right">{{ item.pricePerUnit }}</div>
                      <div class="text-right">
                        {{ item.pricePerUnit * item.quantity }}
                      </div>
                    </div>
                    <div
                      class="grid grid-cols-[8%_42%_10%_18%_22%] font-semibold"
                    >
                      <div class="col-span-2">Total</div>

                      <div class="text-right">
                        {{
                          currentOrder.items.reduce(
                            (sum, it) => sum + it.quantity,
                            0
                          )
                        }}
                      </div>
                      <div></div>
                      <div class="text-right">
                        {{
                          currentOrder.items
                            .reduce(
                              (sum, it) => sum + it.quantity * it.pricePerUnit,
                              0
                            )
                            .toLocaleString()
                        }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <!-- <div class="card-actions justify-end">
          <button class="btn btn-primary">Buy Now</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import Table from "@/components/Table.vue";
import db from "@/firebase/init";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { onMounted, ref } from "vue";

const tables = ref([]);
const table = ref(null);
const currentOrder = ref(null);

onMounted(async () => {
  const tableCollection = collection(db, "tables");
  onSnapshot(query(tableCollection, orderBy("tableCode")), (snapshot) => {
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
    container: "btn-outline",
  },
  Occupied: {
    container: "btn-primary btn-soft",
  },
  Waiting_for_Billing: {
    container: "btn-warning btn-soft",
  },
  Reserved: {
    container: "btn-secondary btn-soft",
  },
  Need_Help: {
    container: "btn-primary btn-soft",
  },
  default: {
    container: "", // ⚪ fallback
  },
};

const tableDetail = async (id) => {
  table.value = null;
  currentOrder.value = null;
  const tableCollection = doc(db, "tables", id);
  const snapshot = await getDoc(tableCollection);
  table.value = { id: snapshot.id, ...snapshot.data() };
  if (table.value.currentOrderId) {
    const orderCollection = doc(db, "orders", table.value.currentOrderId);
    const orderSnapshot = await getDoc(orderCollection);
    currentOrder.value = { id: orderSnapshot.id, ...orderSnapshot.data() };
    console.log(currentOrder.value);
  }
};

function timeAgo(ts) {
  if (!ts?.seconds) return "-";

  const diff = Date.now() - ts.seconds * 1000;
  const min = Math.floor(diff / 60000);

  if (min < 1) return "เมื่อสักครู่";
  if (min < 60) return `${min} นาทีที่แล้ว`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ชั่วโมงที่แล้ว`;

  return new Date(ts.seconds * 1000).toLocaleDateString("th-TH");
}

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
