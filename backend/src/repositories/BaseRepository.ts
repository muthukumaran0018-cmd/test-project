import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter?: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
  update(id: string, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  count(filter?: FilterQuery<T>): Promise<number>;
}

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return (await entity.save()) as T;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.model.findByIdAndDelete(id).exec();
    return res !== null;
  }

  async softDelete(id: string): Promise<boolean> {
    const res = await this.model.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    } as any).exec();
    return res !== null;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
