// function feed(parent, args, context, info) {
//   console.log(context.prisma.link.findMany())
//   return context.prisma.link.findMany()
// }
async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        { description: { contains: args.filter } },
        { url: { contains: args.filter } },
      ],
    }
    : {}

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  })

  const count = await context.prisma.link.count({ where })

  return {
    links,
    count,
  }
}

function link(parent, args, context, info) {
  return context.prisma.link.findUnique({ where: { id: Number(args.id) }})
  // return context.prisma.link.findUnique({ where: { id: 20 }})
}

module.exports = {
  feed,
  link,
}