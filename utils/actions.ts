'use server';

import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { imageSchema, productSchema, validateWithZodSchema } from './schemas';
import { deleteImage, uploadImage } from './supabase';
import { revalidatePath } from 'next/cache';


const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = ({ search = '' }: { search: string }) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    }
  })
  if (!product) {
    redirect('/products');
  }
  return product;
}

export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser()

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const file = formData.get('image') as File;
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    // console.log(validatedFile);
    const fullPath = await uploadImage(validatedFile.image);

    await db.product.create({
      data: {
        ...validatedFields,
        image: fullPath,
        clerkId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect('/admin/products');
};

export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = await db.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image)
    revalidatePath('/admin/products');
    return { message: 'product removed' };
  } catch (error) {
    return renderError(error);
  }
}

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect('/admin/products');
  return product;
};

export const updateProductAction = async (
  prevState: any, // Предыдущее состояние продукта
  formData: FormData // Новые данные формы для обновления продукта
) => {
  await getAdminUser(); // Проверяем, что текущий пользователь — администратор
  try {
    // Извлекаем ID продукта из данных формы
    const productId = formData.get('id') as string;

    // Преобразуем FormData в объект для дальнейшей обработки
    const rawData = Object.fromEntries(formData);

    // Валидируем поля формы с помощью схемы Zod
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    // Обновляем продукт в базе данных
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields, // Используем валидированные данные для обновления
      },
    });

     // Обновляем кэш страницы редактирования
     revalidatePath(`/admin/products/${productId}/edit`);

     // Возвращаем сообщение об успешном обновлении
     return { message: 'Product updated successfully' };
  } catch (error) {
     // Обрабатываем ошибки и возвращаем ошибку
     return renderError(error);
  }
};

export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  return { message: 'Product Image updated successfully' };
};