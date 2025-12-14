<script setup>
import db from "@/firebase/init";
import { and, collection, getDocs, query, where } from "firebase/firestore";
import { onMounted, ref } from "vue";

const categories = ref([]);
const menus = ref([]);
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
</script>
<template>
  <div class="grid grid-cols-[70%_40%] p-6">
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
        <div
          v-if="menus"
          v-for="(menu, __) in menus"
          class="card card-xs bg-base-100 shadow-sm"
        >
          <figure>
            <img
              class="aspect-square object-cover"
              :src="'/' + menu.name + '.png'"
              :alt="menu.name"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ menu.name }}</h2>
            <p class="card-title text-primary">{{ menu.price }}.-</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
