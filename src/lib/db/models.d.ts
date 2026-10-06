export type LeanDoc = Record<string, unknown>;

export interface Query<T> {
  sort(spec?: unknown): Query<T>;
  select(spec?: unknown): Query<T>;
  limit(n: number): Query<T>;
  skip(n: number): Query<T>;
  populate(path: string, select?: string): Query<T>;
  lean(): Query<T>;
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}

export type DbModel = {
  find(filter?: unknown): Query<LeanDoc[]>;
  findOne(filter?: unknown): Query<LeanDoc | null>;
  findById(id: unknown): Query<LeanDoc | null>;
  findByIdAndUpdate(
    id: unknown,
    update: unknown,
    options?: { new?: boolean }
  ): Promise<LeanDoc | null>;
  create(doc: unknown): Promise<LeanDoc>;
  updateOne(
    filter: unknown,
    update: unknown
  ): Promise<{ matchedCount: number; modifiedCount: number }>;
  deleteOne(filter: unknown): Promise<{ deletedCount?: number }>;
  countDocuments(filter?: unknown): Promise<number>;
  aggregate<T = LeanDoc>(pipeline: unknown[]): Promise<T[]>;
};

export type AppModels = {
  conn: unknown;
  User: DbModel;
  Media: DbModel;
  Category: DbModel;
  Post: DbModel;
  MainService: DbModel;
  Service: DbModel;
};

export function getModels(): Promise<AppModels>;
