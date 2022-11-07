import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatarUrl: 'https://github.com/GuiAlcantaraa.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'BOL123',
            ownerID: (await user).id,

            participants: {
                create: {
                    userId: (await user).id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-03T10:09:05.153Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-05T10:09:05.153Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: (await user).id,
                                poolId: pool.id
                            }
                        }
                    }

                }
            }
        },
    })
}

main()