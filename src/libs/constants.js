import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import express from 'express';
dotenv.config();

export const EXPRESS = express;
export const PORT = process.env.PORT || 3000;
export const prismaClient = new PrismaClient;
