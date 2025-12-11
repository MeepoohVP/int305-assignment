// ---- ตั้งค่า Firebase ของโปรเจกต์เรา ----
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------- CATEGORY (ใหม่ตามที่ให้มา) ----------------

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

// ---------------- SAMPLE MENUS (สุ่ม category หลังจากสร้าง category) ----------------

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
  lastActivity: Timestamp.now(),
}));

// ---------------- UTIL ----------------
function randomOrderStatus() {
  const statuses = ["Open", "Waiting_for_Service", "Ready_for_Billing", "Paid", "Canceled"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// ---------------- SEED FUNCTION ----------------

async function seed() {
  try {
    console.log("Seeding Sushi Data...");

    // 1) CATEGORIES
    const categoriesCol = collection(db, "categories");
    const categoryDocs = [];

    for (const cat of categorySeed) {
      const docRef = await addDoc(categoriesCol, cat);
      categoryDocs.push({ id: docRef.id, ...cat });
    }
    console.log("✔ categories inserted:", categoryDocs.length);

    // 2) MENUS (map categoryId แบบหมุน)
    const menusCol = collection(db, "menus");
    const menuDocs = [];

    for (let i = 0; i < menuSeed.length; i++) {
      const base = menuSeed[i];
      const cat = categoryDocs[i % categoryDocs.length];

      const data = {
        ...base,
        categoryId: cat.id,
      };

      const docRef = await addDoc(menusCol, data);
      menuDocs.push({ id: docRef.id, ...data });
    }
    console.log("✔ menus inserted:", menuDocs.length);

    // 3) TABLES
    const tablesCol = collection(db, "tables");
    const tableDocs = [];

    for (const t of tableSeed) {
      const docRef = await addDoc(tablesCol, t);
      tableDocs.push({ id: docRef.id, ...t });
    }
    console.log("✔ tables inserted:", tableDocs.length);

    // 4) ORDERS (10 orders)
    const ordersCol = collection(db, "orders");

    for (let i = 0; i < 10; i++) {
      const table = tableDocs[i % tableDocs.length];
      const status = randomOrderStatus();

      // random menu items
      const itemCount = 2 + Math.floor(Math.random() * 2); // 2–3 items
      let totalPrice = 0;
      const items = [];

      for (let j = 0; j < itemCount; j++) {
        const menu = menuDocs[(i + j) % menuDocs.length];
        const quantity = 1 + Math.floor(Math.random() * 3);

        items.push({
          menuId: menu.id,
          menuName: menu.name,
          pricePerUnit: menu.price,
          quantity,
          status: "Pending",
          customOption: {},
          options: [],
          note: "",
        });

        totalPrice += menu.price * quantity;
      }

      await addDoc(ordersCol, {
        tableId: table.id,
        status,
        createdAt: Timestamp.now(),
        totalPrice,
        isPaid: status === "Paid",
        note: "",
        items,
      });
    }

    console.log("✔ orders inserted: 10");
    console.log("🎉 DONE: All Seeds Completed!");

  } catch (err) {
    console.error("❌ Seed Error:", err);
  }
}

// RUN
seed();
