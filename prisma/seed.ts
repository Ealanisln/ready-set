import { PrismaClient, catering_request, on_demand, user } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

type Order = catering_request | on_demand

function isCateringRequest(order: Order): order is catering_request {
  return (order as catering_request).headcount !== undefined
}

async function main() {
  // Create users
  const users: user[] = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          type: faker.helpers.arrayElement(['vendor', 'client', 'driver', 'admin', 'helpdesk'] as const),
          company_name: faker.company.name(),
          contact_name: faker.person.fullName(),
          contact_number: faker.phone.number(),
          website: faker.internet.url(),
          street1: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          status: faker.helpers.arrayElement(['active', 'pending', 'deleted'] as const),
        },
      })
    })
  )

  console.log(`Created ${users.length} users`)

  if (users.length === 0) {
    console.error('No users were created. Stopping the seed process.')
    return
  }

  // Create addresses
  const addresses = await Promise.all(
    users.map((user) =>
      prisma.address.create({
        data: {
          user_id: user.id,
          county: faker.location.county(),
          street1: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          status: faker.helpers.arrayElement(['active', 'inactive'] as const),
        },
      })
    )
  )

  console.log(`Created ${addresses.length} addresses`)

  if (addresses.length === 0) {
    console.error('No addresses were created. Stopping the seed process.')
    return
  }

  // Create catering requests
  const cateringRequests = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const user = faker.helpers.arrayElement(users)
      const address = faker.helpers.arrayElement(addresses)
      return prisma.catering_request.create({
        data: {
          user_id: user.id,
          address_id: address.id,
          delivery_address_id: address.id,
          order_number: faker.string.alphanumeric(10),
          date: faker.date.future(),
          pickup_time: faker.date.future(),
          arrival_time: faker.date.future(),
          headcount: faker.number.int({ min: 10, max: 100 }).toString(),
          need_host: faker.helpers.arrayElement(['yes', 'no'] as const),
          hours_needed: faker.number.int({ min: 1, max: 8 }).toString(),
          client_attention: faker.lorem.sentence(),
          pickup_notes: faker.lorem.paragraph(),
          special_notes: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement(['active', 'assigned', 'cancelled', 'completed'] as const),
          order_total: Number(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
          tip: Number(faker.finance.amount({ min: 10, max: 100, dec: 2 })),
        },
      })
    })
  )

  console.log(`Created ${cateringRequests.length} catering requests`)

  // Create on-demand orders
  const onDemandOrders = await Promise.all(
    Array.from({ length: 15 }).map(async () => {
      const user = faker.helpers.arrayElement(users)
      const address = faker.helpers.arrayElement(addresses)
      return prisma.on_demand.create({
        data: {
          user_id: user.id,
          address_id: address.id,
          delivery_address_id: address.id,
          order_number: faker.string.alphanumeric(10),
          date: faker.date.future(),
          pickup_time: faker.date.future(),
          arrival_time: faker.date.future(),
          hours_needed: faker.number.int({ min: 1, max: 4 }).toString(),
          item_delivered: faker.commerce.product(),
          vehicle_type: faker.helpers.arrayElement(['Car', 'Van', 'Truck'] as const),
          client_attention: faker.lorem.sentence(),
          pickup_notes: faker.lorem.paragraph(),
          special_notes: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement(['active', 'assigned', 'cancelled', 'completed'] as const),
          order_total: Number(faker.finance.amount({ min: 50, max: 500, dec: 2 })),
          tip: Number(faker.finance.amount({ min: 5, max: 50, dec: 2 })),
          length: faker.number.int({ min: 10, max: 100 }).toString(),
          width: faker.number.int({ min: 10, max: 100 }).toString(),
          height: faker.number.int({ min: 10, max: 100 }).toString(),
          weight: faker.number.int({ min: 1, max: 50 }).toString(),
        },
      })
    })
  )

  console.log(`Created ${onDemandOrders.length} on-demand orders`)

  // Create dispatches
  const orders: Order[] = [...cateringRequests, ...onDemandOrders]
  const dispatches = await Promise.all(
    orders.map(async (order) => {
      const drivers = users.filter(u => u.type === 'driver')
      const admins = users.filter(u => u.type === 'admin')
      
      if (drivers.length === 0 || admins.length === 0) {
        console.warn('Not enough users to create dispatch. Skipping.')
        return null
      }

      const driver = faker.helpers.arrayElement(drivers)
      const dispatcher = faker.helpers.arrayElement(admins)
      
      return prisma.dispatch.create({
        data: {
          cateringRequestId: isCateringRequest(order) ? order.id : null,
          on_demandId: isCateringRequest(order) ? null : order.id,
          driverId: driver.id,
          userId: dispatcher.id,
        },
      })
    })
  )

  const validDispatches = dispatches.filter((d): d is Exclude<typeof d, null> => d !== null)
  console.log(`Created ${validDispatches.length} dispatches`)

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })