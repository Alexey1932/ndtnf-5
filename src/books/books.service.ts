import { Injectable } from '@nestjs/common';
import { Book, BookDocument } from '../interfaces/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from '../interfaces/dto/create_book.dto';

@Injectable()
export class BooksService {
	constructor(@InjectModel(Book.name) private BookModel: Model<BookDocument>) { }

	async create(create_book: CreateBookDto): Promise<BookDocument> {
		const book = new this.BookModel(create_book);
		return book.save();
	}

	async findAll(): Promise<BookDocument[]> {
		try {
			const books = await this.BookModel.find().exec();
			if (!books || books.length === 0) {
				throw new Error('Книги не найдены');
			}
			return books;
		} catch (error) {
			throw new Error(`Ошибка при получении списка книг: ${error.message}`);
		}
	}

	async getBook(id: string): Promise<BookDocument> {
		return this.BookModel.findById({ _id: id }).exec();
	}

	async deleteBook(id: string): Promise<BookDocument> {
		try {
			const deletedBook = await this.BookModel.findOneAndRemove({ _id: id }).exec();
			if (!deletedBook) {
				throw new Error('Книга не найдена');
			}
			return deletedBook;
		} catch (error) {
			throw new Error(`Ошибка при удалении книги: ${error.message}`);
		}
	}

	async updateBook(id: string, data: CreateBookDto): Promise<BookDocument> {
		try {
		  const updatedBook = await this.BookModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec();
		  if (!updatedBook) {
			 throw new Error('Книга не найдена');
		  }
		  return updatedBook;
		} catch (error) {
		  throw new Error(`Ошибка при обновлении книги: ${error.message}`);
		}
	 }
}
