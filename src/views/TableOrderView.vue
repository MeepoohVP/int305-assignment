<script setup>
import db from "@/firebase/init";
import {
  addDoc,
  and,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MenuCard from "@/components/MenuCard.vue";

const route = useRoute();
const categories = ref([]);
const menus = ref([]);
const table = ref({});
const order = ref(null);
const orderTab = ref("selectionList");
const selectionMenu = ref([]);
onMounted(async () => {
  const categoriesCollection = collection(db, "categories");
  const categoriesSnapshot = await getDocs(
    query(categoriesCollection, where("isActive", "==", true))
  );
  categories.value = categoriesSnapshot.docs.map((e) => ({
    id: e.id,
    ...e.data(),
  }));

  const menusCollection = collection(db, "menus");
  const menusSnapshot = await getDocs(
    query(menusCollection, where("isAvailable", "==", true))
  );
  menus.value = menusSnapshot.docs.map((e) => ({
    id: e.id,
    ...e.data(),
  }));
  console.log(menus.value);

  const tableQuery = query(
    collection(db, "tables"),
    where("tableCode", "==", route.params.tableCode),
    limit(1)
  );
  onSnapshot(tableQuery, async (tableSnapshot) => {
    table.value = {
      id: tableSnapshot.docs[0].id,
      ...tableSnapshot.docs[0].data(),
    };
    if (tableSnapshot.docs[0].data().currentOrderId) {
      const orderDoc = doc(
        db,
        "orders",
        tableSnapshot.docs[0].data().currentOrderId
      );
      onSnapshot(orderDoc, (orderSnapshot) => {
        order.value = { id: orderSnapshot.id, ...orderSnapshot.data() };
        console.log(order.value);
      });
    }
  });
});

const changeCategory = async (categoryId) => {
  const menusCollection = collection(db, "menus");
  let menusSnapshot = null;
  if (categoryId) {
    menusSnapshot = await getDocs(
      query(
        menusCollection,
        and(
          where("categoryId", "==", categoryId),
          where("isAvailable", "==", true)
        )
      )
    );
  } else {
    menusSnapshot = await getDocs(
      query(menusCollection, where("isAvailable", "==", true))
    );
  }
  menus.value = menusSnapshot.docs.map((e) => ({
    id: e.id,
    ...e.data(),
  }));
};

const placeOrder = async () => {
  if (order.value) {
    const orderDoc = doc(db, "orders", order.value.id);
    const updateOrder = await updateDoc(orderDoc, {
      items: arrayUnion(selectionMenu.value),
    });
  } else {
    const orderCollection = collection(db, "orders");
    const addOrder = await addDoc(orderCollection, {
      createdAt: new Date(),
      isPaid: false,
      items: selectionMenu.value,
      note: "",
      status: "Open",
      tableCode: table.value.tableCode,
      tableId: table.value.id,
      totalPrice: selectionMenu.value.reduce(
        (sum, it) => sum + it.quantity * it.pricePerUnit,
        0
      ),
    });
    
    const updateCurrentOrder = await updateDoc(doc(db, 'tables', table.value.id), {
      status: 'Occupied',
      currentOrderId: addOrder.id
    })
  }
  selectionMenu.value = {}
};

function formatDate(ts) {
  if (!ts || !ts.seconds) return "-";

  const date = new Date(ts.seconds * 1000);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${days[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
}

const itemStatusStyles = {
  Pending: {
    badge: "badge-warning",
  },
  Preparing: {
    badge: "badge-info",
  },
  Ready: {
    badge: "badge-success",
  },
  Served: {
    badge: "badge-ghost",
  },
};

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};

const menuDetail = ref(null);
const selectedOptions = ref({});

const showMenuDetail = (menuId) => {
  menuDetail.value = menus.value.find(({ id }) => id === menuId);
  openModal();
};

const clearMenuDetail = () => {
  closeModal();
  menuDetail.value = null;
  selectedOptions.value = {};
};

watch(
  selectedOptions,
  () => {
    console.log(selectedOptions.value);
  },
  { deep: true }
);

const incQty = (item) => {
  /* +1 */
};
const decQty = (item) => {
  /* -1 (ขั้นต่ำ 1 หรือ 0 แล้วลบ) */
};
const removeItem = (item) => {
  const index = selectionMenu.value.findIndex((i) => i.menuId === item.menuId);

  if (index !== -1) {
    selectionMenu.value.splice(index, 1);
  }
};

const submitMenu = () => {
  if (selectionMenu.value.find((m) => m.menuId === menuDetail.value.id)) {
    selectionMenu.value.find(
      (m) => m.menuId === menuDetail.value.id
    ).quantity += 1;
  } else {
    selectionMenu.value.push({
      menuId: menuDetail.value.id,
      menuName: menuDetail.value.name,
      note: menuDetail.value.note || "",
      options: selectedOptions.value,
      pricePerUnit: menuDetail.value.price,
      quantity: 1,
      status: "Pending",
    });
  }
  console.log(selectionMenu.value);

  clearMenuDetail();
};
</script>
<template>
  <Teleport to="body">
    <dialog
      id="my_modal_1"
      class="modal"
      :class="showModal ? 'modal-open' : ''"
    >
      <form
        @submit.prevent="submitMenu"
        class="modal-box w-full max-w-[60vw] h-[85vh] p-0 relative"
      >
        <div class="grid grid-cols-1 md:grid-cols-[40%_60%] h-full">
          <!-- LEFT : Image -->
          <figure class="relative h-full">
            <img
              v-if="menuDetail"
              class="w-full h-full object-cover object-center"
              :src="`https://meepoohvp.github.io/int305-assignment-image/menus/${menuDetail?.name}.png`"
              :alt="menuDetail?.name"
            />
          </figure>

          <!-- RIGHT : Content -->
          <div class="flex flex-col p-5 overflow-y-auto">
            <!-- Title -->
            <h3 class="text-2xl font-bold mb-1">
              {{ menuDetail?.name }}
            </h3>

            <!-- Price -->
            <p class="text-xl text-primary font-semibold mb-3">
              {{ menuDetail?.price }} บาท
            </p>

            <!-- Description -->
            <p class="text-sm text-gray-500 mb-4">
              {{ menuDetail?.description }}
            </p>

            <!-- Options -->
            <div class="flex-1 space-y-4">
              <div
                v-if="menuDetail && menuDetail?.customOptions"
                v-for="(menuVal, menuKey) in menuDetail?.customOptions"
              >
                <h4 class="font-semibold mb-2">
                  {{
                    menuKey
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())
                  }}
                </h4>
                <div class="flex flex-col gap-2">
                  <label v-for="choice in menuVal">
                    <input
                      type="radio"
                      class="radio"
                      :name="choice"
                      v-model="selectedOptions[menuKey]"
                      :value="choice"
                    />
                    {{ choice }}
                  </label>
                </div>
              </div>
              <div>
                <textarea
                  v-if="menuDetail"
                  placeholder="Note"
                  class="textarea"
                  v-model="menuDetail.note"
                ></textarea>
              </div>
            </div>

            <!-- Footer Actions -->
            <div
              class="sticky bottom-0 bg-base-100 pt-4 mt-4 border-t flex gap-3"
            >
              <div class="btn btn-outline w-1/3" @click="clearMenuDetail">
                ยกเลิก
              </div>

              <button class="btn btn-primary flex-1 text-lg">
                เพิ่มลงรายการ • {{ menuDetail?.price }} ฿
              </button>
            </div>
          </div>
        </div>
      </form>
    </dialog>
  </Teleport>
  <div class="grid grid-cols-[75%_25%] p-6 gap-4">
    <div class="py-4 px-8 bg-base-100 rounded-3xl flex flex-col gap-4">
      <div class="flex gap-4 flex-wrap" v-if="categories" data-theme="pastel">
        <input
          class="btn rounded-2xl"
          type="radio"
          name="frameworks"
          aria-label="All"
          @change="changeCategory()"
          checked
        />
        <input
          v-for="(category, __) in categories"
          class="btn rounded-2xl checked:btn-secondary"
          type="radio"
          name="frameworks"
          @change="changeCategory(category.id)"
          :aria-label="category.name"
        />
      </div>
      <div class="grid grid-cols-5 gap-4">
        <MenuCard
          @showDetail="showMenuDetail(menu.id)"
          v-for="(menu, __) in menus"
          :key="menu.id"
          :menu="menu"
        />
      </div>
    </div>
    <div
      class="card bg-base-100 rounded-3xl h-fit min-h-[40vh] max-h-[80vh] sticky top-20"
    >
      <div class="card-body">
        <h2 class="card-title">Table #{{ route.params.tableCode }}</h2>
        <div class="tabs tabs-box tabs-sm w-fit">
          <input
            type="radio"
            name="orderList"
            class="tab"
            aria-label="รายการที่เลือกไว้"
            v-model="orderTab"
            value="selectionList"
          />
          <input
            type="radio"
            name="orderList"
            class="tab"
            aria-label="ออเดอร์ของฉัน"
            v-model="orderTab"
            value="myOrder"
          />
        </div>
        <div v-if="orderTab === 'selectionList'">
          <ul
            class="list bg-base-100 border-b border-base-300 overflow-y-auto max-h-96"
          >
            <!-- Header ของ tab -->
            <li class="p-4 pb-2 text-sm opacity-60 flex justify-between">
              <p class="font-medium">รายการที่เลือกไว้</p>
              <p class="text-right">{{ selectionMenu?.length || 0 }} รายการ</p>
            </li>

            <!-- Empty state -->
            <li
              v-if="!selectionMenu?.length"
              class="p-6 text-sm opacity-60 text-center"
            >
              ยังไม่มีรายการที่เลือกไว้
            </li>

            <!-- Items -->
            <li
              class="list-row relative"
              v-for="item in selectionMenu"
              :key="item.menuId"
            >
              <div>
                <img
                  class="size-14 rounded-box object-cover"
                  :src="`https://meepoohvp.github.io/int305-assignment-image/menus/${item.menuName}.png`"
                  :alt="item.menuName"
                />
              </div>

              <div class="min-w-0">
                <p class="font-medium truncate">{{ item.menuName }}</p>

                <!-- options -->
                <div class="flex flex-col text-xs opacity-60">
                  <span v-for="(optVal, optKey) in item.options" :key="optKey">
                    {{
                      optKey
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())
                    }}: {{ optVal }}
                  </span>
                  <span v-if="item?.note">Note: {{ item?.note }}</span>
                </div>

                <!-- qty controls -->
                <div class="mt-2 flex items-center gap-2">
                  <button class="btn btn-xs btn-outline" @click="decQty(item)">
                    -
                  </button>
                  <span class="text-sm font-semibold w-6 text-center">{{
                    item.quantity
                  }}</span>
                  <button class="btn btn-xs btn-outline" @click="incQty(item)">
                    +
                  </button>

                  <button
                    class="btn btn-xs btn-ghost ml-2"
                    @click="removeItem(item)"
                  >
                    ลบ
                  </button>
                </div>
              </div>

              <!-- price -->
              <div class="self-end text-right">
                <p class="text-sm font-semibold">
                  {{ (item.pricePerUnit * item.quantity).toLocaleString() }}.-
                </p>
                <p class="text-xs opacity-60">
                  {{ item.pricePerUnit.toLocaleString() }}.- / ชิ้น
                </p>
              </div>
            </li>
          </ul>
          <div class="flex justify-center mt-8">
            <button @click="placeOrder" class="btn btn-primary btn-wide" :disabled="selectionMenu.length===0">สั่งอาหาร</button>
          </div>
        </div>
        <div v-else-if="orderTab === 'myOrder' && order" class="">
          <ul
            class="list bg-base-100 border-b border-base-300 overflow-y-auto max-h-96"
          >
            <li class="p-4 pb-2 text-sm opacity-60 flex justify-between">
              <p class="font-medium">Order ID:</p>
              <p class="text-right">{{ order.id }}</p>
            </li>
            <li class="p-4 pb-2 text-sm opacity-60 flex justify-between">
              <p class="font-medium">Date:</p>
              <p class="text-right">{{ formatDate(order.createdAt) }}</p>
            </li>

            <li class="list-row relative" v-for="item in order.items">
              <p
                class="badge badge-sm badge-soft absolute right-0 top-0 m-1"
                :class="itemStatusStyles[item.status].badge"
              >
                {{ item.status }}
              </p>
              <div>
                <img
                  class="size-14 rounded-box object-cover"
                  :src="
                    'https://meepoohvp.github.io/int305-assignment-image/menus/' +
                    item.menuName +
                    '.png'
                  "
                />
              </div>
              <div>
                <div class="">
                  <p>{{ item.menuName }}</p>
                </div>
                <div class="flex flex-col text-xs opacity-60">
                  <span
                    class=""
                    v-for="(optVal, optKey) in item.customOption"
                    :key="optKey"
                  >
                    {{
                      optKey
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())
                    }}: {{ optVal }}
                  </span>
                </div>
                <div class="text-xs font-semibold opacity-60">
                  x{{ item.quantity }}
                </div>
              </div>

              <p class="self-end">{{ item.pricePerUnit.toLocaleString() }}.-</p>
            </li>
          </ul>
          <li class="flex justify-between p-4 font-semibold">
            <p>Total</p>
            <p class="text-right">{{ order.totalPrice.toLocaleString() }}.-</p>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
