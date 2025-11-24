import { prisma } from '../utils/prismaClient.js';

export class UserController {
  static getUsers = async (req, res) => {
    const { offset = 0, limit = 10, order } = req.query;
    const orderbyOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'desc' },
    };
    const user = await prisma.user.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy: orderbyOption[order] || orderbyOption['recent'],
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        userPreference: { select: { receivedEmail: true } },
      },
    });
    res.status(200).send(user);
  };
  static createUser = async (req, res) => {
    const { userPreference, ...userFields } = req.body;
    const received = userPreference ? userPreference.receivedEmail : false;

    const user = await prisma.user.create({
      data: {
        ...userFields,
        userPreference: {
          create: {
            receivedEmail: received,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        userPreference: { select: { receivedEmail: true } },
      },
    });
    res.status(201).send(user);
  };
  static getUserDetail = async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        name: true,
        email: true,
        createdAt: true,
        userPreference: { select: { receivedEmail: true } },
        comment: true,
      },
    });
    res.status(200).send(user);
  };
  static patchUser = async (req, res) => {
    const { id } = req.params;
    const { userPreference, ...userFields } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...userFields,
        userPreference: { update: { receivedEmail: userPreference.receivedEmail } },
      },
      select: { name: true, email: true, userPreference: { select: { receivedEmail: true } } },
    });
    res.send(user);
  };
  static deleteUser = async (req, res) => {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });
    res.sendStatus(204);
  };
}
