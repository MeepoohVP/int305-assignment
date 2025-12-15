
import admin from "firebase-admin";
import { readFileSync } from "fs";


const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();


const categorySeed = [
  { key: "nigiri", name: "ซูชิหน้าต่าง ๆ (Nigiri)", order: 1, isActive: true },
  { key: "sashimi", name: "ซาชิมิ (Sashimi)", order: 2, isActive: true },
  { key: "maki", name: "ข้าวปั้นม้วน (Maki Roll)", order: 3, isActive: true },
  { key: "temaki", name: "ซูชิโคน (Temaki)", order: 4, isActive: true },
  { key: "donburi", name: "ดงบุริ / ข้าวหน้าต่าง ๆ", order: 5, isActive: true },
  { key: "fried", name: "ของทอด / อาหารทานเล่น", order: 6, isActive: true },
  { key: "soup", name: "ซุป", order: 7, isActive: true },
  { key: "dessert", name: "ของหวาน", order: 8, isActive: true },
  { key: "drink", name: "เครื่องดื่ม", order: 9, isActive: true },
  { key: "special", name: "ชุดเมนูพิเศษ", order: 10, isActive: true },
];


const menuSeed = [
  { type: "nigiri", name: "แซลมอนซูชิ", price: 40, description: "ซูชิหน้าแซลมอน", isAvailable: true },
  { type: "nigiri", name: "ทูน่าซูชิ", price: 45, description: "ซูชิหน้าทูน่า", isAvailable: true },
  { type: "nigiri", name: "เอบิซูชิ", price: 45, description: "ซูชิหน้ากุ้ง", isAvailable: true },
  { type: "nigiri", name: "ทามาโกะซูชิ", price: 30, description: "ซูชิหน้าไข่หวาน", isAvailable: true },

  { type: "sashimi", name: "แซลมอนซาชิมิ", price: 120, description: "ปลาดิบ 5 ชิ้น", isAvailable: true },
  { type: "sashimi", name: "ปลาทูน่าซาชิมิ", price: 130, description: "ทูน่าซาชิมิ 5 ชิ้น", isAvailable: true },
  { type: "sashimi", name: "รวมซาชิมิ", price: 199, description: "รวมซาชิมิ 8 ชิ้น", isAvailable: true },

  { type: "maki", name: "แคลิฟอร์เนียโรล", price: 89, description: "โรลปูอัด 6 ชิ้น", isAvailable: true },
  { type: "maki", name: "สไปซี่แซลมอนโรล", price: 99, description: "โรลแซลมอนเผ็ด 6 ชิ้น", isAvailable: true },
  { type: "maki", name: "เทมปุระโรล", price: 109, description: "โรลกุ้งเทมปุระ 6 ชิ้น", isAvailable: true },
  { type: "maki", name: "อุโรลปลาไหล", price: 129, description: "โรลปลาไหล 6 ชิ้น", isAvailable: true },

  { type: "temaki", name: "เทมากิแซลมอน", price: 79, description: "ซูชิโคนแซลมอน", isAvailable: true },
  { type: "temaki", name: "เทมากิทูน่า", price: 85, description: "ซูชิโคนทูน่า", isAvailable: true },

  { type: "donburi", name: "แซลมอนดงบุริ", price: 159, description: "ข้าวหน้าแซลมอน", isAvailable: true },
  { type: "donburi", name: "ทูน่าดงบุริ", price: 169, description: "ข้าวหน้าทูน่า", isAvailable: true },
  { type: "donburi", name: "ไก่เทอริยากิดงบุริ", price: 129, description: "ข้าวหน้าไก่เทอริยากิ", isAvailable: true },
  { type: "donburi", name: "คัตสึดง", price: 139, description: "ข้าวหน้าหมูทอดไข่", isAvailable: true },

  { type: "fried", name: "ไก่คาราอะเกะ", price: 69, description: "ไก่ทอดญี่ปุ่น", isAvailable: true },
  { type: "fried", name: "เอบิเทมปุระ", price: 99, description: "กุ้งเทมปุระ 3 ชิ้น", isAvailable: true },
  { type: "fried", name: "ทาโกะยากิ", price: 89, description: "ทาโกะยากิ 6 ลูก", isAvailable: true },

  { type: "soup", name: "มิโซะซุป", price: 29, description: "ซุปเต้าหู้สาหร่าย", isAvailable: true },
  { type: "soup", name: "ซุปต้มยำซีฟู้ด", price: 59, description: "ซุปต้มยำรสจัด", isAvailable: true },

  { type: "dessert", name: "โมจิไอศกรีม", price: 69, description: "โมจิไอศกรีม 2 ลูก", isAvailable: true },
  { type: "dessert", name: "พุดดิ้งญี่ปุ่น", price: 59, description: "พุดดิ้งนุ่ม ๆ", isAvailable: true },

  { type: "drink", name: "ชาเขียวรีฟิล", price: 39, description: "ชาเขียวเย็นรีฟิล", isAvailable: true },
  { type: "drink", name: "โคล่า", price: 25, description: "น้ำอัดลม", isAvailable: true },
  { type: "drink", name: "น้ำเปล่า", price: 15, description: "น้ำดื่ม", isAvailable: true },

  { type: "special", name: "เซ็ตซูชิรวม", price: 249, description: "ซูชิรวม 10 คำ", isAvailable: true },

  { type: "nigiri", name: "แซลมอนอาบุริซูชิ", price: 55, description: "ซูชิแซลมอนเบิร์นซอส", isAvailable: true },
  { type: "soup", name: "ราเมงมินิ", price: 89, description: "ราเมงถ้วยเล็ก", isAvailable: true },
];

function makeTableCode(i) {
  const n = String(i).padStart(2, "0");
  return `A${n}`; // A01..A10
}

const tableSeed = Array.from({ length: 10 }).map((_, idx) => ({
  tableCode: makeTableCode(idx + 1),
  status: "Empty",
  currentOrderId: "",
  isActive: true,
  lastActivity: admin.firestore.Timestamp.now(),
}));

async function deleteAllDocsInCollection(collectionName, batchSize = 300) {
  const colRef = db.collection(collectionName);

  while (true) {
    const snap = await colRef.limit(batchSize).get();
    if (snap.empty) break;

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

function randomOrderStatus() {
  const statuses = ["Open", "Waiting_for_Service", "Ready_for_Billing", "Paid", "Canceled"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function buildCustomOptionsByType(type) {
  switch (type) {
    case "nigiri":
    case "temaki":
      return {
        wasabi: ["ไม่เอา", "น้อย", "ปกติ", "เยอะ"],
        soySauce: ["ปกติ", "น้อยเค็ม", "เพิ่มซอส"],
      };

    case "sashimi":
      return {
        wasabi: ["ไม่เอา", "น้อย", "ปกติ", "เยอะ"],
        soySauce: ["ปกติ", "น้อยเค็ม", "เพิ่มซอส"],
        cut: ["ปกติ", "หนา", "บาง"],
      };

    case "maki":
      return {
        spicyLevel: ["ไม่เผ็ด", "เผ็ดน้อย", "เผ็ดกลาง", "เผ็ดมาก"],
        toppings: ["ไม่เพิ่ม", "เพิ่มไข่กุ้ง", "เพิ่มมายองเนส", "เพิ่มงา"],
      };

    case "donburi":
      return {
        rice: ["ข้าวปกติ", "ข้าวน้อย", "เพิ่มข้าว"],
        sauce: ["ซอสปกติ", "ซอสน้อย", "ซอสเยอะ"],
        addOn: ["ไม่เพิ่ม", "เพิ่มไข่ออนเซ็น", "เพิ่มสาหร่าย", "เพิ่มงา"],
      };

    case "fried":
      return {
        dip: ["ไม่เอาซอส", "มายองเนส", "ซอสเทอริยากิ", "ซอสสไปซี่"],
        spice: ["ปกติ", "พริกป่นน้อย", "พริกป่นเยอะ"],
      };

    case "soup":
      return {
        size: ["เล็ก", "ปกติ"],
        spicyLevel: ["ไม่เผ็ด", "เผ็ดน้อย", "เผ็ดกลาง", "เผ็ดมาก"],
      };

    case "dessert":
      return {
        sweetness: ["หวานปกติ", "หวานน้อย"],
        topping: ["ไม่เพิ่ม", "เพิ่มถั่วแดง", "เพิ่มซอสช็อกโกแลต"],
      };

    case "drink":
      return {
        size: ["แก้วเล็ก", "แก้วปกติ", "แก้วใหญ่"],
        ice: ["น้ำแข็งปกติ", "น้ำแข็งน้อย", "ไม่เอาน้ำแข็ง"],
        sweetness: ["หวานปกติ", "หวานน้อย", "ไม่หวาน"],
      };

    case "special":
      return { note: ["ไม่เผ็ด", "ไม่ใส่วาซาบิ", "ขอขิงดองเพิ่ม"] };

    default:
      return undefined;
  }
}

function maybeCustomOptions(type) {
  const probHave = 0.55;
  if (Math.random() > probHave) return undefined;
  return buildCustomOptionsByType(type);
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickCustomOptionFromMenu(menu) {
  const co = menu.customOptions;
  if (!co) return {};
  const picked = {};
  for (const [k, v] of Object.entries(co)) {
    if (Array.isArray(v)) picked[k] = pickOne(v);
  }
  return picked;
}

async function seed() {
  try {
    console.log("🚀 RESET + Seeding Sushi Data (AUTO-ID ALL, NO KEY FIELDS)...");


    const collectionsToReset = ["orders", "tables", "menus", "categories"];
    for (const col of collectionsToReset) {
      console.log(`🧹 clearing ${col}...`);
      await deleteAllDocsInCollection(col);
    }
    console.log("✔ cleared all target collections");

    const categoriesCol = db.collection("categories");
    const categoryDocs = [];

    for (const cat of categorySeed) {
      const docRef = await categoriesCol.add({
        name: cat.name,
        order: cat.order,
        isActive: cat.isActive,
      });

      categoryDocs.push({ id: docRef.id, key: cat.key, name: cat.name, order: cat.order });
    }
    console.log("✔ categories:", categoryDocs.length);

    const categoryIdByType = new Map(categoryDocs.map((c) => [c.key, c.id]));

    const menusCol = db.collection("menus");
    const menuDocs = [];

    for (const m of menuSeed) {
      const categoryId = categoryIdByType.get(m.type) ?? categoryDocs[0].id;
      const customOptions = maybeCustomOptions(m.type);

      const data = {
        type: m.type,
        name: m.name,
        price: m.price,
        description: m.description,
        isAvailable: m.isAvailable,
        categoryId,
        ...(customOptions ? { customOptions } : {}),
      };

      const docRef = await menusCol.add(data);
      menuDocs.push({ id: docRef.id, ...data });
    }
    console.log("✔ menus:", menuDocs.length);


    const tablesCol = db.collection("tables");
    const tableDocs = [];

    for (const t of tableSeed) {
      const docRef = await tablesCol.add(t);
      tableDocs.push({ id: docRef.id, ...t });
    }
    console.log("✔ tables:", tableDocs.length);


    const ordersCol = db.collection("orders");

    for (let i = 0; i < 10; i++) {
      const table = tableDocs[i % tableDocs.length];
      const status = randomOrderStatus();

      const itemCount = 2 + Math.floor(Math.random() * 2);
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
          options: pickCustomOptionFromMenu(menu),
          note: "",
        });

        totalPrice += menu.price * qty;
      }

      const orderRef = await ordersCol.add({
        tableId: table.id,
        tableCode: table.tableCode, 
        status,
        totalPrice,
        isPaid: status === "Paid",
        createdAt: admin.firestore.Timestamp.now(),
        note: "",
        items,
      });

      if (status !== "Paid" && status !== "Canceled") {
        await tablesCol.doc(table.id).update({
          status: "Occupied",
          currentOrderId: orderRef.id,
          lastActivity: admin.firestore.Timestamp.now(),
        });
      }
    }

    console.log("✔ orders: 10");
    console.log("🎉 DONE — Reset + Seed Completed");
  } catch (err) {
    console.error("❌ Seed Error:", err);
  }
}

seed();
