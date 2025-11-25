import { prisma } from '../utils/prismaClient.js';

export class AuthController {
  static register = async (req, res) => {
    const { userPreference, password, ...userFields } = req.body;
    const received = userPreference ? userPreference.receivedEmail : false;
    const profileImage = req.file;

    let image;
    if (profileImage) {
      image = { create: { url: `/files/user-profiles/${profileImage.filename}` } };
    } else {
      image = undefined;
    }

    const user = await prisma.user.create({
      data: {
        ...userFields,
        password,
        userPreference: {
          create: {
            receivedEmail: received,
          },
        },
        image,
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).send(userWithoutPassword);
  };
}
