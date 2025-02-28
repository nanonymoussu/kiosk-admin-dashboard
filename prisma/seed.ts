import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to create noodle options
const createNoodleOptions = () => [
  {
    nameTH: 'เลือกเส้น',
    nameEN: 'Noodle',
    type: 'single',
    choices: {
      create: [
        { nameTH: 'มาม่า', nameEN: 'Mama' },
        { nameTH: 'เส้นเล็ก', nameEN: 'Sen Lek' },
        { nameTH: 'เส้นหมี่ขาว', nameEN: 'Sen Mii Kaow' },
        { nameTH: 'เส้นใหญ่', nameEN: 'Sen Yai' },
        { nameTH: 'เส้นหมี่เหลือง', nameEN: 'Yellow Noodle' },
        { nameTH: 'วุ้นเส้น', nameEN: 'Vermicelli' },
      ],
    },
  },
  {
    nameTH: 'ประเภท',
    nameEN: 'Type',
    type: 'single',
    choices: {
      create: [
        { nameTH: 'น้ำ', nameEN: 'Soup' },
        { nameTH: 'แห้ง', nameEN: 'Dry' },
      ],
    },
  },
  {
    nameTH: 'ระดับความเผ็ด',
    nameEN: 'Spiciness Level',
    type: 'single',
    choices: {
      create: [
        { nameTH: 'ไม่เผ็ด', nameEN: 'No Spicy' },
        { nameTH: 'เผ็ดน้อย', nameEN: 'Less Spicy' },
        { nameTH: 'เผ็ด', nameEN: 'Spicy' },
      ],
    },
  },
  {
    nameTH: 'ผัก',
    nameEN: 'Vegetables',
    type: 'single',
    choices: {
      create: [
        { nameTH: 'ใส่ผัก', nameEN: 'Yes' },
        { nameTH: 'ไม่ใส่ผัก', nameEN: 'No' },
        { nameTH: 'ไม่ใส่ถั่วงอก', nameEN: 'No Bean Sprout' },
      ],
    },
  },
  {
    nameTH: 'ขนาด',
    nameEN: 'Size',
    type: 'single',
    choices: {
      create: [
        { nameTH: 'ธรรมดา', nameEN: 'Normal' },
        { nameTH: 'พิเศษ', nameEN: 'Extra' },
      ],
    },
  },
  {
    nameTH: 'เพิ่มเติม',
    nameEN: 'Add-ons',
    type: 'multiple',
    choices: {
      create: [
        { nameTH: 'เพิ่มไข่ต้ม', nameEN: 'Add Egg' },
        { nameTH: 'เพิ่มเกี๊ยว', nameEN: 'Add Fried Dumpling' },
        { nameTH: 'เพิ่มลูกชิ้น', nameEN: 'Add Meatball' },
      ],
    },
  },
]

// Helper function for sweetness level options
const createSweetnessOptions = () => ({
  nameTH: 'ระดับความหวาน',
  nameEN: 'Sweetness Level',
  type: 'single',
  choices: {
    create: [
      { nameTH: 'หวานน้อย', nameEN: 'Less Sweet' },
      { nameTH: 'หวานปกติ', nameEN: 'Normal Sweet' },
      { nameTH: 'เพิ่มหวาน', nameEN: 'Extra Sweet' },
    ],
  },
})

async function main() {
  // Clear existing data in correct order
  await prisma.$transaction([
    // First delete child records
    prisma.orderHistoryItem.deleteMany({}),
    // Then delete parent records
    prisma.orderHistory.deleteMany({}),
    prisma.orderOptionChoice.deleteMany({}),
    prisma.orderOption.deleteMany({}),
    prisma.menuItem.deleteMany({}),
    prisma.menuCategory.deleteMany({}),
    prisma.user.deleteMany({}),
  ])

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: await bcrypt.hash('admin', 12),
      role: Role.admin,
    },
  })

  const managerUser = await prisma.user.create({
    data: {
      username: 'manager',
      password: await bcrypt.hash('manager', 12),
      role: Role.manager,
    },
  })

  // Create menu categories
  const menuCategories = await Promise.all([
    prisma.menuCategory.create({
      data: {
        nameTH: 'ก๋วยเตี๋ยว',
        nameEN: 'Noodles',
      },
    }),
    prisma.menuCategory.create({
      data: {
        nameTH: 'ของกินเล่น',
        nameEN: 'Snacks',
      },
    }),
    prisma.menuCategory.create({
      data: {
        nameTH: 'ขนมหวาน',
        nameEN: 'Desserts',
      },
    }),
    prisma.menuCategory.create({
      data: {
        nameTH: 'เครื่องดื่ม',
        nameEN: 'Beverages',
      },
    }),
  ])

  // Create menu items
  const menuItems = await Promise.all([
    // Tom Yum
    prisma.menuItem.create({
      data: {
        nameTH: 'ต้มยำ',
        nameEN: 'Tom Yum',
        price: 50,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoEjN5Qw2mRZwpf8ULEThFIWZLym8F-cVsHPKsiTiry3yidofgV0zndrGWSWJcRcTObqs&usqp=CAU',
        menuCategoryId: menuCategories[0].id,
        orderOptions: {
          create: [
            {
              nameTH: 'เนื้อสัตว์',
              nameEN: 'Meat',
              type: 'single',
              choices: {
                create: [
                  { nameTH: 'หมูสับ', nameEN: 'Minced Pork' },
                  { nameTH: 'ทะเล', nameEN: 'Seafood' },
                ],
              },
            },
            ...createNoodleOptions(),
          ],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),

    // Nam Tok
    prisma.menuItem.create({
      data: {
        nameTH: 'น้ำตก',
        nameEN: 'Nam Tok',
        price: 50,
        image:
          'https://eknoodle.com/wp-content/uploads/2022/12/44-1024x749.jpg',
        menuCategoryId: menuCategories[0].id,
        orderOptions: {
          create: [
            {
              nameTH: 'เนื้อสัตว์',
              nameEN: 'Meat',
              type: 'single',
              choices: {
                create: [
                  { nameTH: 'หมูสับ', nameEN: 'Minced Pork' },
                  { nameTH: 'หมูชิ้น', nameEN: 'Pork' },
                  { nameTH: 'เนื้อเปื่อย', nameEN: 'Stewed Beef' },
                ],
              },
            },
            ...createNoodleOptions(),
          ],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),

    // Yen Tafo
    prisma.menuItem.create({
      data: {
        nameTH: 'เย็นตาโฟ',
        nameEN: 'Yen Tafo',
        price: 50,
        image:
          'https://food.mthai.com/app/uploads/2015/05/10390363_604556829675113_5458183944058722391_n.jpg',
        menuCategoryId: menuCategories[0].id,
        orderOptions: {
          create: [
            {
              nameTH: 'เนื้อสัตว์',
              nameEN: 'Meat',
              type: 'single',
              choices: {
                create: [
                  { nameTH: 'หมูสับ', nameEN: 'Minced Pork' },
                  { nameTH: 'หมูชิ้น', nameEN: 'Pork' },
                  { nameTH: 'เนื้อเปื่อย', nameEN: 'Stewed Beef' },
                  { nameTH: 'ทะเล', nameEN: 'Seafood' },
                ],
              },
            },
            ...createNoodleOptions(),
          ],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),

    // Clear Soup
    prisma.menuItem.create({
      data: {
        nameTH: 'น้ำใส',
        nameEN: 'Clear Soup',
        price: 50,
        image:
          'https://img.wongnai.com/p/1968x0/2019/03/17/5757c855aa664790852b87452a7ee94a.jpg',
        menuCategoryId: menuCategories[0].id,
        orderOptions: {
          create: [
            {
              nameTH: 'เนื้อสัตว์',
              nameEN: 'Meat',
              type: 'single',
              choices: {
                create: [
                  { nameTH: 'หมูสับ', nameEN: 'Minced Pork' },
                  { nameTH: 'หมูชิ้น', nameEN: 'Pork' },
                  { nameTH: 'ลิ้นวัว', nameEN: 'Beef Tongue' },
                ],
              },
            },
            ...createNoodleOptions(),
          ],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),

    // Snacks
    prisma.menuItem.create({
      data: {
        nameTH: 'แคปหมู',
        nameEN: 'Pork Rinds',
        price: 15,
        image:
          'https://www.ตลาดเกษตรกรออนไลน์.com/uploads/products/images/img_60bc4ddee4411.jpg',
        menuCategoryId: menuCategories[1].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'เกี๊ยวทอด',
        nameEN: 'Fried Dumplings',
        price: 20,
        image:
          'https://s359.kapook.com/pagebuilder/42ce18d3-1c13-4d6f-a03f-9964cf57124c.jpg',
        menuCategoryId: menuCategories[1].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'ไส้กรอกทอด',
        nameEN: 'Fried Sausage',
        price: 25,
        image: 'https://s.isanook.com/wo/0/ud/50/252701/252701-thumbnail.jpg',
        menuCategoryId: menuCategories[1].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),

    // Desserts
    prisma.menuItem.create({
      data: {
        nameTH: 'ขนมถ้วย',
        nameEN: 'Kanom Tuay',
        price: 20,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh0fbL2B6G_ay1w1Nqdl84XertElpyXzJN8A&s',
        menuCategoryId: menuCategories[2].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'บัวลอย',
        nameEN: 'Bua Loy',
        price: 35,
        image:
          'https://i.pinimg.com/736x/ef/1f/a7/ef1fa7d93ab37745479f05d9b009bddb.jpg',
        menuCategoryId: menuCategories[2].id,
        orderOptions: {
          create: [
            {
              nameTH: 'ใส่ไข่',
              nameEN: 'With Egg',
              type: 'single',
              choices: {
                create: [
                  { nameTH: 'ใส่', nameEN: 'Yes' },
                  { nameTH: 'ไม่ใส่', nameEN: 'No' },
                ],
              },
            },
            createSweetnessOptions(),
          ],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'หวานเย็น',
        nameEN: 'Wan yen',
        price: 20,
        image:
          'https://chillchilljapan.com/wp-content/uploads/2021/08/pixta_67672435_M.jpg',
        menuCategoryId: menuCategories[2].id,
        orderOptions: {
          create: [
            {
              nameTH: 'ท็อปปิ้ง',
              nameEN: 'Topings',
              type: 'multiple',
              choices: {
                create: [
                  { nameTH: 'เฉาก๊วย', nameEN: 'Black Jelly' },
                  { nameTH: 'เผือก', nameEN: 'Taro' },
                  { nameTH: 'มัน', nameEN: 'Potato' },
                  { nameTH: 'ขนมปัง', nameEN: 'Bread' },
                  { nameTH: 'ฟักทอง', nameEN: 'Pumpkin' },
                ],
              },
            },
            {
              nameTH: 'นมข้นหวาน',
              nameEN: 'Sweetened condensed milk',
              type: 'single',
              choices: {
                create: [
                  { nameTH: 'ราด', nameEN: 'Yes' },
                  { nameTH: 'ไม่ราด', nameEN: 'No' },
                ],
              },
            },
          ],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'เฉาก๊วยน้ำเชื่อม',
        nameEN: 'Black Jelly in Syrup',
        price: 25,
        image:
          'https://s359.kapook.com/r/600/auto/pagebuilder/99910e94-ffb6-4561-82b9-d3b5fbbd4fc1.jpg',
        menuCategoryId: menuCategories[2].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),

    // Beverages
    prisma.menuItem.create({
      data: {
        nameTH: 'น้ำเปล่า (ขวด)',
        nameEN: 'Water (Bottle)',
        price: 10,
        image:
          'https://www.cokeshopth.com/pub/media/catalog/product/cache/e0b9252e27a8956bf801d8ddef82be21/n/a/namthip1.5l_3.jpg',
        menuCategoryId: menuCategories[3].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'โค้กออริจินัล (กระป๋อง)',
        nameEN: 'Original Coke (can)',
        price: 15,
        image:
          'https://gda.thai-tba.or.th/wp-content/uploads/2018/07/coke-full-red-325-ml-hires.png',
        menuCategoryId: menuCategories[3].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'โค้กออริจินัล (ขวดลิตร)',
        nameEN: 'Original Coke (liter bottle)',
        price: 30,
        image: 'https://assets.tops.co.th/COKE-Coke195ltr-8851959129012-1',
        menuCategoryId: menuCategories[3].id,
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'ชาเย็น',
        nameEN: 'Thai Tea',
        price: 20,
        image:
          'https://thematter.co/wp-content/uploads/2017/06/%E0%B8%8A%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2-cover-content-WEB.png',
        menuCategoryId: menuCategories[3].id,
        orderOptions: {
          create: [createSweetnessOptions()],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
    prisma.menuItem.create({
      data: {
        nameTH: 'ชาเขียว',
        nameEN: 'Green Tea',
        price: 20,
        image:
          'https://www.bluemochatea.com/wp-content/uploads/2020/01/%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%AD%E0%B9%82%E0%B8%A3%E0%B8%A1%E0%B9%88%E0%B8%B2.jpg',
        menuCategoryId: menuCategories[3].id,
        orderOptions: {
          create: [createSweetnessOptions()],
        },
      },
      include: {
        menuCategory: true,
        orderOptions: { include: { choices: true } },
      },
    }),
  ])

  console.log({
    adminUser,
    managerUser,
    menuCategories,
    menuItems,
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
