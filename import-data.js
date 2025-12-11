// ---------- IMPORT ----------
import admin from "firebase-admin";
import { readFileSync } from "fs";

// ---------- INITIALIZE ADMIN SDK ----------
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---------------- CATEGORY ----------------
const categorySeed = [
  { name: "ซูชิหน้าต่าง ๆ (Nigiri)", order: 1, isActive: true },
  { name: "ซาชิมิ (Sashimi)", order: 2, isActive: true },
  { name: "ข้าวปั้นม้วน (Maki Roll)", order: 3, isActive: true },
  { name: "ซูชิโคน (Temaki)", order: 4, isActive: true },
  { name: "ดงบุริ / ข้าวหน้าต่าง ๆ", order: 5, isActive: true },
  { name: "ของทอด / อาหารทานเล่น", order: 6, isActive: true },
  { name: "ซุป", order: 7, isActive: true },
  { name: "ของหวาน", order: 8, isActive: true },
  { name: "เครื่องดื่ม", order: 9, isActive: true },
  { name: "ชุดเมนูพิเศษ", order: 10, isActive: true },
];

// ---------------- MENU ----------------
const menuSeed = [
  { name: "แซลมอนซูชิ", price: 40, description: "ซูชิหน้าแซลมอน", isAvailable: true },
  { name: "ทามาโกะซูชิ", price: 30, description: "ซูชิหน้าไข่หวาน", isAvailable: true },
  { name: "แซลมอนซาชิมิ", price: 120, description: "ปลาดิบ 5 ชิ้น", isAvailable: true },
  { name: "ปลาทูน่าซาชิมิ", price: 130, description: "ปลาทูน่าซาชิมิ", isAvailable: true },
  { name: "แคลิฟอร์เนียโรล", price: 89, description: "โรลปูอัด 6 ชิ้น", isAvailable: true },
  { name: "สไปซี่แซลมอนโรล", price: 99, description: "โรลแซลมอนเผ็ด", isAvailable: true },
  { name: "แซลมอนดงบุริ", price: 159, description: "ข้าวหน้าแซลมอน", isAvailable: true },
  { name: "ไก่คาราอะเกะ", price: 69, description: "ไก่ทอดญี่ปุ่น", isAvailable: true },
  { name: "มิโซะซุป", price: 29, description: "ซุปเต้าหู้สาหร่าย", isAvailable: true },
  { name: "ชาเขียวรีฟิล", price: 39, description: "ชาเขียวเย็นรีฟิล", isAvailable: true },
];

// ---------------- TABLES ----------------
const tableSeed = Array.from({ length: 10 }).map((_, idx) => ({
  tableNumber: idx + 1,
  status: "Empty",
  currentOrderId: "",
  isActive: true,
  lastActivity: admin.firestore.Timestamp.now(),
}));

function randomOrderStatus() {
  const statuses = [
    "Open",
    "Waiting_for_Service",
    "Ready_for_Billing",
    "Paid",
    "Canceled",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// ---------------- SEED FUNCTION ----------------
async function seed() {
  try {
    console.log("🚀 Seeding Sushi Data...");

    // 1) Categories
    const categoriesCol = db.collection("categories");
    const categoryDocs = [];

    for (const cat of categorySeed) {
      const docRef = await categoriesCol.add(cat);
      categoryDocs.push({ id: docRef.id, ...cat });
    }
    console.log("✔ categories:", categoryDocs.length);

    // 2) Menus
    const menusCol = db.collection("menus");
    const menuDocs = [];

    for (let i = 0; i < menuSeed.length; i++) {
      const base = menuSeed[i];
      const cat = categoryDocs[i % categoryDocs.length];

      const data = {
        ...base,
        categoryId: cat.id,
      };

      const docRef = await menusCol.add(data);
      menuDocs.push({ id: docRef.id, ...data });
    }
    console.log("✔ menus:", menuDocs.length);

    // 3) Tables
    const tablesCol = db.collection("tables");
    const tableDocs = [];

    for (const t of tableSeed) {
      const docRef = await tablesCol.add(t);
      tableDocs.push({ id: docRef.id, ...t });
    }
    console.log("✔ tables:", tableDocs.length);

    // 4) Orders (10 orders)
    const ordersCol = db.collection("orders");

    for (let i = 0; i < 10; i++) {
      const table = tableDocs[i % tableDocs.length];
      const status = randomOrderStatus();

      const itemCount = 2 + Math.floor(Math.random() * 2); // 2–3 items
      let totalPrice = 0;
      const items = [];

      for (let j = 0; j < itemCount; j++) {
        const menu = menuDocs[(i + j) % menuDocs.length];
        const qty = 1 + Math.floor(Math.random() * 3);

        items.push({
          menuId: menu.id,
          menuName: menu.name,
          pricePerUnit: menu.price,
          quantity: qty,
          status: "Pending",
          customOption: {},
          options: [],
          note: "",
        });

        totalPrice += menu.price * qty;
      }

      await ordersCol.add({
        tableId: table.id,
        status,
        totalPrice,
        isPaid: status === "Paid",
        createdAt: admin.firestore.Timestamp.now(),
        note: "",
        items,
      });
    }

    console.log("✔ orders: 10");
    console.log("🎉 DONE — All Seeds Completed");

  } catch (err) {
    console.error("❌ Seed Error:", err);
  }
}

seed();
