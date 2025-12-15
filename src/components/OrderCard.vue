<script setup>
const props = defineProps({
    order: {
        type: Object,
        require: true
    }
})

const statusBadge = {
  Open: "badge-neutral",
  Waiting_for_Service: "badge-info",
  Ready_for_Billing: "badge-warning",
  Paid: "badge-success",
  Canceled: "badge-error",
};

function formatDate(ts) {
  if (!ts || !ts.seconds) return "-";

  const date = new Date(ts.seconds * 1000);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

</script>
<template>
  <div class="card bg-base-100 shadow-sm w-full cursor-pointer hover:scale-[1.02] h-fit break-inside-avoid mt-4">
    <div class="card-body">
      <div class="flex justify-between">
        <h2 class="card-title text-sm">#{{ order?.id || '1234343asas' }}</h2>
      </div>
      <hr class="opacity-20" />
      <p class="flex gap-1.5 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-clock"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
          />
          <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
          />
        </svg>
        {{ formatDate(order?.createdAt) }}
      </p>
      <p class="flex gap-1.5 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-diamond" viewBox="0 0 16 16">
  <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
</svg>
        Table {{ order?.tableCode }}
      </p>
      <hr class="opacity-20" />
      <slot></slot>
      <div class="flex justify-between">
        <p>{{ order?.items.length || 0 }} items</p>
        <p class="text-right font-semibold text-primary">{{ order?.totalPrice.toLocaleString() || 0 }}.-</p>
      </div>
      <div>
        <span class="badge badge-lg badge-soft"  :class="statusBadge[order?.status] || 'badge-ghost'">{{ order?.status || 'status' }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
