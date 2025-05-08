import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.book.createMany({
    data: [
      {
        title: 'The Art of War',
        description: 'A timeless military strategy book.',
        author: 'Sun Tzu',
        genre: 'Strategy',
        price: 9.99,
        coverImageUrl: 'https://example.com/covers/art-of-war.jpg',
        fileUrl: 'https://example.com/books/art-of-war.pdf',
        sampleUrl: 'https://example.com/samples/art-of-war.pdf',
      },
      {
        title: '1984',
        description: 'A dystopian novel by George Orwell.',
        author: 'George Orwell',
        genre: 'Fiction',
        price: 14.99,
        coverImageUrl: 'https://example.com/covers/1984.jpg',
        fileUrl: 'https://example.com/books/1984.pdf',
        sampleUrl: 'https://example.com/samples/1984.pdf',
      },
      {
        title: 'Clean Code',
        description: 'A handbook of Agile software craftsmanship.',
        author: 'Robert C. Martin',
        genre: 'Technology',
        price: 24.99,
        coverImageUrl: 'https://example.com/covers/clean-code.jpg',
        fileUrl: 'https://example.com/books/clean-code.pdf',
        sampleUrl: 'https://example.com/samples/clean-code.pdf',
      },
      {
        title: 'To Kill a Mockingbird',
        description: 'A novel about the serious issues of rape and racial inequality.',
        author: 'Harper Lee',
        genre: 'Fiction',
        price: 12.99,
        coverImageUrl: 'https://example.com/covers/to-kill-a-mockingbird.jpg',
        fileUrl: 'https://example.com/books/to-kill-a-mockingbird.pdf',
        sampleUrl: 'https://example.com/samples/to-kill-a-mockingbird.pdf',
      },
      {
        title: 'The Great Gatsby',
        description: 'A critique of the American Dream in the Roaring Twenties.',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        price: 10.99,
        coverImageUrl: 'https://example.com/covers/the-great-gatsby.jpg',
        fileUrl: 'https://example.com/books/the-great-gatsby.pdf',
        sampleUrl: 'https://example.com/samples/the-great-gatsby.pdf',
      },
      {
        title: 'Pride and Prejudice',
        description: 'A romantic novel that also critiques the British landed gentry.',
        author: 'Jane Austen',
        genre: 'Romance',
        price: 11.99,
        coverImageUrl: 'https://example.com/covers/pride-and-prejudice.jpg',
        fileUrl: 'https://example.com/books/pride-and-prejudice.pdf',
        sampleUrl: 'https://example.com/samples/pride-and-prejudice.pdf',
      },
      {
        title: 'The Catcher in the Rye',
        description: 'A story about teenage alienation and angst.',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        price: 13.99,
        coverImageUrl: 'https://example.com/covers/the-catcher-in-the-rye.jpg',
        fileUrl: 'https://example.com/books/the-catcher-in-the-rye.pdf',
        sampleUrl: 'https://example.com/samples/the-catcher-in-the-rye.pdf',
      },
      {
        title: 'The Hobbit',
        description: 'A fantasy novel and prelude to the Lord of the Rings.',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        price: 15.99,
        coverImageUrl: 'https://example.com/covers/the-hobbit.jpg',
        fileUrl: 'https://example.com/books/the-hobbit.pdf',
        sampleUrl: 'https://example.com/samples/the-hobbit.pdf',
      },
      {
        title: 'Moby-Dick',
        description: 'A sailor’s narrative of the obsessive quest of Ahab for revenge on Moby Dick.',
        author: 'Herman Melville',
        genre: 'Adventure',
        price: 14.99,
        coverImageUrl: 'https://example.com/covers/moby-dick.jpg',
        fileUrl: 'https://example.com/books/moby-dick.pdf',
        sampleUrl: 'https://example.com/samples/moby-dick.pdf',
      },
      {
        title: 'War and Peace',
        description: 'A historical novel that chronicles the French invasion of Russia.',
        author: 'Leo Tolstoy',
        genre: 'Historical Fiction',
        price: 19.99,
        coverImageUrl: 'https://example.com/covers/war-and-peace.jpg',
        fileUrl: 'https://example.com/books/war-and-peace.pdf',
        sampleUrl: 'https://example.com/samples/war-and-peace.pdf',
      },
    ],
  })

  console.log('🌱 Seeded books successfully')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
